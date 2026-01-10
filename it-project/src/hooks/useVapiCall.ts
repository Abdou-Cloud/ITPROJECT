"use client";

import { useEffect, useRef, useState } from "react";
import { vapi } from "@/lib/vapi";
import { useUser } from "@clerk/nextjs";

export function useVapiCall({
  klantId,
}: {
  klantId: number | null;
}) {
  const [callActive, setCallActive] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [callEnded, setCallEnded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { isLoaded, isSignedIn } = useUser();
  const messageContainerRef = useRef<HTMLDivElement>(null);

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

  const toggleCall = async () => {
    setError(null);

    if (callActive) {
      vapi.stop();
      return;
    }

    if (!isLoaded || !isSignedIn) {
      setError("Je moet ingelogd zijn");
      return;
    }

    if (!klantId) {
      setError("Geen klant_id beschikbaar");
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

    await vapi.start(assistantId, {
      metadata: {
        klant_id: klantId,
      },
    });
  };

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
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
