"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function Header() {
  const [logoError, setLogoError] = useState(false);

  return (
    <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur supports-[backdrop-filter]:bg-slate-950/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center overflow-hidden">
            {!logoError ? (
              <Image
                src="/images/icons/logo.png"
                alt="SchedulAI Logo"
                width={40}
                height={40}
                className="w-full h-full object-contain"
                onError={() => setLogoError(true)}
              />
            ) : (
              <span className="text-2xl">📅</span>
            )}
          </div>
          <span className="text-lg font-semibold tracking-tight text-white">SchedulAI</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="#features" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
            Features
          </Link>
          <Link href="#hoe-het-werkt" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
            Hoe het werkt
          </Link>
          <Link href="#voor-wie" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
            Voor wie
          </Link>
          <Link href="#prijzen" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
            Prijzen
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          <SignedOut>
            <Button variant="ghost" asChild className="text-white hover:text-slate-300">
              <Link href="/choose">Registreer</Link>
            </Button>
            <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white">
              <Link href="/choose">Login</Link>
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}

