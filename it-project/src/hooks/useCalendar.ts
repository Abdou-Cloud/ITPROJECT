"use client";

import { useState, useEffect, useCallback } from "react";

export interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
}

export interface CalendarSlotsResponse {
  werknemer_id: number;
  date: string;
  slots: TimeSlot[];
}

interface UseCalendarOptions {
  werknemer_id: number | null;
  date: string | null;
  duration?: number;
  startHour?: number;
  endHour?: number;
  autoFetch?: boolean;
}

interface UseCalendarReturn {
  slots: TimeSlot[];
  loading: boolean;
  error: string | null;
  fetchSlots: () => Promise<void>;
  refetch: () => Promise<void>;
}

/**
 * useCalendar Hook
 *
 * Fetches available time slots from the database via /api/calendar/slots.
 *
 * Usage:
 * ```tsx
 * const { slots, loading, error, fetchSlots, refetch } = useCalendar({
 *   werknemer_id: 1,
 *   date: "2024-01-15",
 *   duration: 30,
 *   autoFetch: true
 * });
 * ```
 *
 * The hook automatically fetches slots when werknemer_id and date change (if autoFetch is true).
 * You can also manually trigger a fetch using fetchSlots() or refetch().
 */
export function useCalendar(options: UseCalendarOptions): UseCalendarReturn {
  const {
    werknemer_id,
    date,
    duration = 30,
    startHour = 9,
    endHour = 17,
    autoFetch = true,
  } = options;

  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSlots = useCallback(async () => {
    if (!werknemer_id || !date) {
      setSlots([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        werknemer_id: werknemer_id.toString(),
        date: date,
        duration: duration.toString(),
        startHour: startHour.toString(),
        endHour: endHour.toString(),
      });

      const response = await fetch(`/api/calendar/slots?${params.toString()}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Onbekende fout" }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data: CalendarSlotsResponse = await response.json();
      setSlots(data.slots);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Er is een fout opgetreden";
      setError(errorMessage);
      setSlots([]);
      console.error("Error fetching calendar slots:", err);
    } finally {
      setLoading(false);
    }
  }, [werknemer_id, date, duration, startHour, endHour]);

  // Auto-fetch when dependencies change
  useEffect(() => {
    if (autoFetch) {
      fetchSlots();
    }
  }, [autoFetch, fetchSlots]);

  const refetch = useCallback(() => {
    return fetchSlots();
  }, [fetchSlots]);

  return {
    slots,
    loading,
    error,
    fetchSlots,
    refetch,
  };
}