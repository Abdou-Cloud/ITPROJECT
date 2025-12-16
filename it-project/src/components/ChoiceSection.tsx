"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface PortalCardProps {
  iconSrc: string;
  iconAlt: string;
  fallbackEmoji: string;
  badges: string[];
  title: string;
  description: string;
  features: string[];
  primaryButtonText: string;
  secondaryButtonText: string;
  primaryButtonHref: string;
  secondaryButtonHref: string;
  iconBgColor: string;
  buttonColor: string;
  recommended?: boolean;
}

function PortalCard({
  iconSrc,
  iconAlt,
  fallbackEmoji,
  badges,
  title,
  description,
  features,
  primaryButtonText,
  secondaryButtonText,
  primaryButtonHref,
  secondaryButtonHref,
  iconBgColor,
  buttonColor,
  recommended = false,
}: PortalCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <Card className={`h-full bg-slate-800/50 border-slate-700 ${recommended ? 'border-orange-500/50' : ''}`}>
      <CardHeader>
        <div className="flex items-start justify-between mb-4">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center ${iconBgColor} p-4`}>
            {!imageError ? (
              <Image
                src={iconSrc}
                alt={iconAlt}
                width={56}
                height={56}
                className="w-full h-full object-contain"
                onError={() => setImageError(true)}
              />
            ) : (
              <span className="text-4xl">{fallbackEmoji}</span>
            )}
          </div>
          <div className="flex flex-col gap-2 items-end">
            {badges.map((badge, index) => (
              <Badge
                key={index}
                className={badge === "Aanbevolen" ? "bg-orange-500/20 text-orange-400 border-orange-500/30" : "bg-blue-500/20 text-blue-400 border-blue-500/30"}
              >
                {badge}
              </Badge>
            ))}
          </div>
        </div>
        <CardTitle className="text-2xl text-white mb-2">{title}</CardTitle>
        <CardDescription className="text-slate-300 text-base">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-slate-300">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <Button
          size="lg"
          className={`w-full ${buttonColor} text-white`}
          asChild
        >
          <Link href={primaryButtonHref}>{primaryButtonText}</Link>
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="w-full"
          asChild
        >
          <Link href={secondaryButtonHref}>{secondaryButtonText}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export function ChoiceSection() {
  const klantenFeatures = [
    "Instant boeken buiten kantooruren",
    "Keuze tussen AI-bot of digitale agenda",
    "Automatische herinneringen via SMS/email",
    "Geen wachttijden aan de telefoon",
  ];

  const businessFeatures = [
    "Centraal dashboard met alle boekingen",
    "Geen dubbele afspraken meer",
    "Elimineer administratieve last",
    "Zie reden van afspraak voor goede voorbereiding",
  ];

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 mb-4">Begin vandaag</Badge>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Klaar om te starten?</h2>
        <h3 className="text-2xl md:text-3xl font-semibold text-slate-300 max-w-3xl mx-auto">
          Kies hoe je SchedulAI wilt gebruiken en begin direct met slimmer plannen
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <PortalCard
          iconSrc="/images/icons/user.png"
          iconAlt="Klant Icon"
          fallbackEmoji="👤"
          badges={["Voor klanten"]}
          title="Klanten Portal"
          description="Boek direct je afspraken 24/7, beheer je agenda en ontvang automatische herinneringen"
          features={klantenFeatures}
          primaryButtonText="Login als klant →"
          secondaryButtonText="Maak klant account"
          primaryButtonHref="/login/client"
          secondaryButtonHref="/signup/client"
          iconBgColor="bg-blue-500"
          buttonColor="bg-blue-500 hover:bg-blue-600"
        />
        <PortalCard
          iconSrc="/images/icons/briefcase.png"
          iconAlt="Business Icon"
          fallbackEmoji="💼"
          badges={["Aanbevolen", "Voor bedrijven"]}
          title="Business Dashboard"
          description="Beheer alle afspraken, klanten en je AI assistent vanuit één krachtig dashboard"
          features={businessFeatures}
          primaryButtonText="Login als bedrijf →"
          secondaryButtonText="Start gratis proefperiode"
          primaryButtonHref="/login/business"
          secondaryButtonHref="/signup/business"
          iconBgColor="bg-orange-500"
          buttonColor="bg-orange-500 hover:bg-orange-600"
          recommended={true}
        />
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div>
          <div className="text-3xl font-bold text-white mb-2">24/7</div>
          <div className="text-slate-400">Beschikbaarheid</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-white mb-2">100%</div>
          <div className="text-slate-400">Foutloze synchronisatie</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-white mb-2">0</div>
          <div className="text-slate-400">Dubbele boekingen</div>
        </div>
      </div>
    </section>
  );
}

