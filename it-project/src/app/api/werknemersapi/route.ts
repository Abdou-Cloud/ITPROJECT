// app/api/werknemers/route.ts
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const bedrijfId = request.nextUrl.searchParams.get("bedrijf_id");

    if (!bedrijfId) {
      return NextResponse.json(
        { error: "bedrijf_id is verplicht" },
        { status: 400 }
      );
    }

    const bedrijfIdNum = parseInt(bedrijfId, 10);
    if (isNaN(bedrijfIdNum)) {
      return NextResponse.json(
        { error: "Ongeldig bedrijf_id" },
        { status: 400 }
      );
    }

    const werknemers = await prisma.werknemer.findMany({
      where: { bedrijf_id: bedrijfIdNum },
      select: {
        werknemer_id: true,
        voornaam: true,
        naam: true,
        email: true,
        telefoonnummer: true,
      },
      orderBy: { naam: "asc" },
    });

    return NextResponse.json(werknemers, { status: 200 });
  } catch (error) {
    console.error("Fout bij ophalen werknemers:", error);
    return NextResponse.json(
      { error: "Er is een fout opgetreden bij het ophalen van werknemers" },
      { status: 500 }
    );
  }
}
