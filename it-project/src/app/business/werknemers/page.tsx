"use client";

import { useState, useEffect } from "react";
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
  Edit2,
  Check,
  X,
  Loader2,
} from "lucide-react";

type Werknemer = {
  werknemer_id: number;
  voornaam: string;
  naam: string;
  email: string;
};

type EditingWerknemer = {
  werknemer_id: number;
  voornaam: string;
  naam: string;
  email: string;
};

export default function WerknemersPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [werknemers, setWerknemers] = useState<Werknemer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [nieuwWerknemer, setNieuwWerknemer] = useState<{ voornaam: string; naam: string; email: string }>({ voornaam: "", naam: "", email: "" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<EditingWerknemer | null>(null);
  const [updating, setUpdating] = useState(false);

  // Werknemers ophalen
  useEffect(() => {
    if (isLoaded && user) {
      fetchWerknemers();
    }
  }, [isLoaded, user]);

  const fetchWerknemers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/business/werknemers");
      if (!response.ok) {
        throw new Error("Fout bij ophalen werknemers");
      }
      const data = await response.json();
      setWerknemers(data.werknemers || []);
    } catch (error) {
      console.error("Fout bij ophalen werknemers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddWerknemer = async () => {
    if (!nieuwWerknemer.voornaam || !nieuwWerknemer.naam || !nieuwWerknemer.email) return;
    try {
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
          },
        ]);
        setNieuwWerknemer({ voornaam: "", naam: "", email: "" });
      } else {
        const errorData = await res.json();
        console.error("Fout bij toevoegen werknemer:", errorData.error);
        alert(errorData.error || "Fout bij toevoegen werknemer");
      }
    } catch (error) {
      console.error("Fout bij toevoegen werknemer:", error);
      alert("Er is een fout opgetreden bij het toevoegen van de werknemer");
    }
  };

  const handleEdit = (werknemer: Werknemer) => {
    setEditingId(werknemer.werknemer_id);
    setEditingData({
      werknemer_id: werknemer.werknemer_id,
      voornaam: werknemer.voornaam,
      naam: werknemer.naam,
      email: werknemer.email,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingData(null);
  };

  const handleSaveEdit = async () => {
    if (!editingData || !editingId) return;
    if (!editingData.voornaam || !editingData.naam || !editingData.email) {
      alert("Alle velden zijn verplicht");
      return;
    }

    try {
      setUpdating(true);
      const res = await fetch(`/api/business/werknemers/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          voornaam: editingData.voornaam,
          naam: editingData.naam,
          email: editingData.email,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setWerknemers((prev) =>
          prev.map((w) =>
            w.werknemer_id === editingId
              ? {
                  werknemer_id: data.werknemer.werknemer_id,
                  voornaam: data.werknemer.voornaam,
                  naam: data.werknemer.naam,
                  email: data.werknemer.email,
                }
              : w
          )
        );
        setEditingId(null);
        setEditingData(null);
      } else {
        const errorData = await res.json();
        console.error("Fout bij updaten werknemer:", errorData.error);
        alert(errorData.error || "Fout bij updaten werknemer");
      }
    } catch (error) {
      console.error("Fout bij updaten werknemer:", error);
      alert("Er is een fout opgetreden bij het updaten van de werknemer");
    } finally {
      setUpdating(false);
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
        {werknemers.length === 0 && !loading && (
          <div className="bg-slate-800/80 border border-slate-700/50 rounded-lg p-8 text-center">
            <p className="text-gray-400">Nog geen werknemers. Voeg je eerste werknemer toe.</p>
          </div>
        )}

        <div className="grid gap-4 max-w-2xl">
          {werknemers.map((w) => (
            <Card key={w.werknemer_id} className="bg-slate-800/80 border border-slate-700/50">
              <CardContent className="p-4">
                {editingId === w.werknemer_id && editingData ? (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editingData.voornaam}
                        onChange={(e) => setEditingData({ ...editingData, voornaam: e.target.value })}
                        className="flex-1 bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Voornaam"
                      />
                      <input
                        type="text"
                        value={editingData.naam}
                        onChange={(e) => setEditingData({ ...editingData, naam: e.target.value })}
                        className="flex-1 bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Achternaam"
                      />
                    </div>
                    <input
                      type="email"
                      value={editingData.email}
                      onChange={(e) => setEditingData({ ...editingData, email: e.target.value })}
                      className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Email"
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSaveEdit}
                        disabled={updating}
                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50"
                      >
                        {updating ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Opslaan...
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Opslaan
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={handleCancelEdit}
                        disabled={updating}
                        variant="outline"
                        className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700 disabled:opacity-50"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Annuleren
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-lg">{w.voornaam} {w.naam}</div>
                      <div className="text-slate-400 text-sm">{w.email}</div>
                    </div>
                    <Button
                      onClick={() => handleEdit(w)}
                      variant="ghost"
                      className="text-slate-400 hover:text-orange-500 hover:bg-orange-500/10"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
