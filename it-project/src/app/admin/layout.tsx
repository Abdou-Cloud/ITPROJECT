import type { ReactNode } from "react";
import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db"; // Importeer prisma

export default async function AdminLayout({ children }: { children: ReactNode }) {
  // 1. Haal de ingelogde gebruiker op via Clerk (Server-side)
  const user = await currentUser();

  // 2. Haal het e-mailadres op
  const email = user?.primaryEmailAddress?.emailAddress;

  // 3. De Hardcoded Check
  if (email !== "adam.akkay@hotmail.com") {
    redirect("/"); 
  }

  // 4. Database Status Check
  let isDbConnected = false;
  try {
    // We doen een hele lichte check om de verbinding te verifiëren
    await prisma.$queryRaw`SELECT 1`;
    isDbConnected = true;
  } catch (error) {
    console.error("Database status check failed in layout:", error);
    isDbConnected = false;
  }

  return (
    <div className="flex min-h-screen bg-[#0B0F1A] text-white">
      {/* Sidebar is Fixed */}
      <Sidebar />

      {/* Content container */}
      <div className="flex flex-col flex-1 ml-64"> 
        {/* Geef de status door aan de Topbar component */}
        <Topbar isDbConnected={isDbConnected} />
        
        <main className="flex-1 bg-[#0B0F1A]">
          {children}
        </main> 
      </div>
    </div>
  );
}