"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs";

import { FaGithub } from "react-icons/fa";
import UserProfileDropdown from "./Userprofiledropdown";
import {
  PanelBottomClose,
  PanelBottomOpen,
  LayoutDashboard,
  FileStack,
  Users,
  GitBranch,
  Ticket,
  CreditCard,
  ShieldCheck,
  FileText,
  LogIn,
} from "lucide-react";

export default function Header() {
  const { isLoaded, userId } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setIsMobileMenuOpen(false);

  const navLinkClasses =
    "px-3 py-1.5 text-black hover:bg-blue-200 rounded-xl font-semibold text-[13px] transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5";

  const mobileNavLinkClasses =
    "flex items-center gap-3 w-full text-left px-6 py-3.5 text-gray-900 font-semibold hover:bg-gray-100 hover:text-[#0078D4] border-b border-gray-100 transition-colors text-[14px] cursor-pointer";

  const iconSize = "w-[14px] h-[14px]";
  const mobileIconSize = "w-[18px] h-[18px] text-gray-600";

  return (
    <header className="sticky top-0 z-50 w-full bg-white text-black border-b border-gray-300">
      <div className="flex items-center justify-between h-12 px-3 sm:px-4 w-full max-w-[1920px] mx-auto">
        {/* Left Section: Logo & Desktop Navigation */}
        <div className="flex items-center h-full">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:bg-black/5 px-2 py-1.5 rounded-xl transition-colors duration-150 z-50 mr-4"
            onClick={closeMenu}
          >
            <Image
              src="/anylogo.png"
              alt="Kosha Logo"
              width={50}
              height={50}
              className="object-contain"
            />
            <span className="text-black font-semibold text-[22px] tracking-wide flex items-center gap-2">
              KOSHA
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex justify-center items-center gap-1 h-full">
            {isLoaded && userId && (
              <Link href="/dashboard" className={navLinkClasses}>
                <LayoutDashboard className={iconSize} />
                Dashboard
              </Link>
            )}
            <Link href="/supported-formats" className={navLinkClasses}>
              <FileStack className={iconSize} />
              Supported Formats
            </Link>
            <Link href="/about-us" className={navLinkClasses}>
              <Users className={iconSize} />
              About Us
            </Link>
            <Link href="/git-track" className={navLinkClasses}>
              <GitBranch className={iconSize} />
              Project Logs
            </Link>
            <Link href="/openned-tickets" className={navLinkClasses}>
              <Ticket className={iconSize} />
              Tickets
            </Link>
            <Link href="/pricing" className={navLinkClasses}>
              <CreditCard className={iconSize} />
              Pricing
            </Link>
            <Link
              href="/privacy-policy"
              className={`underline ${navLinkClasses}`}
            >
              <ShieldCheck className={iconSize} />
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className={`underline ${navLinkClasses}`}
            >
              <FileText className={iconSize} />
              Terms of Service
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
              className="flex items-center justify-center p-2 hover:bg-black/5 rounded-xl transition-colors duration-150"
              aria-label="GitHub Repository"
            >
              <FaGithub className="w-[18px] h-[18px] text-black" />
            </a>

            {/* Vertical Divider */}
            <div className="w-px h-5 bg-black/20 mx-1" />

            {isLoaded && !userId && (
              <Link
                href="/verify-regis"
                className="bg-[#0078D4] text-white hover:bg-[#005a9e] px-4 py-2 rounded-full text-[13px] font-semibold transition-colors shadow-sm ml-1 flex items-center gap-1.5"
              >
                <LogIn className="w-[14px] h-[14px]" />
                Sign In / Up
              </Link>
            )}
            {isLoaded && userId && (
              <div className="flex items-center hover:bg-black/5 p-1 rounded-xl transition-colors cursor-pointer ml-1">
                <UserProfileDropdown variant="desktop" />
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden flex items-center justify-center p-2 hover:bg-black/5 rounded-xl transition-colors duration-150 cursor-pointer"
            onClick={toggleMenu}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <PanelBottomOpen className="w-5 h-5 text-black" />
            ) : (
              <PanelBottomClose className="w-5 h-5 text-black" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
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
              <LayoutDashboard className={mobileIconSize} />
              Dashboard
            </Link>
          )}
          <Link
            href="/supported-formats"
            className={mobileNavLinkClasses}
            onClick={closeMenu}
          >
            <FileStack className={mobileIconSize} />
            Supported Formats
          </Link>
          <Link
            href="/about-us"
            className={mobileNavLinkClasses}
            onClick={closeMenu}
          >
            <Users className={mobileIconSize} />
            About Us
          </Link>
          <Link
            href="/git-track"
            className={mobileNavLinkClasses}
            onClick={closeMenu}
          >
            <GitBranch className={mobileIconSize} />
            Project Logs
          </Link>
          <Link
            href="/openned-tickets"
            className={mobileNavLinkClasses}
            onClick={closeMenu}
          >
            <Ticket className={mobileIconSize} />
            Opened Tickets
          </Link>
          <Link
            href="/pricing"
            className={mobileNavLinkClasses}
            onClick={closeMenu}
          >
            <CreditCard className={mobileIconSize} />
            Pricing
          </Link>
          <Link
            href="/privacy-policy"
            className={`underline ${mobileNavLinkClasses}`}
            onClick={closeMenu}
          >
            <ShieldCheck className={mobileIconSize} />
            Privacy Policy
          </Link>
          <Link
            href="/terms-of-service"
            className={`underline ${mobileNavLinkClasses}`}
            onClick={closeMenu}
          >
            <FileText className={mobileIconSize} />
            Terms of Service
          </Link>

          <div className="w-full h-px bg-gray-200 my-2" />

          <a
            href="https://github.com/kinshukjainn/pvtcldstrg"
            target="_blank"
            rel="noopener noreferrer"
            className={mobileNavLinkClasses}
          >
            <FaGithub className={mobileIconSize} />
            <span>Open Source</span>
          </a>

          {isLoaded && !userId && (
            <div className="px-6 py-4">
              <Link
                href="/verify-regis"
                className="flex items-center justify-center gap-2 w-full bg-[#0078D4] hover:bg-[#005a9e] text-white px-4 py-2.5 rounded-xl text-[14px] font-semibold transition-colors"
                onClick={closeMenu}
              >
                <LogIn className="w-[16px] h-[16px]" />
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
