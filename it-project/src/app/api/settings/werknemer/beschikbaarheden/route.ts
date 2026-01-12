import { prisma } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// GET - Haal beschikbaarheden op voor een werknemer
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const werknemerId = searchParams.get("werknemer_id");

    if (!werknemerId) {
      return NextResponse.json({ error: "werknemer_id is verplicht" }, { status: 400 });
    }

    // Controleer of werknemer bij het bedrijf hoort
    const user = await clerkClient().then(client => client.users.getUser(userId));
    const userEmail = user?.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress;
    
    if (!userEmail) {
      return NextResponse.json({ error: "Email niet gevonden" }, { status: 404 });
    }

    const bedrijf = await prisma.bedrijf.findFirst({
      where: { email: userEmail },
    });

    if (!bedrijf) {
      return NextResponse.json({ error: "Bedrijf niet gevonden" }, { status: 404 });
    }

    const werknemer = await prisma.werknemer.findFirst({
      where: {
        werknemer_id: Number(werknemerId),
        bedrijf_id: bedrijf.bedrijf_id,
      },
    });

    if (!werknemer) {
      return NextResponse.json({ error: "Werknemer niet gevonden" }, { status: 404 });
    }

    const beschikbaarheden = await prisma.beschikbaarheid.findMany({
      where: { werknemer_id: Number(werknemerId) },
      orderBy: { dag: "asc" },
    });

    return NextResponse.json(beschikbaarheden);
  } catch (error) {
    console.error("Fout bij ophalen beschikbaarheden:", error);
    return NextResponse.json({ error: "Er is een fout opgetreden" }, { status: 500 });
  }
}

// POST - Update beschikbaarheden voor een werknemer
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
    }

    const body = await request.json();
    const { werknemer_id, beschikbaarheden } = body; // Array van { dag, start_tijd, eind_tijd, enabled }

    // Controleer of werknemer bij het bedrijf hoort
    const user = await clerkClient().then(client => client.users.getUser(userId));
    const userEmail = user?.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress;
    
    if (!userEmail) {
      return NextResponse.json({ error: "Email niet gevonden" }, { status: 404 });
    }

    const bedrijf = await prisma.bedrijf.findFirst({
      where: { email: userEmail },
    });

    if (!bedrijf) {
      return NextResponse.json({ error: "Bedrijf niet gevonden" }, { status: 404 });
    }

    const werknemer = await prisma.werknemer.findFirst({
      where: {
        werknemer_id: Number(werknemer_id),
        bedrijf_id: bedrijf.bedrijf_id,
      },
    });

    if (!werknemer) {
      return NextResponse.json({ error: "Werknemer niet gevonden" }, { status: 404 });
    }

    // Haal huidige beschikbaarheden op
    const huidigeBeschikbaarheden = await prisma.beschikbaarheid.findMany({
      where: { werknemer_id: Number(werknemer_id) },
      select: { dag: true },
    });

    const huidigeDagen = new Set(huidigeBeschikbaarheden.map(b => b.dag));
    const nieuweDagen = new Set(
      beschikbaarheden
        .filter((b: { enabled: boolean }) => b.enabled)
        .map((b: { dag: string }) => b.dag)
    );

    // Bepaal welke dagen zijn verwijderd
    const verwijderdeDagen = Array.from(huidigeDagen).filter(dag => !nieuweDagen.has(dag));

    // Verwijder afspraken op uitgevinkte dagen voor deze werknemer
    let verwijderdeAfsprakenCount = 0;
    if (verwijderdeDagen.length > 0) {
      const dayNames = ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"];
      const nu = new Date();

      // Voor elke verwijderde dag, verwijder alle toekomstige afspraken
      for (const dag of verwijderdeDagen) {
        const toekomstigeAfspraken = await prisma.afspraak.findMany({
          where: {
            werknemer_id: Number(werknemer_id),
            start_datum: { gte: nu },
            status: { not: "geannuleerd" },
          },
        });

        // Filter afspraken die op de verwijderde dag vallen
        const teVerwijderen = toekomstigeAfspraken.filter(afspraak => {
          const afspraakDag = dayNames[new Date(afspraak.start_datum).getDay()];
          return afspraakDag === dag;
        });

        // Verwijder deze afspraken
        if (teVerwijderen.length > 0) {
          await prisma.afspraak.deleteMany({
            where: {
              afspraak_id: { in: teVerwijderen.map(a => a.afspraak_id) },
            },
          });
          verwijderdeAfsprakenCount += teVerwijderen.length;
          console.log(`[Beschikbaarheden] ${teVerwijderen.length} afspraken verwijderd voor werknemer ${werknemer_id} op ${dag}`);
        }
      }
    }

    // Verwijder oude beschikbaarheden
    await prisma.beschikbaarheid.deleteMany({
      where: { werknemer_id: Number(werknemer_id) },
    });

    // Maak nieuwe beschikbaarheden aan (alleen voor enabled dagen)
    const enabledBeschikbaarheden = beschikbaarheden.filter((b: { enabled: boolean }) => b.enabled);
    
    if (enabledBeschikbaarheden.length > 0) {
      const dayNames = ["maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag", "zondag"];
      
      const created = await prisma.beschikbaarheid.createMany({
        data: enabledBeschikbaarheden.map((b: { dag: string; start_tijd: string; eind_tijd: string }) => {
          const [startHour, startMinute] = b.start_tijd.split(':').map(Number);
          const [endHour, endMinute] = b.eind_tijd.split(':').map(Number);
          const dayIndex = dayNames.indexOf(b.dag);
          const referenceDate = new Date(2026, 0, 5 + dayIndex);
          
          return {
            werknemer_id: Number(werknemer_id),
            dag: b.dag,
            start_tijd: new Date(referenceDate.setHours(startHour, startMinute, 0, 0)),
            eind_tijd: new Date(referenceDate.setHours(endHour, endMinute, 0, 0)),
          };
        }),
      });

      return NextResponse.json({ 
        success: true, 
        count: created.count,
        verwijderdeAfspraken: verwijderdeAfsprakenCount > 0 
          ? `${verwijderdeAfsprakenCount} afspraken verwijderd op uitgevinkte dagen` 
          : null
      });
    }

    return NextResponse.json({ 
      success: true, 
      count: 0,
      verwijderdeAfspraken: verwijderdeAfsprakenCount > 0 
        ? `${verwijderdeAfsprakenCount} afspraken verwijderd op uitgevinkte dagen` 
        : null
    });
  } catch (error) {
    console.error("Fout bij opslaan beschikbaarheden:", error);
    return NextResponse.json({ error: "Er is een fout opgetreden" }, { status: 500 });
  }
}



