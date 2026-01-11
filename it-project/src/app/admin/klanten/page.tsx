import React from 'react';
import { prisma } from "@/lib/db";
import { Mail, Phone, Calendar, MessageSquare, MoreHorizontal, User, ShieldCheck, UserCircle, Eye } from 'lucide-react';
import SearchInput from "@/components/admin/SearchInput"; // Voor de zoekbalk
import Link from "next/link";



export default async function KlantenPage({
  searchParams,
}: {
  searchParams?: { query?: string };
}) {
  const query = searchParams?.query || "";

  // 1. Haal klanten op uit de database op basis van jouw schema
  const klanten = await prisma.klant.findMany({
    where: {
      OR: [
        { voornaam: { contains: query, mode: 'insensitive' } },
        { naam: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
      ],
    },
    include: {
      _count: {
        select: { 
          afspraken: true, 
          berichten: true 
        }
      },
      // We halen de laatste afspraak op via de relatie
      afspraken: {
        orderBy: { start_datum: 'desc' },
        take: 1
      },
      bedrijf: true
    },
    // Gesorteerd op klant_id 
    orderBy: { klant_id: 'desc' } 
  });

  return (
    <div className="p-8 bg-[#0B0F1A] min-h-screen text-white">
      
      {/* Header met Titel & Zoekbalk */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Klanten Beheer</h1>
          <p className="text-gray-400 mt-1 text-sm">Beheer alle eindgebruikers en hun interacties</p>
        </div>
        <SearchInput />
      </div>
      
      {/* Tabel sectie */}
      <div className="bg-[#1e1e1e] rounded-xl overflow-hidden shadow-2xl border border-[#333]">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#121212] border-b border-[#333] text-gray-500 text-[11px] uppercase tracking-widest font-bold">
            <tr>
              <th className="px-6 py-4">Klant Gegevens</th>
              <th className="px-6 py-4">Status & Bedrijf</th>
              <th className="px-6 py-4 text-center">Totaal Afspraken</th>
              <th className="px-6 py-4 text-center">AI Berichten</th>
              <th className="px-6 py-4 text-center">Volgende Afspraak</th>
              <th className="px-6 py-4 text-right">Actie</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#333]">
            {klanten.map((klant) => {
              // Haal de datum uit de meest recente afspraak
              const laatsteAfspraak = klant.afspraken[0];
              const isGeregistreerd = !!klant.clerkUserId;
              
              return (
                <tr key={klant.klant_id} className="hover:bg-[#252525] transition-all group">
                  
                  {/* Naam en Contact info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-[#0B0F1A] rounded-full flex items-center justify-center border border-[#333] group-hover:border-[#ff7a2d] transition-colors text-gray-400">
                        <User size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-100">{klant.voornaam} {klant.naam}</p>
                        <div className="flex flex-col text-[11px] text-gray-500 mt-0.5">
                           <span className="flex items-center gap-1"><Mail size={10} /> {klant.email}</span>
                           <span className="flex items-center gap-1"><Phone size={10} /> {klant.telefoonnummer}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Account Type & Bedrijf Koppeling */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5">
                      <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase px-2 py-0.5 rounded-md w-fit ${
                        isGeregistreerd ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                      }`}>
                        {isGeregistreerd ? <ShieldCheck size={10} /> : <UserCircle size={10} />}
                        {isGeregistreerd ? 'Geregistreerd' : 'Gast'}
                      </div>
                      <p className="text-[10px] text-gray-500 font-medium italic">
                        Klant bij: {klant.bedrijf?.naam || 'Geen bedrijf'}
                      </p>
                    </div>
                  </td>

                  {/* Afspraken Count */}
                  <td className="px-6 py-4 text-center font-mono text-sm text-gray-300">
                    {klant._count.afspraken}
                  </td>
                  
                  {/* AI Berichten Count */}
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/5 border border-blue-500/10 text-blue-400 text-sm">
                      <MessageSquare size={14} />
                      {klant._count.berichten}
                    </div>
                  </td>
                  
                  {/* Datum van laatste afspraak (start_datum) */}
                  <td className="px-6 py-4 text-center text-sm text-gray-400">
                    {laatsteAfspraak ? (
                      <div className="flex items-center justify-center gap-1.5 text-xs text-gray-300">
                        <Calendar size={13} className="text-[#ff7a2d]" />
                        {new Date(laatsteAfspraak.start_datum).toLocaleDateString('nl-BE')}
                      </div>
                    ) : (
                      <span className="text-gray-600 italic text-[11px]">Nog geen</span>
                    )}
                  </td>
                  
                  {/* Actie knop */}
                  <td className="px-6 py-4 text-right">
                   <Link 
                     href={`/admin/klanten/${klant.klant_id}`}
                     className="inline-flex items-center gap-2 bg-[#ff7a2d] hover:bg-[#e66a25] text-white px-4 py-2 rounded-md text-sm font-bold transition-all"
                  >
                    <Eye size={16} /> Bekijk
                 </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Lege staat */}
        {klanten.length === 0 && (
          <div className="p-24 text-center border-t border-[#333]">
            <div className="inline-flex p-4 rounded-full bg-[#121212] text-gray-600 mb-4">
              <User size={32} />
            </div>
            <p className="text-gray-400 font-medium italic">Geen klanten gevonden voor "{query}"</p>
          </div>
        )}
      </div>
    </div>
  );
}

// export default KlantenPage;