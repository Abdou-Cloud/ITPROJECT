"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface ExtendedFeatureCardProps {
  iconSrc: string;
  iconAlt: string;
  fallbackEmoji: string;
  title: string;
  description: string;
  iconBgColor: string;
}

function ExtendedFeatureCard({ iconSrc, iconAlt, fallbackEmoji, title, description, iconBgColor }: ExtendedFeatureCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <Card className="h-full bg-slate-800/50 border-slate-700">
      <CardHeader>
        <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${iconBgColor} mb-4`}>
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
            <span className="text-3xl">{fallbackEmoji}</span>
          )}
        </div>
        <CardTitle className="text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base text-slate-300">{description}</CardDescription>
      </CardContent>
    </Card>
  );
}

export function ExtendedFeaturesSection() {
  const features = [
    {
      iconSrc: "/images/icons/calendar-feature.png",
      iconAlt: "Double Booking Option",
      fallbackEmoji: "📅",
      title: "Dubbele Boekingsoptie",
      description: "Klanten kunnen boeken via de AI-bot of de digitale agenda - altijd de meest gemakkelijke weg.",
      iconBgColor: "bg-orange-500",
    },
    {
      iconSrc: "/images/icons/robot.png",
      iconAlt: "24/7 AI Assistant",
      fallbackEmoji: "🤖",
      title: "24/7 AI Assistent",
      description: "De AI-bot handelt routinematige vragen af en stelt direct een gepast tijdslot voor.",
      iconBgColor: "bg-blue-500",
    },
    {
      iconSrc: "/images/icons/shield.png",
      iconAlt: "Conflict Prevention",
      fallbackEmoji: "🛡️",
      title: "Conflictpreventie",
      description: "Real-time synchronisatie met je interne agenda maakt dubbele boekingen onmogelijk.",
      iconBgColor: "bg-purple-500",
    },
    {
      iconSrc: "/images/icons/bell-feature.png",
      iconAlt: "Full Automation",
      fallbackEmoji: "🔔",
      title: "Volledige Automatisering",
      description: "Directe bevestiging en herinneringen via SMS of e-mail voor je klanten.",
      iconBgColor: "bg-green-500",
    },
    {
      iconSrc: "/images/icons/chart.png",
      iconAlt: "Dashboard & Insight",
      fallbackEmoji: "📊",
      title: "Dashboard & Inzicht",
      description: "Centraal overzicht van alle boekingen met reden van afspraak voor optimale voorbereiding.",
      iconBgColor: "bg-pink-500",
    },
    {
      iconSrc: "/images/icons/clock.png",
      iconAlt: "No Administrative Burden",
      fallbackEmoji: "🕒",
      title: "Geen Administratieve Last",
      description: "Elimineer planningsfouten en bespaar uren per week aan telefoonbeheer.",
      iconBgColor: "bg-teal-500",
    },
  ];

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <ExtendedFeatureCard key={index} {...feature} />
        ))}
      </div>
    </section>
  );
}

