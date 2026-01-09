import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // We accepteren beide varianten voor de zekerheid
    const bedrijfIdParam = searchParams.get("bedrijfId") || searchParams.get("bedrijf_id");

    if (!bedrijfIdParam) {
      return NextResponse.json(
        { error: "bedrijf_id parameter is verplicht" },
        { status: 400 }
      );
    }

    const bedrijfId = Number(bedrijfIdParam);

    const werknemers = await prisma.werknemer.findMany({
      where: { bedrijf_id: bedrijfId },
      select: {
        werknemer_id: true,
        voornaam: true,
        naam: true,
      },
      orderBy: { naam: "asc" },
    });

    return NextResponse.json(werknemers, {
      headers: { "bypass-tunnel-reminder": "true" }
    });
  } catch (error) {
    console.error("Fout bij ophalen werknemers:", error);
    return NextResponse.json({ error: "Interne fout" }, { status: 500 });
  }
}