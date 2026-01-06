import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// GET - Haal alle klanten op voor het bedrijf van de ingelogde werknemer
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
    }

    // Zoek de werknemer op basis van clerkUserId om het bedrijf te vinden
    const werknemer = await prisma.werknemer.findUnique({
      where: { clerkUserId: userId },
      select: { bedrijf_id: true },
    });

    if (!werknemer) {
      return NextResponse.json({ error: "Werknemer niet gevonden" }, { status: 404 });
    }

    // Haal alle klanten van het bedrijf op
    const klanten = await prisma.klant.findMany({
      where: { bedrijf_id: werknemer.bedrijf_id },
      select: {
        klant_id: true,
        naam: true,
        email: true,
        telefoonnummer: true,
      },
      orderBy: {
        naam: "asc",
      },
    });

    return NextResponse.json(klanten);
  } catch (error) {
    console.error("Fout bij ophalen klanten:", error);
    return NextResponse.json(
      { error: "Er is een fout opgetreden" },
      { status: 500 }
    );
  }
}
