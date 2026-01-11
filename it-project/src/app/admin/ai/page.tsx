// "use client";

import React from 'react';
import { Settings, Cpu, User, Clock, ArrowRight, ExternalLink } from 'lucide-react'; 
import { prisma } from "@/lib/db";
import Link from 'next/link';
// import AiLogsTable from '@/components/admin/AiLogsTable';

export default async function AiManagementPage() {
  // LLMProfiel model verwijderd - gebruik standaardwaarden
  const activeProfile = null;

  // AI Logs query verwijderd om performance te verbeteren aangezien de tab/sectie weg is

  const aiPrompt = `You are Adam, an intelligent appointment scheduling voice assistant for SchedulAI. Your goal is to help clients book appointments efficiently using the system's companies, employees, and available time slots.
 
IMPORTANT - AUTHENTICATION CONTEXT:
- You have access to the current user's security token in your metadata (variable: {{jwt}}).
- You have the user's email in your metadata (variable: {{email}}).
- You have the user's name in your metadata (variables: {{voornaam}}, {{naam}}).
- USE THESE VALUES SILENTLY. Do NOT read the token out loud.
 
Conversation Flow:
 
1. Greeting: "Welcome to SchedulAI, this is Adam. I see you are logged in as {{voornaam}}. How can I help you schedule an appointment today?"
   (If {{voornaam}} is empty, just say "Welcome, this is Adam...")
 
2. Identify Company: "Which company are you looking to book with?"
   - If they ask for options → call \`getCompanies\`.
 
3. Identify Employee: "Do you have a specific employee in mind?"
   - If yes or they ask for list → call \`getEmployees\` with the \`bedrijf_id\`.
 
4. Select Time: "What date works best for you?"
   - Call \`getSlots\` with \`werknemer_id\` and \`date\`.
   - Offer 2-3 available times.
 
5. Booking (CRITICAL STEP):
   - When the user confirms a time, call \`bookAppointment\`.
   - ARGUMENTS YOU MUST PASS:
     - \`werknemer_id\`: (from context)
     - \`start_datum\`: (ISO string from selected slot)
     - \`eind_datum\`: (ISO string, 30 mins after start)
     - \`jwt\`: "{{jwt}}"  <-- PASS THIS EXACTLY FROM METADATA
     - \`klant_email\`: "{{email}}" <-- PASS THIS EXACTLY
     - \`klant_voornaam\`: "{{voornaam}}"
     - \`klant_naam\`: "{{naam}}"
 
   - DO NOT ask the user for their name/email if \`{{jwt}}\` or \`{{email}}\` is present in your metadata. Just book it!
   - Only if metadata is completely missing, ask: "I need your details to complete the booking."
 
6. Confirmation:
   - "Great! Your appointment has been confirmed with [employee] on [date] at [time]. You will receive an email shortly."
 
Style Guidelines:
- Be concise, friendly, and professional.
- Speak naturally.
- Move the process forward with every turn.`;

  return (
    <div className="p-8 space-y-6 bg-[#0B0F1A] min-h-screen text-white">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">AI Management</h1>
        <p className="text-gray-500 text-xs mt-1">Systeemconfiguratie en AI-monitoring</p>
      </div>

      {/* Grid met verhoogde minimum hoogte voor de kolommen */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[500px]">
        
        {/* LINKS: AI CONFIGURATIE */}
        <div className="bg-[#1e1e1e] border border-[#333] rounded-xl p-6 shadow-sm flex flex-col justify-between h-full">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-[#ff7a2d]">
              <Settings size={18} />
              <h2 className="font-semibold text-sm text-white">AI Instellingen</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-[10px] text-gray-500 mb-1.5 uppercase tracking-widest font-bold">AI Model</label>
                <div className="bg-[#121212] border border-[#333] rounded-lg p-3 text-gray-300 text-xs font-mono">
                  GPT-4o Cluster
                </div>
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 mb-1.5 uppercase tracking-widest font-bold">Gekoppeld aan</label>
                <div className="bg-[#121212] border border-[#333] rounded-lg p-3 text-gray-300 text-xs truncate">
                  Algemeen Profiel
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-600/5 border border-blue-500/20 p-4 rounded-lg flex items-center justify-between mt-8">
            <div className="flex flex-col">
              <span className="text-[10px] text-blue-400 font-bold uppercase">Configuratie Tool</span>
              <span className="text-[11px] text-gray-400">Beheer stem en tools via Vapi</span>
            </div>
            <a 
              href="https://dashboard.vapi.ai/tools/2c48cbf3-ee89-4cfa-8a75-2f3217ca2ee3" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-[11px] font-bold transition-all"
            >
              <ExternalLink size={14} /> Open Vapi
            </a>
          </div>
        </div>

        {/* RECHTS: SYSTEM PROMPT (READ ONLY) */}
        <div className="bg-[#1e1e1e] border border-[#333] rounded-xl p-6 shadow-sm flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-[#ff7a2d]">
              <Cpu size={18} />
              <h2 className="font-semibold text-sm text-white">System Prompt (AI assistent)</h2>
            </div>
            <span className="text-[9px] bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-widest">
              Read Only
            </span>
          </div>
          {/* textarea vult nu de volledige resthoogte */}
          <textarea 
            className="flex-1 w-full bg-[#121212] border border-[#333] rounded-lg p-4 text-[11px] text-gray-400 font-mono leading-relaxed resize-none focus:outline-none"
            defaultValue={aiPrompt}
            readOnly
          />
        </div>
      </div>
      
      {/* De volledige sectie voor AI Interacties (Logs) is hier verwijderd */}
    </div>
  );
}