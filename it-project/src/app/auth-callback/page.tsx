"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthCallbackPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user) {
      const email = user.primaryEmailAddress?.emailAddress;

      // Controleer of jij het bent
      if (email === "adam.akkay@student.ehb.be") {
        router.push("/admin"); // Jij gaat naar de Admin schermen
      } else {
        router.push("/business/dashboard"); // Andere gebruikers gaan naar de normale bedrijfsomgeving
      }
    }
  }, [isLoaded, user, router]);

  return (
    <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white text-sm">Sessie verifiëren...</p>
      </div>
    </div>
  );
}   