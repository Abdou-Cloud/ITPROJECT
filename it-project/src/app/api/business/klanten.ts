import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
    const werknemer = await prisma.werknemer.findUnique({ where: { clerkUserId: userId }, select: { bedrijf_id: true } });
    if (!werknemer) return NextResponse.json({ error: "Geen bedrijf gevonden" }, { status: 404 });
    const bedrijfId = werknemer.bedrijf_id;

    const klanten = await prisma.klant.findMany({
      where: { bedrijf_id: bedrijfId },
      select: {
        klant_id: true,
        voornaam: true,
        naam: true,
        email: true,
        telefoonnummer: true,
        afspraken: true,
        // Voeg meer velden toe indien gewenst
      },
    });

    return NextResponse.json({ klanten });
  } catch (error) {
    return NextResponse.json({ error: "Fout bij ophalen klanten" }, { status: 500 });
  }
}
