import { prisma } from "@/lib/db";
import StatCard from '@/components/admin/StatCard';
import SystemStatus from '@/components/admin/SystemStatus';

export default async function AdminDashboardPage() {
  // We initialiseren de status variabelen
  let isDbConnected = false;

  // 1. Data ophalen uit de database
  let stats = {
    bedrijven: 0,
    klanten: 0,
    afspraken: 0,
    berichten: 0
  };

  try {
    // We halen data op. Als dit lukt, werkt de database verbinding.
    const [bedrijven, klanten, afspraken, berichten] = await Promise.all([
      prisma.bedrijf.count(),
      prisma.klant.count(),
      prisma.afspraak.count(),
      prisma.bericht.count(),
    ]);

    stats = { bedrijven, klanten, afspraken, berichten };
    isDbConnected = true;
  } catch (error) {
    console.error("Fout bij ophalen dashboard data:", error);
    isDbConnected = false;
  }

  // Systeem is 'GEACTIVEERD' zodra de database verbinding werkt
  const isSystemActive = isDbConnected;

  return (
    <div className="p-8 space-y-8 bg-[#0B0F1A] min-h-screen text-white">
      
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard Overzicht</h1>
          <p className="text-gray-400">Live systeemstatus en database statistieken</p>
        </div>

        {/* Dynamische Status Knop - Gebaseerd op DB Connectie */}
        <div className="flex items-center gap-3 bg-[#1e1e1e] px-4 py-2 rounded-full border border-[#333]">
          <span className="text-sm font-medium text-gray-300">Systeem:</span>
          <div className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${isSystemActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className={`text-sm font-bold ${isSystemActive ? 'text-green-400' : 'text-red-400'}`}>
              {isSystemActive ? 'GEACTIVEERD' : 'OFFLINE'}
            </span>
          </div>
        </div>
      </header>
      
      {/* Statistieken Rij */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Bedrijven" 
          value={stats.bedrijven} 
          description="Geregistreerde SaaS klanten" 
          percentageChange={0} 
          icon="users"
        />
        <StatCard 
          title="Klanten" 
          value={stats.klanten} 
          description="Eindgebruikers in systeem" 
          percentageChange={0} 
          icon="user"
        />
        <StatCard 
          title="Afspraken" 
          value={stats.afspraken} 
          description="Totaal geplande sessies" 
          percentageChange={0} 
          icon="calendar"
        />
        <StatCard 
          title="Berichten" 
          value={stats.berichten} 
          description="Klant interacties" 
          percentageChange={0} 
          icon="message"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Backend Configuratie Sectie */}
        <div className="lg:col-span-2 bg-[#1e1e1e] p-6 rounded-xl border border-[#333]">
          <h2 className="text-xl font-bold mb-6">Backend Configuratie</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Database Status */}
            <div className="p-4 rounded-lg bg-[#0B0F1A] border border-[#333]">
              <p className="text-sm text-gray-400 mb-1">PostgreSQL Status</p>
              <p className={`font-mono text-sm ${isDbConnected ? 'text-green-400' : 'text-red-400'}`}>
                {isDbConnected ? '● CONNECTED TO MAIN_DB' : '○ CONNECTION_FAILED'}
              </p>
            </div>

            {/* Klantendatabase Status (Vervangt AI Engine) */}
            <div className="p-4 rounded-lg bg-[#0B0F1A] border border-[#333]">
              <p className="text-sm text-gray-400 mb-1">Data Validatie</p>
              <p className={`font-mono text-sm ${stats.bedrijven > 0 ? 'text-green-400' : 'text-orange-400'}`}>
                {stats.bedrijven > 0 ? 'RECORDS DETECTED' : 'INITIALIZING_STORAGE'}
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
            <p className="text-xs text-blue-400 italic">
              Het systeem voert elke 60 seconden een automatische health-check uit op de database tabellen.
            </p>
          </div>
        </div>
        
        {/* Rechter kolom met algemene systeem status */}
        <div className="lg:col-span-1">
          <SystemStatus />
        </div>
      </div>
    </div>
  );
}