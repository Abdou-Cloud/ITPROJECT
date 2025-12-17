"use client";

import React from 'react';
import { CreditCard, TrendingUp, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

export default function BetalingenPage() {
  return (
    <div className="p-8 space-y-8">
      {/* Titel Sectie */}
      <div>
        <h1 className="text-2xl font-semibold text-white">Betalingen & Abonnementen</h1>
        <p className="text-gray-500 text-sm">Beheer alle betalingen en plannen</p>
      </div>

      {/* Financiële Overzichtskaarten */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="MRR (Monthly Recurring Revenue)" 
          value="€1,343" 
          trend="+12% vs vorige maand" 
          trendUp={true} 
        />
        <StatCard 
          title="ARR (Annual Recurring Revenue)" 
          value="€16,116" 
          trend="+8% vs vorig jaar" 
          trendUp={true} 
        />
        <StatCard 
          title="Mislukte Betalingen" 
          value="2" 
          trend="Actie vereist" 
          isAlert={true} 
        />
      </div>

      {/* Abonnement Plannen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PlanCard type="Basic" price="29" subscribers="1" color="bg-blue-600" />
        <PlanCard type="Pro" price="79" subscribers="3" color="bg-purple-600" />
        <PlanCard type="Enterprise" price="199" subscribers="2" color="bg-orange-600" />
      </div>

      {/* Recente Transacties Tabel */}
      <div className="bg-[#0f1219] border border-gray-800/50 rounded-xl p-6">
        <h2 className="font-medium text-white mb-6">Recente Transacties</h2>
        <div className="space-y-3">
          <TransactionRow 
            date="2024-12-04" 
            clinic="Dental Clinic Amsterdam" 
            plan="Enterprise Plan" 
            amount="199" 
            success={true} 
          />
          <TransactionRow 
            date="2024-12-03" 
            clinic="Tandarts De Vries" 
            plan="Pro Plan" 
            amount="79" 
            success={true} 
          />
          <TransactionRow 
            date="2024-12-02" 
            clinic="Rotterdam Dental Care" 
            plan="Basic Plan" 
            amount="29" 
            success={false} 
          />
        </div>
      </div>
    </div>
  );
}

// Sub-componenten specifiek voor deze pagina
function StatCard({ title, value, trend, trendUp, isAlert }: any) {
  return (
    <div className="bg-[#0f1219] border border-gray-800/50 rounded-xl p-6">
      <p className="text-xs text-gray-500 font-medium mb-2 uppercase tracking-wider">{title}</p>
      <h3 className="text-3xl font-bold text-white mb-2">{value}</h3>
      <div className={`flex items-center gap-1 text-xs font-medium ${isAlert ? 'text-red-500' : 'text-green-500'}`}>
        {isAlert ? <AlertCircle size={14} /> : <TrendingUp size={14} />}
        {trend}
      </div>
    </div>
  );
}

function PlanCard({ type, price, subscribers, color }: any) {
  return (
    <div className="bg-[#0f1219] border border-gray-800/50 rounded-xl p-6">
      <span className={`${color} text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider`}>
        {type}
      </span>
      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-3xl font-bold text-white">€{price}</span>
        <span className="text-gray-500 text-sm">/maand</span>
      </div>
      <p className="mt-2 text-xs text-gray-400">{subscribers} actieve abonnees</p>
    </div>
  );
}

function TransactionRow({ date, clinic, plan, amount, success }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-[#161b22]/30 border border-gray-800/40 rounded-lg">
      <div className="flex items-center gap-8">
        <span className="text-xs text-gray-500 font-mono w-24">{date}</span>
        <div>
          <p className="text-sm font-medium text-gray-200">{clinic}</p>
          <p className="text-[11px] text-gray-500">{plan}</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <span className="text-sm font-semibold text-white">€{amount}</span>
        {success ? (
          <CheckCircle2 size={20} className="text-green-500" />
        ) : (
          <XCircle size={20} className="text-red-500" />
        )}
      </div>
    </div>
  );
}