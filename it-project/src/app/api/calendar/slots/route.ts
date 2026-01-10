import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
}

/**
 * GET /api/calendar/slots
 * Returns available time slots based on Beschikbaarheid table for a given employee and date.
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const werknemerIdParam = searchParams.get("werknemer_id");
    const dateParam = searchParams.get("date");
    const durationParam = searchParams.get("duration");

    // Validation
    if (!werknemerIdParam || !dateParam) {
      return NextResponse.json(
        { error: "werknemer_id en date zijn verplicht" },
        { status: 400 }
      );
    }

    const werknemerId = parseInt(werknemerIdParam, 10);
    if (isNaN(werknemerId)) {
      return NextResponse.json(
        { error: "Ongeldig werknemer_id" },
        { status: 400 }
      );
    }

    const requestedDate = new Date(dateParam);
    if (isNaN(requestedDate.getTime())) {
      return NextResponse.json(
        { error: "Ongeldig datum formaat (YYYY-MM-DD verwacht)" },
        { status: 400 }
      );
    }

    const duration = parseInt(durationParam || "30", 10);

    // Verify employee exists
    const werknemer = await prisma.werknemer.findUnique({
      where: { werknemer_id: werknemerId },
    });

    if (!werknemer) {
      return NextResponse.json(
        { error: "Werknemer niet gevonden" },
        { status: 404 }
      );
    }

    // Get day of week name in Dutch
    const dayNames = ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"];
    const dayIndex = requestedDate.getDay();
    const dayOfWeek = dayNames[dayIndex];

    if (!dayOfWeek) {
      return NextResponse.json({ error: "Ongeldige dag" }, { status: 400 });
    }

    // 1. Get Availability (Beschikbaarheid)
    // Table: Beschikbaarheid
    // Fields: werknemer_id, dag, start_tijd, eind_tijd
    const beschikbaarheden = await prisma.beschikbaarheid.findMany({
      where: {
        werknemer_id: werknemerId,
        dag: dayOfWeek,
      },
      select: {
        start_tijd: true,
        eind_tijd: true,
      },
    });

    // 2. Get Appointments (Afspraak)
    // Table: Afspraak
    // Fields: werknemer_id, start_datum, eind_datum, status
    const startOfDay = new Date(requestedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(requestedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingAppointments = await prisma.afspraak.findMany({
      where: {
        werknemer_id: werknemerId,
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

    // 3. Generate Slots and Filter
    const availableSlots: TimeSlot[] = [];
    const now = new Date();

    for (const beschikbaarheid of beschikbaarheden) {
      // Extract time from beschikbaarheid (using UTC date from DB)
      const bStart = new Date(beschikbaarheid.start_tijd);
      const bEnd = new Date(beschikbaarheid.eind_tijd);

      // Create start/end Date objects for the *requested date* using hours/mins from beschikbaarheid
      // Note: Assuming seed/db times are stored correctly relative to the timezone logic desired.
      // We take hours/minutes from the DB time and apply to the requested date.
      const slotWindowStart = new Date(requestedDate);
      slotWindowStart.setHours(bStart.getHours(), bStart.getMinutes(), 0, 0);

      const slotWindowEnd = new Date(requestedDate);
      slotWindowEnd.setHours(bEnd.getHours(), bEnd.getMinutes(), 0, 0);

      // Generate slots
      let currentSlotStart = new Date(slotWindowStart);

      while (currentSlotStart.getTime() < slotWindowEnd.getTime()) {
        const currentSlotEnd = new Date(currentSlotStart);
        currentSlotEnd.setMinutes(currentSlotEnd.getMinutes() + duration);

        // Check availability window constraint
        if (currentSlotEnd.getTime() > slotWindowEnd.getTime()) {
          break;
        }

        // Check if slot is in the past
        if (currentSlotStart.getTime() < now.getTime()) {
          currentSlotStart.setMinutes(currentSlotStart.getMinutes() + duration);
          continue;
        }

        // Check overlap with appointments
        const isOverlapping = existingAppointments.some((app) => {
          const appStart = new Date(app.start_datum).getTime();
          const appEnd = new Date(app.eind_datum).getTime();
          const sStart = currentSlotStart.getTime();
          const sEnd = currentSlotEnd.getTime();

          return sStart < appEnd && sEnd > appStart;
        });

        if (!isOverlapping) {
          availableSlots.push({
            start: currentSlotStart.toISOString(),
            end: currentSlotEnd.toISOString(),
            available: true,
          });
        }

        // Increment
        currentSlotStart.setMinutes(currentSlotStart.getMinutes() + duration);
      }
    }

    // Sort slots
    availableSlots.sort((a, b) =>
      new Date(a.start).getTime() - new Date(b.start).getTime()
    );

    // 4. Return JSON response
    return NextResponse.json(
      {
        werknemer_id: werknemerId,
        date: dateParam,
        slots: availableSlots,
      },
      {
        status: 200,
        headers: {
          "bypass-tunnel-reminder": "true",
        },
      }
    );

  } catch (error) {
    console.error("Fout bij ophalen beschikbare slots:", error);
    return NextResponse.json(
      { error: "Interne server fout" },
      { status: 500 }
    );
  }
}
