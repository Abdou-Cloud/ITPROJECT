import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
}

/**
 * GET /api/calendar/slots
 * Returns available time slots based on Beschikbaarheid table for a given employee and date.
 * 
 * Query parameters:
 * - werknemer_id: Employee ID (required)
 * - date: Date in ISO format (YYYY-MM-DD) (required)
 * - duration: Duration in minutes (optional, default: 30)
 * 
 * Returns: JSON with werknemer_id, date, and available slots
 * Only returns slots within beschikbaarheden and not overlapping with existing appointments
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const werknemerId = searchParams.get("werknemer_id");
    const date = searchParams.get("date");
    const duration = parseInt(searchParams.get("duration") || "30", 10);

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

    // Parse the date
    const selectedDate = new Date(date);
    if (isNaN(selectedDate.getTime())) {
      return NextResponse.json(
        { error: "Ongeldig datum format" },
        { status: 400 }
      );
    }

    // Get day of week name in Dutch
    const dayNames = ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"];
    const dayOfWeek = dayNames[selectedDate.getDay()];

    // Step 1: Get beschikbaarheden for this werknemer on this day of week
    const beschikbaarheden = await prisma.beschikbaarheid.findMany({
      where: {
        werknemer_id: werknemerIdNum,
        dag: dayOfWeek,
      },
      select: {
        start_tijd: true,
        eind_tijd: true,
      },
    });

    if (beschikbaarheden.length === 0) {
      return NextResponse.json({
        werknemer_id: werknemerIdNum,
        date: date,
        slots: [],
      });
    }

    // Step 2: Get existing appointments for this day
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

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

    // Step 3: Generate time slots from beschikbaarheden
    const now = new Date();
    const availableSlots: TimeSlot[] = [];

    for (const beschikbaarheid of beschikbaarheden) {
      // Extract time from beschikbaarheid (start_tijd and eind_tijd contain time info)
      // Gebruik UTC tijd om consistent te zijn met de seed data
      const beschikbaarheidStart = new Date(beschikbaarheid.start_tijd);
      const beschikbaarheidEnd = new Date(beschikbaarheid.eind_tijd);

      // Get hours and minutes from beschikbaarheid
      // Gebruik lokale tijd omdat de seed lokale tijd gebruikt (zonder Z suffix)
      const startHour = beschikbaarheidStart.getHours();
      const startMinute = beschikbaarheidStart.getMinutes();
      const endHour = beschikbaarheidEnd.getHours();
      const endMinute = beschikbaarheidEnd.getMinutes();

      // Create slots for the selected date (gebruik lokale tijd)
      const slotDate = new Date(selectedDate);
      slotDate.setHours(startHour, startMinute, 0, 0);
      const endDate = new Date(selectedDate);
      endDate.setHours(endHour, endMinute, 0, 0);

      // Generate slots in duration intervals
      let currentSlotStart = new Date(slotDate);
      
      while (currentSlotStart < endDate) {
        const currentSlotEnd = new Date(currentSlotStart);
        currentSlotEnd.setMinutes(currentSlotEnd.getMinutes() + duration);

        // Check if slot fits within beschikbaarheid window
        if (currentSlotEnd > endDate) {
          break;
        }

        // Skip slots in the past
        if (currentSlotStart < now) {
          currentSlotStart.setMinutes(currentSlotStart.getMinutes() + duration);
          continue;
        }

        // Check if slot overlaps with any existing appointment
        const hasOverlap = existingAppointments.some((appointment) => {
          const appStart = new Date(appointment.start_datum);
          const appEnd = new Date(appointment.eind_datum);
          
          // Check for overlap
          return currentSlotStart < appEnd && currentSlotEnd > appStart;
        });

        // Only include slots without overlaps
        if (!hasOverlap) {
          availableSlots.push({
            start: currentSlotStart.toISOString(),
            end: currentSlotEnd.toISOString(),
            available: true,
          });
        }

        // Move to next slot
        currentSlotStart.setMinutes(currentSlotStart.getMinutes() + duration);
      }
    }

    // Sort slots by start time
    availableSlots.sort((a, b) => 
      new Date(a.start).getTime() - new Date(b.start).getTime()
    );

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

