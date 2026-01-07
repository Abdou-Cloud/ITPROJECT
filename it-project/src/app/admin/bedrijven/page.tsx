// src/app/admin/professionals/page.tsx

import { prisma } from "@/lib/db";
import Link from 'next/link'; // Noodzakelijk voor de "Details" knoppen
import { Building2, Eye, Mail } from "lucide-react";
import SearchInput from "@/components/admin/SearchInput"; // component voor url wijziging bij opzoeking

export default async function BedrijvenOverzichtPage({
  searchParams,
}: {
  searchParams?: { query?: string };
}) {
  const query = searchParams?.query || "";

  // Prisma haalt nu alleen resultaten op die voldoen aan de zoekterm
  const bedrijven = await prisma.bedrijf.findMany({
    where: {
      naam: {
        contains: query,
        mode: 'insensitive', // Zoeken is niet hoofdlettergevoelig
      },
    },
    include: {
      _count: {
        select: { werknemers: true }
      }
    },
    orderBy: { created_at: 'desc' }
  });

  return (
    <div className="p-8 bg-[#0B0F1A] min-h-screen text-white">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Bedrijven Beheer</h1>
          <p className="text-gray-400">Beheer je SaaS-partners en hun data</p>
        </div>
        
        {/* Hier plaatsen we de nieuwe zoekbalk component */}
        <SearchInput />
      </header>

      <div className="bg-[#1e1e1e] border border-[#333] rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#121212] border-b border-[#333] text-gray-400 text-sm">
            <tr>
              <th className="px-6 py-4">Bedrijf</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4 text-center">Professionals</th>
              <th className="px-6 py-4 text-right">Actie</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#333]">
            {bedrijven.map((bedrijf) => (
              <tr key={bedrijf.bedrijf_id} className="hover:bg-[#252525] transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3 font-semibold">
                    <Building2 size={18} className="text-[#ff7a2d]" />
                    {bedrijf.naam}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">{bedrijf.email}</td>
                <td className="px-6 py-4 text-center font-mono">{bedrijf._count.werknemers}</td>
                <td className="px-6 py-4 text-right">
                  <Link 
                    href={`/admin/bedrijven/${bedrijf.bedrijf_id}`}
                    className="inline-flex items-center gap-2 bg-[#ff7a2d] hover:bg-[#e66a25] text-white px-4 py-2 rounded-md text-sm font-bold transition"
                  >
                    <Eye size={16} /> Bekijk
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Feedback als er geen resultaten zijn */}
        {bedrijven.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-gray-500">Geen bedrijven gevonden die voldoen aan "{query}".</p>
          </div>
        )}
      </div>
    </div>
  );
}

// export default ProfessionalsPage;