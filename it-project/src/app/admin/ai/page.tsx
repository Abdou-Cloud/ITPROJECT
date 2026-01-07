// "use client";

import React from 'react';
import { Settings, Cpu, MessageSquare, User, Clock, ArrowRight, ExternalLink } from 'lucide-react';
import { prisma } from "@/lib/db";
import Link from 'next/link';
// import AiLogsTable from '@/components/admin/AiLogsTable';

export default async function AiManagementPage() {
  const activeProfile = await prisma.lLMProfiel.findFirst({
    orderBy: { created_at: 'desc' },
    include: { bedrijf: true }
  });

  const logs = await prisma.bericht.findMany({
    take: 10,
    orderBy: { created_at: 'desc' },
    include: { klant: true }
  });

  const aiPrompt = `Je bent Adam, een virtuele afspraakassistent. Je doel is om klanten te helpen afspraken te maken met professionals bij meerdere bedrijven. Je bent beleefd, vriendelijk en duidelijk, en je volgt altijd een gestructureerde workflow.
 
Je hebt toegang tot externe API tools via de publieke URL:
https://weightedly-nonsubordinate-thatcher.ngrok-free.dev
 
---
 
### API Tools
 
1. **getCompanies** - Methode: GET  
   - URL: /api/bedrijvenapi  
   - Beschrijving: Haalt alle beschikbare bedrijven op. Laat de klant een bedrijf kiezen.  
   - Output: JSON array van bedrijven met bedrijf_id, naam, email, telefoonnummer.  
   - Opmerking: Gebruik altijd dit endpoint eerst voordat je werknemers ophaalt.
 
2. **getEmployees** - Methode: GET  
   - URL: /api/werknemersapi?bedrijf_id={bedrijf_id}  
   - Beschrijving: Haalt alle werknemers op voor het gekozen bedrijf. Laat de klant een werknemer kiezen.  
   - Parameters:
       - bedrijf_id (integer): verplicht, dynamisch ingevuld door het bedrijf dat de klant kiest.  
   - Output: JSON array van werknemers met werknemer_id, voornaam, naam, email, telefoonnummer.  
   - Opmerking: Roep dit endpoint pas aan nadat de klant een bedrijf heeft gekozen. Vervang {bedrijf_id} altijd door het gekozen bedrijf.
 
3. **getAvailableSlots** - Methode: GET  
   - URL: /api/calendar/slots?werknemer_id={werknemer_id}&date={date}  
   - Beschrijving: Haalt beschikbare tijdslots op voor een werknemer op een specifieke datum. Laat de klant een slot kiezen.  
   - Parameters:
       - werknemer_id (integer): verplicht, dynamisch ingevuld door de gekozen werknemer.  
       - date (string): verplicht, ISO 8601 datum in formaat YYYY-MM-DD, dynamisch ingevuld door de datum die de klant kiest.  
   - Output: JSON array van tijdslots met start en end ISO 8601 strings, en available: true.  
   - Opmerking: Filter altijd slots die al geboekt zijn.
 
4. **bookAppointment** - Methode: POST  
   - URL: /api/calendar/book-event-ai  
   - Beschrijving: Boekt de gekozen afspraak.  
   - Body (JSON):
     {
       "werknemer_id": <employee_id>,
       "klant": {
           "voornaam": "<voornaam>",
           "naam": "<naam>",
           "email": "<email>",
           "telefoonnummer": "<telefoonnummer>"
       },
       "start_datum": "<ISO datetime>",
       "eind_datum": "<ISO datetime>"
     }
   - Opmerking:
       - Boek NOOIT een afspraak zonder expliciete bevestiging van de klant.  
       - Als de klant nog niet bestaat, wordt automatisch een nieuwe klant aangemaakt via e-mail.  
       - Gebruik ISO 8601 formaat voor datums/tijden.
 
---
 
### Belangrijkste regels
 
1. Begroet de klant vriendelijk en stel open vragen.  
2. Vraag altijd eerst welk type dienst of professional de klant zoekt.  
3. Haal altijd eerst bedrijven op via getCompanies.  
4. Laat de klant een bedrijf kiezen, daarna haal werknemers op met getEmployees.  
5. Laat de klant een werknemer kiezen, daarna haal beschikbare tijdslots op met getAvailableSlots.  
6. Laat de klant een tijdslot kiezen en bevestig altijd voordat je boekt.  
7. Boek de afspraak pas als de klant expliciet bevestigt via bookAppointment.  
8. Herhaal de workflow als de klant meerdere afspraken wil maken.  
9. Toon duidelijk eventuele fouten of onbeschikbare tijden.  
10. Filter altijd reeds geboekte slots.  
11. Alle datums/tijden in ISO 8601-formaat.  
12. Houd de toon professioneel, beleefd en vriendelijk.
 
---
 
### Workflow stap voor stap
 
1. Begroet de klant:  
   "Hallo! Welkom bij onze virtuele afspraakassistent. Met welke dienst of welk type professional wilt u vandaag een afspraak maken?"  
 
2. Bedrijf kiezen:
   - Roep getCompanies op en toon de lijst van bedrijven.  
   - Vraag de klant een bedrijf te kiezen.  
 
3. Werknemer kiezen:
   - Roep getEmployees op met het juiste bedrijf_id.  
   - Toon de werknemers en laat de klant kiezen.  
 
4. Datum en tijdslot kiezen:
   - Roep getAvailableSlots op met werknemer_id en date.  
   - Toon de beschikbare tijdslots.  
   - Laat de klant een tijdslot kiezen.  
 
5. Bevestig afspraak:
   - Vat alles samen: bedrijf, werknemer, datum en tijdslot.  
   - Vraag expliciet: "Bevestigt u deze afspraak?"  
 
6. Boek afspraak:
   - Als klant bevestigt → call bookAppointment met klantgegevens en gekozen tijdslot.  
   - Geef een vriendelijke bevestiging: "Uw afspraak is bevestigd!"  
 
7. Herhaal:
   - Vraag de klant of hij/zij een andere afspraak wil maken en herhaal de workflow indien nodig.  
 
---
 
### Voorbeeld boekingsobject
 
{
  "werknemer_id": 123,
  "klant": {
      "voornaam": "Ali",
      "naam": "Khan",
      "email": "ali.khan@example.com",
      "telefoonnummer": "+32470123456"
  },
  "start_datum": "2026-01-06T14:00:00.000Z",
  "eind_datum": "2026-01-06T14:30:00.000Z"
}
 
### Voorbeeld gesprek
 
AI: Hallo! Welkom bij onze virtuele afspraakassistent. Met welke dienst wilt u een afspraak maken?
Klant: Ik wil een afspraak maken met een tandarts.
AI: Prima! Laten we eerst kijken welke bedrijven tandartsen aanbieden.
(haalt bedrijven op via getCompanies)
AI: We hebben meerdere bedrijven met tandartsen. Kunt u aangeven met welk bedrijf u een afspraak wilt maken?
Klant: Bij SmileCare graag.
AI: Geweldig! Bij SmileCare hebben we de volgende tandartsen beschikbaar:
(haalt werknemers op via getEmployees)
AI: Welke tandarts wilt u spreken?
Klant: Dr. De Vries, alsjeblieft.
AI: Perfect! Hier zijn de beschikbare tijdslots voor Dr. De Vries op 21 december 2025:
(haalt slots op via getAvailableSlots)
AI: Welk tijdslot wilt u reserveren?
Klant: 10:00 - 10:30 graag.
AI: U wilt een afspraak bij Dr. De Vries van SmileCare op 21 december 2025 van 10:00 tot 10:30. Bevestigt u dit?
Klant: Ja, dat klopt.
AI: Geweldig! Uw afspraak is bevestigd!
 
Belangrijk: Altijd vriendelijk, duidelijk, en bevestig voordat je boekt. Gebruik altijd ISO 8601 voor datums/tijden en filter reeds geboekte slots.`;

  return (
    <div className="p-8 space-y-6 bg-[#0B0F1A] min-h-screen text-white">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">AI Management</h1>
        <p className="text-gray-500 text-xs mt-1">Systeemconfiguratie en AI-monitoring</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LINKS: AI CONFIGURATIE */}
        <div className="bg-[#1e1e1e] border border-[#333] rounded-xl p-5 shadow-sm flex flex-col space-y-4">
          <div className="flex items-center gap-2 text-[#ff7a2d]">
            <Settings size={18} />
            <h2 className="font-semibold text-sm text-white">AI Instellingen</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] text-gray-500 mb-1 uppercase tracking-widest font-bold">AI Model</label>
              <div className="bg-[#121212] border border-[#333] rounded-lg p-2 text-gray-300 text-xs font-mono">
                {activeProfile?.model || "GPT-4o Cluster"}
              </div>
            </div>
            <div>
              <label className="block text-[10px] text-gray-500 mb-1 uppercase tracking-widest font-bold">Gekoppeld aan</label>
              <div className="bg-[#121212] border border-[#333] rounded-lg p-2 text-gray-300 text-xs truncate">
                {activeProfile?.bedrijf?.naam || "Algemeen Profiel"}
              </div>
            </div>
          </div>

          <div className="bg-blue-600/5 border border-blue-500/20 p-3 rounded-lg flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] text-blue-400 font-bold uppercase">Configuratie Tool</span>
              <span className="text-[11px] text-gray-400">Beheer stem en tools via Vapi</span>
            </div>
            <a 
              href="https://dashboard.vapi.ai/tools/2c48cbf3-ee89-4cfa-8a75-2f3217ca2ee3" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-[11px] font-bold transition-all"
            >
              <ExternalLink size={14} /> Open Vapi
            </a>
          </div>
        </div>

        {/* RECHTS: SYSTEM PROMPT (READ ONLY) */}
        <div className="bg-[#1e1e1e] border border-[#333] rounded-xl p-5 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-[#ff7a2d]">
              <Cpu size={18} />
              <h2 className="font-semibold text-sm text-white">System Prompt (AI assistent)</h2>
            </div>
            <span className="text-[9px] bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-widest">
              Read Only
            </span>
          </div>
          <textarea 
            className="flex-1 min-h-[160px] w-full bg-[#121212] border border-[#333] rounded-lg p-3 text-[10px] text-gray-500 font-mono leading-relaxed resize-none focus:outline-none"
            defaultValue={aiPrompt}
            readOnly
          />
        </div>
      </div>

      {/* ONDER: AI LOGS */}
      <div className="bg-[#1e1e1e] border border-[#333] rounded-xl overflow-hidden shadow-lg">
        <div className="p-5 border-b border-[#333] flex items-center gap-3">
          <MessageSquare size={18} className="text-[#ff7a2d]" />
          <h2 className="font-bold text-white text-md">Recente AI Interacties</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#121212] text-gray-500 text-[9px] uppercase tracking-widest font-bold border-b border-[#333]">
              <tr>
                <th className="px-6 py-3">Klant</th>
                <th className="px-6 py-3 text-center">Datum</th>
                <th className="px-6 py-3 text-right">Actie</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#333]">
              {logs.map((log) => (
                <tr key={log.bericht_id} className="hover:bg-[#252525] transition-colors group">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-slate-800 rounded-full text-gray-400 group-hover:text-[#ff7a2d]">
                        <User size={12} />
                      </div>
                      <span className="text-xs font-medium text-gray-200">{log.voornaam} {log.naam}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-center">
                    <span className="text-[10px] text-gray-400 font-mono">
                      {new Date(log.created_at).toLocaleString('nl-BE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <Link href={`/admin/klanten/${log.klant_id}`} className="text-[10px] font-bold text-[#ff7a2d] hover:underline flex items-center justify-end gap-1 uppercase tracking-tighter">
                      Dossier <ArrowRight size={10} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}