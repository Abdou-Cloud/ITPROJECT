import StatCard from "@/components/admin/StatCard";
import RevenueChart from "@/components/admin/RevenueChart";
import SystemStatus from "@/components/admin/SystemStatus";
import RecentInteractions from "@/components/admin/RecentInteractions";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Dashboard Overzicht</h2>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Professionals" value="3" delta="+12%" />
        <StatCard title="Klanten" value="3" delta="+8%" />
        <StatCard title="Afspraken Vandaag" value="2" delta="+5%" />
        <StatCard title="AI Gesprekken" value="1946" delta="+15%" />
      </div>

      {/* Charts + status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RevenueChart />
        <SystemStatus />
      </div>

      <RecentInteractions />
    </div>
  );
}
