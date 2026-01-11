"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser, UserButton } from "@clerk/nextjs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  BarChart3,
  Users,
  Clock,
  Bell,
  Search,
  Save,
  Loader2,
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

interface Beschikbaarheid {
  beschikbaarheid_id: number;
  dag: string;
  start_tijd: string;
  eind_tijd: string;
}

interface Werknemer {
  werknemer_id: number;
  voornaam: string;
  naam: string;
  email: string;
  beschikbaarheden: Beschikbaarheid[];
}

interface RoosterItem {
  dag: string;
  open: boolean;
  openTijd: string;
  sluitTijd: string;
}

export default function BeschikbaarheidPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [werknemers, setWerknemers] = useState<Werknemer[]>([]);
  const [selectedWerknemerId, setSelectedWerknemerId] = useState<number | null>(null);
  const [rooster, setRooster] = useState<RoosterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const skipRoosterUpdate = useRef(false);

  // Haal werknemers op bij mount
  useEffect(() => {
    if (isLoaded && user) {
      fetchWerknemers();
    }
  }, [isLoaded, user]);

  // Update rooster wanneer werknemer wordt geselecteerd (alleen als het geen manual change is)
  useEffect(() => {
    if (selectedWerknemerId && !skipRoosterUpdate.current && werknemers.length > 0) {
      const werknemer = werknemers.find((w) => w.werknemer_id === selectedWerknemerId);
      if (werknemer) {
        updateRoosterFromBeschikbaarheden(werknemer.beschikbaarheden);
      }
    }
    skipRoosterUpdate.current = false;
  }, [selectedWerknemerId, werknemers]);

  const fetchWerknemers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/business/beschikbaarheid");
      if (!response.ok) {
        throw new Error("Fout bij ophalen werknemers");
      }
      const data = await response.json();
      setWerknemers(data.werknemers || []);
      if (data.werknemers && data.werknemers.length > 0) {
        setSelectedWerknemerId(data.werknemers[0].werknemer_id);
      }
    } catch (error) {
      console.error("Fout bij ophalen werknemers:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateRoosterFromBeschikbaarheden = (beschikbaarheden: Beschikbaarheid[]) => {
    const dagNamen: Record<string, string> = {
      maandag: "Maandag",
      dinsdag: "Dinsdag",
      woensdag: "Woensdag",
      donderdag: "Donderdag",
      vrijdag: "Vrijdag",
      zaterdag: "Zaterdag",
      zondag: "Zondag",
    };

    // Gebruik hardcoded defaults
    const defaultDagen = ["maandag", "dinsdag", "woensdag", "donderdag", "vrijdag"];
    const defaultStartTijd = "09:00";
    const defaultEindTijd = "17:00";

    // Als de werknemer al beschikbaarheden heeft ingesteld, gebruik alleen die
    const heeftBeschikbaarheden = beschikbaarheden.length > 0;

    const nieuweRooster = weekDays.map((dag) => {
      const dagLower = Object.keys(dagNamen).find(
        (key) => dagNamen[key] === dag
      ) || dag.toLowerCase();
      
      const beschikbaarheid = beschikbaarheden.find((b) => b.dag === dagLower);
      
      if (beschikbaarheid) {
        const startTijd = new Date(beschikbaarheid.start_tijd);
        const eindTijd = new Date(beschikbaarheid.eind_tijd);
        
        return {
          dag,
          open: true,
          openTijd: `${String(startTijd.getHours()).padStart(2, "0")}:${String(startTijd.getMinutes()).padStart(2, "0")}`,
          sluitTijd: `${String(eindTijd.getHours()).padStart(2, "0")}:${String(eindTijd.getMinutes()).padStart(2, "0")}`,
        };
      }
      
      // Als de werknemer al beschikbaarheden heeft, is een dag zonder beschikbaarheid gesloten
      // Anders gebruik hardcoded defaults als initial state
      const isDefaultOpen = heeftBeschikbaarheden ? false : defaultDagen.includes(dagLower);
      
      return {
        dag,
        open: isDefaultOpen,
        openTijd: defaultStartTijd,
        sluitTijd: defaultEindTijd,
      };
    });
    
    setRooster(nieuweRooster);
  };

  const handleChange = (idx: number, field: keyof RoosterItem, value: string | boolean) => {
    skipRoosterUpdate.current = true;
    const nieuweRooster = rooster.map((item, i) =>
      i === idx ? { ...item, [field]: value } : item
    );
    setRooster(nieuweRooster);
    
    // Realtime opslaan
    if (selectedWerknemerId) {
      saveBeschikbaarheden(selectedWerknemerId, nieuweRooster);
    }
  };

  const saveBeschikbaarheden = async (werknemerId: number, roosterData: RoosterItem[]) => {
    try {
      setSaving(true);
      skipRoosterUpdate.current = true; // Voorkom dat useEffect de rooster overschrijft
      const response = await fetch("/api/business/beschikbaarheid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          werknemer_id: werknemerId,
          beschikbaarheden: roosterData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Fout bij opslaan beschikbaarheden");
      }

      const data = await response.json();
      
      // Update alleen de lokale werknemers state met de nieuwe beschikbaarheden
      setWerknemers((prev) =>
        prev.map((w) =>
          w.werknemer_id === werknemerId
            ? { ...w, beschikbaarheden: data.beschikbaarheden || [] }
            : w
        )
      );
    } catch (error) {
      console.error("Fout bij opslaan beschikbaarheden:", error);
      skipRoosterUpdate.current = false;
      // Revert de wijziging bij fout
      const werknemer = werknemers.find((w) => w.werknemer_id === werknemerId);
      if (werknemer) {
        updateRoosterFromBeschikbaarheden(werknemer.beschikbaarheden);
      }
      // Show error to user
      alert(error instanceof Error ? error.message : "Er is een fout opgetreden bij het opslaan van beschikbaarheden");
    } finally {
      setSaving(false);
    }
  };

  const handleSave = () => {
    if (selectedWerknemerId) {
      saveBeschikbaarheden(selectedWerknemerId, rooster);
    }
  };

  if (!isLoaded || loading) {
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
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Beschikbaarheid instellen</h1>
          {saving && (
            <div className="flex items-center gap-2 text-orange-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Opslaan...</span>
            </div>
          )}
        </div>

        {/* Werknemer Selectie */}
        {werknemers.length > 0 && (
          <div className="mb-8 max-w-md">
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Selecteer werknemer
            </label>
            <Select
              value={selectedWerknemerId?.toString() || ""}
              onValueChange={(value) => setSelectedWerknemerId(Number(value))}
            >
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Selecteer een werknemer" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {werknemers.map((werknemer) => (
                  <SelectItem
                    key={werknemer.werknemer_id}
                    value={werknemer.werknemer_id.toString()}
                    className="text-white hover:bg-slate-700"
                  >
                    {werknemer.voornaam} {werknemer.naam}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {werknemers.length === 0 && !loading && (
          <div className="bg-slate-800/80 border border-slate-700/50 rounded-lg p-8 text-center">
            <p className="text-gray-400">Geen werknemers gevonden. Voeg eerst werknemers toe.</p>
            <Button
              onClick={() => router.push("/business/werknemers")}
              className="mt-4 bg-gradient-to-r from-orange-500 to-orange-600"
            >
              Ga naar Werknemers
            </Button>
          </div>
        )}

        {selectedWerknemerId && rooster.length > 0 && (
          <div className="grid gap-6 max-w-2xl">
            {rooster.map((item, idx) => (
              <Card key={item.dag} className="bg-slate-800/80 border border-slate-700/50">
                <CardContent className="p-4 flex flex-col md:flex-row md:items-center gap-4">
                  <div className="font-semibold w-32">{item.dag}</div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.open}
                      onChange={(e) => handleChange(idx, "open", e.target.checked)}
                      className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-orange-500 focus:ring-orange-500"
                    />
                    <span>Open</span>
                  </label>
                  {item.open && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <input
                        type="time"
                        value={item.openTijd}
                        onChange={(e) => handleChange(idx, "openTijd", e.target.value)}
                        className="bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      <span className="text-gray-400">-</span>
                      <input
                        type="time"
                        value={item.sluitTijd}
                        onChange={(e) => handleChange(idx, "sluitTijd", e.target.value)}
                        className="bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {selectedWerknemerId && (
          <Button
            onClick={handleSave}
            disabled={saving}
            className="mt-8 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Opslaan...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Opslaan
              </>
            )}
          </Button>
        )}
      </main>
    </div>
  );
}
