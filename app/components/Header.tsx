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

  // Azure-themed Desktop Navigation Link
  const navLinkClasses =
    "px-3 py-1.5 text-white hover:bg-white/10 rounded-sm font-semibold text-[13px] transition-colors cursor-pointer whitespace-nowrap";

  // Azure-themed Mobile Dropdown Link
  const mobileNavLinkClasses =
    "block w-full text-left px-6 py-3.5 text-gray-900 font-semibold hover:bg-gray-100 hover:text-[#0078D4] border-b border-gray-100 transition-colors text-[14px] cursor-pointer";

  return (
    <header className="sticky top-0 z-50 w-full bg-[#005A9E] text-white shadow-md">
      <div className="flex items-center justify-between h-12 px-3 sm:px-4 w-full max-w-[1920px] mx-auto">
        {/* Left Section: Logo & Desktop Navigation */}
        <div className="flex items-center h-full">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:bg-white/10 px-2 py-1.5 rounded-sm transition-colors duration-150 z-50 mr-4"
            onClick={closeMenu}
          >
            <BsCloudRain className="w-5 h-5 text-[#ff9900]" />
            <span className="text-white font-semibold text-[15px] tracking-wide flex items-center gap-2">
              Kosha
              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#0078D4] text-white uppercase tracking-wider rounded-sm">
                Beta
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 h-full">
            {isLoaded && userId && (
              <Link href="/dashboard" className={navLinkClasses}>
                Dashboard
              </Link>
            )}
            <Link href="/supported-formats" className={navLinkClasses}>
              Supported Formats
            </Link>
            <Link href="/about-us" className={navLinkClasses}>
              About Us
            </Link>
            <Link href="/git-track" className={navLinkClasses}>
              Project Logs
            </Link>
            <Link href="/openned-tickets" className={navLinkClasses}>
              Tickets
            </Link>
            <Link href="/pricing" className={navLinkClasses}>
              Pricing
            </Link>
          </nav>
        </div>

        {/* Right Section: Desktop Actions & Mobile Toggle */}
        <div className="flex items-center gap-1 sm:gap-2 h-full">
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            <a
              href="https://github.com/kinshukjainn/pvtcldstrg"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center p-2 hover:bg-white/10 rounded-sm transition-colors duration-150"
              aria-label="GitHub Repository"
            >
              <FaGithub className="w-[18px] h-[18px]" />
            </a>

            {/* Vertical Divider */}
            <div className="w-px h-5 bg-white/20 mx-1" />

            {isLoaded && !userId && (
              <Link
                href="/verify-regis"
                className="bg-white text-[#005A9E] hover:bg-gray-100 px-4 py-1.5 rounded-sm text-[13px] font-semibold transition-colors shadow-sm ml-1"
              >
                Sign In / Up
              </Link>
            )}
            {isLoaded && userId && (
              <div className="flex items-center hover:bg-white/10 p-1 rounded-sm transition-colors cursor-pointer ml-1">
                <UserProfileDropdown variant="desktop" />
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden flex items-center justify-center p-2 hover:bg-white/10 rounded-sm transition-colors duration-150 cursor-pointer"
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
      </div>

      {/* Mobile Navigation Dropdown (Azure Context Menu Style) */}
      <div
        className={`md:hidden absolute top-12 left-0 w-full bg-white shadow-xl transition-all duration-200 ease-in-out origin-top overflow-hidden border-b border-gray-300 ${
          isMobileMenuOpen
            ? "opacity-100 max-h-[80vh] overflow-y-auto"
            : "opacity-0 max-h-0"
        }`}
      >
        <nav className="flex flex-col py-2">
          {isLoaded && userId && (
            <Link
              href="/dashboard"
              className={mobileNavLinkClasses}
              onClick={closeMenu}
            >
              Dashboard
            </Link>
          )}
          <Link
            href="/supported-formats"
            className={mobileNavLinkClasses}
            onClick={closeMenu}
          >
            Supported Formats
          </Link>
          <Link
            href="/about-us"
            className={mobileNavLinkClasses}
            onClick={closeMenu}
          >
            About Us
          </Link>
          <Link
            href="/git-track"
            className={mobileNavLinkClasses}
            onClick={closeMenu}
          >
            Project Logs
          </Link>
          <Link
            href="/openned-tickets"
            className={mobileNavLinkClasses}
            onClick={closeMenu}
          >
            Opened Tickets
          </Link>
          <Link
            href="/pricing"
            className={mobileNavLinkClasses}
            onClick={closeMenu}
          >
            Pricing
          </Link>

          <div className="w-full h-px bg-gray-200 my-2" />

          <a
            href="https://github.com/kinshukjainn/pvtcldstrg"
            target="_blank"
            rel="noopener noreferrer"
            className={`${mobileNavLinkClasses} flex items-center gap-3`}
          >
            <FaGithub className="w-[18px] h-[18px] text-gray-700" />
            <span>Open Source</span>
          </a>

          {isLoaded && !userId && (
            <div className="px-6 py-4">
              <Link
                href="/verify-regis"
                className="flex items-center justify-center w-full bg-[#0078D4] hover:bg-[#005a9e] text-white px-4 py-2.5 rounded-sm text-[14px] font-semibold transition-colors"
                onClick={closeMenu}
              >
                Sign In / Up
              </Link>
            </div>
          )}

          {isLoaded && userId && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <UserProfileDropdown variant="mobile" onAction={closeMenu} />
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
