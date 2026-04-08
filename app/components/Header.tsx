"use client";
import { useState } from "react";
import Link from "next/link";
import { UserButton, useAuth } from "@clerk/nextjs";

// Using react-icons exclusively as requested
import { BsCloudRain } from "react-icons/bs";
import { FaGithub } from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";

export default function Header() {
  const { isLoaded, userId } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Helper function to render auth UI to keep code DRY across desktop and mobile
  const renderAuthUI = () => (
    <>
      {isLoaded && !userId && (
        <Link
          href="/verify-regis"
          className="inline-flex items-center justify-center text-md font-medium text-zinc-900 hover:text-black px-4 py-2 rounded-full border border-zinc-800 bg-[#ff9100] hover:bg-[#ff9100]/90 transition-all duration-200"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Sign in / Up
        </Link>
      )}
      {isLoaded && userId && (
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-9 h-9",
            },
          }}
        />
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity z-50"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <BsCloudRain className="w-6 h-6 text-emerald-400" />
          <span className="text-zinc-100 font-semibold text-lg">
            WoolyCloud
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium absolute left-1/2 -translate-x-1/2">
          <Link
            href="/supported-formats"
            className="text-zinc-300 hover:text-emerald-400 transition-colors"
          >
            Supported Formats
          </Link>
          <Link
            href="/about-us"
            className="text-zinc-300 hover:text-emerald-400 transition-colors"
          >
            About Us
          </Link>
        </nav>

        {/* Desktop Actions (GitHub + Auth) */}
        <div className="hidden md:flex items-center gap-5">
          <a
            href="https://github.com/yourusername/yourrepo"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-white transition-colors"
            aria-label="GitHub Repository"
          >
            <FaGithub className="w-6 h-6" />
          </a>
          {renderAuthUI()}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          className="md:hidden text-zinc-300 hover:text-white z-50 p-2 -mr-2"
          onClick={toggleMenu}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? (
            <FiX className="w-6 h-6" />
          ) : (
            <FiMenu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-zinc-950/95 border-b border-zinc-800/50 backdrop-blur-xl md:hidden flex flex-col py-6 px-6 gap-6 shadow-2xl h-[calc(100vh-4rem)]">
          <nav className="flex flex-col gap-4 text-base font-medium">
            <Link
              href="/supported-formats"
              className="text-zinc-300 hover:text-emerald-400 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Supported Formats
            </Link>
            <Link
              href="/about-us"
              className="text-zinc-300 hover:text-emerald-400 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About Us
            </Link>
          </nav>

          <div className="w-full h-px bg-zinc-800/50" />

          <div className="flex flex-col gap-6">
            <a
              href="https://github.com/kinshukjainn/pvtcldstrg"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors"
            >
              <FaGithub className="w-6 h-6" />
              <span>View GitHub Repo</span>
            </a>

            <div className="flex items-center gap-4">{renderAuthUI()}</div>
          </div>
        </div>
      )}
    </header>
  );
}
