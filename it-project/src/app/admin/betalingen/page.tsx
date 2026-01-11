// "use client";

import React from 'react';
import { ExternalLink, ShieldCheck, Zap, Crown, Info, Building2 } from 'lucide-react';
// We behouden de prisma import voor het geval je later weer data wilt koppelen, 
// hoewel we nu primair naar Clerk verwijzen voor het beheer.
import { prisma } from "@/lib/db";
import Link from 'next/link';

export default async function BetalingenPage() {
  // De link naar het specifieke Clerk Billing dashboard
  const CLERK_BILLING_URL = "https://dashboard.clerk.com/apps/app_36hmc7NNgugAxckJ0LQEj9Xt9xj/instances/ins_36hmc8vQKZEdrYYMUkhUUmOLuhJ/billing/plans";

  // 1. Haal alle bedrijven op uit de database 
  const totaalBedrijven = await prisma.bedrijf.count();

  // De betalingsplannen
  const plans = [
    {
      name: "BASIC",
      key: "basic_user",
      trial: "Always free",
      monthly: "-",
      annually: "-",
      icon: <ShieldCheck className="text-blue-400" size={20} />,
      color: "border-blue-500/50"
    },
    {
      name: "STARTER",
      key: "start_user",
      trial: "7 days",
      monthly: "$59.00",
      annually: "$588.00",
      icon: <Zap className="text-purple-400" size={20} />,
      color: "border-purple-500/50"
    },
    {
      name: "PRO",
      key: "pro_user",
      trial: "7 days",
      monthly: "$200.00",
      annually: "$1,788.00",
      icon: <Crown className="text-[#ff7a2d]" size={20} />,
      color: "border-[#ff7a2d]/50"
    }
  ];

  return (
    <div className="p-8 space-y-8 bg-[#0B0F1A] min-h-screen text-white">
      {/* Titel Sectie & Clerk Link */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#1e1e1e] p-6 rounded-2xl border border-[#333] shadow-xl">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Betalingen & Abonnementen</h1>
          <p className="text-gray-500 text-sm mt-1">
            Beheer actieve abonnementen en facturatie voor de {totaalBedrijven} bedrijven via Clerk.
          </p>
        </div>

        <Link 
          href={CLERK_BILLING_URL}
          target="_blank"
          className="flex items-center gap-2 bg-[#ff7a2d] hover:bg-[#ff7a2d]/90 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-orange-500/20 group"
        >
          Beheer in Clerk Dashboard
          <ExternalLink size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </Link>
      </div>

      {/* Informatieve Sectie: Subscription Plans (gebaseerd op screenshot) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-gray-400 px-1">
          <Info size={16} />
          <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-500">Subscription plans</h2>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#333] bg-[#1e1e1e] shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-[10px] uppercase tracking-widest text-gray-500 font-bold border-b border-[#333]">
                <th className="p-5">Plan</th>
                <th className="p-5">Plan Key</th>
                <th className="p-5">Trial</th>
                <th className="p-5">Monthly</th>
                <th className="p-5">Annually</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#333]">
              {plans.map((plan) => (
                <tr key={plan.name} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-[#0B0F1A] border ${plan.color}`}>
                        {plan.icon}
                      </div>
                      <div>
                        <p className="font-bold text-gray-100">{plan.name}</p>
                        <p className="text-[10px] text-gray-500">Subscription plan</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-5 font-mono text-xs text-gray-400">{plan.key}</td>
                  <td className="p-5 text-sm text-gray-300 font-medium">{plan.trial}</td>
                  <td className="p-5 text-sm text-gray-100 font-bold">{plan.monthly}</td>
                  <td className="p-5 text-sm text-gray-100 font-bold">{plan.annually}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Info Box */}
      <div className="mt-6 p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg flex items-start gap-3">
        <Info size={16} className="text-blue-400 mt-0.5" />
        <p className="text-xs text-blue-400 italic">
          Bovenstaande tabel dient ter referentie. Voor het aanmaken van nieuwe plannen of het wijzigen van prijzen, gebruik de "Create Plan" functie binnen het Clerk Dashboard.
        </p>
      </div>
    </div>
  );
}