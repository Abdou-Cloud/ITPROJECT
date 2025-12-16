import React from 'react';

//  Datastructuur 
interface Customer {
  id: number;
  name: string;
  contact: string; // Email en Telefoon
  accountStatus: 'Geregistreerd' | 'Gast';
  appointments: number;
  aiInteractions: number;
  lastAppointment: string; // Datum
}

const mockData: Customer[] = [
  { id: 1, name: 'Sarah Bakker', contact: 'sarah@email.be\n+32 6 1234 5678', accountStatus: 'Geregistreerd', appointments: 8, aiInteractions: 12, lastAppointment: '1-12-2024' },
  { id: 2, name: 'Tom Peters', contact: 'tom@email.be\n+32 6 2345 6789', accountStatus: 'Gast', appointments: 3, aiInteractions: 4, lastAppointment: '28-11-2024' },
  { id: 3, name: 'Anna de Jong', contact: 'anna@email.be\n+32 6 3456 7890', accountStatus: 'Geregistreerd', appointments: 15, aiInteractions: 23, lastAppointment: '3-12-2024' },
];

//  Componenten

const getStatusClasses = (status: Customer['accountStatus']) => {
  if (status === 'Geregistreerd') return 'bg-green-600';
  return 'bg-gray-500'; // Gast status is grijs in de afbeelding
};

// Component voor één rij in de tabel
const CustomerRow: React.FC<{ customer: Customer }> = ({ customer }) => {
  const [email, phone] = customer.contact.split('\n');

  return (
    <div className="grid grid-cols-7 gap-4 items-center py-3 border-b border-[#333] hover:bg-[#2c2c2c] transition-colors">
      
      {/* Klant & Contact (Col 1) */}
      <div className="col-span-2 text-sm">
        <p className="font-semibold text-white">{customer.name}</p>
        <p className="text-xs text-gray-500">{email}</p>
        <p className="text-xs text-gray-500">{phone}</p>
      </div>
      
      {/* Account Status (Col 2) */}
      <div className="text-left">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusClasses(customer.accountStatus)}`}>
          {customer.accountStatus}
        </span>
      </div>

      {/* Afspraken (Col 3) */}
      <div className="text-center text-sm text-gray-400">{customer.appointments}</div>
      
      {/* AI Interacties (Col 4) */}
      <div className="text-center text-sm text-gray-400">{customer.aiInteractions}</div>
      
      {/* Laatste Afspraak (Col 5) */}
      <div className="text-center text-sm text-gray-400">{customer.lastAppointment}</div>
      
      {/* Acties (Col 6) */}
      <div className="text-center">
        {/* Meer opties icoon, gesimuleerd met een knop voor nu */}
        <button className="px-3 py-1 text-xs font-medium rounded-md bg-[#2c2c2c] text-white hover:bg-[#3d3d3d]">
          ...
        </button>
      </div>
    </div>
  );
};

// Hoofd Klanten Pagina Component
const KlantenPage: React.FC = () => {
  return (
    <div className="p-6">
      
      {/* Header (Titel & Beschrijving) */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Klanten Beheer</h1>
        <p className="text-gray-400">Alle eindgebruikers die afspraken maken</p>
      </div>
      
      {/* Tabel Container */}
      <div className="bg-[#1e1e1e] rounded-xl p-4 shadow-lg border border-[#333]">
        
        {/* Tabel Headers */}
        {/* De kolomverdeling is aangepast naar grid-cols-7 om de breedte van de Customer & Acties kolommen te accommoderen */}
        <div className="grid grid-cols-7 gap-4 font-semibold text-sm text-gray-400 pb-2 border-b border-[#333]">
          <div className="col-span-2">Klant</div>
          <div className="text-left">Account</div>
          <div className="text-center">Afspraken</div>
          <div className="text-center">AI Interacties</div>
          <div className="text-center">Laatste Afspraak</div>
          <div className="text-center">Acties</div>
        </div>
        
        {/* Tabel Rijen */}
        <div>
          {mockData.map(cust => (
            <CustomerRow key={cust.id} customer={cust} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default KlantenPage;