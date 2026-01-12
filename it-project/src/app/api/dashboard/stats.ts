import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getBedrijfIdForUser } from "@/lib/bedrijf-sync";

/**
 * GET /api/dashboard/stats
 * Returns the number of appointments today and AI bookings this week for the current business user
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
    }

    // Vind het bedrijf_id van de ingelogde gebruiker
    const bedrijfId = await getBedrijfIdForUser(userId);
    if (!bedrijfId) {
      return NextResponse.json({ error: "Geen bedrijf gevonden voor deze gebruiker" }, { status: 404 });
    }


    // Aantal afspraken vandaag (alle afspraken van werknemers van dit bedrijf)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const afsprakenVandaag = await prisma.afspraak.count({
      where: {
        werknemer: {
          bedrijf_id: bedrijfId,
        },
        start_datum: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    return NextResponse.json({
      afsprakenVandaag,
    });
  } catch (error) {
    console.error("Fout bij ophalen dashboard stats:", error);
    return NextResponse.json({ error: "Er is een fout opgetreden" }, { status: 500 });
  }
}
