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

  // Reusable sharp button classes
  const actionButtonClass =
    "w-full flex items-center gap-3 px-4 py-3 border-2 border-[#000000] shadow-[4px_4px_0px_#000000] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all duration-150 uppercase font-bold text-[14px] cursor-pointer rounded-none";

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
    user.fullName || user.firstName || user.username || "USER";
  const email = user.primaryEmailAddress?.emailAddress || "";
  const avatarUrl = user.imageUrl;
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

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

  // Sharp, square avatar rendering
  const renderAvatar = (size: number) =>
    avatarUrl ? (
      <Image
        src={avatarUrl}
        alt={displayName}
        width={size}
        height={size}
        unoptimized
        className="object-cover shrink-0 border-2 border-[#000000] rounded-none bg-[#000000]"
        referrerPolicy="no-referrer"
      />
    ) : (
      <span
        className="bg-[#ff9900] text-black font-bold flex items-center justify-center shrink-0 border-2 border-[#000000] rounded-none"
        style={{
          width: size,
          height: size,
          fontSize: size < 32 ? 12 : 16,
        }}
      >
        {initials}
      </span>
    );

  /* ─── MOBILE: inline expandable card ─── */
  if (variant === "mobile") {
    return (
      <div className="w-full" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-full flex items-center gap-4 p-3 bg-[#1e1e1e] border-2 border-[#444444] shadow-[4px_4px_0px_#000000] hover:border-[#ff9900] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all duration-150 cursor-pointer rounded-none outline-none"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          {renderAvatar(40)}
          <div className="min-w-0 flex-1 text-left">
            <p className="text-[16px] font-bold text-white uppercase truncate">
              {displayName}
            </p>
            {email && (
              <p className="text-[12px] font-bold text-[#00cc44] truncate mt-0.5 uppercase">
                {email}
              </p>
            )}
          </div>
          <div className="w-8 h-8 flex items-center justify-center bg-[#000000] border-2 border-[#444444] transition-colors duration-150 shrink-0">
            <FiChevronDown
              className={`w-5 h-5 text-white transition-transform duration-200 ${
                isOpen ? "rotate-180 text-[#ff9900]" : ""
              }`}
            />
          </div>
        </button>

        {isOpen && (
          <div className="mt-4 flex flex-col gap-3 p-2 bg-[#111111] border-2 border-[#444444]">
            <button
              onClick={handleManage}
              className={`${actionButtonClass} bg-[#ffffff] text-black`}
            >
              <FiSettings className="w-5 h-5 shrink-0" />
              <span>Manage Account</span>
            </button>

            <button
              onClick={handleSignOut}
              className={`${actionButtonClass} bg-[#ff3333] text-white`}
            >
              <FiLogOut className="w-5 h-5 shrink-0" />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  /* ─── DESKTOP: floating dropdown ─── */
  return (
    <div className="relative" ref={dropdownRef}>
      {/* Desktop Trigger */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 p-1 pr-2 bg-[#1e1e1e] border-2 border-[#000000] shadow-[2px_2px_0px_#000000] hover:border-[#ff9900] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all duration-150 cursor-pointer outline-none rounded-none"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {renderAvatar(30)}
        <FiChevronDown
          className={`w-4 h-4 text-[#aaaaaa] transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#ff9900]" : ""
          }`}
        />
      </button>

      {/* Desktop Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-[calc(100%+12px)] w-[280px] sm:w-[320px] bg-[#1e1e1e] border-4 border-[#000000] shadow-[8px_8px_0px_#000000] z-50 rounded-none">
          {/* User Info Header */}
          <div className="flex items-center gap-4 px-4 py-4 border-b-4 border-[#000000] bg-[#111111]">
            {renderAvatar(44)}
            <div className="min-w-0 flex-1">
              <p className="text-[16px] font-bold text-white uppercase truncate">
                {displayName}
              </p>
              {email && (
                <p className="text-[12px] font-bold text-[#00cc44] uppercase truncate mt-0.5">
                  {email}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-4 flex flex-col gap-3">
            <button
              onClick={handleManage}
              className={`${actionButtonClass} bg-[#ffffff] text-black`}
            >
              <FiSettings className="w-5 h-5 shrink-0" />
              <span>Manage Account</span>
            </button>

            <button
              onClick={handleSignOut}
              className={`${actionButtonClass} bg-[#ff3333] text-white`}
            >
              <FiLogOut className="w-5 h-5 shrink-0" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
