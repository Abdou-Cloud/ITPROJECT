import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { resend } from "@/lib/resend";

type BookEventAIRequest = {
  werknemer_id?: number;
  start_datum?: string;
  eind_datum?: string;
  klant?: {
    voornaam?: string;
    naam?: string;
    email?: string;
    telefoonnummer?: string;
  };
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as BookEventAIRequest;
    const { werknemer_id, start_datum, eind_datum, klant } = body;

    // Basic validation
    if (!werknemer_id || !start_datum || !eind_datum || !klant?.email) {
      return NextResponse.json(
        {
          error:
            "werknemer_id, start_datum, eind_datum en klant.email zijn verplicht",
        },
        { status: 400 },
      );
    }

    // Parse dates
    const startDateTime = new Date(start_datum);
    const endDateTime = new Date(eind_datum);

    if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
      return NextResponse.json(
        { error: "Ongeldige datum format" },
        { status: 400 },
      );
    }

    if (startDateTime >= endDateTime) {
      return NextResponse.json(
        { error: "Einddatum moet na startdatum zijn" },
        { status: 400 },
      );
    }

    // Check werknemer exists
    const werknemer = await prisma.werknemer.findUnique({
      where: { werknemer_id },
      select: {
        werknemer_id: true,
        voornaam: true,
        naam: true,
        email: true,
        telefoonnummer: true,
        bedrijf_id: true,
      },
    });

    if (!werknemer) {
      return NextResponse.json(
        { error: "Werknemer niet gevonden" },
        { status: 404 },
      );
    }

    // Find or create klant by email (email is NOT unique in schema, so use findFirst)
    let dbKlant = await prisma.klant.findFirst({
      where: { email: klant.email },
      select: {
        klant_id: true,
        voornaam: true,
        naam: true,
        email: true,
        telefoonnummer: true,
      },
    });

    if (!dbKlant) {
      const createdKlant = await prisma.klant.create({
        data: {
          clerkUserId: `guest-${crypto.randomUUID()}`,
          voornaam: klant.voornaam || "Onbekend",
          naam: klant.naam || "Onbekend",
          email: klant.email,
          telefoonnummer: klant.telefoonnummer || "N/A",
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
      console.log(
        `[Book-Event-AI] Created new klant via AI booking: klant_id=${dbKlant.klant_id} email=${dbKlant.email}`,
      );
    } else {
      console.log(
        `[Book-Event-AI] Reusing existing klant: klant_id=${dbKlant.klant_id} email=${dbKlant.email}`,
      );
    }

    if (!dbKlant) {
      console.error("[Book-Event-AI] Klant kon niet worden gevonden of aangemaakt");
      return NextResponse.json(
        { error: "Klant kon niet worden gevonden of aangemaakt" },
        { status: 500 },
      );
    }

    // Check if booking time falls within werknemer's beschikbaarheden
    const dayNames = ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"];
    const dayOfWeek = dayNames[startDateTime.getDay()];
    
    const beschikbaarheden = await prisma.beschikbaarheid.findMany({
      where: {
        werknemer_id: werknemer.werknemer_id,
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
        { status: 400 },
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
        { status: 400 },
      );
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

    if (overlappingAppointment) {
      return NextResponse.json(
        { error: "Dit tijdslot is al bezet" },
        { status: 409 },
      );
    }

    // Create afspraak
    const afspraak = await prisma.afspraak.create({
      data: {
        werknemer_id,
        klant_id: dbKlant!.klant_id,
        start_datum: startDateTime,
        eind_datum: endDateTime,
        status: "gepland",
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
        console.log(`[Book-Event-AI] Bevestigingsmail verstuurd naar klant: ${afspraak.klant.email}`);
      } catch (e) {
        console.error("[Book-Event-AI] Fout bij versturen bevestigingsmail naar klant:", e);
      }
    }

    // Verstuur notificatie naar bedrijf (optioneel)
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
        console.log(`[Book-Event-AI] Notificatie verstuurd naar bedrijf: ${afspraak.werknemer.bedrijf.email}`);
      } catch (e) {
        console.error("[Book-Event-AI] Fout bij versturen notificatie naar bedrijf:", e);
      }
    }

    return NextResponse.json(afspraak, { status: 201 });
  } catch (error) {
    console.error("[Book-Event-AI] Error handling booking:", error);
    return NextResponse.json(
      { error: "Er is een fout opgetreden bij het boeken" },
      { status: 500 },
    );
  }
}
