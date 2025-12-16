"use client";

import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { Header } from "@/components/Header";

export default function ClientLoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <Header />
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Login als Klant</h1>
            <p className="text-slate-400">
              Boek direct je afspraken 24/7, beheer je agenda en ontvang automatische herinneringen
            </p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <SignIn
              routing="hash"
              signUpUrl="/signup/client"
              afterSignInUrl="/client/dashboard"
            />
          </div>
          <div className="text-center mt-6">
            <p className="text-slate-400">
              Nog geen account?{" "}
              <Link href="/signup/client" className="text-blue-500 hover:text-blue-400">
                Registreer als klant
              </Link>
            </p>
            <p className="text-slate-400 mt-2">
              Of{" "}
              <Link href="/login/business" className="text-orange-500 hover:text-orange-400">
                login als bedrijf
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

