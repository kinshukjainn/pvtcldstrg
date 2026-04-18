"use client";

import { useState, useRef, useEffect } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { FiLogOut, FiSettings, FiChevronDown } from "react-icons/fi";
import Image from "next/image";

interface UserProfileDropdownProps {
  variant?: "desktop" | "mobile";
  onAction?: () => void;
}

export default function UserProfileDropdown({
  variant = "desktop",
  onAction,
}: UserProfileDropdownProps) {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Azure Standard Context Menu Button Classes
  const menuButtonClass =
    "w-full flex items-center cursor-pointer gap-3 py-2 px-3 text-[13px] text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-sm outline-none";

  const dangerMenuButtonClass =
    "w-full flex items-center cursor-pointer gap-3 py-2 px-3 text-[13px] text-[#a4262c] hover:bg-[#fdf3f4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-sm outline-none";

  useEffect(() => {
    if (variant !== "desktop") return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [variant]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  if (!user) return null;

  const displayName =
    user.fullName || user.firstName || user.username || "User";
  const email = user.primaryEmailAddress?.emailAddress || "";
  const avatarUrl = user.imageUrl;

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleManage = () => {
    setIsOpen(false);
    onAction?.();
    openUserProfile();
  };

  const handleSignOut = () => {
    setIsOpen(false);
    onAction?.();
    signOut();
  };

  // Standard Microsoft/Azure circular avatar
  const renderAvatar = (size: number) =>
    avatarUrl ? (
      <Image
        src={avatarUrl}
        alt={displayName}
        width={size}
        height={size}
        unoptimized
        className="object-cover shrink-0 rounded-full border border-gray-200 bg-white"
        referrerPolicy="no-referrer"
      />
    ) : (
      <span
        className="bg-[#0078D4] text-white font-semibold flex items-center justify-center shrink-0 rounded-full"
        style={{
          width: size,
          height: size,
          fontSize: size < 32 ? 11 : 14,
        }}
      >
        {initials}
      </span>
    );

  /* ─── MOBILE: inline expandable card (Azure List Style) ─── */
  if (variant === "mobile") {
    return (
      <div
        className="w-full bg-white rounded-sm border border-gray-200 shadow-sm"
        ref={dropdownRef}
      >
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors duration-150 cursor-pointer outline-none group"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          {renderAvatar(36)}
          <div className="min-w-0 flex-1 text-left">
            <p className="text-[14px] font-semibold text-gray-900 truncate">
              {displayName}
            </p>
            {email && (
              <p className="text-[12px] text-gray-500 truncate mt-0.5">
                {email}
              </p>
            )}
          </div>
          <div className="w-8 h-8 flex items-center justify-center shrink-0">
            <FiChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                isOpen ? "rotate-180 text-[#0078D4]" : ""
              }`}
            />
          </div>
        </button>

        {isOpen && (
          <div className="flex flex-col gap-1 p-2 bg-gray-50 border-t border-gray-100">
            <button onClick={handleManage} className={menuButtonClass}>
              <FiSettings className="w-4 h-4 shrink-0 text-gray-500" />
              <span>Manage Account</span>
            </button>

            <button onClick={handleSignOut} className={dangerMenuButtonClass}>
              <FiLogOut className="w-4 h-4 shrink-0" />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  /* ─── DESKTOP: floating dropdown (Azure Top Nav Style) ─── */
  return (
    <div className="relative" ref={dropdownRef}>
      {/* Desktop Trigger (Styled for blue global header) */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 p-1 rounded-sm hover:bg-white/10 transition-colors duration-150 cursor-pointer outline-none group"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {renderAvatar(28)}
        <FiChevronDown
          className={`w-3.5 h-3.5 text-white/80 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Desktop Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-[calc(100%+8px)] w-[280px] bg-white border border-gray-200 shadow-md z-50 rounded-sm overflow-hidden">
          {/* User Info Header */}
          <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-[#faf9f8]">
            {renderAvatar(44)}
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-semibold text-gray-900 truncate">
                {displayName}
              </p>
              {email && (
                <p className="text-[12px] text-gray-500 truncate mt-0.5">
                  {email}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-2 flex flex-col">
            <button onClick={handleManage} className={menuButtonClass}>
              <FiSettings className="w-4 h-4 shrink-0 text-gray-500" />
              <span>Manage Account</span>
            </button>

            <div className="w-full border-t border-gray-100 my-1"></div>

            <button onClick={handleSignOut} className={dangerMenuButtonClass}>
              <FiLogOut className="w-4 h-4 shrink-0" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
