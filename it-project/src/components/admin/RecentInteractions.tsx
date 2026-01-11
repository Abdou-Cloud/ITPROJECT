// src/components/admin/RecentInteractions.tsx

import React from 'react';

// Interface voor de data van één interactie
interface Interaction {
  id: number;
  date: string; // Bijv. "2024-12-04"
  time: string; // Bijv. "14:23"
  name: string;
  detail: string; // Bijv. "Dental Clinic Amsterdam"
  duration: string; // Bijv. "2:34"
  tokens: number;
  status: 'Afspraak' | 'Info' | 'Mislukt';
}



const getStatusColor = (status: Interaction['status']) => {
  switch (status) {
    case 'Afspraak':
      return 'bg-green-600';
    case 'Info':
      return 'bg-blue-600';
    case 'Mislukt':
      return 'bg-red-600';
    default:
      return 'bg-gray-500';
  }
};

// Component voor één rij interactie
const InteractionRow: React.FC<{ interaction: Interaction }> = ({ interaction }) => {
  return (
    <div className="flex justify-between items-center py-3 border-b border-[#333] last:border-b-0">
      
      {/* Kolom 1: Datum & Tijd (Links) */}
      <div className="flex-shrink-0 w-36 text-sm text-gray-400">
        <span className="font-semibold">{interaction.date}</span>
        <span className="ml-2">{interaction.time}</span>
      </div>

      {/* Kolom 2: Naam & Detail (Midden) */}
      <div className="flex-grow min-w-0 pr-4">
        <p className="text-white font-medium truncate">{interaction.name}</p>
        <p className="text-xs text-gray-500 truncate">{interaction.detail}</p>
      </div>

      {/* Kolom 3: Duur, Tokens & Status (Rechts) */}
      <div className="flex items-center space-x-4 text-sm text-gray-400 flex-shrink-0">
        
        {/* Duur */}
        <span className="text-xs font-mono w-10 text-right">{interaction.duration}</span>
        
        {/* Tokens */}
        <span className="text-xs font-mono w-12 text-right">{interaction.tokens}</span>
        
        {/* Status Badge */}
        <span 
          className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(interaction.status)} w-auto text-center`}
        >
          {interaction.status}
        </span>
      </div>
    </div>
  );
};

const RecentInteractions: React.FC = () => {
  return (
    <div className="bg-[#1e1e1e] p-6 rounded-xl shadow-lg border border-[#333]">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
        Laatste AI Interacties
      </h2>

      
    </div>
  );
};

export default RecentInteractions;