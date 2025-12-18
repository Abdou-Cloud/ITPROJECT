import { prisma } from "../../../../../prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// GET - Haal een specifieke afspraak op
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
    }

    const { id } = await params;
    const afspraakId = Number(id);

    const afspraak = await prisma.afspraak.findUnique({
      where: { afspraak_id: afspraakId },
      include: {
        klant: {
          select: {
            naam: true,
            email: true,
            telefoonnummer: true,
          },
        },
        werknemer: {
          select: {
            naam: true,
            email: true,
          },
        },
      },
    });

    if (!afspraak) {
      return NextResponse.json({ error: "Afspraak niet gevonden" }, { status: 404 });
    }

    return NextResponse.json(afspraak);
  } catch (error) {
    console.error("Fout bij ophalen afspraak:", error);
    return NextResponse.json(
      { error: "Er is een fout opgetreden" },
      { status: 500 }
    );
  }
}

// PUT - Update een afspraak
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
    }

    const { id } = await params;
    const afspraakId = Number(id);
    const body = await request.json();
    const { start_datum, eind_datum, status } = body;

    // Check of de afspraak bestaat
    const bestaandeAfspraak = await prisma.afspraak.findUnique({
      where: { afspraak_id: afspraakId },
    });

    if (!bestaandeAfspraak) {
      return NextResponse.json({ error: "Afspraak niet gevonden" }, { status: 404 });
    }

    // Update de afspraak
    const afspraak = await prisma.afspraak.update({
      where: { afspraak_id: afspraakId },
      data: {
        ...(start_datum && { start_datum: new Date(start_datum) }),
        ...(eind_datum && { eind_datum: new Date(eind_datum) }),
        ...(status && { status }),
      },
      include: {
        klant: {
          select: {
            naam: true,
            email: true,
            telefoonnummer: true,
          },
        },
      },
    });

    return NextResponse.json(afspraak);
  } catch (error) {
    console.error("Fout bij updaten afspraak:", error);
    return NextResponse.json(
      { error: "Er is een fout opgetreden" },
      { status: 500 }
    );
  }
}

// DELETE - Verwijder een afspraak
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
    }

    const { id } = await params;
    const afspraakId = Number(id);

    // Check of de afspraak bestaat
    const bestaandeAfspraak = await prisma.afspraak.findUnique({
      where: { afspraak_id: afspraakId },
    });

    if (!bestaandeAfspraak) {
      return NextResponse.json({ error: "Afspraak niet gevonden" }, { status: 404 });
    }

    // Verwijder de afspraak
    await prisma.afspraak.delete({
      where: { afspraak_id: afspraakId },
    });

    return NextResponse.json({ message: "Afspraak verwijderd" });
  } catch (error) {
    console.error("Fout bij verwijderen afspraak:", error);
    return NextResponse.json(
      { error: "Er is een fout opgetreden" },
      { status: 500 }
    );
  }
}
