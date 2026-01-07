// src/app/admin/professionals/[id]/page.tsx

// 'use client'; // Blijft niet nodig voor eventuele toekomstige hooks en state

// import React from 'react';
import Link from 'next/link'; // Gebruikt voor de vaste navigatie van de Terugknop
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { 
  ArrowLeft, Mail, Phone, Users, Brain, 
  Check, Clock, Zap
} from 'lucide-react';



export default async function BedrijfDetailPage({ params }: { params: { id: string } }) {
  // Belangrijk: zet de string ID om naar een nummer voor Prisma
  const id = parseInt(params.id);

  const bedrijf = await prisma.bedrijf.findUnique({
    where: { bedrijf_id: id },
    include: {
      werknemers: true,
      llmProfielen: true,
      _count: { select: { werknemers: true } }
    }
  });

  if (!bedrijf) return notFound();

  // Statistieken ophalen voor dit specifieke bedrijf
  const [afsprakenCount, berichtenCount] = await Promise.all([
    prisma.afspraak.count({ where: { werknemer: { bedrijf_id: id } } }),
    prisma.bericht.count({ where: { klant: { bedrijf_id: id } } })
  ]);

  return (
    <div className="p-8 bg-[#0B0F1A] min-h-screen text-white">
      {/* TERUG LINK: Aangepast naar /admin/bedrijven */}
      <Link href="/admin/bedrijven" className="flex items-center text-gray-400 hover:text-white mb-6 transition">
        <ArrowLeft size={18} className="mr-2" /> Terug naar bedrijvenoverzicht
      </Link>

      <header className="mb-8">
        <h1 className="text-4xl font-bold">{bedrijf.naam}</h1>
        <p className="text-gray-400">Bedrijfsgegevens en systeemactiviteit</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 bg-[#1e1e1e] border border-[#333] rounded-xl grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 text-xs uppercase font-bold mb-2">Contact</p>
              <p className="flex items-center gap-2 text-sm"><Mail size={14} /> {bedrijf.email}</p>
              <p className="flex items-center gap-2 text-sm mt-1"><Phone size={14} /> {bedrijf.telefoonnummer}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase font-bold mb-2">Data</p>
              <p className="text-sm">Geregistreerd op: {new Date(bedrijf.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-[#1e1e1e] border border-[#333] rounded-xl text-center">
               <Brain className="mx-auto mb-2 text-[#ff7a2d]" />
               <p className="text-2xl font-bold">{berichtenCount}</p>
               <p className="text-xs text-gray-500">AI Berichten</p>
            </div>
            <div className="p-4 bg-[#1e1e1e] border border-[#333] rounded-xl text-center">
               <Zap className="mx-auto mb-2 text-[#ff7a2d]" />
               <p className="text-2xl font-bold">{bedrijf.llmProfielen.length}</p>
               <p className="text-xs text-gray-500">AI Profielen</p>
            </div>
            <div className="p-4 bg-[#1e1e1e] border border-[#333] rounded-xl text-center">
               <Users className="mx-auto mb-2 text-[#ff7a2d]" />
               <p className="text-2xl font-bold">{bedrijf._count.werknemers}</p>
               <p className="text-xs text-gray-500">Professionals</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-[#1e1e1e] border border-[#333] rounded-xl">
          <h2 className="font-bold mb-4">Lijst Professionals</h2>
          <div className="space-y-2">
            {bedrijf.werknemers.map(w => (
              <div key={w.werknemer_id} className="p-3 bg-[#0B0F1A] rounded border border-[#333] text-sm font-medium">
                {w.voornaam} {w.naam}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// export default ProfessionalDetailsPage;