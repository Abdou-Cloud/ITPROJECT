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
      // Controleer of de werknemer bestaat
      const werknemer = await prisma.werknemer.findUnique({
        where: { werknemer_id: Number(werknemerIdParam) },
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
          werknemer_id: Number(werknemerIdParam),
          start_datum: {
            gte: startOfDay,
            lte: endOfDay,
          },
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
    const user = await clerkClient().then(client => client.users.getUser(userId));
    const userEmail = user?.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress;
    
    if (!userEmail) {
      return NextResponse.json({ error: "Gebruiker email niet gevonden" }, { status: 404 });
    }

    const werknemer = await prisma.werknemer.findFirst({
      where: { email: userEmail },
    });

    if (!werknemer) {
      return NextResponse.json({ error: "Werknemer niet gevonden" }, { status: 404 });
    }

    // Bouw de where clause voor filtering
    const whereClause: {
      werknemer_id: number;
      start_datum?: { gte?: Date; lte?: Date };
    } = {
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
      { error: "Er is een fout opgetreden" },
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
          // Import and call ensureKlantExists
          const { ensureKlantExists } = await import("@/lib/klant-sync");
          await ensureKlantExists(userId);
          
          // Fetch the klant again after sync
          klant = await prisma.klant.findUnique({
            where: { clerkUserId: userId },
          });

          if (!klant) {
            console.error(`[Booking API] Klant still not found after sync for userId: ${userId}`);
            return NextResponse.json(
              { error: "Klant niet gevonden en synchronisatie mislukt" },
              { status: 404 }
            );
          }

          console.log(`[Booking API] ✓ Klant successfully synced and found, klant_id: ${klant.klant_id}`);
        } catch (syncError) {
          console.error(`[Booking API] Error syncing Klant for userId: ${userId}`, syncError);
          return NextResponse.json(
            { error: "Klant niet gevonden en synchronisatie mislukt" },
            { status: 404 }
          );
        }
      }

      // Controleer of de werknemer bestaat
      const werknemer = await prisma.werknemer.findUnique({
        where: { werknemer_id: Number(werknemerId) },
      });

      if (!werknemer) {
        return NextResponse.json({ error: "Werknemer niet gevonden" }, { status: 404 });
      }

      // Note: Customers can book with any employee from any company (platform-wide booking)
      // No bedrijf_id validation needed - customers are platform-wide users

      // Check if booking time falls within werknemer's beschikbaarheden
      const dayNames = ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"];
      const dayOfWeek = dayNames[startDateTime.getDay()];
      
      const beschikbaarheden = await prisma.beschikbaarheid.findMany({
        where: {
          werknemer_id: Number(werknemerId),
          dag: dayOfWeek,
        },
        select: {
          start_tijd: true,
          eind_tijd: true,
        },
      });

      if (beschikbaarheden.length === 0) {
        return NextResponse.json(
          { error: "Werknemer is niet beschikbaar op deze dag" },
          { status: 400 }
        );
      }

      // Check if booking time falls within any beschikbaarheid window
      // Gebruik lokale tijd voor consistentie (seed gebruikt lokale tijd zonder Z)
      const bookingStartHour = startDateTime.getHours();
      const bookingStartMinute = startDateTime.getMinutes();
      const bookingEndHour = endDateTime.getHours();
      const bookingEndMinute = endDateTime.getMinutes();

      const isWithinBeschikbaarheid = beschikbaarheden.some((beschikbaarheid) => {
        const beschikbaarheidStart = new Date(beschikbaarheid.start_tijd);
        const beschikbaarheidEnd = new Date(beschikbaarheid.eind_tijd);
        
        // Gebruik lokale tijd voor beschikbaarheden (consistent met seed)
        const beschikbaarheidStartHour = beschikbaarheidStart.getHours();
        const beschikbaarheidStartMinute = beschikbaarheidStart.getMinutes();
        const beschikbaarheidEndHour = beschikbaarheidEnd.getHours();
        const beschikbaarheidEndMinute = beschikbaarheidEnd.getMinutes();

        // Convert to minutes for easier comparison
        const bookingStartMinutes = bookingStartHour * 60 + bookingStartMinute;
        const bookingEndMinutes = bookingEndHour * 60 + bookingEndMinute;
        const beschikbaarheidStartMinutes = beschikbaarheidStartHour * 60 + beschikbaarheidStartMinute;
        const beschikbaarheidEndMinutes = beschikbaarheidEndHour * 60 + beschikbaarheidEndMinute;

        // Check if booking is completely within beschikbaarheid window
        return bookingStartMinutes >= beschikbaarheidStartMinutes && 
               bookingEndMinutes <= beschikbaarheidEndMinutes;
      });

      if (!isWithinBeschikbaarheid) {
        return NextResponse.json(
          { error: "Dit tijdslot valt buiten de beschikbaarheid van de werknemer" },
          { status: 400 }
        );
      }

      // Check for overlapping appointments to ensure time slot is available
      const overlappingAppointment = await prisma.afspraak.findFirst({
        where: {
          werknemer_id: Number(werknemerId),
          start_datum: {
            lt: endDateTime,
          },
          eind_datum: {
            gt: startDateTime,
          },
          status: {
            not: "geannuleerd",
          },
        },
      });

      if (overlappingAppointment) {
        return NextResponse.json(
          { error: "Dit tijdslot is al bezet" },
          { status: 409 }
        );
      }

      // Maak de afspraak aan
      const afspraak = await prisma.afspraak.create({
        data: {
          werknemer_id: Number(werknemerId),
          klant_id: klant.klant_id,
          start_datum: startDateTime,
          eind_datum: endDateTime,
          status: status || "gepland",
        },
        include: {
  werknemer: {
    select: {
      werknemer_id: true,
      voornaam: true,
      naam: true,
      email: true,
      telefoonnummer: true,
      bedrijf: {
        select: {
          naam: true,
          email: true,
        },
      },
    },
  },
  klant: {
    select: {
      klant_id: true,
      voornaam: true,
      naam: true,
      email: true,
      telefoonnummer: true,
    },
  },
},
      });

      // Verstuur bevestigingsmail naar klant
      if (afspraak.klant?.email) {
        try {
          const startDate = new Date(afspraak.start_datum);
          const endDate = new Date(afspraak.eind_datum);
          const duration = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60)); // Minuten

          await resend.emails.send({
            from: "SchedulAI <onboarding@resend.dev>",
            to: afspraak.klant.email,
            subject: "Afspraak Bevestigd 📅",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #ff7a2d 0%, #ff5722 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                  <h1 style="color: white; margin: 0; font-size: 28px;">Afspraak Bevestigd!</h1>
                </div>
                <div style="background: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <p style="color: #333; font-size: 16px; line-height: 1.6;">Hallo ${afspraak.klant.voornaam || 'Klant'},</p>
                  <p style="color: #666; font-size: 15px; line-height: 1.6;">Uw afspraak is succesvol bevestigd. Hier zijn de details:</p>
                  <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <table style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 8px 0; color: #666; font-weight: bold; width: 150px;">Werknemer:</td>
                        <td style="padding: 8px 0; color: #333;">${afspraak.werknemer.voornaam} ${afspraak.werknemer.naam}</td>
                      </tr>
                      ${afspraak.werknemer.bedrijf ? `
                      <tr>
                        <td style="padding: 8px 0; color: #666; font-weight: bold;">Bedrijf:</td>
                        <td style="padding: 8px 0; color: #333;">${afspraak.werknemer.bedrijf.naam}</td>
                      </tr>
                      ` : ''}
                      <tr>
                        <td style="padding: 8px 0; color: #666; font-weight: bold;">Datum:</td>
                        <td style="padding: 8px 0; color: #333;">${startDate.toLocaleDateString('nl-NL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #666; font-weight: bold;">Tijd:</td>
                        <td style="padding: 8px 0; color: #333;">${startDate.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #666; font-weight: bold;">Duur:</td>
                        <td style="padding: 8px 0; color: #333;">${duration} minuten</td>
                      </tr>
                    </table>
                  </div>
                  <p style="color: #666; font-size: 14px; line-height: 1.6; margin-top: 20px;">
                    Gelieve 15 minuten voor uw afspraak aanwezig te zijn. Als u wilt wijzigen of annuleren, neem dan minstens 24 uur van tevoren contact met ons op.
                  </p>
                  <p style="color: #666; font-size: 14px; line-height: 1.6; margin-top: 20px;">
                    Met vriendelijke groet,<br>
                    <strong>SchedulAI</strong>
                  </p>
                </div>
              </div>
            `,
          });
          console.log(`[Booking API] Bevestigingsmail verstuurd naar klant: ${afspraak.klant.email}`);
        } catch (e) {
          console.error("[Booking API] Fout bij versturen bevestigingsmail naar klant:", e);
        }
      }

      // Verstuur notificatie naar bedrijf
      if (afspraak.werknemer?.bedrijf?.email) {
        try {
          await resend.emails.send({
            from: "SchedulAI <onboarding@resend.dev>",
            to: afspraak.werknemer.bedrijf.email,
            subject: "Nieuwe afspraak bevestigd 📅",
            html: `
              <p>Hallo ${afspraak.werknemer.bedrijf.naam},</p>
              <p>Er is een nieuwe afspraak bevestigd.</p>
              <ul>
                <li><strong>Klant:</strong> ${afspraak.klant.voornaam} ${afspraak.klant.naam}</li>
                <li><strong>Werknemer:</strong> ${afspraak.werknemer.voornaam} ${afspraak.werknemer.naam}</li>
                <li><strong>Wanneer:</strong> ${new Date(afspraak.start_datum).toLocaleString("nl-NL")}</li>
              </ul>
              <p>— SchedulAI</p>
            `,
          });
          console.log(`[Booking API] Notificatie verstuurd naar bedrijf: ${afspraak.werknemer.bedrijf.email}`);
        } catch (e) {
          console.error("[Booking API] Fout bij versturen notificatie naar bedrijf:", e);
        }
      }

      return NextResponse.json(afspraak, { status: 201 });
    }

    // BUSINESS FLOW: Werknemer maakt afspraak met klant
    // Validatie
    if (!klant_id || !start_datum || !eind_datum) {
      return NextResponse.json(
        { error: "Klant, startdatum en einddatum zijn verplicht" },
        { status: 400 }
      );
    }

    // Zoek de werknemer op basis van email (Werknemer heeft geen clerkUserId in schema)
    const user = await clerkClient().then(client => client.users.getUser(userId));
    const userEmail = user?.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress;
    
    if (!userEmail) {
      return NextResponse.json({ error: "Gebruiker email niet gevonden" }, { status: 404 });
    }

    const werknemer = await prisma.werknemer.findFirst({
      where: { email: userEmail },
    });

    if (!werknemer) {
      return NextResponse.json({ error: "Werknemer niet gevonden" }, { status: 404 });
    }

    // Maak de afspraak aan
    const afspraak = await prisma.afspraak.create({
      data: {
        werknemer_id: werknemer.werknemer_id,
        klant_id: Number(klant_id),
        start_datum: new Date(start_datum),
        eind_datum: new Date(eind_datum),
        status: status || "gepland",
      },
      include: {
        klant: {
          select: {
            naam: true,
            email: true,
            telefoonnummer: true,
          },
        },
      },
    });

    return NextResponse.json(afspraak, { status: 201 });
  } catch (error) {
    console.error("Fout bij maken afspraak:", error);
    return NextResponse.json(
      { error: "Er is een fout opgetreden" },
      { status: 500 }
    );
  }
}
