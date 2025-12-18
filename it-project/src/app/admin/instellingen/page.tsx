"use client";

import React, { useState } from 'react';
import { useUser } from "@clerk/nextjs";
import { 
  User, 
  Shield, 
  Cpu, 
  Globe, 
  Bell, 
  Save,
  CheckCircle2
} from 'lucide-react';

const SettingsPage = () => {
  const { user } = useUser();
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Systeem Instellingen</h1>
          <p className="text-gray-400">Beheer de globale configuratie van SchedulAI</p>
        </div>
        <button 
          onClick={handleSave}
          className="bg-[#ff7a2d] hover:bg-[#e56a25] text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-all"
        >
          {isSaved ? <CheckCircle2 size={18} /> : <Save size={18} />}
          {isSaved ? "Opgeslagen" : "Wijzigingen opslaan"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 1. Admin Profiel (Gekoppeld aan Clerk) */}
        <div className="bg-[#1e1e1e] border border-[#333] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <User className="text-[#ff7a2d]" size={20} />
            <h2 className="text-lg font-semibold text-white">Admin Profiel</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/5">
              <img 
                src={user?.imageUrl} 
                alt="Profile" 
                className="w-12 h-12 rounded-full border-2 border-[#ff7a2d]"
              />
              <div>
                <p className="text-white font-medium">{user?.fullName || "Admin"}</p>
                <p className="text-sm text-gray-400">{user?.primaryEmailAddress?.emailAddress}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 italic">
              Profielgegevens worden beheerd via Clerk Auth.
            </p>
          </div>
        </div>

        {/* 2. AI Systeem Status */}
        <div className="bg-[#1e1e1e] border border-[#333] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Cpu className="text-[#ff7a2d]" size={20} />
            <h2 className="text-lg font-semibold text-white">AI Engine Configuuratie</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Globaal AI Status</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ff7a2d]"></div>
              </label>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Default Model</label>
              <select className="w-full bg-[#0b0e14] border border-[#333] text-white rounded-lg p-2 focus:outline-none focus:border-[#ff7a2d]">
                <option>GPT-4o (Aanbevolen)</option>
                <option>GPT-3.5 Turbo</option>
                <option>Claude 3.5 Sonnet</option>
              </select>
            </div>
          </div>
        </div>

        {/* 3. Platform Instellingen */}
        <div className="bg-[#1e1e1e] border border-[#333] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="text-[#ff7a2d]" size={20} />
            <h2 className="text-lg font-semibold text-white">Platform Details</h2>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Platform Naam</label>
              <input 
                type="text" 
                defaultValue="SchedulAI"
                className="w-full bg-[#0b0e14] border border-[#333] text-white rounded-lg p-2 focus:outline-none focus:border-[#ff7a2d]" 
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Onderhoudsmodus</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
              </label>
            </div>
          </div>
        </div>

        {/* 4. Beveiliging & Meldingen */}
        <div className="bg-[#1e1e1e] border border-[#333] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="text-[#ff7a2d]" size={20} />
            <h2 className="text-lg font-semibold text-white">Admin Beveiliging</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center gap-3">
                <Bell size={18} className="text-gray-400" />
                <span className="text-sm text-gray-200">Email bij nieuwe registraties</span>
              </div>
              <input type="checkbox" defaultChecked className="accent-[#ff7a2d]" />
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center gap-3">
                <Shield size={18} className="text-gray-400" />
                <span className="text-sm text-gray-200">2FA Verplichten voor admins</span>
              </div>
              <input type="checkbox" className="accent-[#ff7a2d]" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SettingsPage;