"use client";

import { useUser, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  BarChart3,
  Users,
  Settings,
  Bell,
  Search,
  Plus,
  Download,
  Filter,
  Star,
  Mail,
  Phone,
  MoreVertical,
  TrendingUp,
  Clock,
} from "lucide-react";
import { useState, useEffect } from "react";

interface Client {
  id: string;
  name: string;
  initials: string;
  email: string;
  phone: string;
  appointments: number;
  lastContact: string;
  rating: number;
  status: "active" | "inactive";
}

export default function BusinessClientsPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [klanten, setKlanten] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch("/api/business/klanten")
      .then(async (res) => {
        if (!res.ok) throw new Error("Fout bij ophalen klanten");
        return res.json();
      })
      .then((data) => {
        setKlanten(data.klanten || []);
        setError(null);
      })
      .catch(() => setError("Kon klanten niet laden."))
      .finally(() => setLoading(false));
  }, []);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-700 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Klanten laden...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push("/login/business");
    return null;
  }

  const totalClients = klanten.length;
  // Voorbeeld: actieve klanten zijn klanten met >=1 afspraak
  const activeClients = klanten.filter((c) => (c.afspraken?.length || 0) > 0).length;
  const avgAppointments = klanten.length > 0 ? (klanten.reduce((sum, c) => sum + (c.afspraken?.length || 0), 0) / klanten.length).toFixed(1) : 0;

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating ? "fill-yellow-400 text-yellow-400" : "text-slate-600"
            }`}
          />
        ))}
      </div>
    );
  };


    const filteredClients = klanten.filter((client) =>
      (`${client.voornaam} ${client.naam}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (client.telefoonnummer || '').includes(searchQuery))
    );

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
              <button onClick={() => router.push("/business/agenda")} className="px-3 py-2 hover:bg-slate-700/50 rounded-lg transition flex items-center gap-2 text-slate-300 hover:text-white">
                <Calendar className="w-4 h-4" />
                Agenda
              </button>
              <button className="px-3 py-2 text-orange-500 font-medium flex items-center gap-2 bg-orange-500/10 rounded-lg">
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
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Klanten</h1>
            <p className="text-slate-400">Beheer je klanten database en bekijk hun geschiedenis</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Filter en Exporteren knoppen verwijderd */}
            {/* Nieuwe klant button verwijderd */}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Totaal klanten</p>
                  <p className="text-3xl font-bold text-orange-400">{totalClients}</p>
                </div>
                <div className="p-3 bg-orange-500/20 rounded-lg">
                  <Users className="w-6 h-6 text-orange-400" />
                </div>
              </div>
              {/* <p className="text-xs text-emerald-400 mt-2">✓ +10 deze maand</p> */}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Actieve klanten</p>
                  <p className="text-3xl font-bold text-emerald-400">{activeClients}</p>
                </div>
                <div className="p-3 bg-emerald-500/20 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
              {/* <p className="text-xs text-emerald-400 mt-2">✓ +88% activiteit</p> */}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Gem. afspraken</p>
                  <p className="text-3xl font-bold text-blue-400">{avgAppointments}</p>
                </div>
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <Calendar className="w-6 h-6 text-blue-400" />
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-2">Per klant</p>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Zoek op naam, email of telefoonnummer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg pl-10 pr-4 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500/50 transition"
            />
          </div>
        </div>

        {/* Clients List */}
        <Card className="bg-slate-800/30 border border-slate-700/50">
          <CardHeader className="border-b border-slate-700/50">
            <div className="flex items-center justify-between">
              <CardTitle>Alle klanten ({filteredClients.length})</CardTitle>
              <div className="text-xs text-slate-400">Sorteren op: Naam</div>
            </div>
          </CardHeader>
          <CardContent className="p-0">

            <div className="divide-y divide-slate-700/50">
              {loading ? (
                <div className="p-8 text-center text-slate-400">Klanten laden...</div>
              ) : error ? (
                <div className="p-8 text-center text-red-400">{error}</div>
              ) : filteredClients.length === 0 ? (
                <div className="p-8 text-center text-slate-400">Geen klanten gevonden</div>
              ) : (
                filteredClients.map((client) => (
                  <div
                    key={client.klant_id}
                    className="p-4 hover:bg-slate-700/20 transition flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center font-bold text-sm">
                        {client.voornaam?.[0]}{client.naam?.[0]}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{client.voornaam} {client.naam}</h3>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {client.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {client.telefoonnummer}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 min-w-fit">
                      <div className="text-right">
                        <p className="font-semibold text-white">{client.afspraken?.length || 0}</p>
                        <p className="text-xs text-slate-400">Afspraken</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-400 mb-1">-</p>
                        <p className="text-xs text-slate-500">Laatste contact</p>
                      </div>
                      {/* <div>{renderStars(client.rating)}</div> */}
                      <button className="p-2 hover:bg-slate-700/50 rounded-lg transition text-slate-400 hover:text-white">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {/* Geen paginatie, alle klanten worden getoond */}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}