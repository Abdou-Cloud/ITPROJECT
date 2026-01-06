import { prisma } from "@/lib/prisma";
// import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
}

/**
 * GET /api/calendar/slots
 * Returns available time slots from Beschikbaarheid table for a given employee and date.
 * 
 * Query parameters:
 * - werknemer_id: Employee ID (required)
 * - date: Date in ISO format (YYYY-MM-DD) (required)
 * 
 * Returns: JSON with werknemer_id, date, and up to 5 available slots
 * Only returns slots where isBeschikbaar = true and not overlapping with Afspraak
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: Uncomment when ready to add Clerk authentication
    // const { userId } = await auth();
    // if (!userId) {
    //   return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
    // }

    const searchParams = request.nextUrl.searchParams;
    const werknemerId = searchParams.get("werknemer_id");
    const date = searchParams.get("date");

    // Validation
    if (!werknemerId || !date) {
      return NextResponse.json(
        { error: "werknemer_id en date zijn verplicht" },
        { status: 400 }
      );
    }

    const werknemerIdNum = parseInt(werknemerId, 10);
    if (isNaN(werknemerIdNum)) {
      return NextResponse.json(
        { error: "Ongeldig werknemer_id" },
        { status: 400 }
      );
    }

    // Verify employee exists
    const werknemer = await prisma.werknemer.findUnique({
      where: { werknemer_id: werknemerIdNum },
    });

    if (!werknemer) {
      return NextResponse.json(
        { error: "Werknemer niet gevonden" },
        { status: 404 }
      );
    }

    // Parse the date and set boundaries for the day
    const selectedDate = new Date(date);
    if (isNaN(selectedDate.getTime())) {
      return NextResponse.json(
        { error: "Ongeldig datum format" },
        { status: 400 }
      );
    }

    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Step 1: Query Beschikbaarheid table for available slots
    const beschikbaarheden = await prisma.beschikbaarheid.findMany({
      where: {
        werknemerId: werknemerIdNum,
        start_datum: {
          gte: startOfDay,
          lte: endOfDay,
        },
        isBeschikbaar: true,
      },
      select: {
        start_datum: true,
        eind_datum: true,
      },
      orderBy: {
        start_datum: "asc",
      },
    });

    // Step 2: Query Afspraak table to get booked appointments
    const existingAppointments = await prisma.afspraak.findMany({
      where: {
        werknemer_id: werknemerIdNum,
        start_datum: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: {
          not: "geannuleerd",
        },
      },
      select: {
        start_datum: true,
        eind_datum: true,
      },
    });

    // Step 3: Filter out slots that overlap with existing appointments
    const now = new Date();
    const availableSlots: TimeSlot[] = [];

    for (const beschikbaarheid of beschikbaarheden) {
      const slotStart = new Date(beschikbaarheid.start_datum);
      const slotEnd = new Date(beschikbaarheid.eind_datum);

      // Skip slots in the past
      if (slotStart < now) {
        continue;
      }

      // Check if slot overlaps with any existing appointment
      const hasOverlap = existingAppointments.some((appointment: { start_datum: Date; eind_datum: Date }) => {
        const appStart = new Date(appointment.start_datum);
        const appEnd = new Date(appointment.eind_datum);
        
        // Check for overlap: slot starts before appointment ends AND slot ends after appointment starts
        return slotStart < appEnd && slotEnd > appStart;
      });

      // Only include slots without overlaps
      if (!hasOverlap) {
        availableSlots.push({
          start: slotStart.toISOString(),
          end: slotEnd.toISOString(),
          available: true,
        });

        // Limit to 5 slots per request
        if (availableSlots.length >= 5) {
          break;
        }
      }
    }

    // Step 4: Return JSON response
    return NextResponse.json({
      werknemer_id: werknemerIdNum,
      date: date,
      slots: availableSlots,
    });
  } catch (error) {
    console.error("Fout bij ophalen beschikbare slots:", error);
    return NextResponse.json(
      { error: "Er is een fout opgetreden bij het ophalen van beschikbare slots" },
      { status: 500 }
    );
  }
}

