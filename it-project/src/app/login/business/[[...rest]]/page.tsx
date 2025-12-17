"use client";

import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { Header } from "@/components/Header";

export default function BusinessLoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <Header />
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Login als Bedrijf</h1>
            <p className="text-slate-400">
              Beheer alle afspraken, klanten en je AI assistent vanuit één krachtig dashboard
            </p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <SignIn
              routing="path"
              path="/login/business"
              signUpUrl="/business/dashboard"
              // Gebruik forceRedirectUrl om naar onze logica-checker te gaan
              forceRedirectUrl="/auth-callback"
            />
          </div>
          <div className="text-center mt-6">
            <p className="text-slate-400">
              Nog geen account?{" "}
              <Link href="/signup/business" className="text-orange-500 hover:text-orange-400">
                Registreer als bedrijf
              </Link>
            </p>
            <p className="text-slate-400 mt-2">
              Of{" "}
              <Link href="/login/client" className="text-blue-500 hover:text-blue-400">
                login als klant
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}