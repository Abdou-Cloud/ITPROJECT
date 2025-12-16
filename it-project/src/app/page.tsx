// app/page.tsx

"use client";

import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { FeaturesSection } from "@/components/FeaturesSection";
import { HoeHetWerktSection } from "@/components/HoeHetWerktSection";
import { VoorWieSection } from "@/components/VoorWieSection";
import { ExtendedFeaturesSection } from "@/components/ExtendedFeaturesSection";
import { PricingSection } from "@/components/PricingSection";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <Header />
      <Hero />
      <FeaturesSection />
      <HoeHetWerktSection />
      <VoorWieSection />
      <ExtendedFeaturesSection />
      <PricingSection />
    </main>
  );
}
