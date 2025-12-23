"use client";

import { useState, useCallback, useEffect } from "react";
import { useVapiCall } from "./useVapiCall";
import { useUser } from "@clerk/nextjs";

export interface BookAppointmentParams {
  werknemer_id: number;
  start_datum: string;
  eind_datum: string;
  klant_id?: number;
  status?: string;
}

export interface BookAppointmentResponse {
  afspraak_id: number;
  werknemer_id: number;
  klant_id: number;
  start_datum: string;
  eind_datum: string;
  status: string;
  werknemer: {
    werknemer_id: number;
    naam: string;
    email: string;
    telefoonnummer: string;
  };
  klant: {
    klant_id: number;
    naam: string;
    email: string;
    telefoonnummer: string;
  };
}

interface UseBookingAIReturn {
  bookAppointment: (params: BookAppointmentParams) => Promise<BookAppointmentResponse | null>;
  booking: boolean;
  error: string | null;
  lastBooking: BookAppointmentResponse | null;
  // VAPI integration helpers
  extractBookingFromMessage: (message: string) => BookAppointmentParams | null;
  handleVapiMessage: (message: string) => Promise<void>;
}

/**
 * useBookingAI Hook
 * 
 * Integrates with useVapiCall to book appointments via AI voice input.
 * The hook listens to VAPI messages and can extract booking information from natural language.
 * 
 * Usage:
 * ```tsx
 * const { callActive, messages } = useVapiCall();
 * const { bookAppointment, booking, error, handleVapiMessage } = useBookingAI();
 * 
 * // Listen to VAPI messages and auto-book
 * useEffect(() => {
 *   messages.forEach(msg => {
 *     if (msg.role === 'assistant' && msg.content.includes('book')) {
 *       handleVapiMessage(msg.content);
 *     }
 *   });
 * }, [messages, handleVapiMessage]);
 * ```
 * 
 * The hook can extract booking details from natural language like:
 * - "Book an appointment with John on January 15th at 2 PM"
 * - "Schedule a meeting tomorrow at 10:00"
 */
export function useBookingAI(): UseBookingAIReturn {
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastBooking, setLastBooking] = useState<BookAppointmentResponse | null>(null);
  const { user } = useUser();

  /**
   * Books an appointment by calling the /api/calendar/book-event endpoint
   */
  const bookAppointment = useCallback(async (
    params: BookAppointmentParams
  ): Promise<BookAppointmentResponse | null> => {
    setBooking(true);
    setError(null);

    try {
      const response = await fetch("/api/calendar/book-event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Onbekende fout" }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data: BookAppointmentResponse = await response.json();
      setLastBooking(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Er is een fout opgetreden bij het boeken";
      setError(errorMessage);
      console.error("Error booking appointment:", err);
      return null;
    } finally {
      setBooking(false);
    }
  }, []);

  /**
   * Extracts booking parameters from natural language message
   * This is a basic implementation - you may want to enhance this with NLP/AI parsing
   */
  const extractBookingFromMessage = useCallback((message: string): BookAppointmentParams | null => {
    // This is a simplified parser - in production, you'd use an AI service
    // or more sophisticated NLP to extract dates, times, and employee IDs
    
    // Example patterns to look for:
    // - "book appointment with [employee] on [date] at [time]"
    // - "schedule meeting [date] [time]"
    
    // For now, return null - you'll need to implement proper parsing
    // or use your VAPI assistant to structure the data before calling this
    
    console.warn("extractBookingFromMessage: Basic implementation - enhance with proper NLP");
    return null;
  }, []);

  /**
   * Handles a message from VAPI and attempts to book an appointment
   * This should be called when the AI assistant confirms a booking
   */
  const handleVapiMessage = useCallback(async (message: string): Promise<void> => {
    // Try to extract booking info from the message
    const bookingParams = extractBookingFromMessage(message);
    
    if (!bookingParams) {
      // If extraction fails, you might want to prompt the user for more info
      setError("Kon geen boekingsinformatie uit het bericht halen");
      return;
    }

    // Book the appointment
    await bookAppointment(bookingParams);
  }, [extractBookingFromMessage, bookAppointment]);

  return {
    bookAppointment,
    booking,
    error,
    lastBooking,
    extractBookingFromMessage,
    handleVapiMessage,
  };
}

/**
 * Enhanced version that integrates directly with useVapiCall
 * Use this if you want automatic booking when VAPI detects booking intent
 */
export function useBookingAIWithVapi() {
  const vapiCall = useVapiCall();
  const bookingAI = useBookingAI();
  const [autoBookingEnabled, setAutoBookingEnabled] = useState(false);

  // Listen to VAPI messages and auto-book when booking intent is detected
  useEffect(() => {
    if (!autoBookingEnabled) return;

    const lastMessage = vapiCall.messages[vapiCall.messages.length - 1];
    if (!lastMessage || lastMessage.role !== "assistant") return;

    // Check if message contains booking confirmation keywords
    const bookingKeywords = ["book", "schedule", "appointment", "afspraak", "boeken", "inplannen"];
    const hasBookingIntent = bookingKeywords.some(keyword => 
      lastMessage.content.toLowerCase().includes(keyword)
    );

    if (hasBookingIntent) {
      bookingAI.handleVapiMessage(lastMessage.content);
    }
  }, [vapiCall.messages, autoBookingEnabled, bookingAI]);

  return {
    ...vapiCall,
    ...bookingAI,
    autoBookingEnabled,
    setAutoBookingEnabled,
  };
}

