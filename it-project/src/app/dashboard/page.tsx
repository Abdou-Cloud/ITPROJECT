"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      router.push("/choose");
      return;
    }

    // Check user metadata to determine if they are a business or client
    const userType = user.publicMetadata?.userType as string | undefined;

    // NOTITIE: Als je de demonstratie wilt zien, moet je de redirects hieronder 
    // eventueel (tijdelijk) uitschakelen, anders word je direct doorgestuurd.
    if (userType === "business") {
      router.push("/business/agenda");
    } else if (userType === "client") {
      router.push("/assistant");
    } else {
      // If user type is not set, redirect to choose page
      router.push("/choose");
    }
  }, [user, isLoaded, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col items-center justify-center p-6">
      <div className="mb-8 animate-pulse text-slate-400">Laden...</div>

      {/* Nieuw blok voor de video demonstratie */}
      <div className="w-full max-w-4xl bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-[#ff7a2d] rounded-full"></span>
          Demonstratie:
        </h2>
        
        <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-slate-700 bg-black">
          <video 
            controls 
            className="w-full h-full object-contain"
            poster="/video-placeholder.png" // Optioneel: voeg een afbeelding toe die getoond wordt voor de video start
          >
            <source src="/demonstratie.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        
        <p className="mt-4 text-sm text-slate-500 italic">
          Bekijk hier hoe SchedulAI uw afspraken automatiseert.
        </p>
      </div>
    </div>
  );
}