import { prisma } from "../../../../prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

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
    // Zoek de werknemer op basis van clerkUserId
    const werknemer = await prisma.werknemer.findUnique({
      where: { clerkUserId: userId },
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

      // Zoek de klant op basis van clerkUserId
      const klant = await prisma.klant.findUnique({
        where: { clerkUserId: userId },
      });

      if (!klant) {
        return NextResponse.json({ error: "Klant niet gevonden" }, { status: 404 });
      }

      // Controleer of de werknemer bestaat
      const werknemer = await prisma.werknemer.findUnique({
        where: { werknemer_id: Number(werknemerId) },
      });

      if (!werknemer) {
        return NextResponse.json({ error: "Werknemer niet gevonden" }, { status: 404 });
      }

      // Klanten kunnen bij elk bedrijf boeken (geen bedrijf check meer nodig)

      // Controleer of het tijdslot nog vrij is
      const startDateTime = new Date(startDate);
      const endDateTime = new Date(endDate);

      const bestaandeAfspraak = await prisma.afspraak.findFirst({
        where: {
          werknemer_id: Number(werknemerId),
          OR: [
            {
              // Nieuwe afspraak begint tijdens een bestaande
              start_datum: { lte: startDateTime },
              eind_datum: { gt: startDateTime },
            },
            {
              // Nieuwe afspraak eindigt tijdens een bestaande
              start_datum: { lt: endDateTime },
              eind_datum: { gte: endDateTime },
            },
            {
              // Bestaande afspraak valt binnen nieuwe afspraak
              start_datum: { gte: startDateTime },
              eind_datum: { lte: endDateTime },
            },
          ],
        },
      });

      if (bestaandeAfspraak) {
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
              naam: true,
              email: true,
              telefoonnummer: true,
            },
          },
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
    }

    // BUSINESS FLOW: Werknemer maakt afspraak met klant
    // Validatie
    if (!klant_id || !start_datum || !eind_datum) {
      return NextResponse.json(
        { error: "Klant, startdatum en einddatum zijn verplicht" },
        { status: 400 }
      );
    }

    // Zoek de werknemer op basis van clerkUserId
    const werknemer = await prisma.werknemer.findUnique({
      where: { clerkUserId: userId },
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
