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

  const renderAvatar = (size: number) =>
    avatarUrl ? (
      <Image
        src={avatarUrl}
        alt={displayName}
        width={size}
        height={size}
        unoptimized
        className="rounded-lg object-cover ring-1 ring-white/10 shrink-0"
        referrerPolicy="no-referrer"
      />
    ) : (
      <span
        className="rounded-full bg-emerald-500/20 text-emerald-400 font-semibold flex items-center justify-center shrink-0 ring-1 ring-emerald-400/20"
        style={{
          width: size,
          height: size,
          fontSize: size < 32 ? 11 : 14,
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
          className="w-full flex items-center gap-3 p-3 rounded-xl border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.06] active:scale-[0.99] transition-all duration-200 cursor-pointer"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          {renderAvatar(36)}
          <div className="min-w-0 flex-1 text-left">
            <p className="text-[17px] font-bold text-white truncate leading-tight">
              {displayName}
            </p>
            {email && (
              <p className="text-[14px] text-green-500 truncate mt-0.5">
                {email}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1 p-2 rounded-full bg-blue-800  transition-colors duration-150">
            <FiChevronDown
              className={`w-4 h-4 text-neutral-100 transition-transform duration-200 shrink-0 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </button>

        {isOpen && (
          <div className="mt-2 flex flex-col gap-2 animate-[fadeIn_0.15s_ease-out]">
            <button
              onClick={handleManage}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-300 hover:text-white bg-white/[0.02] hover:bg-white/[0.06] active:bg-white/[0.03] border border-[#313131] transition-colors duration-150 cursor-pointer"
            >
              <FiSettings className="w-4 h-4 text-neutral-500 shrink-0" />
              <span className="text-[16px] font-medium">Manage account</span>
            </button>

            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 w-max rounded-xl text-white  bg-red-500 transition-colors duration-150 cursor-pointer"
            >
              <FiLogOut className="w-4 h-4 text-white shrink-0" />
              <span className="text-[16px] font-medium">Sign out</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  /* ─── DESKTOP: floating dropdown ─── */
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-lg p-0.5 pr-2 border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] active:scale-[0.97] transition-all duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {renderAvatar(28)}
        <FiChevronDown
          className={`w-3.5 h-3.5 text-neutral-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-[calc(100%+8px)] w-[280px] sm:w-[300px] rounded-xl border border-white/[0.08] bg-[#111113] shadow-2xl shadow-black/60 overflow-hidden animate-[dropdownIn_0.18s_ease-out]">
          <div className="flex items-center gap-3 px-4 py-4 border-b border-white/[0.06]">
            {renderAvatar(40)}
            <div className="min-w-0 flex-1">
              <p className="text-[17px] font-semibold text-white truncate leading-tight">
                {displayName}
              </p>
              {email && (
                <p className="text-[14px] text-green-500 truncate mt-0.5">
                  {email}
                </p>
              )}
            </div>
          </div>

          <div className="p-1.5 gap-2 flex flex-col">
            <button
              onClick={handleManage}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-neutral-300 hover:text-white hover:bg-white/[0.06] active:bg-white/[0.03] transition-colors duration-150 cursor-pointer"
            >
              <FiSettings className="w-4 h-4 text-white" />
              <span className="text-[17px] font-medium">Manage account</span>
            </button>

            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white bg-red-500 transition-colors duration-150 cursor-pointer"
            >
              <FiLogOut className="w-4 h-4 text-white" />
              <span className="text-[17px] font-medium">Sign out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
