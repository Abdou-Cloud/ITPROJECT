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

const mockInteractions: Interaction[] = [
  { id: 1, date: "2024-12-04", time: "14:23", name: "Sarah Bakker", detail: "Dental Clinic Amsterdam", duration: "2:34", tokens: 1247, status: 'Afspraak' },
  { id: 2, date: "2024-12-04", time: "13:45", name: "Tom Peters", detail: "Tandarts De Vries", duration: "1:52", tokens: 892, status: 'Afspraak' },
  { id: 3, date: "2024-12-04", time: "12:30", name: "Anna de Jong", detail: "Rotterdam Dental Care", duration: "0:45", tokens: 421, status: 'Info' },
  { id: 4, date: "2024-12-04", time: "11:15", name: "Unknown", detail: "Dental Clinic Amsterdam", duration: "0:22", tokens: 159, status: 'Mislukt' },
];

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
      
      {/* Mapping van de mock data naar rijen */}
      <div>
        {mockInteractions.map(interaction => (
          <InteractionRow key={interaction.id} interaction={interaction} />
        ))}
      </div>
      
    </div>
  );
};

export default RecentInteractions;