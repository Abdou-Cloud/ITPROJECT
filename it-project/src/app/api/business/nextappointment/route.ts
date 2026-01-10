import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Haal de eerstvolgende afspraak op (op basis van start_datum)
    const nextAppointment = await prisma.afspraak.findFirst({
      orderBy: { start_datum: "asc" },
      include: {
        klant: true,
        werknemer: true,
      },
      where: {
        start_datum: { gte: new Date() },
      },
    });
    return NextResponse.json({ nextAppointment });
  } catch (error) {
    return NextResponse.json({ error: "Kon afspraak niet ophalen" }, { status: 500 });
  }
}
