// src/app/admin/afspraken/page.tsx

import React from 'react';
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Calendar, Clock, User, Building2, ArrowUpRight } from 'lucide-react';
import SearchInput from "@/components/admin/SearchInput"; // Importeer dezelfde zoekbalk

// Hulpfuncties voor styling
const getStatusClasses = (status: string) => {
  switch (status.toLowerCase()) {
    case 'bevestigd':
      return 'bg-green-500/10 text-green-500 border border-green-500/20';
    case 'voltooid':
      return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
    case 'no-show':
      return 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
    default:
      return 'bg-orange-500/10 text-orange-500 border border-orange-500/20';
  }
};

export default async function AfsprakenPage({
  searchParams,
}: {
  searchParams?: { query?: string };
}) {
  const query = searchParams?.query || "";

  // Haal gefilterde afspraken op inclusief de gekoppelde klant en werknemer (professional)
  const afspraken = await prisma.afspraak.findMany({
    where: {
      OR: [
        // Zoeken op klantgegevens
        { klant: { voornaam: { contains: query, mode: 'insensitive' } } },
        { klant: { naam: { contains: query, mode: 'insensitive' } } },
        // Zoeken op bedrijfsnaam
        { werknemer: { bedrijf: { naam: { contains: query, mode: 'insensitive' } } } },
        // Zoeken op naam van de professional (werknemer)
        { werknemer: { voornaam: { contains: query, mode: 'insensitive' } } },
        { werknemer: { naam: { contains: query, mode: 'insensitive' } } },
      ],
    },
    include: {
      klant: true,
      werknemer: {
        include: {
          bedrijf: true // Om de klinieknaam/bedrijfsnaam te tonen
        }
      }
    },
    orderBy: {
      start_datum: 'desc'
    }
  });

  return (
    <div className="p-8 bg-[#0B0F1A] min-h-screen text-white">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Afspraken Overzicht</h1>
          <p className="text-gray-400 mt-1">Klik op een professional of klant voor meer details</p>
        </div>
        {/* Zoekbalk toegevoegd, identiek aan klanten/bedrijven pagina */}
        <SearchInput />
      </header>

      <div className="bg-[#1e1e1e] rounded-xl overflow-hidden shadow-2xl border border-[#333]">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#121212] border-b border-[#333] text-gray-500 text-[11px] uppercase tracking-widest font-bold">
            <tr>
              <th className="px-6 py-4">Professional / Bedrijf</th>
              <th className="px-6 py-4">Klant Gegevens</th>
              <th className="px-6 py-4 text-center">Datum & Tijd</th>
              <th className="px-6 py-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#333]">
            {afspraken.map((appt) => {
              const startDatum = new Date(appt.start_datum);
              
              return (
                <tr key={appt.afspraak_id} className="hover:bg-[#252525] transition-all group">
                  
                  {/* LINK NAAR BEDRIJF */}
                  <td className="px-6 py-4">
                    <Link 
                      href={`/admin/bedrijven/${appt.werknemer.bedrijf_id}`}
                      className="flex items-center gap-3 group/link w-fit"
                    >
                      <div className="p-2 bg-blue-500/5 rounded-lg text-blue-400 group-hover/link:bg-blue-500/20 transition-colors">
                        <Building2 size={16} />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-gray-200 group-hover/link:text-[#ff7a2d] flex items-center gap-1 transition-colors">
                          {appt.werknemer.voornaam} {appt.werknemer.naam}
                          <ArrowUpRight size={12} className="opacity-0 group-hover/link:opacity-100 transition-opacity" />
                        </p>
                        <p className="text-[10px] text-gray-500 uppercase font-medium">{appt.werknemer.bedrijf.naam}</p>
                      </div>
                    </Link>
                  </td>

                  {/* LINK NAAR KLANT */}
                  <td className="px-6 py-4">
                    <Link 
                      href={`/admin/klanten/${appt.klant_id}`}
                      className="flex items-center gap-3 group/klant w-fit"
                    >
                      <div className="p-2 bg-slate-800 rounded-full text-gray-400 group-hover/klant:text-[#ff7a2d] transition-colors">
                        <User size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-300 group-hover/klant:text-white transition-colors">
                          {appt.klant.voornaam} {appt.klant.naam}
                        </p>
                        <p className="text-[10px] text-gray-500">{appt.klant.email}</p>
                      </div>
                    </Link>
                  </td>

                  {/* Datum & Tijd */}
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex flex-col items-center">
                      <span className="text-sm font-bold flex items-center gap-1.5 text-gray-200">
                        <Calendar size={13} className="text-[#ff7a2d]" />
                        {startDatum.toLocaleDateString('nl-BE')}
                      </span>
                      <span className="text-[11px] text-gray-500 font-mono">
                        {startDatum.toLocaleTimeString('nl-BE', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 text-center">
                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm ${getStatusClasses(appt.status)}`}>
                      {appt.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {afspraken.length === 0 && (
          <div className="p-20 text-center text-gray-400 italic">
            Geen afspraken gevonden voor de zoekopdracht "{query}".
          </div>
        )}
      </div>
    </div>
  );
}

// export default AfsprakenPage;