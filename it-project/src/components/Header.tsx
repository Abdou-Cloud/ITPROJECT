"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/Icon";

type HeaderVariant = "landing" | "app";

type HeaderProps = {
  variant?: HeaderVariant;
};

export function Header({ variant }: HeaderProps) {
  const pathname = usePathname();
  const [logoError, setLogoError] = useState(false);

  const resolvedVariant: HeaderVariant =
    variant ?? (pathname.startsWith("/assistant") ? "app" : "landing");

  return (
    <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur supports-[backdrop-filter]:bg-slate-950/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Left */}
        <div className="flex items-center gap-3">
          {resolvedVariant === "app" && (
            <Button
              variant="ghost"
              className="text-slate-200 hover:text-white"
              asChild
            >
              <Link href="/" className="flex items-center gap-2">
                <span className="text-sm">←</span>
                <span className="text-sm">Terug</span>
              </Link>
            </Button>
          )}

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
                <span className="text-lg text-slate-900">S</span>
              )}
            </div>
            <span className="text-lg font-semibold tracking-tight text-white">
              SchedulAI
            </span>
          </Link>
        </div>

        {/* Center nav only on landing */}
        {resolvedVariant === "landing" && (
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#features"
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              Features
            </Link>
            <Link
              href="#hoe-het-werkt"
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              Hoe het werkt
            </Link>
            <Link
              href="#voor-wie"
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              Voor wie
            </Link>
            <Link
              href="#prijzen"
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              Prijzen
            </Link>
          </nav>
        )}

        {/* Right */}
        <div className="flex items-center gap-3">
          {resolvedVariant === "landing" && (
            <>
              <SignedOut>
                <Button
                  variant="ghost"
                  asChild
                  className="text-white"
                >
                  <Link href="/choose">Registreer</Link>
                </Button>
                <Button
                  asChild
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  <Link href="/choose">Login</Link>
                </Button>
              </SignedOut>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </>
          )}

          {resolvedVariant === "app" && (
            <>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-800 bg-slate-950/40 text-slate-200 hover:text-white hover:bg-slate-900 transition"
                aria-label="Notifications"
              >
                <Icon name="bell" className="h-4 w-4" />
              </button>

              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>

              <SignedOut>
                <Button
                  asChild
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  <Link href="/choose">Login</Link>
                </Button>
              </SignedOut>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
