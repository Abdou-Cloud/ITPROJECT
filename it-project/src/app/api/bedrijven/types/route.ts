import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// GET - Haal alle beschikbare bedrijfstypes op
// Let op: type veld is nog niet in database, dus we geven standaard types terug
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
    }

    // Standaard types (type veld is nog niet in Prisma schema)
    const defaultTypes = ["kapper", "tandarts", "huisarts", "fysiotherapeut", "schoonheidssalon", "overig"];

    return NextResponse.json(defaultTypes);
  } catch (error) {
    console.error("Fout bij ophalen bedrijfstypes:", error);
    return NextResponse.json(
      { error: "Er is een fout opgetreden" },
      { status: 500 }
    );
  }
}
