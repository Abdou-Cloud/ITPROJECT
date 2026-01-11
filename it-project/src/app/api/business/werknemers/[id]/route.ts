import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// PUT - Update een werknemer
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
    }

    const { id } = await params;
    const werknemerId = Number(id);
    
    if (isNaN(werknemerId)) {
      return NextResponse.json({ error: "Ongeldig werknemer_id" }, { status: 400 });
    }

    const body = await request.json();
    const { voornaam, naam, email } = body;

    if (!voornaam || !naam || !email) {
      return NextResponse.json(
        { error: "voornaam, naam en email zijn verplicht" },
        { status: 400 }
      );
    }

    // Haal email op van Clerk gebruiker om bedrijf te verifiëren
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const userEmail = user?.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress;
    
    if (!userEmail) {
      return NextResponse.json({ error: "Gebruiker email niet gevonden" }, { status: 404 });
    }

    // Zoek de werknemer op basis van email om bedrijf_id te krijgen
    const huidigeWerknemer = await prisma.werknemer.findFirst({
      where: { email: userEmail },
      select: { bedrijf_id: true },
    });

    if (!huidigeWerknemer) {
      return NextResponse.json({ error: "Werknemer niet gevonden" }, { status: 404 });
    }

    // Controleer of de doelwerknemer bestaat
    const doelWerknemer = await prisma.werknemer.findUnique({
      where: { werknemer_id: werknemerId },
      select: { bedrijf_id: true, email: true },
    });

    if (!doelWerknemer) {
      return NextResponse.json({ error: "Werknemer niet gevonden" }, { status: 404 });
    }

    // Verifieer dat beide werknemers bij hetzelfde bedrijf horen
    if (huidigeWerknemer.bedrijf_id !== doelWerknemer.bedrijf_id) {
      return NextResponse.json({ error: "Geen toegang tot deze werknemer" }, { status: 403 });
    }

    // Als email wordt gewijzigd, controleer of nieuwe email al bestaat
    if (email !== doelWerknemer.email) {
      const bestaandeWerknemer = await prisma.werknemer.findUnique({
        where: { email },
      });

      if (bestaandeWerknemer) {
        return NextResponse.json(
          { error: "Een werknemer met dit email adres bestaat al" },
          { status: 409 }
        );
      }
    }

    // Update de werknemer
    const bijgewerkteWerknemer = await prisma.werknemer.update({
      where: { werknemer_id: werknemerId },
      data: {
        voornaam,
        naam,
        email,
      },
      select: {
        werknemer_id: true,
        voornaam: true,
        naam: true,
        email: true,
      },
    });

    return NextResponse.json({ werknemer: bijgewerkteWerknemer }, { status: 200 });
  } catch (error) {
    console.error("Fout bij updaten werknemer:", error);
    
    // Prisma unique constraint error
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return NextResponse.json(
        { error: "Een werknemer met dit email adres bestaat al" },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: "Er is een fout opgetreden bij het updaten van de werknemer" },
      { status: 500 }
    );
  }
}
