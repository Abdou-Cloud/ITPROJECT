import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getBedrijfIdForUser } from "@/lib/bedrijf-sync";

// GET - Haal alle werknemers op voor het bedrijf
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
    }

    // Haal bedrijf_id op voor de gebruiker
    const bedrijfId = await getBedrijfIdForUser(userId);

    if (!bedrijfId) {
      return NextResponse.json({ error: "Bedrijf niet gevonden" }, { status: 404 });
    }

    // Haal alle werknemers op van het bedrijf met hun beschikbaarheden
    const werknemers = await prisma.werknemer.findMany({
      where: { bedrijf_id: bedrijfId },
      select: {
        werknemer_id: true,
        voornaam: true,
        naam: true,
        email: true,
        beschikbaarheden: {
          select: {
            beschikbaarheid_id: true,
            dag: true,
            start_tijd: true,
            eind_tijd: true,
          },
        },
      },
      orderBy: { naam: "asc" },
    });

    return NextResponse.json({ werknemers }, { status: 200 });
  } catch (error) {
    console.error("Fout bij ophalen werknemers:", error);
    return NextResponse.json(
      { error: "Er is een fout opgetreden bij het ophalen van werknemers" },
      { status: 500 }
    );
  }
}

// POST - Maak een nieuwe werknemer aan
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
    }

    const body = await request.json();
    const { voornaam, naam, email, telefoonnummer, geboorte_datum } = body;

    if (!voornaam || !naam || !email) {
      return NextResponse.json(
        { error: "voornaam, naam en email zijn verplicht" },
        { status: 400 }
      );
    }

    // Haal bedrijf_id op voor de gebruiker
    const bedrijfId = await getBedrijfIdForUser(userId);

    if (!bedrijfId) {
      return NextResponse.json({ error: "Bedrijf niet gevonden" }, { status: 404 });
    }

    // Controleer of email al bestaat
    const bestaandeWerknemer = await prisma.werknemer.findUnique({
      where: { email },
    });

    if (bestaandeWerknemer) {
      return NextResponse.json(
        { error: "Een werknemer met dit email adres bestaat al" },
        { status: 409 }
      );
    }

    // Maak nieuwe werknemer aan
    const nieuweWerknemer = await prisma.werknemer.create({
      data: {
        voornaam,
        naam,
        email,
        telefoonnummer: telefoonnummer || "",
        geboorte_datum: geboorte_datum ? new Date(geboorte_datum) : new Date(),
        bedrijf_id: bedrijfId,
      },
      select: {
        werknemer_id: true,
        voornaam: true,
        naam: true,
        email: true,
        beschikbaarheden: {
          select: {
            beschikbaarheid_id: true,
            dag: true,
            start_tijd: true,
            eind_tijd: true,
          },
        },
      },
    });

    return NextResponse.json({ werknemer: nieuweWerknemer }, { status: 201 });
  } catch (error) {
    console.error("Fout bij aanmaken werknemer:", error);
    
    // Prisma unique constraint error
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return NextResponse.json(
        { error: "Een werknemer met dit email adres bestaat al" },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: "Er is een fout opgetreden bij het aanmaken van de werknemer" },
      { status: 500 }
    );
  }
}
