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
} from "lucide-react";
import { useState } from "react";

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

  const clients: Client[] = [
    {
      id: "1",
      name: "Jan Jansen",
      initials: "JJ",
      email: "jan.jansen@email.nl",
      phone: "+31 6 1234 5678",
      appointments: 12,
      lastContact: "Mi, 30 Dec",
      rating: 5,
      status: "active",
    },
    {
      id: "2",
      name: "Sophie Bakker",
      initials: "SB",
      email: "sophie.bakker@email.nl",
      phone: "+31 6 2345 6789",
      appointments: 9,
      lastContact: "Di, 31 Dec",
      rating: 5,
      status: "active",
    },
    {
      id: "3",
      name: "Ahmed El Mansouri",
      initials: "AEM",
      email: "ahmed.mansouri@email.nl",
      phone: "+31 6 3456 7890",
      appointments: 15,
      lastContact: "Di, 2 Jan",
      rating: 5,
      status: "active",
    },
    {
      id: "4",
      name: "Emma de Vries",
      initials: "EDV",
      email: "emma.devries@email.nl",
      phone: "+31 6 4567 8901",
      appointments: 8,
      lastContact: "Vr, 3 Jan",
      rating: 5,
      status: "active",
    },
    {
      id: "5",
      name: "Lucas Vermeer",
      initials: "LV",
      email: "lucas.vermeer@email.nl",
      phone: "+31 6 5678 9012",
      appointments: 20,
      lastContact: "Ma, 6 Jan",
      rating: 5,
      status: "active",
    },
    {
      id: "6",
      name: "Maria Santos",
      initials: "MS",
      email: "maria.santos@email.nl",
      phone: "+31 6 6789 0123",
      appointments: 4,
      lastContact: "Vr, 8 Jan",
      rating: 4,
      status: "active",
    },
    {
      id: "7",
      name: "Thomas Berg",
      initials: "TB",
      email: "thomas.berg@email.nl",
      phone: "+31 6 7890 1234",
      appointments: 3,
      lastContact: "Do, 9 Jan",
      rating: 3,
      status: "inactive",
    },
    {
      id: "8",
      name: "Lisa van Dam",
      initials: "LVD",
      email: "lisa.vandam@email.nl",
      phone: "+31 6 8901 2345",
      appointments: 18,
      lastContact: "Za, 4 Jan",
      rating: 5,
      status: "active",
    },
  ];

  const totalClients = clients.length;
  const activeClients = clients.filter((c) => c.status === "active").length;
  const avgAppointments = (clients.reduce((sum, c) => sum + c.appointments, 0) / clients.length).toFixed(1);

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

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phone.includes(searchQuery)
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
              <button onClick={() => router.push("/business/dashboard")} className="px-3 py-2 hover:bg-slate-700/50 rounded-lg transition flex items-center gap-2 text-slate-300 hover:text-white">
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </button>
              <button onClick={() => router.push("/business/agenda")} className="px-3 py-2 hover:bg-slate-700/50 rounded-lg transition flex items-center gap-2 text-slate-300 hover:text-white">
                <Calendar className="w-4 h-4" />
                Agenda
              </button>
              <button className="px-3 py-2 text-orange-500 font-medium flex items-center gap-2 bg-orange-500/10 rounded-lg">
                <Users className="w-4 h-4" />
                Klanten
              </button>
              <button onClick={() => router.push("/business/instellingen")} className="px-3 py-2 hover:bg-slate-700/50 rounded-lg transition flex items-center gap-2 text-slate-300 hover:text-white">
                <Settings className="w-4 h-4" />
                Instellingen
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
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700/50">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700/50">
              <Download className="w-4 h-4 mr-2" />
              Exporteren
            </Button>
            <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium">
              <Plus className="w-4 h-4 mr-2" />
              Nieuw klant
            </Button>
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
              <p className="text-xs text-emerald-400 mt-2">✓ +10 deze maand</p>
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
              <p className="text-xs text-emerald-400 mt-2">✓ +88% activiteit</p>
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
              {filteredClients.length === 0 ? (
                <div className="p-8 text-center text-slate-400">Geen klanten gevonden</div>
              ) : (
                filteredClients.map((client) => (
                  <div
                    key={client.id}
                    className="p-4 hover:bg-slate-700/20 transition flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center font-bold text-sm">
                        {client.initials}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{client.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {client.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {client.phone}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 min-w-fit">
                      <div className="text-right">
                        <p className="font-semibold text-white">{client.appointments}</p>
                        <p className="text-xs text-slate-400">Afspraken</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-400 mb-1">{client.lastContact}</p>
                        <p className="text-xs text-slate-500">Laatste contact</p>
                      </div>
                      <div>{renderStars(client.rating)}</div>
                      <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700/50">
                        Details
                      </Button>
                      <button className="p-2 hover:bg-slate-700/50 rounded-lg transition text-slate-400 hover:text-white">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            <div className="border-t border-slate-700/50 p-4 flex items-center justify-between">
              <p className="text-sm text-slate-400">Toont 1-8 van 127 klanten</p>
              <div className="flex gap-2">
                <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700/50">
                  Vorige
                </Button>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  Volgende
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
