"use client";

import { useEffect, useRef, useState } from "react";
import { vapi } from "@/lib/vapi";
import { useUserToken } from "@/hooks/useUserToken";

interface Customer {
  klant_id: number;
  voornaam: string;
  naam: string;
  email: string;
  telefoonnummer?: string;
  bedrijf_id?: number;
  // Admin fields
  admin_id?: number;
  // Generic
  role?: string;
  [key: string]: any;
}

interface UseVapiCallProps {
  customer: Customer | null;
}

export function useVapiCall({ customer }: UseVapiCallProps) {
  const [callActive, setCallActive] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [callEnded, setCallEnded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user, isSignedIn, getUserToken } = useUserToken();
  const messageContainerRef = useRef<HTMLDivElement>(null);

  // ===================== Event handlers =====================
  useEffect(() => {
    const handleCallStart = () => {
      setConnecting(false);
      setCallActive(true);
      setCallEnded(false);
      setError(null);
    };

    const handleCallEnd = () => {
      setCallActive(false);
      setConnecting(false);
      setIsSpeaking(false);
      setCallEnded(true);
    };

    const handleSpeechStart = () => setIsSpeaking(true);
    const handleSpeechEnd = () => setIsSpeaking(false);

    const handleMessage = (message: any) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        setMessages((prev) => [
          ...prev,
          { content: message.transcript, role: message.role },
        ]);
      }
    };

    const handleError = (err: any) => {
      setConnecting(false);
      setCallActive(false);
      setError(err?.message || "Vapi fout");
    };

    vapi
      .on("call-start", handleCallStart)
      .on("call-end", handleCallEnd)
      .on("speech-start", handleSpeechStart)
      .on("speech-end", handleSpeechEnd)
      .on("message", handleMessage)
      .on("error", handleError);

    return () => {
      vapi
        .off("call-start", handleCallStart)
        .off("call-end", handleCallEnd)
        .off("speech-start", handleSpeechStart)
        .off("speech-end", handleSpeechEnd)
        .off("message", handleMessage)
        .off("error", handleError);
    };
  }, []);

  // ===================== Scroll messages automatisch =====================
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // ===================== Start/stop call =====================
  const toggleCall = async () => {
    setError(null);

    if (callActive) {
      vapi.stop();
      return;
    }

    if (!isSignedIn || !user) {
      setError("Je moet ingelogd zijn");
      return;
    }

    if (!customer) {
      setError("Geen klantgegevens beschikbaar");
      return;
    }

    const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
    if (!assistantId) {
      setError("Assistant ID ontbreekt");
      return;
    }

    setConnecting(true);
    setMessages([]);
    setCallEnded(false);

    try {
      // Haal JWT token van Clerk
      const token = await getUserToken();

      // Start de VAPI call met JWT in metadata
      await vapi.start(assistantId, {
        metadata: {
          klant_id: customer.klant_id, // Fallback for admin
          voornaam: customer.voornaam,
          naam: customer.naam,
          email: customer.email,
          telefoonnummer: customer.telefoonnummer,
          ...(token ? { jwt: token } : {}),
        },
      });
    } catch (err: any) {
      setConnecting(false);
      setCallActive(false);
      setError(err?.message || "Kon call niet starten");
    }
  };

  return {
    callActive,
    connecting,
    isSpeaking,
    callEnded,
    messages,
    error,
    toggleCall,
    messageContainerRef,
  };
}
