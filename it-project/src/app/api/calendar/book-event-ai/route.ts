import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { resend } from "@/lib/resend";

// Type voor request body
type BookEventAIRequest = {
  werknemer_id?: number;
  start_datum?: string;
  eind_datum?: string;
};

// Functie om ingelogde gebruiker op te halen (pas aan naar jouw auth systeem)
function getUserEmailFromRequest(request: NextRequest): string | null {
  // Bijvoorbeeld JWT in header: Authorization: Bearer <token>
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) return null;
  const token = authHeader.replace("Bearer ", "");
  // decodeer JWT en haal email eruit (afhankelijk van jouw auth setup)
  // Hier dummy: return email uit token
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
    return payload.email;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as BookEventAIRequest;
    const { werknemer_id, start_datum, eind_datum } = body;

    if (!werknemer_id || !start_datum || !eind_datum) {
      return NextResponse.json(
        { error: "werknemer_id, start_datum en eind_datum zijn verplicht" },
        { status: 400 },
      );
    }

    // Haal ingelogde gebruiker
    const userEmail = getUserEmailFromRequest(request);
    if (!userEmail) {
      return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
    }

    // Parse dates
    const startDateTime = new Date(start_datum);
    const endDateTime = new Date(eind_datum);
    if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
      return NextResponse.json({ error: "Ongeldige datum format" }, { status: 400 });
    }
    if (startDateTime >= endDateTime) {
      return NextResponse.json({ error: "Einddatum moet na startdatum zijn" }, { status: 400 });
    }

    // Check werknemer
    const werknemer = await prisma.werknemer.findUnique({
      where: { werknemer_id },
      select: { werknemer_id: true, voornaam: true, naam: true, email: true, telefoonnummer: true, bedrijf_id: true, bedrijf: { select: { naam: true, email: true } } },
    });
    if (!werknemer) return NextResponse.json({ error: "Werknemer niet gevonden" }, { status: 404 });

    // Vind of maak klant op basis van ingelogde gebruiker
    let dbKlant = await prisma.klant.findFirst({
      where: { email: userEmail },
      select: { klant_id: true, voornaam: true, naam: true, email: true, telefoonnummer: true },
    });
    if (!dbKlant) {
      const createdKlant = await prisma.klant.create({
        data: {
          email: userEmail,
          voornaam: "Onbekend",
          naam: "Onbekend",
          telefoonnummer: "N/A",
          clerkUserId: `guest-${crypto.randomUUID()}`,
          geboorte_datum: new Date(),
          bedrijf_id: werknemer.bedrijf_id ?? undefined,
        },
      });
      dbKlant = {
        klant_id: createdKlant.klant_id,
        voornaam: createdKlant.voornaam,
        naam: createdKlant.naam,
        email: createdKlant.email,
        telefoonnummer: createdKlant.telefoonnummer,
      };
      console.log(`[Book-Event-AI] Created new klant via AI booking: ${dbKlant.email}`);
    } else {
      console.log(`[Book-Event-AI] Reusing existing klant: ${dbKlant.email}`);
    }

    // Beschikbaarheid check
    const dayNames = ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"];
    const dayOfWeek = dayNames[startDateTime.getDay()];
    const beschikbaarheden = await prisma.beschikbaarheid.findMany({
      where: { werknemer_id, dag: dayOfWeek },
      select: { start_tijd: true, eind_tijd: true },
    });
    if (beschikbaarheden.length === 0) {
      return NextResponse.json({ error: "Werknemer is niet beschikbaar op deze dag" }, { status: 400 });
    }

    const bookingStartMinutes = startDateTime.getHours() * 60 + startDateTime.getMinutes();
    const bookingEndMinutes = endDateTime.getHours() * 60 + endDateTime.getMinutes();
    const isWithinBeschikbaarheid = beschikbaarheden.some((b) => {
      const start = new Date(b.start_tijd);
      const end = new Date(b.eind_tijd);
      const startMinutes = start.getHours() * 60 + start.getMinutes();
      const endMinutes = end.getHours() * 60 + end.getMinutes();
      return bookingStartMinutes >= startMinutes && bookingEndMinutes <= endMinutes;
    });
    if (!isWithinBeschikbaarheid) {
      return NextResponse.json({ error: "Dit tijdslot valt buiten de beschikbaarheid van de werknemer" }, { status: 400 });
    }

    // Overlap check
    const overlappingAppointment = await prisma.afspraak.findFirst({
      where: {
        werknemer_id,
        start_datum: { lt: endDateTime },
        eind_datum: { gt: startDateTime },
        status: { not: "geannuleerd" },
      },
    });
    if (overlappingAppointment) return NextResponse.json({ error: "Dit tijdslot is al bezet" }, { status: 409 });

    // Maak afspraak
    const afspraak = await prisma.afspraak.create({
      data: { werknemer_id, klant_id: dbKlant.klant_id, start_datum: startDateTime, eind_datum: endDateTime, status: "gepland" },
      include: {
        werknemer: { select: { werknemer_id: true, voornaam: true, naam: true, email: true, telefoonnummer: true, bedrijf: { select: { naam: true, email: true } } } },
        klant: { select: { klant_id: true, voornaam: true, naam: true, email: true, telefoonnummer: true } },
      },
    });

    // Verstuur bevestigingsmail
    if (afspraak.klant?.email) {
      try {
        const startDate = new Date(afspraak.start_datum);
        const endDate = new Date(afspraak.eind_datum);
        const duration = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60));
        await resend.emails.send({
          from: "SchedulAI <onboarding@resend.dev>",
          to: afspraak.klant.email,
          subject: "Afspraak Bevestigd 📅",
          html: `<p>Hallo ${afspraak.klant.voornaam || 'Klant'}, uw afspraak is bevestigd!</p>`,
        });
      } catch (e) { console.error("[Book-Event-AI] Fout bij mail:", e); }
    }

    return NextResponse.json(afspraak, { status: 201 });
  } catch (error) {
    console.error("[Book-Event-AI] Error:", error);
    return NextResponse.json({ error: "Er is een fout opgetreden bij het boeken" }, { status: 500 });
  }
}
