"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

interface StepProps {
  number: string;
  iconSrc: string;
  iconAlt: string;
  fallbackEmoji: string;
  title: string;
  description: string;
}

function Step({ number, iconSrc, iconAlt, fallbackEmoji, title, description }: StepProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex items-center justify-center mb-4">
        <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-xl z-10">
          {number}
        </div>
        <div className="absolute left-full w-full h-0.5 bg-orange-500 hidden md:block" style={{ width: 'calc(100% - 4rem)' }} />
      </div>
      <Card className="bg-slate-800/50 border-slate-700 w-full max-w-xs">
        <CardContent className="pt-6 pb-6">
          <div className="w-16 h-16 rounded-xl bg-slate-700/50 flex items-center justify-center mx-auto mb-4">
            {!imageError ? (
              <Image
                src={iconSrc}
                alt={iconAlt}
                width={40}
                height={40}
                className="w-full h-full object-contain"
                onError={() => setImageError(true)}
              />
            ) : (
              <span className="text-3xl text-orange-500">{fallbackEmoji}</span>
            )}
          </div>
          <h3 className="text-xl font-semibold text-white mb-2 text-center">{title}</h3>
          <p className="text-slate-400 text-center text-sm">{description}</p>
        </CardContent>
      </Card>
    </div>
  );
}

export function HoeHetWerktSection() {
  const steps = [
    {
      number: "01",
      iconSrc: "/images/icons/message.png",
      iconAlt: "Contact Icon",
      fallbackEmoji: "💬",
      title: "Klant neemt contact op",
      description: "Via de AI-bot of digitale agenda - buiten kantooruren of tijdens drukke momenten",
    },
    {
      number: "02",
      iconSrc: "/images/icons/calendar-step.png",
      iconAlt: "Calendar Icon",
      fallbackEmoji: "📅",
      title: "AI stelt tijdslot voor",
      description: "De bot analyseert de vraag en controleert real-time beschikbaarheid in je agenda",
    },
    {
      number: "03",
      iconSrc: "/images/icons/checkmark.png",
      iconAlt: "Checkmark Icon",
      fallbackEmoji: "✓",
      title: "Directe bevestiging",
      description: "Afspraak wordt automatisch vastgelegd en gesynchroniseerd met je interne systeem",
    },
    {
      number: "04",
      iconSrc: "/images/icons/bell.png",
      iconAlt: "Bell Icon",
      fallbackEmoji: "🔔",
      title: "Automatische herinneringen",
      description: "Klant ontvangt bevestiging en herinneringen via hun voorkeurskanaal (SMS/email)",
    },
  ];

  return (
    <section id="hoe-het-werkt" className="container mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Hoe het werkt</h2>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          Van eerste contact tot bevestigde afspraak in vier eenvoudige stappen
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
        {steps.map((step, index) => (
          <Step key={index} {...step} />
        ))}
      </div>

      <div className="text-center mt-16">
        <h3 className="text-2xl font-semibold text-white mb-4">Gebouwd rondom jouw behoeften</h3>
        <p className="text-slate-300 max-w-2xl mx-auto">
          SchedulAI is ontworpen met de verwachtingen van zowel klanten als professionals in gedachten
        </p>
      </div>
    </section>
  );
}

