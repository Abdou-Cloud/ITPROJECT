"use client";

import { Header } from "@/components/Header";
import AIVoiceAssistantPage from "@/components/AIVoiceAssistantPage";

export default function AssistantPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <Header variant="app" />
      <AIVoiceAssistantPage />
    </main>
  );
}
