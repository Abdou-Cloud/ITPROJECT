"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface Plan {
  name: string;
  badge?: string;
  price: string;
  features: string[];
  highlighted?: boolean;
}

export default function BusinessPlanSelectionPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const plans: Plan[] = [
    {
      name: "Starter",
      price: "€29",
      features: [
        "24/7 AI Assistent voor afspraken",
        "Real-time agenda synchronisatie",
        "Tot 100 boekingen per maand",
        "Basis dashboard",
        "Email herinneringen",
      ],
    },
    {
      name: "Professional",
      badge: "POPULAIR",
      price: "€79",
      features: [
        "Alles van Starter",
        "Onbeperkte boekingen",
        "SMS + Email herinneringen",
        "Geavanceerd dashboard & analytics",
        "Meerdere teamleden",
        "Priority support",
      ],
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "€199",
      features: [
        "Alles van Professional",
        "Onbeperkte AI-gesprekken",
        "White-label oplossing",
        "Dedicated account manager",
        "Custom integraties",
        "SLA garantie",
      ],
    },
  ];

  const handlePlanSelection = (planName: string) => {
    // Hier zou je de plan selectie kunnen opslaan in de database
    // Voor nu redirecten we naar het dashboard
    router.push("/business/agenda");
  };

  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">Laden...</div>
        </div>
      </main>
    );
  }

  if (!user) {
    router.push("/signup/business");
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <Header />
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Kies je Plan</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Welkom {user.firstName || user.emailAddresses[0]?.emailAddress}! Kies het plan dat het beste bij je bedrijf past.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`h-full bg-slate-800/50 border-slate-700 ${
                plan.highlighted ? "border-orange-500/50" : ""
              }`}
            >
              {plan.badge && (
                <div className="px-6 pt-6">
                  <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                    {plan.badge}
                  </Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-3xl text-white mb-2">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-slate-400 ml-2">per maand</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  size="lg"
                  className={`w-full ${
                    plan.highlighted
                      ? "bg-orange-500 hover:bg-orange-600 text-white"
                      : "bg-slate-700 hover:bg-slate-600 text-white"
                  }`}
                  onClick={() => handlePlanSelection(plan.name)}
                >
                  Kies {plan.name}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}

