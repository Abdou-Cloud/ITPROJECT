"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface Feature {
  text: string;
}

interface UserTypeCardProps {
  iconSrc: string;
  iconAlt: string;
  fallbackEmoji: string;
  badge: string;
  title: string;
  subtitle: string;
  features: Feature[];
  iconBgColor: string;
}

function UserTypeCard({ iconSrc, iconAlt, fallbackEmoji, badge, title, subtitle, features, iconBgColor }: UserTypeCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <Card className="h-full bg-slate-800/50 border-slate-700">
      <CardHeader>
        <div className="flex items-start justify-between mb-4">
          <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${iconBgColor} p-3`}>
            {!imageError ? (
              <Image
                src={iconSrc}
                alt={iconAlt}
                width={48}
                height={48}
                className="w-full h-full object-contain"
                onError={() => setImageError(true)}
              />
            ) : (
              <span className="text-3xl">{fallbackEmoji}</span>
            )}
          </div>
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">{badge}</Badge>
        </div>
        <CardTitle className="text-2xl text-white mb-2">{title}</CardTitle>
        <CardDescription className="text-slate-400 text-base">{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-slate-300">{feature.text}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export function VoorWieSection() {
  const klantenFeatures = [
    { text: "Instant boeken buiten kantooruren" },
    { text: "Keuze tussen AI-bot of digitale agenda" },
    { text: "Automatische herinneringen via SMS/email" },
    { text: "Geen wachttijden aan de telefoon" },
  ];

  const professionalsFeatures = [
    { text: "Centraal dashboard met alle boekingen" },
    { text: "Geen dubbele afspraken meer" },
    { text: "Elimineer administratieve last" },
    { text: "Zie reden van afspraak voor goede voorbereiding" },
  ];

  return (
    <section id="voor-wie" className="container mx-auto px-4 py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <UserTypeCard
          iconSrc="/images/icons/user.png"
          iconAlt="Klant Icon"
          fallbackEmoji="👤"
          badge="Voor klanten"
          title="Voor klanten zoals Ilyas"
          subtitle="De drukke consument"
          features={klantenFeatures}
          iconBgColor="bg-blue-500"
        />
        <UserTypeCard
          iconSrc="/images/icons/briefcase.png"
          iconAlt="Professional Icon"
          fallbackEmoji="💼"
          badge="Voor professionals"
          title="Voor professionals zoals Abdennour"
          subtitle="De manager/professional"
          features={professionalsFeatures}
          iconBgColor="bg-orange-500"
        />
      </div>

      {/* Stats Section */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-slate-400">Beschikbaarheid</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">100%</div>
              <div className="text-slate-400">Foutloze synchronisatie</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">0</div>
              <div className="text-slate-400">Dubbele boekingen</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

