import { prisma } from "@/lib/prisma";
// import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/calendar/book-event
 * Creates a new appointment in the database.
 * 
 * Request body:
 * - werknemer_id: Employee ID (required)
 * - klant_id: Client ID (optional - will use authenticated user's client ID if not provided)
 * - start_datum: Start date/time in ISO format (required)
 * - eind_datum: End date/time in ISO format (required)
 * - status: Appointment status (default: "gepland")
 * 
 * Returns: Created appointment with related data
 */
export async function POST(request: NextRequest) {
  try {
    // TODO: Uncomment when ready to add Clerk authentication
    // const { userId } = await auth();
    // if (!userId) {
    //   return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
    // }

    const body = await request.json();
    const { werknemer_id, klant_id, start_datum, eind_datum, status } = body;

    // Validation
    if (!werknemer_id || !start_datum || !eind_datum) {
      return NextResponse.json(
        { error: "werknemer_id, start_datum en eind_datum zijn verplicht" },
        { status: 400 }
      );
    }

    // When auth is disabled, klant_id is required
    if (!klant_id) {
      return NextResponse.json(
        { error: "klant_id is verplicht" },
        { status: 400 }
      );
    }

    // Parse dates
    const startDate = new Date(start_datum);
    const endDate = new Date(eind_datum);

    // Validate dates
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json(
        { error: "Ongeldige datum format" },
        { status: 400 }
      );
    }

    if (startDate >= endDate) {
      return NextResponse.json(
        { error: "Startdatum moet voor einddatum zijn" },
        { status: 400 }
      );
    }

    // Verify employee exists
    const werknemer = await prisma.werknemer.findUnique({
      where: { werknemer_id: parseInt(werknemer_id, 10) },
    });

    if (!werknemer) {
      return NextResponse.json(
        { error: "Werknemer niet gevonden" },
        { status: 404 }
      );
    }

    // Determine client ID
    let finalKlantId: number;
    
    if (klant_id) {
      // Use provided client ID
      const klant = await prisma.klant.findUnique({
        where: { klant_id: parseInt(klant_id, 10) },
      });

      if (!klant) {
        return NextResponse.json(
          { error: "Klant niet gevonden" },
          { status: 404 }
        );
      }
      finalKlantId = klant.klant_id;
    } else {
      // TODO: Uncomment when ready to add Clerk authentication
      // Try to find client by clerkUserId
      // const klant = await prisma.klant.findUnique({
      //   where: { clerkUserId: userId },
      // });
      // 
      // if (!klant) {
      //   return NextResponse.json(
      //     { error: "Klant niet gevonden. Log in als klant of geef klant_id op." },
      //     { status: 404 }
      //   );
      // }
      // finalKlantId = klant.klant_id;
      
      // This should not be reached when auth is disabled (klant_id is required above)
      return NextResponse.json(
        { error: "klant_id is verplicht" },
        { status: 400 }
      );
    }

    // Check for overlapping appointments
    const overlappingAppointment = await prisma.afspraak.findFirst({
      where: {
        werknemer_id: parseInt(werknemer_id, 10),
        start_datum: {
          lt: endDate,
        },
        eind_datum: {
          gt: startDate,
        },
        status: {
          not: "geannuleerd",
        },
      },
    });

    if (overlappingAppointment) {
      return NextResponse.json(
        { error: "Er is al een afspraak op dit tijdstip" },
        { status: 409 }
      );
    }

    // Create the appointment
    const afspraak = await prisma.afspraak.create({
      data: {
        werknemer_id: parseInt(werknemer_id, 10),
        klant_id: finalKlantId,
        start_datum: startDate,
        eind_datum: endDate,
        status: status || "gepland",
      },
      include: {
        werknemer: {
          select: {
            werknemer_id: true,
            naam: true,
            email: true,
            telefoonnummer: true,
          },
        },
        klant: {
          select: {
            klant_id: true,
            naam: true,
            email: true,
            telefoonnummer: true,
          },
        },
      },
    });

    return NextResponse.json(afspraak, { status: 201 });
  } catch (error) {
    console.error("Fout bij boeken afspraak:", error);
    return NextResponse.json(
      { error: "Er is een fout opgetreden bij het boeken van de afspraak" },
      { status: 500 }
    );
  }
}

