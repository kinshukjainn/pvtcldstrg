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

  // AuthPage Theme 3D Button Classes
  const secondaryButtonClass =
    "w-full flex items-center cursor-pointer gap-3 py-2 px-4 font-bold text-[13px]  bg-[#dddddd] text-black border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#888888] border-b-[#888888] active:border-t-[#888888] active:border-l-[#888888] active:border-b-[#ffffff] active:border-r-[#ffffff] hover:bg-[#ffffff] disabled:opacity-50 disabled:cursor-not-allowed rounded-none transition-none";

  const dangerButtonClass =
    "w-full flex items-center cursor-pointer gap-3 py-2 px-4 font-bold text-[13px]  bg-[#cc0000] text-white border-2 border-t-[#ff3333] border-l-[#ff3333] border-r-[#660000] border-b-[#660000] active:border-t-[#660000] active:border-l-[#660000] active:border-b-[#ff3333] active:border-r-[#ff3333] hover:bg-[#ee0000] disabled:opacity-50 disabled:cursor-not-allowed rounded-none transition-none";

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
  // Line 68: remove .toLowerCase()
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
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

  // Sharp, square avatar rendering matched to theme
  const renderAvatar = (size: number) =>
    avatarUrl ? (
      <Image
        src={avatarUrl}
        alt={displayName}
        width={size}
        height={size}
        unoptimized
        className="object-cover shrink-0 border border-[#444444] rounded-none bg-[#000000]"
        referrerPolicy="no-referrer"
      />
    ) : (
      <span
        className="bg-[#dd7700] text-white font-bold flex items-center justify-center shrink-0 border border-[#444444] rounded-none"
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
          className="w-full flex items-center gap-3 p-3 bg-[#1e1e1e] border border-[#444444] shadow-[4px_4px_0px_#000000] hover:border-[#dd7700] transition-colors duration-150 cursor-pointer rounded-none outline-none group"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          {renderAvatar(36)}
          <div className="min-w-0 flex-1 text-left">
            <p className="text-[14px] font-bold text-white  tracking-tight truncate group-hover:text-[#dd7700] transition-colors">
              {displayName}
            </p>
            {email && (
              <p className="text-[11px] font-bold text-[#aaaaaa] tracking-wider truncate mt-0.5 ">
                {email}
              </p>
            )}
          </div>
          <div className="w-8 h-8 flex items-center justify-center bg-[#000000] border border-[#555555] transition-colors duration-150 shrink-0 group-hover:border-[#dd7700]">
            <FiChevronDown
              className={`w-4 h-4 text-[#aaaaaa] transition-transform duration-200 group-hover:text-[#dd7700] ${
                isOpen ? "rotate-180 text-[#dd7700]" : ""
              }`}
            />
          </div>
        </button>

        {isOpen && (
          <div className="mt-3 flex flex-col gap-3 p-3 bg-[#111111] border border-[#444444] shadow-[4px_4px_0px_#000000]">
            <button onClick={handleManage} className={secondaryButtonClass}>
              <FiSettings className="w-4 h-4 shrink-0" />
              <span>Manage Account</span>
            </button>

            <button onClick={handleSignOut} className={dangerButtonClass}>
              <FiLogOut className="w-4 h-4 shrink-0" />
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
        className="flex items-center gap-2 p-1.5 pr-2 bg-[#1e1e1e] border border-[#444444] shadow-[2px_2px_0px_#000000] hover:border-[#dd7700] active:translate-y-[1px] active:shadow-none transition-all duration-150 cursor-pointer outline-none rounded-none group"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {renderAvatar(28)}
        <FiChevronDown
          className={`w-4 h-4 text-[#aaaaaa] transition-transform duration-200 group-hover:text-[#dd7700] ${
            isOpen ? "rotate-180 text-[#dd7700]" : ""
          }`}
        />
      </button>

      {/* Desktop Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-[calc(100%+8px)] w-[260px] sm:w-[280px] bg-[#1e1e1e] border border-[#444444] shadow-[6px_6px_0px_#000000] z-50 rounded-none">
          {/* User Info Header */}
          <div className="flex items-center gap-3 p-4 border-b border-[#444444] bg-[#000000]">
            {renderAvatar(40)}
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-bold text-white  tracking-tight truncate">
                {displayName}
              </p>
              {email && (
                <p className="text-[10px] font-bold text-[#aaaaaa] tracking-wider  truncate mt-0.5">
                  {email}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-4 flex flex-col gap-3">
            <button onClick={handleManage} className={secondaryButtonClass}>
              <FiSettings className="w-4 h-4 shrink-0" />
              <span>Manage Account</span>
            </button>

            <div className="w-full border-t border-[#333333] my-0.5"></div>

            <button onClick={handleSignOut} className={dangerButtonClass}>
              <FiLogOut className="w-4 h-4 shrink-0" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
