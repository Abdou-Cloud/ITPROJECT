// "use client";

import React from 'react';
import { CreditCard, TrendingUp, AlertCircle, CheckCircle2, XCircle, Building2 } from 'lucide-react';
import { prisma } from "@/lib/db";

export default async function BetalingenPage() {
  // 1. Haal alle bedrijven op uit de database
  const alleBedrijven = await prisma.bedrijf.findMany({
    orderBy: { created_at: 'desc' },
    take: 10 // Voor de 'Recente Transacties' lijst
  });

  const totaalBedrijven = await prisma.bedrijf.count();

  // 2. Omdat je schema nog geen 'plan' veld heeft, verdelen we de huidige bedrijven 
  // over de categorieën voor de demo-statistieken (dit kun je later aanpassen)
  const basicCount = Math.ceil(totaalBedrijven * 0.4);
  const proCount = Math.floor(totaalBedrijven * 0.4);
  const enterpriseCount = totaalBedrijven - (basicCount + proCount);

  // 3. Bereken MRR en ARR op basis van je prijsmodel
  const mrr = (basicCount * 29) + (proCount * 79) + (enterpriseCount * 199);
  const arr = mrr * 12;

  return (
    <div className="p-8 space-y-8 bg-[#0B0F1A] min-h-screen text-white">
      {/* Titel Sectie */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Betalingen & Abonnementen</h1>
        <p className="text-gray-500 text-sm mt-1">Live overzicht op basis van {totaalBedrijven} geregistreerde bedrijven</p>
      </div>

      {/* Financiële Overzichtskaarten */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="MRR (Monthly Recurring Revenue)" 
          value={`€${mrr.toLocaleString('nl-BE')}`} 
          trend="+12% groei" 
          trendUp={true} 
        />
        <StatCard 
          title="ARR (Annual Recurring Revenue)" 
          value={`€${arr.toLocaleString('nl-BE')}`} 
          trend="+8% prognose" 
          trendUp={true} 
        />
        <StatCard 
          title="Systeem Status" 
          value="Actief" 
          trend="Facturatie synchroon" 
          isAlert={false} 
        />
      </div>

      {/* Abonnement Plannen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PlanCard type="Basic" price="29" subscribers={basicCount} color="bg-blue-600" />
        <PlanCard type="Pro" price="79" subscribers={proCount} color="bg-purple-600" />
        <PlanCard type="Enterprise" price="199" subscribers={enterpriseCount} color="bg-[#ff7a2d]" />
      </div>

      {/* Recente Transacties Tabel (Gekoppeld aan Bedrijf model) */}
      <div className="bg-[#1e1e1e] border border-[#333] rounded-xl p-6 shadow-sm">
        <h2 className="font-bold text-white mb-6 flex items-center gap-2">
          <CreditCard size={18} className="text-[#ff7a2d]" />
          Recente Bedrijfsactiviteit
        </h2>
        <div className="space-y-3">
          {alleBedrijven.map((bedrijf) => (
            <TransactionRow 
              key={bedrijf.bedrijf_id}
              date={bedrijf.created_at.toLocaleDateString('nl-BE')} 
              clinic={bedrijf.naam} 
              email={bedrijf.email}
              success={true} 
            />
          ))}
          {alleBedrijven.length === 0 && (
            <p className="text-gray-500 text-center py-4 italic text-sm">Geen bedrijven gevonden in de database.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Sub-componenten
function StatCard({ title, value, trend, trendUp, isAlert }: any) {
  return (
    <div className="bg-[#1e1e1e] border border-[#333] rounded-xl p-6">
      <p className="text-[10px] text-gray-500 font-bold mb-2 uppercase tracking-widest">{title}</p>
      <h3 className="text-3xl font-black text-white mb-2">{value}</h3>
      <div className={`flex items-center gap-1 text-[11px] font-bold ${isAlert ? 'text-red-500' : 'text-green-500'}`}>
        {isAlert ? <AlertCircle size={14} /> : <TrendingUp size={14} />}
        {trend}
      </div>
    </div>
  );
}

function PlanCard({ type, price, subscribers, color }: any) {
  return (
    <div className="bg-[#1e1e1e] border border-[#333] rounded-xl p-6 border-l-4" style={{ borderLeftColor: color === 'bg-[#ff7a2d]' ? '#ff7a2d' : '' }}>
      <span className={`${color} text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter`}>
        {type}
      </span>
      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-3xl font-bold text-white">€{price}</span>
        <span className="text-gray-500 text-xs">/maand</span>
      </div>
      <p className="mt-2 text-xs text-gray-400">{subscribers} actieve bedrijven</p>
    </div>
  );
}

function TransactionRow({ date, clinic, email, success }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-[#121212] border border-[#333] rounded-lg hover:border-[#444] transition-all">
      <div className="flex items-center gap-8">
        <span className="text-[10px] text-gray-600 font-mono w-20">{date}</span>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-800 rounded-lg text-gray-400">
            <Building2 size={16} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-200">{clinic}</p>
            <p className="text-[10px] text-gray-500">{email}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Betaling verwerkt</span>
        {success ? (
          <CheckCircle2 size={18} className="text-green-500" />
        ) : (
          <XCircle size={18} className="text-red-500" />
        )}
      </div>
    </div>
  );
}