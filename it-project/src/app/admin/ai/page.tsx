"use client";

import React from 'react';
import { Settings, Cpu } from 'lucide-react';
// import AiLogsTable from '@/components/admin/AiLogsTable';

export default function AiManagementPage() {
  return (
    <div className="p-8 space-y-8">
      {/* Header  */}
      <div>
        <h1 className="text-2xl font-semibold text-white">AI Management</h1>
        <p className="text-gray-500 text-sm">Configureer AI instellingen voor het platform</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Globale Instellingen */}
        <div className="bg-[#0f1219] border border-gray-800/50 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-8">
            <Settings className="text-orange-500" size={20} />
            <h2 className="font-medium text-white">AI Instellingen</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-xs text-gray-500 mb-2 uppercase tracking-wider font-semibold">AI Model</label>
              <select className="w-full bg-[#161b22] border border-gray-700 rounded-lg p-2.5 text-gray-300 focus:outline-none focus:border-orange-500 transition-colors">
                <option>GPT-4o (Aanbevolen)</option>
                <option>GPT-4 Turbo</option>
                <option>GPT-3.5 Turbo</option>
                <option>Gemini</option>
              </select>
            </div>

{/*            <div>
              <label className="block text-xs text-gray-500 mb-2 uppercase tracking-wider font-semibold">Max Tokens per Gesprek</label>
              <input 
                type="number" 
                defaultValue="2000"
                className="w-full bg-[#161b22] border border-gray-700 rounded-lg p-2.5 text-gray-300 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>*/}
          </div>
        </div>

        {/* Standaard System Prompt */}
        <div className="bg-[#0f1219] border border-gray-800/50 rounded-xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-8">
            <Cpu className="text-orange-500" size={20} />
            <h2 className="font-medium text-white">Standaard System Prompt</h2>
          </div>
          <textarea 
            className="flex-1 min-h-[180px] w-full bg-[#161b22] border border-gray-800 rounded-lg p-4 text-sm text-gray-400 focus:outline-none focus:border-orange-500 transition-colors resize-none leading-relaxed"
            placeholder="Voer de instructies voor de AI hier in..."
          />
          <div className="mt-4">
            <button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5 px-8 rounded-lg transition-all active:scale-95 shadow-lg shadow-orange-900/20">
              Opslaan
            </button>
          </div>
        </div>
      </div>

      {/* Logs Sectie 
      <div className="bg-[#0f1219] border border-gray-800/50 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-4 bg-orange-500 rounded-full"></div>
          <h2 className="font-medium text-white">Alle AI Logs</h2>
        </div>
        <AiLogsTable />
      </div>*/}
    </div>
  );
}
