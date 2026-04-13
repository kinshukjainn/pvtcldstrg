"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

import { BsCloudRain } from "react-icons/bs";
import { FaGithub } from "react-icons/fa";
import UserProfileDropdown from "./Userprofiledropdown";
import { PanelBottomClose, PanelBottomOpen } from "lucide-react";

export default function Header() {
  const { isLoaded, userId } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[#0a0a0c]/80 backdrop-blur-2xl backdrop-saturate-150">
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-300 z-50"
          onClick={closeMenu}
        >
          <BsCloudRain className="w-8 h-8 text-[#ff9100]" />
          <span className="text-white special-font font-semibold text-[24px] tracking-tight flex items-center gap-2">
            Kosha
            <span className="px-2 py-[3px] text-[13px] font-semibold rounded-full bg-blue-800  font-mono  text-white">
              Beta version
            </span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-[16px] font-medium absolute left-1/2 -translate-x-1/2">
          {isLoaded && userId && (
            <Link
              href="/dashboard"
              className="text-neutral-400 hover:text-white transition-colors duration-300"
            >
              Dashboard
            </Link>
          )}
          <Link
            href="/supported-formats"
            className="text-neutral-400 hover:text-white transition-colors duration-300"
          >
            Supported Formats
          </Link>
          <Link
            href="/about-us"
            className="text-neutral-400 hover:text-white transition-colors duration-300"
          >
            About Us
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="https://github.com/kinshukjainn/pvtcldstrg"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white  transition-colors duration-300"
            aria-label="GitHub Repository"
          >
            <FaGithub className="w-7 h-7" />
          </a>
          {isLoaded ||
            (!userId && (
              <Link
                href="/verify-regis"
                className="inline-flex items-center justify-center text-[15px] font-medium text-white px-4 py-2 rounded-xl bg-blue-800  active:scale-[0.97] transition-all duration-200"
              >
                Sign in / Up
              </Link>
            ))}
          {isLoaded && userId && <UserProfileDropdown variant="desktop" />}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden cursor-pointer text-neutral-200 bg-blue-800 rounded-md hover:text-white z-50 p-2 -mr-2 transition-colors duration-200"
          onClick={toggleMenu}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? (
            <PanelBottomOpen className="w-5 h-5" />
          ) : (
            <PanelBottomClose className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="absolute top-14 left-0 w-full rounded-b-2xl h-max bg-[#121212] border-b border-white/[0.06] md:hidden flex flex-col py-6 px-6 gap-5 h-[calc(100vh-3.5rem)] animate-[fadeIn_0.2s_ease-out]">
          <nav className="flex flex-col gap-1 text-[17px] font-medium">
            {isLoaded && userId && (
              <Link
                href="/dashboard"
                className="text-neutral-300 hover:text-white  p-2 hover:bg-[#202020] rounded-lg transition-colors duration-200 py-2"
                onClick={closeMenu}
              >
                Dashboard
              </Link>
            )}
            <Link
              href="/supported-formats"
              className="text-neutral-300 hover:text-white p-2 hover:bg-[#202020] rounded-lg transition-colors duration-200 py-2"
              onClick={closeMenu}
            >
              Supported Formats
            </Link>
            <Link
              href="/about-us"
              className="text-neutral-300 hover:text-white p-2 hover:bg-[#202020] rounded-lg transition-colors duration-200 py-2"
              onClick={closeMenu}
            >
              About Us
            </Link>
          </nav>

          <div className="w-full h-px bg-white/[0.06]" />

          <div className="flex flex-col gap-4">
            <a
              href="https://github.com/kinshukjainn/pvtcldstrg"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-neutral-200 hover:text-white transition-colors duration-200"
            >
              <FaGithub className="w-5 h-5" />
              <span className="text-[16px]">Open Source</span>
            </a>

            {isLoaded && !userId && (
              <Link
                href="/verify-regis"
                className="inline-flex items-center justify-center text-[18px] font-medium text-white px-4 py-3 rounded-xl bg-blue-800  active:scale-[0.97] transition-all duration-200"
                onClick={closeMenu}
              >
                Sign in / Up
              </Link>
            )}
            {isLoaded && userId && (
              <UserProfileDropdown variant="mobile" onAction={closeMenu} />
            )}
          </div>
        </div>
      )}
    </header>
  );
}
