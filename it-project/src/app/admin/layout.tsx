import type { ReactNode } from "react";
import Sidebar  from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#0B0F1A] text-white">
      {/* 1. Sidebar is Fixed, dus deze 'zweeft' boven de rest */}
      <Sidebar />

      {/* 2. De content container moet de ruimte van de Sidebar innemen. */}
      {/* Oplossing: Voeg ml-64 (margin-left: 16rem) toe om de content naar rechts te duwen. */}
      <div className="flex flex-col flex-1 ml-64"> 
        <Topbar />
        {/* We verwijderen de p-6 uit de main, en laten de children (page.tsx) de padding bepalen */}
        <main>{children}</main> 
      </div>
    </div>
  );
}
