"use client";

import { useUser, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Calendar,
  Phone,
  Users,
  Bell,
  Search,
  Plus,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Clock,
  Zap,
  MessageSquare,
} from "lucide-react";

export default function BusinessDashboard() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-700 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Dashboard laden...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push("/login/business");
    return null;
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Goedemorgen";
    if (hour < 18) return "Goedemiddag";
    return "Goedenavond";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Navbar */}
      <nav className="bg-slate-800/30 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center font-bold shadow-lg">
                S
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">SchedulAI</span>
            </div>
            <div className="hidden lg:flex items-center gap-1">
              <button className="px-3 py-2 text-orange-500 font-medium flex items-center gap-2 bg-orange-500/10 rounded-lg">
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </button>
              <button onClick={() => router.push("/business/agenda")} className="px-3 py-2 hover:bg-slate-700/50 rounded-lg transition flex items-center gap-2 text-slate-300 hover:text-white">
                <Calendar className="w-4 h-4" />
                Agenda
              </button>
              <button onClick={() => router.push("/business/klanten")} className="px-3 py-2 hover:bg-slate-700/50 rounded-lg transition flex items-center gap-2 text-slate-300 hover:text-white">
                <Users className="w-4 h-4" />
                Klanten
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section with Gradient Background */}
        <div className="mb-12 rounded-2xl bg-gradient-to-r from-orange-500/10 via-orange-500/5 to-transparent border border-orange-500/20 p-8 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5 text-orange-400" />
            <span className="text-orange-400 font-semibold text-sm">Welkom terug</span>
          </div>
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
            {getGreeting()}, {user.firstName || "Bedrijf"}!
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Je hebt <span className="text-orange-400 font-semibold">12 afspraken</span> vandaag. AI heeft je geholpen met <span className="text-orange-400 font-semibold">18 boekingen</span> deze week.
          </p>
        </div>

        {/* Grid Layout - Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* AI Voice Assistant Card */}
          <Card className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-slate-700/50 hover:border-orange-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10 col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <Phone className="w-5 h-5 text-orange-400" />
                </div>
                AI Voice Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-400 text-sm leading-relaxed">
                Laai je AI assistent direct telefonisch afspraken maken.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  24/7 beschikbaarheid
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  Natuurlijke spraak
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  Direct boeken in agenda
                </div>
              </div>
              <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium shadow-lg shadow-orange-500/20">
                Activeer AI Assistent
              </Button>
            </CardContent>
          </Card>

          {/* Book Appointment Card */}
          <Card className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-slate-700/50 hover:border-emerald-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <Calendar className="w-5 h-5 text-emerald-400" />
                </div>
                Afspraken Plannen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-400 text-sm leading-relaxed">
                Plan direct een afspraak in de agenda van je klant.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  Slimme slot-suggesties
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  Persoonlijk ontvangs
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  Instant confirmatie
                </div>
              </div>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-lg shadow-emerald-600/20">
                Plan Afspraak
              </Button>
            </CardContent>
          </Card>

          {/* This Week Statistics Card */}
          <Card className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-slate-700/50 hover:border-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                </div>
                Deze Week
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-slate-400">Nieuwe boekingen</span>
                  <span className="font-bold">18</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: "75%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-slate-400">AI gesprekken</span>
                  <span className="font-bold">34</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: "85%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-slate-400">Voltooide afspraken</span>
                  <span className="font-bold">12</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: "60%" }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Service Health Card */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                Systeemstatus
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-400 text-sm">Alle systemen draaien soepel</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-bold text-green-500">3</p>
                  <p className="text-xs text-slate-400">Actief</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">6</p>
                  <p className="text-xs text-slate-400">Afspraken</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Get Started Card */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-orange-500" />
                Klaar om te starten?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-400 text-sm">
                Leer hoe AI jou kan helpen besparen bij het boeken.
              </p>
              <div className="flex gap-2">
                <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white">
                  AI Gids
                </Button>
                <Button className="flex-1 bg-slate-700 hover:bg-slate-600 text-white">
                  Afspraak
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Next Appointment Card */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle>Volgende Afspraak</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-slate-400">Vandaag</p>
                  <p className="font-semibold">Jan Jansen</p>
                  <p className="text-sm text-slate-400">Controle • neiging - 30min</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Ma, 3</p>
                  <p className="font-semibold">Emma de Vries</p>
                  <p className="text-sm text-slate-400">Urgente behandeling - 45min</p>
                </div>
              </div>
              <button className="text-orange-500 font-medium flex items-center gap-2 hover:text-orange-400 transition">
                Bekijk Alles <ArrowRight className="w-4 h-4" />
              </button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
