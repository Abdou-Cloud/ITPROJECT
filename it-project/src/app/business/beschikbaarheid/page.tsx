"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser, UserButton } from "@clerk/nextjs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  BarChart3,
  Users,
  Clock,
  Bell,
  Search,
} from "lucide-react";

const weekDays = [
  "Maandag",
  "Dinsdag",
  "Woensdag",
  "Donderdag",
  "Vrijdag",
  "Zaterdag",
  "Zondag",
];

export default function BeschikbaarheidPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [rooster, setRooster] = useState(
    weekDays.map((dag) => ({
      dag,
      open: dag !== "Zondag",
      openTijd: "09:00",
      sluitTijd: "17:00",
      pauze: false,
      pauzeStart: "12:00",
      pauzeEind: "13:00",
    }))
  );

  const handleChange = (idx, field, value) => {
    setRooster((prev) =>
      prev.map((item, i) =>
        i === idx ? { ...item, [field]: value } : item
      )
    );
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-700 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Beschikbaarheid laden...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push("/login/business");
    return null;
  }

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
              <button onClick={() => router.push("/business/agenda")} className="px-3 py-2 hover:bg-slate-700/50 rounded-lg transition flex items-center gap-2 text-slate-300 hover:text-white">
                <Calendar className="w-4 h-4" />
                Agenda
              </button>
              <button onClick={() => router.push("/business/klanten")} className="px-3 py-2 hover:bg-slate-700/50 rounded-lg transition flex items-center gap-2 text-slate-300 hover:text-white">
                <Users className="w-4 h-4" />
                Klanten
              </button>
              <button className="px-3 py-2 text-orange-500 font-medium flex items-center gap-2 bg-orange-500/10 rounded-lg">
                <Clock className="w-4 h-4" />
                Beschikbaarheid
              </button>
                <button onClick={() => router.push("/business/werknemers")} className="px-3 py-2 hover:bg-slate-700/50 rounded-lg transition flex items-center gap-2 text-slate-300 hover:text-white">
                  <BarChart3 className="w-4 h-4" />
                  Werknemers
                </button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-slate-700/50 rounded-lg transition text-slate-400 hover:text-white">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-slate-700/50 rounded-lg transition relative text-slate-400 hover:text-white">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Beschikbaarheid instellen</h1>
        <div className="grid gap-6 max-w-2xl">
          {rooster.map((item, idx) => (
            <Card key={item.dag} className="bg-slate-800/80 border border-slate-700/50">
              <CardContent className="p-4 flex flex-col md:flex-row md:items-center gap-4">
                <div className="font-semibold w-32">{item.dag}</div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={item.open}
                    onChange={(e) => handleChange(idx, "open", e.target.checked)}
                  />
                  Open
                </label>
                {item.open && (
                  <>
                    <input
                      type="time"
                      value={item.openTijd}
                      onChange={(e) => handleChange(idx, "openTijd", e.target.value)}
                      className="bg-slate-700 rounded px-2 py-1 text-white"
                    />
                    <span>-</span>
                    <input
                      type="time"
                      value={item.sluitTijd}
                      onChange={(e) => handleChange(idx, "sluitTijd", e.target.value)}
                      className="bg-slate-700 rounded px-2 py-1 text-white"
                    />
                    <label className="flex items-center gap-2 ml-4">
                      <input
                        type="checkbox"
                        checked={item.pauze}
                        onChange={(e) => handleChange(idx, "pauze", e.target.checked)}
                      />
                      Pauze
                    </label>
                    {item.pauze && (
                      <>
                        <input
                          type="time"
                          value={item.pauzeStart}
                          onChange={(e) => handleChange(idx, "pauzeStart", e.target.value)}
                          className="bg-slate-700 rounded px-2 py-1 text-white"
                        />
                        <span>-</span>
                        <input
                          type="time"
                          value={item.pauzeEind}
                          onChange={(e) => handleChange(idx, "pauzeEind", e.target.value)}
                          className="bg-slate-700 rounded px-2 py-1 text-white"
                        />
                      </>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        <Button className="mt-8 bg-gradient-to-r from-orange-500 to-orange-600">Opslaan</Button>
      </main>
    </div>
  );
}
