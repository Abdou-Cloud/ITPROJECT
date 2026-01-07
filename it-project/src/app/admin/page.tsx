import { prisma } from "@/lib/db";
import StatCard from '@/components/admin/StatCard';
// import RevenueChart from '@/components/admin/RevenueChart';
// import RecentInteractions from '@/components/admin/RecentInteractions'; 
import SystemStatus from '@/components/admin/SystemStatus';



export default async function AdminDashboardPage() {
  // We initialiseren de status variabelen
  let isDbConnected = false;
  let hasAiProfiles = false;

  // 1. Data ophalen uit de database
  // We gebruiken een try-catch om te voorkomen dat de hele pagina crasht bij DB problemen
let stats = {
    bedrijven: 0,
    klanten: 0,
    afspraken: 0,
    berichten: 0
  };

  try {
    const [bedrijven, klanten, afspraken, berichten, aiProfiles] = await Promise.all([
      prisma.bedrijf.count(),
      prisma.klant.count(),
      prisma.afspraak.count(),
      prisma.bericht.count(),
      prisma.lLMProfiel.count(),
    ]);
    stats = { bedrijven, klanten, afspraken, berichten };
    isDbConnected = true;
    hasAiProfiles = aiProfiles > 0;
  } catch (error) {
    console.error("Fout bij ophalen dashboard data:", error);
    isDbConnected = false;
  }

  // Systeem is 'Actief' als de DB verbonden is en er minstens 1 AI profiel is
  const isSystemActive = isDbConnected && hasAiProfiles;

return (
    <div className="p-8 space-y-8 bg-[#0B0F1A] min-h-screen text-white">
      
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard Overzicht</h1>
          <p className="text-gray-400">Live systeemstatus en database statistieken</p>
        </div>

        {/* Dynamische Status Knop */}
        <div className="flex items-center gap-3 bg-[#1e1e1e] px-4 py-2 rounded-full border border-[#333]">
          <span className="text-sm font-medium text-gray-300">Status:</span>
          <div className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${isSystemActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className={`text-sm font-bold ${isSystemActive ? 'text-green-400' : 'text-red-400'}`}>
              {isSystemActive ? 'GEACTIVEERD' : 'OFFLINE'}
            </span>
          </div>
        </div>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Bedrijven" 
          value={stats.bedrijven} 
          description="SaaS Klanten" 
          percentageChange={0} 
          icon="users"
        />
        <StatCard 
          title="Klanten" 
          value={stats.klanten} 
          description="Eindgebruikers" 
          percentageChange={0} 
          icon="user"
        />
        <StatCard 
          title="Afspraken" 
          value={stats.afspraken} 
          description="Totaal gepland" 
          percentageChange={0} 
          icon="calendar"
        />
        <StatCard 
          title="Interacties" 
          value={stats.berichten} 
          description="AI Gesprekken" 
          percentageChange={0} 
          icon="message"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Systeem Details Sectie */}
        <div className="lg:col-span-2 bg-[#1e1e1e] p-6 rounded-xl border border-[#333]">
          <h2 className="text-xl font-bold mb-6">Backend Configuratie</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-[#0B0F1A] border border-[#333]">
              <p className="text-sm text-gray-400 mb-1">Database Connectie</p>
              <p className={`font-mono text-sm ${isDbConnected ? 'text-green-400' : 'text-red-400'}`}>
                {isDbConnected ? 'CONNECTED TO POSTGRESQL' : 'CONNECTION ERROR'}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-[#0B0F1A] border border-[#333]">
              <p className="text-sm text-gray-400 mb-1">AI Engine (LLM Profiles)</p>
              <p className={`font-mono text-sm ${hasAiProfiles ? 'text-green-400' : 'text-orange-400'}`}>
                {hasAiProfiles ? 'AI PROFILES READY' : 'NO PROFILES FOUND'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <SystemStatus />
        </div>
      </div>
    </div>
  );
}

      {/* 2. Charts & Status (Middelste rij) */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"> */}
        {/* Revenue Chart - 2/3 breedte */}
        {/* <div className="lg:col-span-2">
          <RevenueChart />
        </div>*/}
        
        {/* System Status - 1/3 breedte */}
        {/* <div className="lg:col-span-1">
          <SystemStatus />
        </div>
      </div>*/}

      {/* 3. Recent Interactions (Onderste rij) */}
      {/* <div>
        <RecentInteractions />
      </div>  */}
      


// export default AdminDashboardPage;