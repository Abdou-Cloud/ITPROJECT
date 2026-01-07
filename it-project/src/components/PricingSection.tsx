"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { PricingTable } from "@clerk/nextjs";

interface PricingFeature {
  text: string;
}

interface PricingPlanProps {
  name: string;
  badge?: string;
  target: string;
  price: string;
  features: PricingFeature[];
  buttonText: string;
  buttonVariant?: "default" | "outline";
  highlighted?: boolean;
  isContactButton?: boolean;
}

function PricingPlan({ name, badge, target, price, features, buttonText, buttonVariant = "outline", highlighted = false, isContactButton = false }: PricingPlanProps) {
  return (
    <Card className={`h-full bg-slate-800/50 border-slate-700 ${highlighted ? 'border-orange-500/50' : ''}`}>
      {badge && (
        <div className="px-6 pt-6">
          <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">{badge}</Badge>
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-3xl text-white mb-2">{name}</CardTitle>
        <CardDescription className="text-slate-400 text-base">{target}</CardDescription>
        <div className="mt-4">
          <span className="text-4xl font-bold text-white">{price}</span>
          <span className="text-slate-400 ml-2">per maand</span>
        </div>
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
      <CardFooter>
        {isContactButton ? (
          <Button
            variant={buttonVariant}
            size="lg"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            asChild
          >
            <Link href="/contact">{buttonText}</Link>
          </Button>
        ) : (
          <Button
            variant={buttonVariant}
            size="lg"
            className={`w-full ${highlighted ? 'bg-orange-500 hover:bg-orange-600 text-white' : ''}`}
            asChild
          >
            <Link href="/signup/business">{buttonText}</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export function PricingSection() {
  const starterFeatures = [
    { text: "24/7 AI Assistent voor afspraken" },
    { text: "Real-time agenda synchronisatie" },
    { text: "Tot 100 boekingen per maand" },
    { text: "Basis dashboard" },
    { text: "Email herinneringen" },
  ];

  const professionalFeatures = [
    { text: "Alles van Starter" },
    { text: "Onbeperkte boekingen" },
    { text: "SMS + Email herinneringen" },
    { text: "Geavanceerd dashboard & analytics" },
    { text: "Meerdere teamleden" },
    { text: "Priority support" },
  ];

  const enterpriseFeatures = [
    { text: "Alles van Professional" },
    { text: "Onbeperkte AI-gesprekken" },
    { text: "White-label oplossing" },
    { text: "Dedicated account manager" },
    { text: "Custom integraties" },
    { text: "SLA garantie" },
  ];

  return (
    <section id="prijzen" className="container mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-2xl">👑</span>
          <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">Flexibele Prijsopties</Badge>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Kies het plan dat bij je past</h2>
        <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-6">
          Van startende professionals tot grote organisaties - SchedulAI groeit mee met jouw ambities. 
          Alle plannen bevatten 24/7 AI support, real-time synchronisatie en nul dubbele boekingen.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-500" />
            <span className="text-slate-300">14 dagen gratis proberen</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-500" />
            <span className="text-slate-300">Geen creditcard vereist</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-500" />
            <span className="text-slate-300">Opzeggen wanneer je wilt</span>
          </div>
        </div>
      </div>

      

          <PricingTable />
        

    </section>
  );
}

