// "use client";

// npx prisma db push - om problemen op te lossen

import React from 'react';
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import SettingsForm from "./SettingsForm";

export default async function SettingsPage() {
  // Haal de huidige Clerk-sessie op
  const clerkUser = await currentUser();
  
  if (!clerkUser) return null;

  // Haal de admin-gegevens op uit de DB op basis van clerkUserId
  // We selecteren specifiek de velden die in je schema staan
  const adminData = await prisma.admin.findUnique({
    where: { clerkUserId: clerkUser.id },
    include: { 
      bedrijf: {
        select: { naam: true }
      } 
    }
  });

  // Haal het globale systeemmodel op uit LLMProfiel
  const globalAi = await prisma.lLMProfiel.findFirst({
    orderBy: { created_at: 'desc' },
    select: { model: true }
  });

  return (
    <SettingsForm 
      clerkData={{
        fullName: clerkUser.fullName,
        imageUrl: clerkUser.imageUrl,
        email: clerkUser.primaryEmailAddress?.emailAddress
      }}
      dbData={{
        voornaam: adminData?.voornaam,
        naam: adminData?.naam,
        email: adminData?.email,
        bedrijfNaam: adminData?.bedrijf?.naam
      }}
      activeModel={globalAi?.model}
    />
  );
}

// export default SettingsPage;