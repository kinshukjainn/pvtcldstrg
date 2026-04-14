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

  // Reusable sharp button class for consistency
  const solidButtonClass =
    "inline-flex items-center justify-center font-bold px-4 py-2 border-2 border-[#000000] shadow-[4px_4px_0px_#000000] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all duration-150  text-[14px]";

  return (
    <header className="sticky top-0 z-50 w-full bg-[#1e1e1e] border-b-4 border-[#000000]">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-150 z-50"
          onClick={closeMenu}
        >
          <div className="w-10 h-10 bg-[#000000] flex items-center justify-center border-2 border-[#444444]">
            <BsCloudRain className="w-6 h-6 text-[#ff9900]" />
          </div>
          <span className="text-white font-bold text-[22px] tracking-tight  flex items-center gap-3">
            Kosha
            <span className="px-2 py-0.5 text-[11px] font-bold bg-[#ff9900] text-black border-2 border-[#000000]  tracking-wider">
              Beta
            </span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-[14px] font-bold  tracking-wide absolute left-1/2 -translate-x-1/2">
          {isLoaded && userId && (
            <Link
              href="/dashboard"
              className="text-[#aaaaaa] hover:text-[#ff9900] transition-colors duration-150"
            >
              Dashboard
            </Link>
          )}
          <Link
            href="/supported-formats"
            className="text-[#aaaaaa] hover:text-[#ff9900] transition-colors duration-150"
          >
            Supported Formats
          </Link>
          <Link
            href="/about-us"
            className="text-[#aaaaaa] hover:text-[#ff9900] transition-colors duration-150"
          >
            About Us
          </Link>
          <Link
            href="/git-track"
            className="text-[#aaaaaa] hover:text-[#ff9900] transition-colors duration-150"
          >
            Project Logs
          </Link>
          <Link
            href="/openned-tickets"
            className="text-[#aaaaaa] hover:text-[#ff9900] transition-colors duration-150"
          >
            Tickets
          </Link>
          <Link
            href="/pricing"
            className="text-[#0088ff] hover:text-white transition-colors duration-150"
          >
            Pricing
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-5">
          <a
            href="https://github.com/kinshukjainn/pvtcldstrg"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center bg-[#000000] border-2 border-[#444444] text-white hover:border-[#ff9900] hover:text-[#ff9900] transition-colors duration-150"
            aria-label="GitHub Repository"
          >
            <FaGithub className="w-5 h-5" />
          </a>
          {isLoaded && !userId && (
            <Link
              href="/verify-regis"
              className={`${solidButtonClass} bg-[#0055cc] text-white`}
            >
              Sign In / Up
            </Link>
          )}
          {isLoaded && userId && (
            <div className="border-2 border-[#000000] shadow-[4px_4px_0px_#000000] bg-[#111111]">
              <UserProfileDropdown variant="desktop" />
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden flex items-center justify-center w-12 h-12 bg-[#000000] border-2 border-[#444444] text-white hover:border-[#ff9900] hover:text-[#ff9900] z-50 transition-colors duration-150 cursor-pointer"
          onClick={toggleMenu}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? (
            <PanelBottomOpen className="w-6 h-6" />
          ) : (
            <PanelBottomClose className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="absolute top-[80px] left-0 w-full bg-[#111111] border-b-4 border-[#000000] md:hidden flex flex-col p-6 shadow-[0px_8px_0px_rgba(0,0,0,1)] z-40">
          <nav className="flex flex-col gap-2 text-[16px] font-bold  tracking-wide">
            {isLoaded && userId && (
              <Link
                href="/dashboard"
                className="text-[#dddddd] hover:text-[#ff9900] bg-[#1e1e1e] border-2 border-[#444444] p-3 hover:border-[#ff9900] transition-colors duration-150"
                onClick={closeMenu}
              >
                Dashboard
              </Link>
            )}
            <Link
              href="/supported-formats"
              className="text-[#dddddd] hover:text-[#ff9900] bg-[#1e1e1e] border-2 border-[#444444] p-3 hover:border-[#ff9900] transition-colors duration-150"
              onClick={closeMenu}
            >
              Supported Formats
            </Link>
            <Link
              href="/about-us"
              className="text-[#dddddd] hover:text-[#ff9900] bg-[#1e1e1e] border-2 border-[#444444] p-3 hover:border-[#ff9900] transition-colors duration-150"
              onClick={closeMenu}
            >
              About Us
            </Link>
            <Link
              href="/git-track"
              className="text-[#dddddd] hover:text-[#ff9900] bg-[#1e1e1e] border-2 border-[#444444] p-3 hover:border-[#ff9900] transition-colors duration-150"
              onClick={closeMenu}
            >
              Project Logs
            </Link>
            <Link
              href="/openned-tickets"
              className="text-[#dddddd] hover:text-[#ff9900] bg-[#1e1e1e] border-2 border-[#444444] p-3 hover:border-[#ff9900] transition-colors duration-150"
              onClick={closeMenu}
            >
              Opened Tickets
            </Link>
            <Link
              href="/pricing"
              className="text-[#0088ff] hover:text-white bg-[#1e1e1e] border-2 border-[#444444] p-3 transition-colors duration-150"
              onClick={closeMenu}
            >
              Pricing
            </Link>
          </nav>

          <div className="w-full h-1 bg-[#333333] my-6" />

          <div className="flex flex-col gap-4">
            <a
              href="https://github.com/kinshukjainn/pvtcldstrg"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 text-[#dddddd] hover:text-[#ff9900] bg-[#1e1e1e] border-2 border-[#444444] p-3 transition-colors duration-150 font-bold "
            >
              <FaGithub className="w-6 h-6" />
              <span>Open Source</span>
            </a>

            {isLoaded && !userId && (
              <Link
                href="/verify-regis"
                className={`${solidButtonClass} bg-[#0055cc] text-white w-full py-4 text-[16px] mt-2`}
                onClick={closeMenu}
              >
                Sign In / Up
              </Link>
            )}
            {isLoaded && userId && (
              <div className="mt-2 border-2 border-[#000000] bg-[#1e1e1e] p-2">
                <UserProfileDropdown variant="mobile" onAction={closeMenu} />
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
