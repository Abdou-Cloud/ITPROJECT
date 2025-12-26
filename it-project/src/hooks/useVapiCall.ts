"use client";

import { useEffect, useRef, useState } from "react";
import { vapi } from "@/lib/vapi";
import { useUser } from "@clerk/nextjs";

export function useVapiCall() {
  const [callActive, setCallActive] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [callEnded, setCallEnded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { isLoaded, isSignedIn } = useUser();
  const messageContainerRef = useRef<HTMLDivElement>(null);

  // Register event listeners unconditionally
  useEffect(() => {
    const handleCallStart = () => {
      console.log("[Vapi] Call started");
      setConnecting(false);
      setCallActive(true);
      setCallEnded(false);
      setError(null);
    };

    const handleCallEnd = () => {
      console.log("[Vapi] Call ended");
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
      console.error("[Vapi] Error:", err);
      setConnecting(false);
      setCallActive(false);
      setError(err?.message || "Er is een fout opgetreden met de AI assistent");
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

  const toggleCall = async () => {
    // Reset error
    setError(null);

    if (callActive) {
      vapi.stop();
      return;
    }

    // Check if user is signed in
    if (!isLoaded) {
      setError("Gebruiker wordt nog geladen...");
      return;
    }

    if (!isSignedIn) {
      setError("Je moet ingelogd zijn om een gesprek te starten");
      return;
    }

    // Check if environment variables are set
    const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
    const apiKey = process.env.NEXT_PUBLIC_VAPI_API_KEY;

    console.log("[Vapi] Starting call with assistant:", assistantId);
    console.log("[Vapi] API Key present:", !!apiKey);

    if (!assistantId) {
      setError("NEXT_PUBLIC_VAPI_ASSISTANT_ID is niet geconfigureerd in .env");
      return;
    }

    if (!apiKey) {
      setError("NEXT_PUBLIC_VAPI_API_KEY is niet geconfigureerd in .env");
      return;
    }

    try {
      setConnecting(true);
      setMessages([]);
      setCallEnded(false);
      await vapi.start(assistantId);
    } catch (err: any) {
      console.error("[Vapi] Start error:", err);
      setConnecting(false);
      setError(err?.message || "Kon geen verbinding maken met de AI assistent");
    }
  };

  // Auto-scroll messages
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

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
