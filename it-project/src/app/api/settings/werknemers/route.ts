import { prisma } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// GET - Haal alle werknemers op van het bedrijf
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
    }

    const user = await clerkClient().then(client => client.users.getUser(userId));
    const userEmail = user?.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress;
    
    if (!userEmail) {
      return NextResponse.json({ error: "Email niet gevonden" }, { status: 404 });
    }

    const bedrijf = await prisma.bedrijf.findFirst({
      where: { email: userEmail },
    });

    if (!bedrijf) {
      return NextResponse.json({ error: "Bedrijf niet gevonden" }, { status: 404 });
    }

    const werknemers = await prisma.werknemer.findMany({
      where: { bedrijf_id: bedrijf.bedrijf_id },
      select: {
        werknemer_id: true,
        voornaam: true,
        naam: true,
        email: true,
      },
      orderBy: { naam: "asc" },
    });

    return NextResponse.json(werknemers);
  } catch (error) {
    console.error("Fout bij ophalen werknemers:", error);
    return NextResponse.json({ error: "Er is een fout opgetreden" }, { status: 500 });
  }
}



