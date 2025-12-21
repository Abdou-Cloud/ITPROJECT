import { prisma } from "../../../../../prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
}

/**
 * GET /api/calendar/slots
 * Returns available time slots for a given employee and date.
 * 
 * Query parameters:
 * - werknemer_id: Employee ID (required)
 * - date: Date in ISO format (YYYY-MM-DD) (required)
 * - duration: Duration in minutes (default: 30)
 * - startHour: Start hour (default: 9)
 * - endHour: End hour (default: 17)
 * 
 * Returns: Array of time slots with availability status
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const werknemerId = searchParams.get("werknemer_id");
    const date = searchParams.get("date");
    const duration = parseInt(searchParams.get("duration") || "30", 10);
    const startHour = parseInt(searchParams.get("startHour") || "9", 10);
    const endHour = parseInt(searchParams.get("endHour") || "17", 10);

    // Validation
    if (!werknemerId || !date) {
      return NextResponse.json(
        { error: "werknemer_id en date zijn verplicht" },
        { status: 400 }
      );
    }

    // Verify employee exists
    const werknemer = await prisma.werknemer.findUnique({
      where: { werknemer_id: parseInt(werknemerId, 10) },
    });

    if (!werknemer) {
      return NextResponse.json(
        { error: "Werknemer niet gevonden" },
        { status: 404 }
      );
    }

    // Parse the date and set timezone
    const selectedDate = new Date(date);
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Fetch existing appointments for this employee on this date
    const existingAppointments = await prisma.afspraak.findMany({
      where: {
        werknemer_id: parseInt(werknemerId, 10),
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

    // Generate all possible time slots for the day
    const slots: TimeSlot[] = [];
    const currentTime = new Date(startOfDay);
    currentTime.setHours(startHour, 0, 0, 0);

    const endTime = new Date(startOfDay);
    endTime.setHours(endHour, 0, 0, 0);

    while (currentTime < endTime) {
      const slotStart = new Date(currentTime);
      const slotEnd = new Date(currentTime);
      slotEnd.setMinutes(slotEnd.getMinutes() + duration);

      // Check if this slot overlaps with any existing appointment
      const isBooked = existingAppointments.some((appointment: { start_datum: Date; eind_datum: Date }) => {
        const appStart = new Date(appointment.start_datum);
        const appEnd = new Date(appointment.eind_datum);
        
        // Check for overlap: slot starts before appointment ends AND slot ends after appointment starts
        return slotStart < appEnd && slotEnd > appStart;
      });

      // Don't show slots in the past
      const isPast = slotStart < new Date();

      slots.push({
        start: slotStart.toISOString(),
        end: slotEnd.toISOString(),
        available: !isBooked && !isPast,
      });

      // Move to next slot
      currentTime.setMinutes(currentTime.getMinutes() + duration);
    }

    return NextResponse.json({
      werknemer_id: parseInt(werknemerId, 10),
      date: date,
      slots: slots,
    });
  } catch (error) {
    console.error("Fout bij ophalen beschikbare slots:", error);
    return NextResponse.json(
      { error: "Er is een fout opgetreden bij het ophalen van beschikbare slots" },
      { status: 500 }
    );
  }
}

