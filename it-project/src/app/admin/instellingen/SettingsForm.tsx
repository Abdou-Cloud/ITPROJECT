"use client";

import React, { useState } from 'react';
import { User, Shield, Cpu, Globe, Bell, Save, CheckCircle2, Building } from 'lucide-react';

export default function SettingsForm({ clerkData, dbData, activeModel }: any) {
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto bg-[#0B0F1A] min-h-screen text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Systeem Instellingen</h1>
          <p className="text-gray-500 text-sm">Beheer de configuratie op basis van je database profiel</p>
        </div>
        <button 
          onClick={handleSave}
          className="bg-[#ff7a2d] hover:bg-[#e56a25] text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all"
        >
          {isSaved ? <CheckCircle2 size={18} /> : <Save size={18} />}
          {isSaved ? "Opgeslagen" : "Wijzigingen opslaan"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Admin Sectie - Gebruikt database velden uit Admin model */}
        <div className="bg-[#1e1e1e] border border-[#333] rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <User className="text-[#ff7a2d]" size={20} />
            <h2 className="text-lg font-semibold">Admin Profiel</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-[#121212] rounded-lg border border-[#333]">
              <img src={clerkData.imageUrl} alt="Avatar" className="w-14 h-14 rounded-full border-2 border-[#ff7a2d]" />
              <div>
                <p className="font-bold text-gray-100">
                  {dbData.voornaam ? `${dbData.voornaam} ${dbData.naam}` : clerkData.fullName}
                </p>
                <p className="text-xs text-gray-500">{dbData.email || clerkData.email}</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Gekoppeld Bedrijf</label>
                <div className="mt-1 flex items-center gap-2 text-sm text-gray-300 bg-[#121212] p-2 rounded border border-[#333]">
                  <Building size={14} className="text-gray-600" />
                  {dbData.bedrijfNaam || "Geen bedrijf gekoppeld"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Sectie - Gebruikt LLMProfiel model */}
        <div className="bg-[#1e1e1e] border border-[#333] rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Cpu className="text-[#ff7a2d]" size={20} />
            <h2 className="text-lg font-semibold">AI Configuratie</h2>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-[#121212] rounded-lg border border-[#333] flex justify-between items-center">
              <span className="text-sm text-gray-400">Actief Systeem Model</span>
              <span className="text-xs font-mono font-bold text-[#ff7a2d]">{activeModel || "Geen model gevonden"}</span>
            </div>
            <p className="text-[10px] text-gray-600 italic">
              Dit model wordt gebruikt voor alle globale assistent-interacties.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}