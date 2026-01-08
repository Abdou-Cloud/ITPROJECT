"use client";

import React, { useState } from 'react';
import { User, Cpu, Save, CheckCircle2 } from 'lucide-react';

export default function SettingsForm({ clerkData, activeModel }: any) {
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
          <p className="text-gray-500 text-sm">Beheer de globale configuratie en je account</p>
       </div> 
       
       {/*  <button  // Voor als ik ooit aanpassingen kan beheren
          onClick={handleSave}
          className="bg-[#ff7a2d] hover:bg-[#e56a25] text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all"
        >
          {isSaved ? <CheckCircle2 size={18} /> : <Save size={18} />}
          {isSaved ? "Opgeslagen" : "Wijzigingen opslaan"}
        </button>
      </div> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Account Sectie - Enkel Clerk gegevens */}
        <div className="bg-[#1e1e1e] border border-[#333] rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <User className="text-[#ff7a2d]" size={20} />
            <h2 className="text-lg font-semibold">Mijn Profiel</h2>
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-[#121212] rounded-lg border border-[#333]">
            <img src={clerkData.imageUrl} alt="Avatar" className="w-14 h-14 rounded-full border-2 border-[#ff7a2d]" />
            <div>
              <p className="font-bold text-gray-100">{clerkData.fullName}</p>
              <p className="text-xs text-gray-500">{clerkData.email}</p>
            </div>
          </div>
          <p className="text-[10px] text-gray-500 mt-4 italic">
            Accountgegevens worden beheerd via Clerk Authentication.
          </p>
        </div>

        {/* AI Sectie - Gebruikt LLMProfiel model uit DB */}
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