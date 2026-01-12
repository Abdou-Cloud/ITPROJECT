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

    // Weekberekening
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0,0,0,0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    const afsprakenWeek = await prisma.afspraak.count({
      where: {
        werknemer: { bedrijf_id: bedrijfId },
        start_datum: { gte: startOfWeek, lt: endOfWeek },
      },
    });

    return NextResponse.json({ afsprakenWeek });
  } catch (error) {
    return NextResponse.json({ error: "Fout bij ophalen weekstats" }, { status: 500 });
  }
}
