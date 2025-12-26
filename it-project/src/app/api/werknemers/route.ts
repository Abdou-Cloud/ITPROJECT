import { prisma } from "../../../../prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// GET - Haal werknemers op voor een specifiek bedrijf (voor klanten om te kunnen boeken)
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
    }

    // Haal query parameter op voor bedrijf filtering
    const searchParams = request.nextUrl.searchParams;
    const bedrijfIdParam = searchParams.get("bedrijfId");

    // Als bedrijfId is meegegeven, haal werknemers van dat bedrijf op
    if (bedrijfIdParam) {
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
          naam: true,
          email: true,
          telefoonnummer: true,
        },
        orderBy: {
          naam: "asc",
        },
      });

      return NextResponse.json(werknemers);
    }

    // Fallback: Zoek de klant op basis van clerkUserId om het bedrijf te vinden
    const klant = await prisma.klant.findUnique({
      where: { clerkUserId: userId },
      select: { bedrijf_id: true },
    });

    if (!klant) {
      return NextResponse.json({ error: "Klant niet gevonden" }, { status: 404 });
    }

    // Haal alle werknemers van het bedrijf op
    const werknemers = await prisma.werknemer.findMany({
      where: { bedrijf_id: klant.bedrijf_id },
      select: {
        werknemer_id: true,
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
