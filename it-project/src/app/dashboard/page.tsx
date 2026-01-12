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
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center">
      <div>Laden...</div>
    </div>
  );
}