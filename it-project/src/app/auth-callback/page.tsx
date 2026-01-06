"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function AuthCallbackContent() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleRedirect = async () => {
      if (!isLoaded || !user) return;

      const email = user.primaryEmailAddress?.emailAddress;
      const intendedType = searchParams.get("type"); // "business" of "client"

      // Controleer of het een admin is
      if (email === "adam.akkay@student.ehb.be") {
        router.push("/admin");
        return;
      }

      // Controleer userType in metadata - als die al is ingesteld, respecteer die
      const userType = user.publicMetadata?.userType as string | undefined;

      if (userType) {
        // Gebruiker heeft al een type - controleer of ze naar de juiste login gaan
        if (userType === "client" && intendedType === "business") {
          setError("Dit account is geregistreerd als klant. Log in via de klant login.");
          return;
        }
        if (userType === "business" && intendedType === "client") {
          setError("Dit account is geregistreerd als bedrijf. Log in via de bedrijf login.");
          return;
        }

        // Type komt overeen, redirect
        if (userType === "business") {
          router.push("/business/dashboard");
        } else {
          // Ensure Klant exists for client users
          try {
            await fetch("/api/auth/sync-klant");
          } catch (error) {
            console.error("Fout bij synchroniseren klant:", error);
          }
          router.push("/assistant");
        }
        return;
      }

      // Als er geen userType is, controleer in database
      try {
        const res = await fetch(`/api/auth/check-user-type?email=${encodeURIComponent(email || "")}&type=${intendedType || "business"}`);
        const data = await res.json();

        // Check of het allowed is
        if (!data.allowed) {
          setError(data.message);
          return;
        }

        // Als er al een type in de database is, gebruik dat
        if (data.existingType) {
          await fetch("/api/auth/set-user-type", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userType: data.existingType }),
          });
          
          if (data.existingType === "business") {
            router.push("/business/dashboard");
          } else {
            // Ensure Klant exists for client users
            try {
              await fetch("/api/auth/sync-klant");
            } catch (error) {
              console.error("Fout bij synchroniseren klant:", error);
            }
            router.push("/assistant");
          }
          return;
        }

        // Geen bestaand type gevonden, stel in op basis van intended type
        const newType = intendedType === "client" ? "client" : "business";
        await fetch("/api/auth/set-user-type", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userType: newType }),
        });
        
        if (newType === "client") {
          // Ensure Klant exists for client users
          try {
            await fetch("/api/auth/sync-klant");
          } catch (error) {
            console.error("Fout bij synchroniseren klant:", error);
          }
          router.push("/assistant");
        } else {
          router.push("/business/dashboard");
        }
      } catch (error) {
        console.error("Fout bij controleren user type:", error);
        router.push("/choose");
      }
    };

    handleRedirect();
  }, [isLoaded, user, router, searchParams]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const handleReset = async () => {
    try {
      const res = await fetch("/api/auth/reset-user-type", {
        method: "POST",
      });
      if (res.ok) {
        await signOut();
        router.push("/");
      }
    } catch (e) {
      console.error("Fout bij resetten:", e);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Verkeerde login</h2>
          <p className="text-slate-400 mb-6">{error}</p>
          <button
            onClick={handleSignOut}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition"
          >
            Uitloggen en opnieuw proberen
          </button>
        </div>
      </div>
    );
  }

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

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-sm">Laden...</p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}   
