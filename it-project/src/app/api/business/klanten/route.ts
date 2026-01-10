import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Haal alle klanten op
    const klanten = await prisma.klant.findMany();
    return NextResponse.json({ count: klanten.length, klanten });
  } catch (error) {
    return NextResponse.json({ error: "Kon klanten niet ophalen" }, { status: 500 });
  }
}
