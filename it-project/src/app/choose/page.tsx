"use client";

import { Header } from "@/components/Header";
import { ChoiceSection } from "@/components/ChoiceSection";

export default function ChoosePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <Header />
      <ChoiceSection />
    </main>
  );
}

