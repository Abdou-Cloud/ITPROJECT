import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, Calendar, User, Building2 } from "lucide-react"; // MessageSquare icoon verwijderd

export default async function KlantDetailPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);

  // Haal de klant op inclusief alle relaties uit het schema (berichten verwijderd)
  const klant = await prisma.klant.findUnique({
    where: { klant_id: id },
    include: {
      bedrijf: true,
      afspraken: {
        include: { werknemer: true },
        orderBy: { start_datum: 'desc' }
      }
      // berichten include verwijderd
    }
  });

  if (!klant) return notFound();

  return (
    <div className="p-8 bg-[#0B0F1A] min-h-screen text-white">
      {/* Navigatie */}
      <Link href="/admin/klanten" className="flex items-center text-gray-400 hover:text-white mb-6 transition">
        <ArrowLeft size={18} className="mr-2" /> Terug naar klantenoverzicht
      </Link>

      <header className="mb-8">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-[#ff7a2d]/10 rounded-full text-[#ff7a2d]">
            <User size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-bold">{klant.voornaam} {klant.naam}</h1>
            <p className="text-gray-400 flex items-center gap-2">
              <Building2 size={16} /> Klant bij {klant.bedrijf?.naam || "Geen specifiek bedrijf"}
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Linker kolom: Contact & Info */}
        <div className="space-y-6">
          <div className="p-6 bg-[#1e1e1e] border border-[#333] rounded-xl">
            <h2 className="text-lg font-bold mb-4 border-b border-[#333] pb-2">Contactgegevens</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="text-[#ff7a2d] mt-1" size={18} />
                <div>
                  <p className="text-xs text-gray-500 uppercase">Email</p>
                  <p className="text-sm font-medium">{klant.email}</p>
                </div>
              </div>
              {/* Telefoonnummer verborgen - kan later weer geactiveerd worden */}
              {/* <div className="flex items-start gap-3">
                <Phone className="text-[#ff7a2d] mt-1" size={18} />
                <div>
                  <p className="text-xs text-gray-500 uppercase">Telefoon</p>
                  <p className="text-sm font-medium">{klant.telefoonnummer}</p>
                </div>
              </div> */}
              {/* Geboortedatum verborgen - kan later weer geactiveerd worden */}
              {/* <div className="flex items-start gap-3">
                <Calendar className="text-[#ff7a2d] mt-1" size={18} />
                <div>
                  <p className="text-xs text-gray-500 uppercase">Geboortedatum</p>
                  <p className="text-sm font-medium">
                    {klant.geboorte_datum ? new Date(klant.geboorte_datum).toLocaleDateString() : "Onbekend"}
                  </p>
                </div>
              </div> */}
            </div>
          </div>

          <div className="p-6 bg-[#1e1e1e] border border-[#333] rounded-xl">
            <h2 className="text-lg font-bold mb-4">Statistieken</h2>
            <div className="grid grid-cols-1"> {/* grid-cols-2 naar grid-cols-1 aangepast */}
              <div className="bg-[#0B0F1A] p-4 rounded-lg text-center border border-[#333]">
                <p className="text-2xl font-bold text-[#ff7a2d]">{klant.afspraken.length}</p>
                <p className="text-[10px] text-gray-500 uppercase">Afspraken</p>
              </div>
              {/* AI Chats statistiek verwijderd */}
            </div>
          </div>
        </div>

        {/* Rechter kolom: Historie */}
        <div className="lg:col-span-2 space-y-6">
          {/* Afsprakenlijst */}
          <div className="p-6 bg-[#1e1e1e] border border-[#333] rounded-xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Calendar size={20} className="text-[#ff7a2d]" /> Afspraak Historie
            </h2>
            <div className="space-y-3">
              {klant.afspraken.length > 0 ? klant.afspraken.map((afspraak) => (
                <div key={afspraak.afspraak_id} className="p-4 bg-[#121212] border border-[#333] rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-bold text-sm">
                      {new Date(afspraak.start_datum).toLocaleDateString('nl-BE', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    <p className="text-xs text-gray-500">Met: {afspraak.werknemer.voornaam} {afspraak.werknemer.naam}</p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 bg-green-500/10 text-green-500 rounded border border-green-500/20 uppercase">
                    {afspraak.status}
                  </span>
                </div>
              )) : (
                <p className="text-gray-500 italic text-sm">Geen afspraken gevonden.</p>
              )}
            </div>
          </div>

          {/* AI Berichten (Laatste chats) sectie volledig verwijderd */}
        </div>
      </div>
    </div>
  );
}