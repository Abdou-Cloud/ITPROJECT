import { prisma } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { resend } from "@/lib/resend";

// GET - Haal afspraken op
// Ondersteunt twee flows:
// 1. Business flow: werknemer haalt eigen afspraken op (met optionele date range)
// 2. Client flow: klant haalt bezette slots op voor een specifieke werknemer op een datum
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
    }

    // Haal query parameters op voor filtering
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const werknemerIdParam = searchParams.get("werknemerId");
    const dateParam = searchParams.get("date");

    // CLIENT FLOW: Klant vraagt bezette slots op voor een specifieke werknemer
    if (werknemerIdParam && dateParam) {
      const werknemerId = Number(werknemerIdParam);
      if (isNaN(werknemerId)) {
        return NextResponse.json({ error: "Ongeldig werknemerId" }, { status: 400 });
      }

      // Controleer of de werknemer bestaat
      const werknemer = await prisma.werknemer.findUnique({
        where: { werknemer_id: werknemerId },
      });

      if (!werknemer) {
        return NextResponse.json({ error: "Werknemer niet gevonden" }, { status: 404 });
      }

      // Klanten kunnen afspraken bekijken van elk bedrijf

      // Haal alle afspraken van deze werknemer op voor de gegeven datum
      const startOfDay = new Date(dateParam);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(dateParam);
      endOfDay.setHours(23, 59, 59, 999);

      const afspraken = await prisma.afspraak.findMany({
        where: {
          werknemer_id: werknemerId,
          start_datum: {
            gte: startOfDay,
            lte: endOfDay,
          },
          status: { not: "geannuleerd" } // Alleen actieve afspraken blokkeren slots
        },
        select: {
          afspraak_id: true,
          start_datum: true,
          eind_datum: true,
          status: true,
        },
        orderBy: {
          start_datum: "asc",
        },
      });

      return NextResponse.json(afspraken);
    }

    // BUSINESS FLOW: Werknemer haalt eigen afspraken op
    // Zoek de werknemer op basis van email (Werknemer heeft geen clerkUserId in schema)
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const userEmail = user?.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress;
    
    if (!userEmail) {
      return NextResponse.json({ error: "Gebruiker email niet gevonden" }, { status: 404 });
    }

    const werknemer = await prisma.werknemer.findFirst({
      where: { email: userEmail },
    });

    if (!werknemer) {
      // Als de gebruiker geen werknemer is, geven we een lege lijst terug in plaats van een 404
      // Dit voorkomt foutmeldingen in het dashboard voor admins of nieuwe accounts
      return NextResponse.json([]);
    }

    // Bouw de where clause voor filtering
    const whereClause: any = {
      werknemer_id: werknemer.werknemer_id,
    };

    if (startDate || endDate) {
      whereClause.start_datum = {};
      if (startDate) {
        whereClause.start_datum.gte = new Date(startDate);
      }
      if (endDate) {
        whereClause.start_datum.lte = new Date(endDate);
      }
    }

    const afspraken = await prisma.afspraak.findMany({
      where: whereClause,
      include: {
        klant: {
          select: {
            voornaam: true,
            naam: true,
            email: true,
            telefoonnummer: true,
          },
        },
      },
      orderBy: {
        start_datum: "asc",
      },
    });

    return NextResponse.json(afspraken);
  } catch (error) {
    console.error("Fout bij ophalen afspraken:", error);
    return NextResponse.json(
      { error: "Er is een fout opgetreden bij het ophalen van de gegevens" },
      { status: 500 }
    );
  }
}

// POST - Maak een nieuwe afspraak
// Ondersteunt twee flows:
// 1. Business flow: werknemer maakt afspraak met klant_id
// 2. Client flow: klant maakt afspraak met werknemerId
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
    }

    const body = await request.json();
    const { klant_id, werknemerId, start_datum, eind_datum, start, end, status } = body;

    // Check of dit een client booking is (werknemerId meegegeven)
    if (werknemerId !== undefined) {
      // CLIENT FLOW: Klant boekt bij werknemer
      const startDate = start || start_datum;
      const endDate = end || eind_datum;

      if (!startDate || !endDate) {
        return NextResponse.json(
          { error: "Start- en einddatum zijn verplicht" },
          { status: 400 }
        );
      }

      // Parse dates
      const startDateTime = new Date(startDate);
      const endDateTime = new Date(endDate);

      // Validate dates
      if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
        return NextResponse.json(
          { error: "Ongeldige datum format" },
          { status: 400 }
        );
      }

      // Validate that end_datum is after start_datum
      if (startDateTime >= endDateTime) {
        return NextResponse.json(
          { error: "Einddatum moet na startdatum zijn" },
          { status: 400 }
        );
      }

      // Zoek de klant op basis van clerkUserId
      let klant = await prisma.klant.findUnique({
        where: { clerkUserId: userId },
      });

      // If Klant not found, try to sync it automatically
      if (!klant) {
        console.log(`[Booking API] Klant not found for userId: ${userId}, attempting to sync...`);
        try {
          const { ensureKlantExists } = await import("@/lib/klant-sync");
          await ensureKlantExists(userId);
          
          klant = await prisma.klant.findUnique({
            where: { clerkUserId: userId },
          });

          if (!klant) {
            return NextResponse.json(
              { error: "Klant profiel kon niet worden aangemaakt" },
              { status: 404 }
            );
          }
        } catch (syncError) {
          console.error(`[Booking API] Error syncing Klant:`, syncError);
          return NextResponse.json(
            { error: "Synchronisatie van klantgegevens mislukt" },
            { status: 404 }
          );
        }
      }

      // Controleer of de werknemer bestaat
      const wId = Number(werknemerId);
      const werknemer = await prisma.werknemer.findUnique({
        where: { werknemer_id: wId },
      });

      if (!werknemer) {
        return NextResponse.json({ error: "Werknemer niet gevonden" }, { status: 404 });
      }

      // Check if booking time falls within werknemer's beschikbaarheden
      const dayNames = ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"];
      const dayOfWeek = dayNames[startDateTime.getDay()];
      
      const beschikbaarheden = await prisma.beschikbaarheid.findMany({
        where: {
          werknemer_id: wId,
          dag: dayOfWeek,
        },
      });

      if (beschikbaarheden.length === 0) {
        return NextResponse.json(
          { error: "Werknemer is niet beschikbaar op deze dag" },
          { status: 400 }
        );
      }

      // Check if booking time falls within any beschikbaarheid window
      const isWithinBeschikbaarheid = beschikbaarheden.some((b) => {
        const bStart = new Date(b.start_tijd);
        const bEnd = new Date(b.eind_tijd);
        
        const bookingStartMinutes = startDateTime.getHours() * 60 + startDateTime.getMinutes();
        const bookingEndMinutes = endDateTime.getHours() * 60 + endDateTime.getMinutes();
        const bStartMinutes = bStart.getHours() * 60 + bStart.getMinutes();
        const bEndMinutes = bEnd.getHours() * 60 + bEnd.getMinutes();

        return bookingStartMinutes >= bStartMinutes && bookingEndMinutes <= bEndMinutes;
      });

      if (!isWithinBeschikbaarheid) {
        return NextResponse.json(
          { error: "Dit tijdslot valt buiten de werktijden van de werknemer" },
          { status: 400 }
        );
      }

      // Check for overlapping appointments
      const overlappingAppointment = await prisma.afspraak.findFirst({
        where: {
          werknemer_id: wId,
          status: { not: "geannuleerd" },
          OR: [
            {
              start_datum: { lt: endDateTime },
              eind_datum: { gt: startDateTime },
            }
          ]
        },
      });

      if (overlappingAppointment) {
        return NextResponse.json({ error: "Dit tijdslot is al bezet" }, { status: 409 });
      }

      // Maak de afspraak aan
      const afspraak = await prisma.afspraak.create({
        data: {
          werknemer_id: wId,
          klant_id: klant.klant_id,
          start_datum: startDateTime,
          eind_datum: endDateTime,
          status: status || "gepland",
        },
        include: {
          werknemer: {
            include: { bedrijf: true }
          },
          klant: true,
        },
      });

      // Verstuur bevestigingsmail naar klant via Resend
      if (afspraak.klant?.email) {
        try {
          const sDate = new Date(afspraak.start_datum);
          await resend.emails.send({
            from: "SchedulAI <onboarding@resend.dev>",
            to: afspraak.klant.email,
            subject: "Afspraak Bevestigd 📅",
            html: `
              <div style="font-family: sans-serif;">
                <h2>Afspraak Bevestigd</h2>
                <p>Hallo ${afspraak.klant.voornaam},</p>
                <p>Je afspraak bij <strong>${afspraak.werknemer.bedrijf?.naam || 'ons'}</strong> is bevestigd.</p>
                <p><strong>Datum:</strong> ${sDate.toLocaleDateString('nl-NL')}<br>
                <strong>Tijd:</strong> ${sDate.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}</p>
                <p>Met vriendelijke groet,<br>Het SchedulAI Team</p>
              </div>
            `,
          });
        } catch (e) {
          console.error("Mail error:", e);
        }
      }

      return NextResponse.json(afspraak, { status: 201 });
    }

    // BUSINESS FLOW: Werknemer maakt afspraak met klant
    if (!klant_id || !start_datum || !eind_datum) {
      return NextResponse.json({ error: "Klant, startdatum en einddatum zijn verplicht" }, { status: 400 });
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const userEmail = user?.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress;
    
    const werknemer = await prisma.werknemer.findFirst({
      where: { email: userEmail },
    });

    if (!werknemer) {
      return NextResponse.json({ error: "Werknemer profiel niet gevonden" }, { status: 404 });
    }

    const afspraak = await prisma.afspraak.create({
      data: {
        werknemer_id: werknemer.werknemer_id,
        klant_id: Number(klant_id),
        start_datum: new Date(start_datum),
        eind_datum: new Date(eind_datum),
        status: status || "gepland",
      },
      include: { klant: true },
    });

    return NextResponse.json(afspraak, { status: 201 });
  } catch (error) {
    console.error("Fout bij maken afspraak:", error);
    return NextResponse.json({ error: "Er is een interne serverfout opgetreden" }, { status: 500 });
  }
}