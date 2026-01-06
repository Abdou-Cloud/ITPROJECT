// app/api/bedrijven/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const bedrijven = await prisma.bedrijf.findMany({
      select: {
        bedrijf_id: true,
        naam: true,
        
        email: true,
        telefoonnummer: true,
      },
      orderBy: { naam: "asc" },
    });

    return NextResponse.json(bedrijven, { status: 200 });
  } catch (error) {
    console.error("Fout bij ophalen bedrijven:", error);
    return NextResponse.json(
      { error: "Er is een fout opgetreden bij het ophalen van bedrijven" },
      { status: 500 }
    );
  }
}
