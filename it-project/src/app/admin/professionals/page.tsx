// src/app/admin/professionals/page.tsx

import React from 'react';
import Link from 'next/link'; // Noodzakelijk voor de "Details" knoppen
import { Plus } from 'lucide-react';

// --- Datastructuur ---
interface Professional {
  id: number;
  name: string;
  contact: string; // Opgemaakt als "Klinieknaam\nemail@adres.nl"
  plan: 'Enterprise' | 'Pro' | 'Basic';
  status: 'Actief' | 'In afwachting';
  aiCalls: number;
  appointments: number;
  conversion: number; // percentage
  revenue: number; // in Euros
}

const mockData: Professional[] = [
  { id: 1, name: 'Dr. Jan van Dam', contact: 'Dental Clinic Amsterdam\ninfo@dentalamsterdam.nl', plan: 'Enterprise', status: 'Actief', aiCalls: 1247, appointments: 892, conversion: 71.5, revenue: 29 },
  { id: 2, name: 'Dr. Lisa de Vries', contact: 'Tandarts De Vries\ncontact@devries.nl', plan: 'Pro', status: 'Actief', aiCalls: 543, appointments: 412, conversion: 75.9, revenue: 14 },
  { id: 3, name: 'Dr. Mark Jansen', contact: 'Rotterdam Dental Care\ninfo@rdcare.nl', plan: 'Basic', status: 'In afwachting', aiCalls: 156, appointments: 98, conversion: 62.8, revenue: 4 },
];

// --- Hulpfuncties ---

const getStatusClasses = (status: Professional['status']) => {
  if (status === 'Actief') return 'bg-green-600';
  return 'bg-yellow-600'; 
};

const getPlanClasses = (plan: Professional['plan']) => {
    switch (plan) {
        case 'Enterprise':
            return 'bg-[#2c2c2c] text-[#ff7a2d]';
        case 'Pro':
            return 'bg-[#2c2c2c] text-purple-400';
        case 'Basic':
            return 'bg-[#2c2c2c] text-blue-400';
        default:
            return 'bg-[#2c2c2c] text-gray-400';
    }
}

// --- Componenten ---

// Component voor één rij in de tabel
const ProfessionalRow: React.FC<{ professional: Professional }> = ({ professional }) => {
  const [clinicName, email] = professional.contact.split('\n');

  return (
    <div className="grid grid-cols-9 gap-4 items-center py-3 px-1 border-b border-[#333] hover:bg-[#2c2c2c] transition-colors">
      
      {/* Kolom 1: Professional & Contact (Col span 2) */}
      <div className="col-span-2 text-sm">
        <p className="font-semibold text-white">{professional.name}</p>
        <p className="text-xs text-gray-500">{clinicName}</p>
        <p className="text-xs text-gray-500">{email}</p>
      </div>
      
      {/* Kolom 2: Plan */}
      <div className="text-center">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPlanClasses(professional.plan)}`}>
          {professional.plan}
        </span>
      </div>

      {/* Kolom 3: Status */}
      <div className="text-center">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusClasses(professional.status)}`}>
          {professional.status}
        </span>
      </div>

      {/* Kolom 4: AI Calls */}
      <div className="text-center text-sm text-gray-400">{professional.aiCalls.toLocaleString('nl-NL')}</div>
      
      {/* Kolom 5: Afspraken */}
      <div className="text-center text-sm text-gray-400">{professional.appointments.toLocaleString('nl-NL')}</div>
      
      {/* Kolom 6: Conversie */}
      <div className={`text-center font-semibold text-sm ${professional.conversion > 70 ? 'text-green-400' : 'text-yellow-400'}`}>
        {professional.conversion.toFixed(1)} %
      </div>
      
      {/* Kolom 7: Omzet */}
      <div className="text-center font-semibold text-sm text-gray-400">€{professional.revenue}</div>
      
      {/* Kolom 8: Acties (Gebruikt Link voor navigatie) */}
      <div className="text-center">
        <Link 
          href={`/admin/professionals/${professional.id}`} // Dynamische link naar detailpagina
          className="px-3 py-1 text-xs font-medium rounded-md bg-[#2c2c2c] text-white hover:bg-[#3d3d3d] inline-block"
        >
          Details
        </Link>
      </div>
    </div>
  );
};

// Hoofd Professionals Pagina Component
const ProfessionalsPage: React.FC = () => {
  return (
    <div className="p-6"> 
      
      {/* Header (Titel & Knop) */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Professionals Beheer</h1>
          <p className="text-gray-400">Alle tandartsen en klinieken</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-[#ff7a2d] text-white font-semibold rounded-lg shadow-lg hover:bg-[#e66c25] transition-colors">
          <Plus size={20} className="mr-2" />
          Nieuwe Professional
        </button>
      </div>
      
      {/* Tabel Container */}
      <div className="bg-[#1e1e1e] rounded-xl p-4 shadow-lg border border-[#333]">
        
        {/* Tabel Headers (grid-cols-9) */}
        <div className="grid grid-cols-9 gap-4 font-semibold text-sm text-gray-400 pb-2 border-b border-[#333] px-1">
          <div className="col-span-2">Professional</div>
          <div className="text-center">Plan</div>
          <div className="text-center">Status</div>
          <div className="text-center">AI Calls</div>
          <div className="text-center">Afspraken</div>
          <div className="text-center">Conversie</div>
          <div className="text-center">Omzet</div>
          <div className="text-center">Acties</div>
        </div>
        
        {/* Tabel Rijen */}
        <div>
          {mockData.map(prof => (
            <ProfessionalRow key={prof.id} professional={prof} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalsPage;