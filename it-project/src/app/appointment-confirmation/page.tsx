"use client";

import { Header } from "@/components/Header";
import AppointmentConfirmationPage from "@/components/AppointmentConfirmationPage";

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <Header />
      <AppointmentConfirmationPage />
    </main>
  );
}
