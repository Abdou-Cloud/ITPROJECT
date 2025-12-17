// src/app/admin/afspraken/page.tsx

import React from 'react';
import { MoreVertical } from 'lucide-react';

// --- Datastructuur ---
interface Appointment {
  id: number;
  professional: string; // Naam van de Kliniek/Professional
  client: string; // Naam van de Klant
  dateTime: string; // Datum en Tijd, opgemaakt als "DD-MM-YYYY\nHH:MM"
  status: 'Bevestigd' | 'Voltooid' | 'No-show';
  source: 'Voice' | 'Web' | 'Handmatig';
}

const mockData: Appointment[] = [
  { id: 1, professional: 'Dental Clinic Amsterdam', client: 'Sarah Bakker', dateTime: '5-12-2024\n10:00', status: 'Bevestigd', source: 'Voice' },
  { id: 2, professional: 'Tandarts De Vries', client: 'Tom Peters', dateTime: '5-12-2024\n14:30', status: 'Bevestigd', source: 'Web' },
  { id: 3, professional: 'Rotterdam Dental Care', client: 'Anna de Jong', dateTime: '4-12-2024\n09:00', status: 'Voltooid', source: 'Voice' },
  { id: 4, professional: 'Dental Clinic Amsterdam', client: 'Lisa van Dijk', dateTime: '3-12-2024\n11:00', status: 'No-show', source: 'Voice' },
];

// --- Hulpfuncties ---

const getStatusClasses = (status: Appointment['status']) => {
  switch (status) {
    case 'Bevestigd':
      return 'bg-green-600';
    case 'Voltooid':
      return 'bg-blue-600'; // Blauw in de afbeelding
    case 'No-show':
      return 'bg-gray-500'; // Grijs in de afbeelding
    default:
      return 'bg-gray-500';
  }
};

const getSourceClasses = (source: Appointment['source']) => {
  if (source === 'Voice') return 'bg-orange-600';
  if (source === 'Web') return 'bg-purple-600';
  return 'bg-gray-600';
};

// --- Componenten ---

// Component voor één rij in de tabel
const AppointmentRow: React.FC<{ appointment: Appointment }> = ({ appointment }) => {
  const [date, time] = appointment.dateTime.split('\n');

  return (
    // De kolomverdeling is grid-cols-7
    <div className="grid grid-cols-7 gap-4 items-center py-3 px-1 border-b border-[#333] hover:bg-[#2c2c2c] transition-colors">
      
      {/* Kolom 1: ID */}
      <div className="text-sm font-semibold text-gray-500">#{appointment.id}</div>
      
      {/* Kolom 2: Professional (Klinieknaam) */}
      <div className="text-sm font-semibold text-white">{appointment.professional}</div>

      {/* Kolom 3: Klant */}
      <div className="text-sm text-gray-400">{appointment.client}</div>

      {/* Kolom 4: Datum & Tijd */}
      <div className="text-center text-sm">
        <p className="font-semibold text-white">{date}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>

      {/* Kolom 5: Status */}
      <div className="text-center">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusClasses(appointment.status)}`}>
          {appointment.status}
        </span>
      </div>
      
      {/* Kolom 6: Bron */}
      <div className="text-center">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getSourceClasses(appointment.source)}`}>
          {appointment.source}
        </span>
      </div>
      
      {/* Kolom 7: Acties */}
      <div className="text-center">
        {/* Drie puntjes icoon */}
        <button className="p-1 text-gray-400 hover:text-white rounded-full transition-colors">
          <MoreVertical size={18} />
        </button>
      </div>
    </div>
  );
};

// Hoofd Afspraken Pagina Component
const AfsprakenPage: React.FC = () => {
  return (
    <div className="p-6"> 
      
      {/* Header (Titel) */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Afspraken Beheer</h1>
        <p className="text-gray-400">Alle afspraken in het systeem</p>
      </div>
      
      {/* Tabel Container */}
      <div className="bg-[#1e1e1e] rounded-xl p-4 shadow-lg border border-[#333]">
        
        {/* Tabel Headers (grid-cols-7) */}
        <div className="grid grid-cols-7 gap-4 font-semibold text-sm text-gray-400 pb-2 border-b border-[#333] px-1">
          <div className="col-span-1">ID</div>
          <div className="col-span-1">Professional</div>
          <div className="col-span-1">Klant</div>
          <div className="col-span-1 text-center">Datum & Tijd</div>
          <div className="col-span-1 text-center">Status</div>
          <div className="col-span-1 text-center">Bron</div>
          <div className="col-span-1 text-center">Acties</div>
        </div>
        
        {/* Tabel Rijen */}
        <div>
          {mockData.map(appt => (
            <AppointmentRow key={appt.id} appointment={appt} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AfsprakenPage;