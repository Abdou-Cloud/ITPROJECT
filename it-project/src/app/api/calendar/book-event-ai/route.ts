import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

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

    return NextResponse.json(afspraak, { status: 201 });
  } catch (error) {
    console.error("[Book-Event-AI] Error handling booking:", error);
    return NextResponse.json(
      { error: "Er is een fout opgetreden bij het boeken" },
      { status: 500 },
    );
  }
}
