"use client";

import { useState, useEffect } from "react";

type RoosterItem = {
  dag: string;
  open: boolean;
  openTijd: string;
  sluitTijd: string;
  pauze: boolean;
  pauzeStart: string;
  pauzeEind: string;
};

type Werknemer = {
  werknemer_id: number;
  voornaam: string;
  naam: string;
  email: string;
  beschikbaarheden?: Array<{
    dag: string;
    start_tijd: string;
    eind_tijd: string;
  }>;
  rooster: RoosterItem[];
};
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

export default function WerknemersPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [werknemers, setWerknemers] = useState<Werknemer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [nieuwWerknemer, setNieuwWerknemer] = useState<{ voornaam: string; naam: string; email: string }>({ voornaam: "", naam: "", email: "" });

  // Werknemers ophalen
  useEffect(() => {
    setLoading(true);
    fetch("/api/business/werknemers")
      .then(async (res) => {
        if (!res.ok) throw new Error("Fout bij ophalen werknemers");
        return res.json();
      })
      .then((data) => {
        setWerknemers(
          (data.werknemers || []).map((w: any): Werknemer => ({
            werknemer_id: w.werknemer_id,
            voornaam: w.voornaam,
            naam: w.naam,
            email: w.email,
            beschikbaarheden: w.beschikbaarheden,
            rooster: weekDays.map((dag) => {
              const b = (w.beschikbaarheden || []).find((x: any) => x.dag === dag);
              return {
                dag,
                open: !!b,
                openTijd: b ? b.start_tijd.slice(11, 16) : "09:00",
                sluitTijd: b ? b.eind_tijd.slice(11, 16) : "17:00",
                pauze: false,
                pauzeStart: "12:00",
                pauzeEind: "13:00",
              };
            }),
          }))
        );
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Rooster wijzigen en opslaan
  const handleRoosterChange = async (
    wid: number,
    idx: number,
    field: keyof RoosterItem,
    value: any
  ) => {
    setWerknemers((prev) =>
      prev.map((w) =>
        w.werknemer_id === wid
          ? {
              ...w,
              rooster: w.rooster.map((item, i) =>
                i === idx ? { ...item, [field]: value } : item
              ),
            }
          : w
      )
    );
    // Direct opslaan naar backend
    const werknemer = werknemers.find((w) => w.werknemer_id === wid);
    if (!werknemer) return;
    const rooster = werknemer.rooster.map((item, i) => (i === idx ? { ...item, [field]: value } : item));
    await fetch("/api/business/werknemers/beschikbaarheid", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ werknemer_id: wid, rooster }),
    });
  };

  const handleAddWerknemer = async () => {
    if (!nieuwWerknemer.voornaam || !nieuwWerknemer.naam || !nieuwWerknemer.email) return;
    const res = await fetch("/api/business/werknemers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nieuwWerknemer),
    });
    if (res.ok) {
      const data = await res.json();
      setWerknemers((prev) => [
        ...prev,
        {
          werknemer_id: data.werknemer.werknemer_id,
          voornaam: data.werknemer.voornaam,
          naam: data.werknemer.naam,
          email: data.werknemer.email,
          beschikbaarheden: data.werknemer.beschikbaarheden,
          rooster: weekDays.map((dag) => ({
            dag,
            open: dag !== "Zondag",
            openTijd: "09:00",
            sluitTijd: "17:00",
            pauze: false,
            pauzeStart: "12:00",
            pauzeEind: "13:00",
          })),
        },
      ]);
      setNieuwWerknemer({ voornaam: "", naam: "", email: "" });
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-700 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Werknemers laden...</p>
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
              <button onClick={() => router.push("/business/beschikbaarheid")} className="px-3 py-2 hover:bg-slate-700/50 rounded-lg transition flex items-center gap-2 text-slate-300 hover:text-white">
                <Clock className="w-4 h-4" />
                Beschikbaarheid
              </button>
              <button className="px-3 py-2 text-orange-500 font-medium flex items-center gap-2 bg-orange-500/10 rounded-lg">
                <BarChart3 className="w-4 h-4" />
                Werknemers
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
        <h1 className="text-4xl font-bold mb-8">Werknemers</h1>
        <div className="mb-8 max-w-xl">
          <h2 className="text-xl font-semibold mb-2">Nieuwe werknemer toevoegen</h2>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Voornaam"
              value={nieuwWerknemer.voornaam}
              onChange={(e) => setNieuwWerknemer({ ...nieuwWerknemer, voornaam: e.target.value })}
              className="bg-slate-700 rounded px-2 py-1 text-white"
            />
            <input
              type="text"
              placeholder="Achternaam"
              value={nieuwWerknemer.naam}
              onChange={(e) => setNieuwWerknemer({ ...nieuwWerknemer, naam: e.target.value })}
              className="bg-slate-700 rounded px-2 py-1 text-white"
            />
            <input
              type="email"
              placeholder="Email"
              value={nieuwWerknemer.email}
              onChange={(e) => setNieuwWerknemer({ ...nieuwWerknemer, email: e.target.value })}
              className="bg-slate-700 rounded px-2 py-1 text-white"
            />
            <Button onClick={handleAddWerknemer} className="bg-gradient-to-r from-orange-500 to-orange-600">Toevoegen</Button>
          </div>
        </div>
        <div className="grid gap-8 max-w-2xl">
          {werknemers.map((w) => (
            <Card key={w.werknemer_id} className="bg-slate-800/80 border border-slate-700/50">
              <CardContent className="p-4">
                <div className="font-semibold text-lg mb-2">{w.voornaam} {w.naam} <span className="text-slate-400 text-sm">({w.email})</span></div>
                <div className="grid gap-4">
                  {w.rooster.map((item, idx) => (
                    <div key={item.dag} className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="font-semibold w-32">{item.dag}</div>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={item.open}
                          onChange={(e) => handleRoosterChange(w.werknemer_id, idx, "open", e.target.checked)}
                        />
                        Open
                      </label>
                      {item.open && (
                        <>
                          <input
                            type="time"
                            value={item.openTijd}
                            onChange={(e) => handleRoosterChange(w.werknemer_id, idx, "openTijd", e.target.value)}
                            className="bg-slate-700 rounded px-2 py-1 text-white"
                          />
                          <span>-</span>
                          <input
                            type="time"
                            value={item.sluitTijd}
                            onChange={(e) => handleRoosterChange(w.werknemer_id, idx, "sluitTijd", e.target.value)}
                            className="bg-slate-700 rounded px-2 py-1 text-white"
                          />
                          <label className="flex items-center gap-2 ml-4">
                            <input
                              type="checkbox"
                              checked={item.pauze}
                              onChange={(e) => handleRoosterChange(w.werknemer_id, idx, "pauze", e.target.checked)}
                            />
                            Pauze
                          </label>
                          {item.pauze && (
                            <>
                              <input
                                type="time"
                                value={item.pauzeStart}
                                onChange={(e) => handleRoosterChange(w.werknemer_id, idx, "pauzeStart", e.target.value)}
                                className="bg-slate-700 rounded px-2 py-1 text-white"
                              />
                              <span>-</span>
                              <input
                                type="time"
                                value={item.pauzeEind}
                                onChange={(e) => handleRoosterChange(w.werknemer_id, idx, "pauzeEind", e.target.value)}
                                className="bg-slate-700 rounded px-2 py-1 text-white"
                              />
                            </>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
