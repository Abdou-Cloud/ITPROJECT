import type { ReactNode } from "react";
import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  // 1. Haal de ingelogde gebruiker op via Clerk (Server-side)
  const user = await currentUser();

  // 2. Haal het e-mailadres op
  const email = user?.primaryEmailAddress?.emailAddress;

  // 3. De Hardcoded Check: Alleen jouw e-mailadres krijgt toegang
  // Iedereen die niet 'adam.akkay@hotmail.com' is, wordt direct weggestuurd
  if (email !== "adam.akkay@hotmail.com") {
    redirect("/"); 
  }

  return (
    <div className="flex min-h-screen bg-[#0B0F1A] text-white">
      {/* Sidebar is Fixed */}
      <Sidebar />

      {/* Content container met margin-left voor de Sidebar ruimte */}
      <div className="flex flex-col flex-1 ml-64"> 
        <Topbar />
        {/* De achtergrondkleur hier zorgt ervoor dat je nooit wit ziet bij het scrollen */}
        <main className="flex-1 bg-[#0B0F1A]">
          {children}
        </main> 
      </div>
    </div>
  );
}