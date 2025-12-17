import { prisma } from "../../../../prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// GET - Haal alle afspraken op voor de ingelogde werknemer
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
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
    }

    const body = await request.json();
    const { klant_id, start_datum, eind_datum, status, beschrijving } = body;

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
