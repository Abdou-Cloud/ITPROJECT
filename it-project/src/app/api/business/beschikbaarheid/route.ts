import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET - Haal alle werknemers op met hun beschikbaarheden voor het bedrijf
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
    }

    // Haal email op van Clerk gebruiker
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const userEmail = user?.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress;
    
    if (!userEmail) {
      return NextResponse.json({ error: "Gebruiker email niet gevonden" }, { status: 404 });
    }

    // Zoek de werknemer op basis van email
    const werknemer = await prisma.werknemer.findFirst({
      where: { email: userEmail },
      select: { bedrijf_id: true },
    });

    if (!werknemer) {
      return NextResponse.json({ error: "Werknemer niet gevonden" }, { status: 404 });
    }

    // Haal alle werknemers op van het bedrijf met hun beschikbaarheden
    const werknemers = await prisma.werknemer.findMany({
      where: { bedrijf_id: werknemer.bedrijf_id },
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
    console.error("Fout bij ophalen beschikbaarheden:", error);
    return NextResponse.json(
      { error: "Er is een fout opgetreden bij het ophalen van beschikbaarheden" },
      { status: 500 }
    );
  }
}

// POST - Sla beschikbaarheden op voor een werknemer (realtime)
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
    }

    const body = await request.json();
    const { werknemer_id, beschikbaarheden } = body;

    if (!werknemer_id) {
      return NextResponse.json({ error: "werknemer_id is verplicht" }, { status: 400 });
    }

    if (!Array.isArray(beschikbaarheden)) {
      return NextResponse.json({ error: "beschikbaarheden moet een array zijn" }, { status: 400 });
    }

    // Haal email op van Clerk gebruiker om bedrijf te verifiëren
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const userEmail = user?.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress;
    
    if (!userEmail) {
      return NextResponse.json({ error: "Gebruiker email niet gevonden" }, { status: 404 });
    }

    // Verifieer dat de werknemer bestaat en bij hetzelfde bedrijf hoort
    const huidigeWerknemer = await prisma.werknemer.findFirst({
      where: { email: userEmail },
      select: { bedrijf_id: true },
    });

    if (!huidigeWerknemer) {
      return NextResponse.json({ error: "Werknemer niet gevonden" }, { status: 404 });
    }

    const doelWerknemer = await prisma.werknemer.findUnique({
      where: { werknemer_id: Number(werknemer_id) },
      select: { bedrijf_id: true },
    });

    if (!doelWerknemer) {
      return NextResponse.json({ error: "Doel werknemer niet gevonden" }, { status: 404 });
    }

    // Verifieer dat beide werknemers bij hetzelfde bedrijf horen
    if (huidigeWerknemer.bedrijf_id !== doelWerknemer.bedrijf_id) {
      return NextResponse.json({ error: "Geen toegang tot deze werknemer" }, { status: 403 });
    }

    // Haal bestaande beschikbaarheden op voor deze werknemer
    const bestaandeBeschikbaarheden = await prisma.beschikbaarheid.findMany({
      where: { werknemer_id: Number(werknemer_id) },
    });

    const dagNamen: Record<string, string> = {
      "Maandag": "maandag",
      "Dinsdag": "dinsdag",
      "Woensdag": "woensdag",
      "Donderdag": "donderdag",
      "Vrijdag": "vrijdag",
      "Zaterdag": "zaterdag",
      "Zondag": "zondag",
    };

    // Map dag naam naar index in week (maandag = 0, dinsdag = 1, etc.)
    const dagMap: Record<string, number> = {
      "Maandag": 0,
      "Dinsdag": 1,
      "Woensdag": 2,
      "Donderdag": 3,
      "Vrijdag": 4,
      "Zaterdag": 5,
      "Zondag": 6,
    };

    // Verwerk nieuwe beschikbaarheden (alleen dagen die open zijn)
    const nieuweBeschikbaarheden = beschikbaarheden
      .filter((b: any) => b.open && b.openTijd && b.sluitTijd)
      .map((b: any) => {
        const dagNaam = dagNamen[b.dag] || b.dag.toLowerCase();
        
        // Valideer tijdvelden
        if (!b.openTijd || !b.sluitTijd) {
          throw new Error(`Tijdvelden ontbreken voor ${b.dag}`);
        }
        
        // Parse tijd (HH:mm formaat) naar DateTime
        const [startUur, startMinuut] = b.openTijd.split(":").map(Number);
        const [eindUur, eindMinuut] = b.sluitTijd.split(":").map(Number);
        
        // Valideer dat de tijden geldig zijn
        if (isNaN(startUur) || isNaN(startMinuut) || isNaN(eindUur) || isNaN(eindMinuut)) {
          throw new Error(`Ongeldige tijd format voor ${b.dag}`);
        }
        
        // Gebruik 12 januari 2026 (maandag) als referentie voor de week
        const weekStart = new Date("2026-01-12T00:00:00"); // Maandag 12 januari 2026
        const dagIndex = dagMap[b.dag] || 0;
        const dagDatum = new Date(weekStart);
        dagDatum.setDate(weekStart.getDate() + dagIndex);
        
        const startTijd = new Date(dagDatum);
        startTijd.setHours(startUur, startMinuut, 0, 0);
        
        const eindTijd = new Date(dagDatum);
        eindTijd.setHours(eindUur, eindMinuut, 0, 0);

        return {
          dag: dagNaam,
          start_tijd: startTijd,
          eind_tijd: eindTijd,
        };
      });

    // Verwijder beschikbaarheden voor dagen die niet meer open zijn
    const openDagen = nieuweBeschikbaarheden.map((b) => b.dag);
    const teVerwijderen = bestaandeBeschikbaarheden.filter(
      (b) => !openDagen.includes(b.dag)
    );

    if (teVerwijderen.length > 0) {
      await prisma.beschikbaarheid.deleteMany({
        where: {
          beschikbaarheid_id: {
            in: teVerwijderen.map((b) => b.beschikbaarheid_id),
          },
        },
      });
    }

    // Verwijder eerst ALLE bestaande beschikbaarheden voor dagen die worden geüpdatet (om duplicaten te voorkomen)
    if (openDagen.length > 0) {
      await prisma.beschikbaarheid.deleteMany({
        where: {
          werknemer_id: Number(werknemer_id),
          dag: {
            in: openDagen,
          },
        },
      });
    }

    // Maak nieuwe beschikbaarheden aan
    if (nieuweBeschikbaarheden.length > 0) {
      await prisma.beschikbaarheid.createMany({
        data: nieuweBeschikbaarheden.map((b) => ({
          werknemer_id: Number(werknemer_id),
          dag: b.dag,
          start_tijd: b.start_tijd,
          eind_tijd: b.eind_tijd,
        })),
      });
    }

    // Haal bijgewerkte beschikbaarheden op
    const bijgewerkteBeschikbaarheden = await prisma.beschikbaarheid.findMany({
      where: { werknemer_id: Number(werknemer_id) },
      select: {
        beschikbaarheid_id: true,
        dag: true,
        start_tijd: true,
        eind_tijd: true,
      },
    });

    return NextResponse.json({
      success: true,
      beschikbaarheden: bijgewerkteBeschikbaarheden,
    }, { status: 200 });
  } catch (error) {
    console.error("Fout bij opslaan beschikbaarheden:", error);
    const errorMessage = error instanceof Error ? error.message : "Er is een fout opgetreden bij het opslaan van beschikbaarheden";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}