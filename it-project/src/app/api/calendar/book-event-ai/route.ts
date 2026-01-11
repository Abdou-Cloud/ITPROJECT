import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { resend } from "@/lib/resend";

// Type voor request body
type BookEventAIRequest = {
  werknemer_id?: number;
  start_datum?: string;
  eind_datum?: string;
  // Optionele klant- en auth parameter voor Vapi calls (via metadata)
  klant_email?: string;
  klant_naam?: string;
  klant_voornaam?: string;
  klant_telefoon?: string;
  jwt?: string;
};

// Eenvoudige helper om email te extracten (Demo versie: we vertrouwen alles!)
function getUserEmail(request: NextRequest, body: BookEventAIRequest): string | null {
  // 1. Probeer JWT uit request body (Vapi stuurt dit mee als we dat instellen)
  if (body.jwt) {
    try {
      const payload = JSON.parse(Buffer.from(body.jwt.split(".")[1], "base64").toString());
      if (payload.email) return payload.email;
    } catch (e) {
      console.warn("Kon JWT uit body niet parsen:", e);
    }
  }

  // 2. Probeer klant_email uit request body (Directe Vapi metadata)
  if (body.klant_email) {
    return body.klant_email;
  }

  // 3. Fallback: Authorization header (voor testen met Postman etc)
  const authHeader = request.headers.get("Authorization");
  if (authHeader) {
    try {
      const token = authHeader.replace("Bearer ", "");
      const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
      if (payload.email) return payload.email;
    } catch (e) {
      console.warn("Kon header JWT niet parsen:", e);
    }
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as BookEventAIRequest;
    const {
      werknemer_id,
      start_datum,
      eind_datum,
      klant_voornaam,
      klant_naam,
      klant_telefoon
    } = body;

    // 1. Validatie van verplichte velden
    if (!werknemer_id || !start_datum || !eind_datum) {
      return NextResponse.json(
        { error: "werknemer_id, start_datum en eind_datum zijn verplicht" },
        { status: 400 },
      );
    }

    // 2. Identificatie (Demo mode: "Trust me bro" security)
    const userEmail = getUserEmail(request, body);

    if (!userEmail) {
      return NextResponse.json({ error: "Gebruiker niet geïdentificeerd (geen JWT of email)" }, { status: 401 });
    }

    // 3. Parse dates
    const startDateTime = new Date(start_datum);
    const endDateTime = new Date(eind_datum);
    if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
      return NextResponse.json({ error: "Ongeldige datum format" }, { status: 400 });
    }
    if (startDateTime >= endDateTime) {
      return NextResponse.json({ error: "Einddatum moet na startdatum zijn" }, { status: 400 });
    }

    // 4. Check werknemer
    const werknemer = await prisma.werknemer.findUnique({
      where: { werknemer_id },
      select: { werknemer_id: true, voornaam: true, naam: true, email: true, telefoonnummer: true, bedrijf_id: true, bedrijf: { select: { naam: true, email: true } } },
    });
    if (!werknemer) return NextResponse.json({ error: "Werknemer niet gevonden" }, { status: 404 });

    // 5. Vind of maak klant
    let dbKlant = await prisma.klant.findFirst({
      where: { email: userEmail },
      select: { klant_id: true, voornaam: true, naam: true, email: true, telefoonnummer: true },
    });

    if (!dbKlant) {
      // Nieuwe klant aanmaken
      const createdKlant = await prisma.klant.create({
        data: {
          email: userEmail,
          voornaam: klant_voornaam || "Gast",
          naam: klant_naam || "Gebruiker",
          telefoonnummer: klant_telefoon || "N/A",
          clerkUserId: `demo-${crypto.randomUUID()}`,
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
      console.log(`[Book-Event-AI] DEMO: Created new klant: ${dbKlant.email}`);
    } else {
      console.log(`[Book-Event-AI] DEMO: Found existing klant: ${dbKlant.email}`);
    }

    // 6. Beschikbaarheid check
    const dayNames = ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"];
    const dayOfWeek = dayNames[startDateTime.getDay()];
    const beschikbaarheden = await prisma.beschikbaarheid.findMany({
      where: { werknemer_id, dag: dayOfWeek },
      select: { start_tijd: true, eind_tijd: true },
    });

    // In DEMO mode kunnen we hier wat soepeler zijn, maar laten we logica behouden
    if (beschikbaarheden.length === 0) {
      return NextResponse.json({ error: "Werknemer werkt niet op deze dag" }, { status: 400 });
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
      return NextResponse.json({ error: "Tijdslot valt buiten werktijden" }, { status: 400 });
    }

    // 7. Overlap check
    const overlappingAppointment = await prisma.afspraak.findFirst({
      where: {
        werknemer_id,
        start_datum: { lt: endDateTime },
        eind_datum: { gt: startDateTime },
        status: { not: "geannuleerd" },
      },
    });
    if (overlappingAppointment) return NextResponse.json({ error: "Tijdslot is al bezet" }, { status: 409 });

    // 8. Maak afspraak
    const afspraak = await prisma.afspraak.create({
      data: { werknemer_id, klant_id: dbKlant.klant_id, start_datum: startDateTime, eind_datum: endDateTime, status: "gepland" },
      include: {
        werknemer: { select: { werknemer_id: true, voornaam: true, naam: true, email: true, telefoonnummer: true, bedrijf: { select: { naam: true, email: true } } } },
        klant: { select: { klant_id: true, voornaam: true, naam: true, email: true, telefoonnummer: true } },
      },
    });

    // 9. Bevestigingsmail (behouden)
    if (afspraak.klant?.email) {
      try {
        await resend.emails.send({
          from: "SchedulAI <onboarding@resend.dev>",
          to: afspraak.klant.email,
          subject: "Afspraak Bevestigd (Demo) 📅",
          html: `<p>Hallo ${afspraak.klant.voornaam || 'Klant'}, uw afspraak is bevestigd!</p>`,
        });
      } catch (e) { console.error("[Book-Event-AI] Mail error:", e); }
    }

    return NextResponse.json(afspraak, { status: 201 });
  } catch (error) {
    console.error("[Book-Event-AI] Error:", error);
    return NextResponse.json({ error: "Server fout bij boeken" }, { status: 500 });
  }
}
