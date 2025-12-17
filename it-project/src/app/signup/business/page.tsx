"use client";

import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { Header } from "@/components/Header";

export default function BusinessSignUpPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <Header />
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Registreer je Bedrijf</h1>
            <p className="text-slate-400">
              Start vandaag nog met je eigen AI-gestuurde afsprakenplanner
            </p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <SignUp
              routing="path"
              path="/signup/business"
              signInUrl="/login/business"
              // Dwing nieuwe gebruikers (en jezelf als je een nieuw account maakt) 
              // om via de verkeersleider te gaan.
              forceRedirectUrl="/auth-callback"
            />
          </div>

          <div className="text-center mt-6">
            <p className="text-slate-400">
              Heb je al een account?{" "}
              <Link href="/login/business" className="text-orange-500 hover:text-orange-400 font-medium">
                Log hier in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}