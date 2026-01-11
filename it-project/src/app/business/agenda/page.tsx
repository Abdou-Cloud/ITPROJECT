"use client";

import { useUser, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  Phone,
  Video,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Plus,
  Download,
  Search,
  Settings,
  Bell,
  BarChart3,
  Users,
  Trash2,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from "date-fns";
import { nl } from "date-fns/locale";

interface Klant {
  klant_id: number;
  naam: string;
  email: string;
  telefoonnummer: string;
}

interface Afspraak {
  afspraak_id: number;
  start_datum: string;
  eind_datum: string;
  status: string;
  klant: {
    naam: string;
    email: string;
    telefoonnummer: string;
  };
}

export default function BusinessAgendaPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("day");
  const [afspraken, setAfspraken] = useState<Afspraak[]>([]);
  const [klanten, setKlanten] = useState<Klant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state voor nieuwe afspraak
  const [nieuwAfspraak, setNieuwAfspraak] = useState({
    klant_id: "",
    start_datum: "",
    start_tijd: "",
    eind_tijd: "",
    status: "gepland",
  });

  // Fetch afspraken
  const fetchAfspraken = useCallback(async () => {
    try {
      const startDate = format(startOfMonth(currentMonth), "yyyy-MM-dd");
      const endDate = format(endOfMonth(currentMonth), "yyyy-MM-dd");
      
      const response = await fetch(`/api/afspraken?startDate=${startDate}&endDate=${endDate}`);
      if (response.ok) {
        const data = await response.json();
        setAfspraken(data);
      }
    } catch (error) {
      console.error("Fout bij ophalen afspraken:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentMonth]);

  // Fetch klanten
  const fetchKlanten = useCallback(async () => {
    try {
      const response = await fetch("/api/business/klanten");
      if (response.ok) {
        const data = await response.json();
        setKlanten(data.klanten);
      }
    } catch (error) {
      console.error("Fout bij ophalen klanten:", error);
    }
  }, []);

  useEffect(() => {
    if (isLoaded && user) {
      fetchAfspraken();
      fetchKlanten();
    }
  }, [isLoaded, user, fetchAfspraken, fetchKlanten]);

  // Maak nieuwe afspraak
  const handleNieuweAfspraak = async () => {
    if (!nieuwAfspraak.klant_id || !nieuwAfspraak.start_datum || !nieuwAfspraak.start_tijd || !nieuwAfspraak.eind_tijd) {
      alert("Vul alle verplichte velden in");
      return;
    }

    setIsSubmitting(true);
    try {
      const start_datum = new Date(`${nieuwAfspraak.start_datum}T${nieuwAfspraak.start_tijd}`);
      const eind_datum = new Date(`${nieuwAfspraak.start_datum}T${nieuwAfspraak.eind_tijd}`);

      const response = await fetch("/api/afspraken", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          klant_id: nieuwAfspraak.klant_id,
          start_datum: start_datum.toISOString(),
          eind_datum: eind_datum.toISOString(),
          status: nieuwAfspraak.status,
        }),
      });

      if (response.ok) {
        setIsDialogOpen(false);
        setNieuwAfspraak({
          klant_id: "",
          start_datum: "",
          start_tijd: "",
          eind_tijd: "",
          status: "gepland",
        });
        fetchAfspraken();
      } else {
        const error = await response.json();
        alert(error.error || "Er is een fout opgetreden");
      }
    } catch (error) {
      console.error("Fout bij maken afspraak:", error);
      alert("Er is een fout opgetreden");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Verwijder afspraak
  const handleVerwijderAfspraak = async (id: number) => {
    if (!confirm("Weet je zeker dat je deze afspraak wilt verwijderen?")) {
      return;
    }

    try {
      const response = await fetch(`/api/afspraken/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchAfspraken();
      } else {
        alert("Er is een fout opgetreden bij het verwijderen");
      }
    } catch (error) {
      console.error("Fout bij verwijderen:", error);
    }
  };

  // Update afspraak status
  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/afspraken/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchAfspraken();
      }
    } catch (error) {
      console.error("Fout bij updaten status:", error);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-700 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Agenda laden...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push("/login/business");
    return null;
  }

  // Filter afspraken voor geselecteerde datum
  const afsprakenVandaag = afspraken.filter((apt) => 
    isSameDay(new Date(apt.start_datum), selectedDate)
  );

  // Kalender dagen genereren met padding zodat maandag altijd de eerste kolom is
  const firstDayOfMonth = startOfMonth(currentMonth);
  // In JS: 0 = zondag, 1 = maandag, ..., 6 = zaterdag
  let jsDay = firstDayOfMonth.getDay();
  // Zet zondag (0) om naar 7 zodat maandag = 1, zondag = 7
  if (jsDay === 0) jsDay = 7;
  const paddingDays = jsDay - 1; // aantal lege cellen voor de eerste dag
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  // Statistieken berekenen
  const afsprakenDezeMaand = afspraken.length;
  const afsprakenDezeWeek = afspraken.filter((apt) => {
    const date = new Date(apt.start_datum);
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    const weekEnd = new Date(now.setDate(now.getDate() + 6));
    return date >= weekStart && date <= weekEnd;
  }).length;

  // Bereken duur in minuten
  const getDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "bevestigd":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "gepland":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "voltooid":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "geannuleerd":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "bevestigd":
        return "Bevestigd";
      case "gepland":
        return "Gepland";
      case "voltooid":
        return "Voltooid";
      case "geannuleerd":
        return "Geannuleerd";
      default:
        return status;
    }
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
              {/* Dashboard knop verwijderd */}
              <button className="px-3 py-2 text-orange-500 font-medium flex items-center gap-2 bg-orange-500/10 rounded-lg">
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
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Agenda</h1>
            <p className="text-slate-400">Beheer al je afspraken op één plek</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Filter en Exporteren knoppen verwijderd */}
            
            {/* Nieuwe Afspraak Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium">
                  <Plus className="w-4 h-4 mr-2" />
                  Nieuwe afspraak
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-slate-700 text-white">
                <DialogHeader>
                  <DialogTitle>Nieuwe afspraak maken</DialogTitle>
                  <DialogDescription className="text-slate-400">
                    Vul de gegevens in om een nieuwe afspraak te plannen.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="klant">Klant</Label>
                    <Select
                      value={nieuwAfspraak.klant_id}
                      onValueChange={(value) => setNieuwAfspraak({ ...nieuwAfspraak, klant_id: value })}
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-700">
                        <SelectValue placeholder="Selecteer een klant" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {klanten.map((klant) => (
                          <SelectItem key={klant.klant_id} value={String(klant.klant_id)}>
                            {klant.naam}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="datum">Datum</Label>
                    <Input
                      id="datum"
                      type="date"
                      value={nieuwAfspraak.start_datum}
                      onChange={(e) => setNieuwAfspraak({ ...nieuwAfspraak, start_datum: e.target.value })}
                      className="bg-slate-800 border-slate-700"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="start_tijd">Starttijd</Label>
                      <Input
                        id="start_tijd"
                        type="time"
                        value={nieuwAfspraak.start_tijd}
                        onChange={(e) => setNieuwAfspraak({ ...nieuwAfspraak, start_tijd: e.target.value })}
                        className="bg-slate-800 border-slate-700"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="eind_tijd">Eindtijd</Label>
                      <Input
                        id="eind_tijd"
                        type="time"
                        value={nieuwAfspraak.eind_tijd}
                        onChange={(e) => setNieuwAfspraak({ ...nieuwAfspraak, eind_tijd: e.target.value })}
                        className="bg-slate-800 border-slate-700"
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={nieuwAfspraak.status}
                      onValueChange={(value) => setNieuwAfspraak({ ...nieuwAfspraak, status: value })}
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="gepland">Gepland</SelectItem>
                        <SelectItem value="bevestigd">Bevestigd</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="border-slate-600 text-black bg-white hover:bg-slate-200"
                  >
                    Annuleren
                  </Button>
                  <Button
                    onClick={handleNieuweAfspraak}
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-orange-500 to-orange-600"
                  >
                    {isSubmitting ? "Bezig..." : "Afspraak maken"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Calendar */}
          <div className="lg:col-span-1">
            <Card className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-slate-700/50">
              <CardContent className="p-4">
                {/* Mini Calendar */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">
                      {format(currentMonth, "MMMM yyyy", { locale: nl })}
                    </h3>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                        className="p-1 hover:bg-slate-700/50 rounded transition"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                        className="p-1 hover:bg-slate-700/50 rounded transition"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Calendar Grid */}
                  <div className="space-y-2">
                    <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-400 mb-2">
                      <div>Ma</div>
                      <div>Di</div>
                      <div>Wo</div>
                      <div>Do</div>
                      <div>Vr</div>
                      <div>Za</div>
                      <div>Zo</div>
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {/* Padding voor de eerste week */}
                      {Array.from({ length: paddingDays }).map((_, idx) => (
                        <div key={"pad-" + idx}></div>
                      ))}
                      {daysInMonth.map((day, i) => {
                        const hasAfspraken = afspraken.some((apt) => 
                          isSameDay(new Date(apt.start_datum), day)
                        );
                        return (
                          <button
                            key={i}
                            onClick={() => setSelectedDate(day)}
                            className={`p-2 rounded text-sm font-medium transition relative ${
                              isSameDay(selectedDate, day)
                                ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white"
                                : "hover:bg-slate-700/50 text-slate-300"
                            }`}
                          >
                            {format(day, "d")}
                            {hasAfspraken && !isSameDay(selectedDate, day) && (
                              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-orange-400 rounded-full"></span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Statistics */}
                <div className="border-t border-slate-700/50 pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Deze maand</span>
                    <span className="font-bold">{afsprakenDezeMaand} afspraken</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Deze week</span>
                    <span className="font-bold">{afsprakenDezeWeek} afspraken</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Vandaag</span>
                    <span className="font-bold text-orange-400">{afsprakenVandaag.length} afspraken</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Appointments */}
          <div className="lg:col-span-3">
            {/* Date Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">
                  Afspraken {isSameDay(selectedDate, new Date()) ? "vandaag" : ""}
                </h2>
                <p className="text-slate-400 text-sm">
                  {format(selectedDate, "EEEE, d MMMM yyyy", { locale: nl })}
                </p>
              </div>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-4 border-slate-700 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-400">Afspraken laden...</p>
              </div>
            ) : afsprakenVandaag.length === 0 ? (
              /* Empty State */
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Geen afspraken</h3>
                <p className="text-slate-400 mb-4">
                  Er zijn geen afspraken gepland voor deze dag.
                </p>
                <Button 
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-gradient-to-r from-orange-500 to-orange-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nieuwe afspraak maken
                </Button>
              </div>
            ) : (
              /* Appointments List */
              <div className="space-y-3">
                {afsprakenVandaag
                  .sort((a, b) => new Date(a.start_datum).getTime() - new Date(b.start_datum).getTime())
                  .map((apt) => (
                    <Card
                      key={apt.afspraak_id}
                      className="bg-gradient-to-r from-slate-800/60 to-slate-800/30 border border-slate-700/50 hover:border-orange-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10"
                    >
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="bg-slate-700/50 rounded-lg p-3 min-w-fit">
                            <div className="text-sm font-bold text-orange-400">
                              {format(new Date(apt.start_datum), "HH:mm")}
                            </div>
                            <div className="text-xs text-slate-400">
                              {getDuration(apt.start_datum, apt.eind_datum)} min
                            </div>
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-white">{apt.klant.naam}</h3>
                              <span
                                className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(apt.status)}`}
                              >
                                {getStatusLabel(apt.status)}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-400">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {format(new Date(apt.start_datum), "HH:mm")} - {format(new Date(apt.eind_datum), "HH:mm")}
                              </div>
                              <div className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {apt.klant.telefoonnummer}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Select
                            value={apt.status}
                            onValueChange={(value) => handleUpdateStatus(apt.afspraak_id, value)}
                          >
                            <SelectTrigger className="w-32 bg-slate-800 border-slate-700 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700">
                              <SelectItem value="gepland">Gepland</SelectItem>
                              <SelectItem value="bevestigd">Bevestigd</SelectItem>
                              <SelectItem value="voltooid">Voltooid</SelectItem>
                              <SelectItem value="geannuleerd">Geannuleerd</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="outline"
                            size="icon"
                            className="bg-[#ef4444] border-[#dc2626] text-white hover:bg-[#b91c1c] hover:border-[#991b1b]"
                            onClick={() => handleVerwijderAfspraak(apt.afspraak_id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}

            {/* Footer Info */}
            <div className="mt-6 flex items-center justify-between text-sm text-slate-400">
              <p>✓ Afspraken worden automatisch opgeslagen in de database</p>
              <button 
                onClick={() => fetchAfspraken()} 
                className="text-orange-400 hover:text-orange-300"
              >
                Vernieuwen →
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}