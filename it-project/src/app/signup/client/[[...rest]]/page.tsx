"use client";

import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { Header } from "@/components/Header";

export default function ClientSignupPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <Header />
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Registreer als Klant</h1>
            <p className="text-slate-400">
              Maak een account aan om direct afspraken te kunnen boeken
            </p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <SignUp
              routing="hash"
              signInUrl="/login/client"
              fallbackRedirectUrl="/auth-callback?type=client"
            />
          </div>
          <div className="text-center mt-6">
            <p className="text-slate-400">
              Al een account?{" "}
              <Link href="/login/client" className="text-blue-500 hover:text-blue-400">
                Login als klant
              </Link>
            </p>
            <p className="text-slate-400 mt-2">
              Of{" "}
              <Link href="/signup/business" className="text-orange-500 hover:text-orange-400">
                registreer als bedrijf
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
