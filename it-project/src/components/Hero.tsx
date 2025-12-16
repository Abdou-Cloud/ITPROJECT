"use client";

import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="container mx-auto px-4 py-20 md:py-32">
      <div className="max-w-3xl mx-auto text-center space-y-6">
        {/* Badge */}
        <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20">
          AI-Powered Planning
        </Badge>

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
          Afspraken plannen zonder wrijving
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
          SchedulAI gebruikt AI-triage om vragen te beantwoorden en direct afspraken te synchroniseren met je agenda. 
          Geen gedoe, geen dubbele boekingen, gewoon slimme planning.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <SignedOut>
            <Button size="lg" asChild className="bg-orange-500 hover:bg-orange-600 text-white">
              <Link href="/choose">Probeer gratis</Link>
            </Button>
          </SignedOut>
          <SignedIn>
            <Button size="lg" asChild className="bg-orange-500 hover:bg-orange-600 text-white">
              <Link href="/dashboard">Ga naar dashboard</Link>
            </Button>
          </SignedIn>
          <Button size="lg" variant="outline" asChild>
            <Link href="#demo">Bekijk demo</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

