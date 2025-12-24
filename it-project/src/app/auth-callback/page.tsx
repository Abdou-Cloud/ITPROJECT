"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthCallbackPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user) {
      // Primaire e-mailadres
      const email = user.primaryEmailAddress?.emailAddress;

      console.log("Verificatie voor:", email);

      // Logica om te bepalen waar de gebruiker heen moet
      if (email === "adam.akkay@student.ehb.be") {
        // Gebruik replace om de geschiedenis op te schonen
        router.replace("/admin");
      } else {
        // Reguliere bedrijven gaan naar hun eigen dashboard
        router.replace("/business/dashboard");
      }
    }
  }, [isLoaded, user, router]);

  return (
    <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center">
      <div className="text-center">
        {/* Een mooie loader die past bij jouw donkere thema */}
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-white font-semibold text-lg">Sessie verifiëren</h2>
        <p className="text-slate-400 text-sm mt-2">Een moment geduld, we bereiden je dashboard voor...</p>
      </div>
    </div>
  );
}