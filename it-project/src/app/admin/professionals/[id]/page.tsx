// src/app/admin/professionals/[id]/page.tsx

'use client'; // Blijft nodig voor eventuele toekomstige hooks en state

import React from 'react';
import Link from 'next/link'; // 🚨 Gebruikt voor de vaste navigatie van de Terugknop
import { 
  ArrowLeft, // Voor de Terugknop
  ArrowUp, 
  Mail, 
  Phone, 
  Users, 
  Calendar, 
  Brain, 
  CreditCard,
  Check, 
  Clock, 
  Zap 
} from 'lucide-react';

// --- Data Structuur (Mock Data) ---
const mockProfessionalData = {
    name: 'Dr. Jan van Dam',
    clinic: 'Dental Clinic Amsterdam',
    email: 'info@dentalamsterdam.nl',
    phone: '+31 20 123 4567',
    employees: 12,
    lastActive: '15 januari 2024',
    plan: 'Enterprise',
    status: 'Actief',
    stats: [
        { value: 1247, label: 'AI Gesprekken', icon: Brain },
        { value: 892, label: 'Afspraken Gemaakt', icon: Calendar },
        { value: '71.5%', label: 'Conversie Rate', icon: ArrowUp }
    ],
    quickStats: [
        { label: 'Maandelijkse Omzet', value: '€299' },
        { label: 'Laatst Actief', value: '4-12-2024' },
        { label: 'Gemiddelde Gespreksduur', value: '2:34 min' },
        { label: 'Customer Rating', value: '4.8/5.0' }
    ],
    performance: [
        { label: 'AI Call Success Rate', value: 85, color: 'bg-blue-500' },
        { label: 'Appointment Completion', value: 92, color: 'bg-green-500' },
        { label: 'Customer Satisfaction', value: 88, color: 'bg-yellow-500' },
        { label: 'Response Time', value: 95, color: 'bg-red-500' },
    ],
    activity: [
        { type: 'Afspraak', text: 'Nieuwe afspraak gemaakt: Controle en reiniging', time: '2 uur geleden', icon: Check, color: 'text-green-500', bg: 'bg-green-500/10' },
        { type: 'Info', text: 'Tom Peters - Informatie over wortelkanaalbehandeling', time: '5 uur geleden', icon: Brain, color: 'text-blue-400', bg: 'bg-blue-400/10' },
        { type: 'Plan', text: 'Plan geüpgraded: Van Pro naar Enterprise plan', time: '1 dag geleden', icon: Calendar, color: 'text-orange-400', bg: 'bg-orange-400/10' },
        { type: 'Betaling', text: 'Betaling ontvangen: €299.00 voor Enterprise plan', time: '2 dagen geleden', icon: CreditCard, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    ]
};

// --- Hulpcomponenten ---

interface QuickStatCardProps {
    value: string | number;
    label: string;
    icon: React.ElementType; 
}

const QuickStatCard: React.FC<QuickStatCardProps> = ({ value, label, icon: IconComponent }) => (
    <div className="flex items-center p-4 rounded-xl bg-[#2c2c2c] shadow-md">
        <div className="p-3 mr-4 rounded-lg bg-[#ff7a2d]">
            <IconComponent size={24} className="text-white" />
        </div>
        <div>
            <p className="text-xl font-bold text-white">{value}</p>
            <p className="text-sm text-gray-400">{label}</p>
        </div>
    </div>
);

const PerformanceBar: React.FC<{ label: string, value: number, color: string }> = ({ label, value, color }) => (
    <div className="mb-4">
        <div className="flex justify-between items-center text-sm mb-1">
            <span className="text-gray-300">{label}</span>
            <span className="font-semibold text-white">{value}%</span>
        </div>
        <div className="w-full bg-[#333] rounded-full h-2.5">
            <div 
                className={`h-2.5 rounded-full ${color}`} 
                style={{ width: `${value}%` }}
            ></div>
        </div>
    </div>
);

const ActivityItem: React.FC<{ activity: typeof mockProfessionalData.activity[0] }> = ({ activity }) => (
    <div className="flex items-start mb-4 border-b border-[#2c2c2c] pb-3 last:border-b-0">
        <div className={`p-2 mr-4 rounded-full ${activity.bg}`}>
            <activity.icon size={20} className={activity.color} />
        </div>
        <div className="flex-grow">
            <p className="font-medium text-white">{activity.text}</p>
            <p className="text-xs text-gray-400 flex items-center">
                <Clock size={12} className="mr-1" />{activity.time}
            </p>
        </div>
    </div>
);

const AdminActionButton: React.FC<{ label: string, color: string }> = ({ label, color }) => (
    <button className={`w-full py-3 text-white font-semibold rounded-lg shadow-md transition-all duration-200 hover:opacity-90`} style={{ backgroundColor: color }}>
        {label}
    </button>
);

// --- Hoofd component voor de detailpagina ---

const ProfessionalDetailsPage: React.FC = () => {
  const data = mockProfessionalData;
  const statusClasses = data.status === 'Actief' ? 'bg-green-600' : 'bg-yellow-600';

  return (
    <div className="p-6 bg-[#0B0F1A] min-h-screen">
      
      {/* --- Hoofd Header & Terugknop Container --- */}
      <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
              
              {/* 🚨 Terugknop met VASTE navigatiepad 🚨 */}
              <Link 
                  href="/admin/professionals" // Navigeert altijd naar het overzicht
                  className="flex items-center text-gray-400 hover:text-white transition-colors mr-6 text-sm"
              >
                  <ArrowLeft size={16} className="mr-2" />
                  Terug
              </Link>
              
              {/* De Hoofd Titel */}
              <header className="flex items-baseline">
                  <h1 className="text-3xl font-bold text-white mr-4">{data.name}</h1>
                  <span className="text-lg text-gray-400">{data.clinic}</span>
              </header>
          </div>

          {/* De Status badges */}
          <div className="flex items-center space-x-3">
              <span className="text-sm font-semibold text-[#ff7a2d]">{data.plan}</span>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full text-white ${statusClasses}`}>
                  {data.status}
              </span>
          </div>
      </div>

      {/* --- Hoofd Lay-out: Grid 3 kolommen --- */}
      <div className="grid grid-cols-3 gap-6">
        
        {/* --- KOLOM 1 & 2 (8/12 breedte) --- */}
        <div className="col-span-2 space-y-6">
            
            {/* 1. Contact Informatie */}
            <div className="grid grid-cols-4 gap-4 p-6 bg-[#1e1e1e] rounded-xl border border-[#333]">
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <Mail size={18} className="text-[#ff7a2d]" />
                    <span>Email: {data.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <Phone size={18} className="text-[#ff7a2d]" />
                    <span>Telefoon: {data.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <Users size={18} className="text-[#ff7a2d]" />
                    <span>Medewerkers: {data.employees} personen</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <Zap size={18} className="text-[#ff7a2d]" />
                    <span>Laatst Actief: {data.lastActive}</span>
                </div>
            </div>
            
            {/* 2. Quick Stats (Drie Grotere Kaarten) */}
            <div className="grid grid-cols-3 gap-6">
                {data.stats.map(stat => (
                    <QuickStatCard key={stat.label} {...stat} />
                ))}
            </div>

            {/* 3. Performance Overzicht (Voortgangsbalken) */}
            <div className="p-6 bg-[#1e1e1e] rounded-xl border border-[#333]">
                <h2 className="text-xl font-semibold text-white mb-4">Performance Overzicht</h2>
                {data.performance.map(perf => (
                    <PerformanceBar key={perf.label} {...perf} />
                ))}
            </div>

            {/* 4. Recente Activiteit */}
            <div className="p-6 bg-[#1e1e1e] rounded-xl border border-[#333]">
                <h2 className="text-xl font-semibold text-white mb-4">Recente Activiteit</h2>
                <div className="space-y-4">
                    {data.activity.map((act, index) => (
                        <ActivityItem key={index} activity={act} />
                    ))}
                </div>
            </div>

        </div>

        {/* --- KOLOM 3 (4/12 breedte) --- */}
        <div className="col-span-1 space-y-6">
            
            {/* 5. Quick Stats (Kleine Lijst) */}
            <div className="p-6 bg-[#1e1e1e] rounded-xl border border-[#333]">
                <h2 className="text-xl font-semibold text-white mb-4">Quick Stats</h2>
                <div className="space-y-3">
                    {data.quickStats.map((stat) => (
                        <div key={stat.label} className="flex justify-between items-center text-sm text-gray-400">
                            <span>{stat.label}</span>
                            <span className="font-semibold text-white">{stat.value}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 6. Admin Acties */}
            <div className="p-6 bg-[#1e1e1e] rounded-xl border border-[#333]">
                <h2 className="text-xl font-semibold text-white mb-4">Admin Acties</h2>
                <div className="space-y-4">
                    <AdminActionButton label="Plan Upgraden" color="#ff7a2d" />
                    <AdminActionButton label="Wachtwoord Resetten" color="#4299e1" />
                    <AdminActionButton label="Blokkeren" color="#f6ad55" />
                    <AdminActionButton label="Account Verwijderen" color="#e53e3e" />
                </div>
            </div>
            
            {/* 7. Huidig Plan */}
            <div className="p-6 bg-[#1e1e1e] rounded-xl border border-[#333]">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-white">Huidig Plan</h2>
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#ff7a2d] text-white">{data.plan}</span>
                </div>
                <p className="text-3xl font-bold text-white mb-4">€199 /maand</p>
                <ul className="space-y-2 text-sm text-gray-400">
                    <li className="flex items-center"><Check size={16} className="mr-2 text-green-400" /> Onbeperkt AI gesprekken</li>
                    <li className="flex items-center"><Check size={16} className="mr-2 text-green-400" /> Tot 12 medewerkers</li>
                    <li className="flex items-center"><Check size={16} className="mr-2 text-green-400" /> Priority support</li>
                    <li className="flex items-center"><Check size={16} className="mr-2 text-green-400" /> Custom integraties</li>
                </ul>
            </div>

        </div>
      </div>
    </div>
  );
};

export default ProfessionalDetailsPage;