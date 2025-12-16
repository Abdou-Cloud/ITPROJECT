import StatCard from '@/components/admin/StatCard';
import RevenueChart from '@/components/admin/RevenueChart';
import SystemStatus from '@/components/admin/SystemStatus';
// We nemen aan dat RecentInteractions.tsx ook bestaat, maar maken deze nu leeg
import RecentInteractions from '@/components/admin/RecentInteractions'; 

const AdminDashboardPage: React.FC = () => {
  return (
    <div className="p-8 space-y-8 bg-[#121212] min-h-screen text-white">
      
      {/* Dashboard Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-white">Dashboard Overzicht</h1>
        <p className="text-gray-400">Complete status van je SaaS platform</p>
      </header>
      
      {/* 1. Stat Cards (Bovenste rij) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Professionals" 
          value={3} 
          description="2 actief" 
          percentageChange={12} 
          icon="users"
        />
        <StatCard 
          title="Klanten" 
          value={3} 
          description="Totaal geregistreerd" 
          percentageChange={8} 
          icon="user"
        />
        <StatCard 
          title="Afspraken Vandaag" 
          value={2} 
          description="Bevestigd" 
          percentageChange={5} 
          icon="calendar"
        />
        <StatCard 
          title="AI Gesprekken" 
          value={1946} 
          description="70.1% conversie" 
          percentageChange={15} 
          icon="message"
        />
      </div>

      {/* 2. Charts & Status (Middelste rij) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart - 2/3 breedte */}
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        
        {/* System Status - 1/3 breedte */}
        <div className="lg:col-span-1">
          <SystemStatus />
        </div>
      </div>

      {/* 3. Recent Interactions (Onderste rij) */}
      <div>
        <RecentInteractions />
      </div>
      
    </div>
  );
};

export default AdminDashboardPage;