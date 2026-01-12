import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getBedrijfIdForUser } from "@/lib/bedrijf-sync";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
    const bedrijfId = await getBedrijfIdForUser(userId);
    if (!bedrijfId) return NextResponse.json({ error: "Geen bedrijf gevonden" }, { status: 404 });

    const now = new Date();
    const nextAfspraak = await prisma.afspraak.findFirst({
      where: {
        werknemer: { bedrijf_id: bedrijfId },
        start_datum: { gte: now },
      },
      orderBy: { start_datum: "asc" },
      include: { klant: true },
    });

    return NextResponse.json({ nextAfspraak });
  } catch (error) {
    return NextResponse.json({ error: "Fout bij ophalen volgende afspraak" }, { status: 500 });
  }
}
