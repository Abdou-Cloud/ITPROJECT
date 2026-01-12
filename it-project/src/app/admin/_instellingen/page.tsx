// "use client";

// npx prisma db push - om problemen op te lossen

import React from 'react';
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import SettingsForm from "./SettingsForm";

export default async function SettingsPage() {
  const clerkUser = await currentUser();
  
  if (!clerkUser) return null;

  // LLMProfiel model verwijderd - gebruik standaardwaarde
  const activeModel = "GPT-4o";

  return (
    <SettingsForm 
      clerkData={{
        fullName: clerkUser.fullName,
        imageUrl: clerkUser.imageUrl,
        email: clerkUser.primaryEmailAddress?.emailAddress
      }}
      activeModel={activeModel}
    />
  );
}

// export default SettingsPage;