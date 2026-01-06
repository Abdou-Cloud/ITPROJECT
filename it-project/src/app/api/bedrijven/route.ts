import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// GET - Haal alle bedrijven op (voor klanten om te kunnen selecteren)
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
    }

    // Haal query parameters op voor filtering
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");

    // Bouw de where clause voor filtering
    const whereClause: {
      naam?: { contains: string; mode: "insensitive" };
    } = {};

    if (search) {
      whereClause.naam = {
        contains: search,
        mode: "insensitive",
      };
    }

    // Haal alle bedrijven op
    const bedrijven = await prisma.bedrijf.findMany({
      where: whereClause,
      select: {
        bedrijf_id: true,
        naam: true,
        email: true,
        telefoonnummer: true,
      },
      orderBy: {
        naam: "asc",
      },
    });

    return NextResponse.json(bedrijven);
  } catch (error) {
    console.error("Fout bij ophalen bedrijven:", error);
    return NextResponse.json(
      { error: "Er is een fout opgetreden" },
      { status: 500 }
    );
  }
}

// GET - Haal alle unieke bedrijfstypes op
export async function OPTIONS(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
    }

    const types = await prisma.bedrijf.findMany({
      select: {
        type: true,
      },
      distinct: ["type"],
      orderBy: {
        type: "asc",
      },
    });

    return NextResponse.json(types.map((t) => t.type));
  } catch (error) {
    console.error("Fout bij ophalen bedrijfstypes:", error);
    return NextResponse.json(
      { error: "Er is een fout opgetreden" },
      { status: 500 }
    );
  }
}
