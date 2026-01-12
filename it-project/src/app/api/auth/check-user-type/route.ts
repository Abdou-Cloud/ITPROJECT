import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET - Controleer of een email al is geregistreerd als een bepaald type gebruiker
 * Query params:
 * - email: het email adres om te controleren
 * - type: "business" of "client"
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get("email");
    const type = searchParams.get("type");

    if (!email) {
      return NextResponse.json(
        { error: "Email is verplicht" },
        { status: 400 }
      );
    }

    if (!type || !["business", "client"].includes(type)) {
      return NextResponse.json(
        { error: "Type moet 'business' of 'client' zijn" },
        { status: 400 }
      );
    }

    // Controleer of email al geregistreerd is als bedrijf (werknemer)
    const existingWerknemer = await prisma.werknemer.findFirst({
      where: { email: email.toLowerCase() },
    });

    const existingKlant = await prisma.klant.findFirst({
      where: { email: email.toLowerCase() },
    });

    const isBusinessUser = !!existingWerknemer;
    const isClientUser = !!existingKlant;

    // Als gebruiker probeert in te loggen als bedrijf, maar al klant is
    if (type === "business" && isClientUser && !isBusinessUser) {
      return NextResponse.json({
        allowed: false,
        message: "Dit email adres is al geregistreerd als klant. Gebruik een ander email adres of log in als klant.",
        existingType: "client",
      });
    }

    // Als gebruiker probeert in te loggen als klant, maar al bedrijf is
    if (type === "client" && isBusinessUser && !isClientUser) {
      return NextResponse.json({
        allowed: false,
        message: "Dit email adres is al geregistreerd als bedrijf. Gebruik een ander email adres of log in als bedrijf.",
        existingType: "business",
      });
    }

    return NextResponse.json({
      allowed: true,
      existingType: isBusinessUser ? "business" : isClientUser ? "client" : null,
    });
  } catch (error) {
    console.error("Fout bij controleren user type:", error);
    return NextResponse.json(
      { error: "Er is een fout opgetreden" },
      { status: 500 }
    );
  }
}
