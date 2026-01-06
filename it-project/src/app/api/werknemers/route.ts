import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// GET - Haal werknemers op voor een specifiek bedrijf (voor klanten om te kunnen boeken)
// Customers are platform-wide and can view employees from any company
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
    }

    // Haal query parameter op voor bedrijf filtering
    const searchParams = request.nextUrl.searchParams;
    const bedrijfIdParam = searchParams.get("bedrijfId");

    // bedrijfId is required - customers can view employees from any company
    if (!bedrijfIdParam) {
      return NextResponse.json(
        { error: "bedrijfId parameter is verplicht" },
        { status: 400 }
      );
    }

    const bedrijfId = Number(bedrijfIdParam);

    // Controleer of het bedrijf bestaat
    const bedrijf = await prisma.bedrijf.findUnique({
      where: { bedrijf_id: bedrijfId },
    });

    if (!bedrijf) {
      return NextResponse.json({ error: "Bedrijf niet gevonden" }, { status: 404 });
    }

    // Haal alle werknemers van het bedrijf op
    const werknemers = await prisma.werknemer.findMany({
      where: { bedrijf_id: bedrijfId },
      select: {
        werknemer_id: true,
        voornaam: true,
        naam: true,
        email: true,
        telefoonnummer: true,
      },
      orderBy: {
        naam: "asc",
      },
    });

    return NextResponse.json(werknemers);
  } catch (error) {
    console.error("Fout bij ophalen werknemers:", error);
    return NextResponse.json(
      { error: "Er is een fout opgetreden" },
      { status: 500 }
    );
  }
}
