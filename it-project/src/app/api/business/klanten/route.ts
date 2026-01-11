import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Haal alle klanten op, inclusief het aantal afspraken per klant
    const klanten = await prisma.klant.findMany({
      include: {
        afspraken: true,
      },
    });
    // Voeg een property toe met het aantal afspraken
    const klantenWithCount = klanten.map((klant) => ({
      ...klant,
      afsprakenCount: klant.afspraken.length,
    }));
    return NextResponse.json({ count: klantenWithCount.length, klanten: klantenWithCount });
  } catch (error) {
    return NextResponse.json({ error: "Kon klanten niet ophalen" }, { status: 500 });
  }
}
