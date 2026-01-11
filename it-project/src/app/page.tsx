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
      
      {/* Demonstratie Sectie - Geoptimaliseerd voor ruimte en grootte */}
      <section id="demo" className="pt-10 pb-20 px-6 scroll-mt-24"> 
        <div className="max-w-7xl mx-auto"> {/* Max-width vergroot naar 7xl voor grotere video */}
          <div className="text-center mb-8"> {/* Margin-bottom verlaagd van 12 naar 8 */}
            <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
              Demonstratie:
            </h2>
            <p className="text-gray-400 mt-3">
              Bekijk hoe SchedulAI uw afspraken automatiseert.
            </p>
          </div>

          <div className="relative group">
            {/* Decoratieve gloed achter de video */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#ff7a2d] to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            
            <div className="relative bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl mx-auto w-full">
              <video 
                controls 
                className="w-full h-auto aspect-video object-contain bg-black"
                preload="metadata"
              >
                <source src="/demo.mp4" type="video/mp4" />
                Uw browser ondersteunt de video tag niet.
              </video>
            </div>
          </div>
        </div>
      </section>

      <FeaturesSection />
      <HoeHetWerktSection />
      <VoorWieSection />
      <ExtendedFeaturesSection />
      <PricingSection />
    </main>
   );
}