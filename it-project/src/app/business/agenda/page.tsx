"use client";

import { useUser, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Video,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Plus,
  Download,
  Filter,
  Search,
  Settings,
  Bell,
  BarChart3,
  Users,
  ZapOff,
} from "lucide-react";
import { useState } from "react";

interface Appointment {
  id: string;
  time: string;
  clientName: string;
  service: string;
  status: "upcoming" | "confirmed" | "completed" | "cancelled";
  duration: number;
  type: "phone" | "video" | "in-person";
  location?: string;
}

export default function BusinessAgendaPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(27);
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("day");

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

  const appointments: Appointment[] = [
    {
      id: "1",
      time: "09:00",
      clientName: "Jan Jansen",
      service: "Controle + neiging",
      status: "confirmed",
      duration: 30,
      type: "in-person",
    },
    {
      id: "2",
      time: "10:00",
      clientName: "Sophie Bakker",
      service: "Wittelijknaadsluthehandeling",
      status: "confirmed",
      duration: 45,
      type: "in-person",
    },
    {
      id: "3",
      time: "11:30",
      clientName: "Ahmed El Mansouri",
      service: "Periodieke controle",
      status: "upcoming",
      duration: 30,
      type: "video",
    },
    {
      id: "4",
      time: "14:00",
      clientName: "Emma de Vries",
      service: "Eenmalig plaatsing",
      status: "confirmed",
      duration: 45,
      type: "in-person",
    },
    {
      id: "5",
      time: "15:30",
      clientName: "Lucas Vermeer",
      service: "Voiberg verangen",
      status: "confirmed",
      duration: 30,
      type: "phone",
    },
    {
      id: "6",
      time: "16:30",
      clientName: "Maria Santos",
      service: "Kraan aannemen",
      status: "upcoming",
      duration: 45,
      type: "in-person",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "upcoming":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "completed":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-red-500/20 text-red-400 border-red-500/30";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Gereserveerd";
      case "upcoming":
        return "In daadbezig";
      case "completed":
        return "Voltooid";
      default:
        return "Geannuleerd";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "phone":
        return <Phone className="w-4 h-4" />;
      case "video":
        return <Video className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
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
              <button onClick={() => router.push("/business/dashboard")} className="px-3 py-2 hover:bg-slate-700/50 rounded-lg transition flex items-center gap-2 text-slate-300 hover:text-white">
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </button>
              <button className="px-3 py-2 text-orange-500 font-medium flex items-center gap-2 bg-orange-500/10 rounded-lg">
                <Calendar className="w-4 h-4" />
                Agenda
              </button>
              <button onClick={() => router.push("/business/klanten")} className="px-3 py-2 hover:bg-slate-700/50 rounded-lg transition flex items-center gap-2 text-slate-300 hover:text-white">
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
            <h1 className="text-4xl font-bold mb-2">Agenda</h1>
            <p className="text-slate-400">Beheer al je afspraken op één plek met Google Calendar sync</p>
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
              Nieuw afspraak
            </Button>
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
                    <h3 className="font-semibold">December 2024</h3>
                    <div className="flex gap-2">
                      <button className="p-1 hover:bg-slate-700/50 rounded transition">
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button className="p-1 hover:bg-slate-700/50 rounded transition">
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
                      {[...Array(31)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedDate(i + 1)}
                          className={`p-2 rounded text-sm font-medium transition ${
                            selectedDate === i + 1
                              ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white"
                              : "hover:bg-slate-700/50 text-slate-300"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Google Calendar Sync */}
                <div className="border-t border-slate-700/50 pt-4 mb-4">
                  <Button className="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium">
                    Sync nu
                  </Button>
                </div>

                {/* Statistics */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Devo maand</span>
                    <span className="font-bold">87 afspraken</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Deze week</span>
                    <span className="font-bold">18 afspraken</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Vandaag</span>
                    <span className="font-bold text-orange-400">6 afspraken</span>
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
                <h2 className="text-2xl font-bold mb-1">Afspraken vandaag</h2>
                <p className="text-slate-400 text-sm">Donderdag, 27 December 2024</p>
              </div>
              <div className="flex gap-2">
                <button className={`px-3 py-1 rounded-lg font-medium transition ${viewMode === "day" ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" : "text-slate-400 hover:text-white"}`}>
                  Dag
                </button>
                <button className={`px-3 py-1 rounded-lg font-medium transition ${viewMode === "week" ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" : "text-slate-400 hover:text-white"}`}>
                  Week
                </button>
                <button className={`px-3 py-1 rounded-lg font-medium transition ${viewMode === "month" ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" : "text-slate-400 hover:text-white"}`}>
                  Maand
                </button>
              </div>
            </div>

            {/* Appointments List */}
            <div className="space-y-3">
              {appointments.map((apt) => (
                <Card
                  key={apt.id}
                  className="bg-gradient-to-r from-slate-800/60 to-slate-800/30 border border-slate-700/50 hover:border-orange-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10"
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="bg-slate-700/50 rounded-lg p-3 min-w-fit">
                        <div className="text-sm font-bold text-orange-400">{apt.time}</div>
                        <div className="text-xs text-slate-400">{apt.duration}min</div>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-white">{apt.clientName}</h3>
                          <span
                            className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(apt.status)}`}
                          >
                            {getStatusLabel(apt.status)}
                          </span>
                        </div>
                        <p className="text-slate-400 text-sm mb-2">{apt.service}</p>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 text-slate-400 text-xs">
                            <Clock className="w-3 h-3" />
                            30 min
                          </div>
                          <div className="flex items-center gap-1 text-slate-400 text-xs">
                            {getTypeIcon(apt.type)}
                            {apt.type === "phone" ? "Telefoon" : apt.type === "video" ? "Video" : "Locatie"}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {apt.type === "video" && (
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm">
                          Join
                        </Button>
                      )}
                      <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700/50 text-sm">
                        Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Footer Info */}
            <div className="mt-6 flex items-center justify-between text-sm text-slate-400">
              <p>✓ Real-time sync met Google Calendar schrift</p>
              <a href="#" className="text-orange-400 hover:text-orange-300">
                Bekijk alle afspraken →
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
