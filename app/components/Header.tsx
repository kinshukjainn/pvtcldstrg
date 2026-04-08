"use client"; // <-- This is the crucial line that fixes your error!
import Link from "next/link";
import { CloudRain } from "lucide-react";
import { UserButton, useAuth } from "@clerk/nextjs";

export default function Header() {
  // Pull the authentication state directly from Clerk
  const { isLoaded, userId } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <CloudRain className="w-6 h-6 text-emerald-400" />
          <span className="text-zinc-100 font-semibold text-lg">
            WoolyCloud
          </span>
        </Link>

        <nav className="hidden sm:flex items-center gap-8 text-sm font-medium">
          <Link
            href="/supported-formats"
            className="text-zinc-300 hover:text-emerald-400 transition-colors"
          >
            Supported Formats
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {/* 1. Show "Sign in" ONLY if Clerk has loaded and there is NO user */}
          {isLoaded && !userId && (
            <Link
              href="/verify-regis"
              className="inline-flex items-center justify-center text-md font-medium text-zinc-900 hover:text-black px-4 py-2 rounded-full border border-zinc-800 bg-[#ff9100] transition-all duration-200"
            >
              Sign in / Up
            </Link>
          )}

          {/* 2. Show the Avatar ONLY if Clerk has loaded and there IS a user */}
          {isLoaded && userId && (
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-9 h-9",
                },
              }}
            />
          )}
        </div>
      </div>
    </header>
  );
}
