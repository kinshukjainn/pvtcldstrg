"use client";
import React, {
  useState,
  useEffect,
  useRef,
  Suspense,
  type ReactNode,
  type RefObject,
} from "react";
import {
  ShieldCheck,
  Zap,
  Layout,
  ArrowRight,
  BrainCircuit,
  LockKeyhole,
  HardDrive,
  Check,
  FolderOpen,
  Upload,
  PartyPopper,
  Rocket,
  ChevronRight,
  BrickWallShield,
  FileCog,
  Cog,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth, useUser } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import HeroGrid from "./components/HeroGrid";

/* ── Azure Modern Color Tokens ── */
const az = {
  blue: "#0078d4",
  blueDark: "#005a9e",
  blueLight: "#deecf9",
  bluePale: "#eff6fc",
  bg: "#ffffff",
  bgAlt: "#faf9f8",
  bgPanel: "#f3f2f1",
  border: "#e8e6e3",
  borderStrong: "#d2d0ce",
  text: "#1b1a19",
  textSecondary: "#605e5c",
  textTertiary: "#a19f9d",
  green: "#107c10",
  greenLight: "#dff6dd",
  orange: "#ffaa44",
  orangeDark: "#d83b01",
  red: "#d13438",
  white: "#ffffff",
};

/* ── File Icons (Azure flat style) ── */
const fileIcons = [
  {
    label: "PDF",
    color: az.red,
    icon: (
      <svg viewBox="0 0 64 64" className="w-full h-full">
        <rect
          x="10"
          y="4"
          width="44"
          height="56"
          rx="3"
          fill="#fff"
          stroke={az.red}
          strokeWidth="2"
        />
        <rect x="10" y="4" width="44" height="14" rx="3" fill={az.red} />
        <text
          x="32"
          y="15"
          textAnchor="middle"
          fill="#fff"
          fontSize="10"
          fontWeight="600"
          fontFamily="'Segoe UI', sans-serif"
        >
          PDF
        </text>
        <rect x="18" y="26" width="28" height="2" rx="1" fill="#d2d0ce" />
        <rect x="18" y="32" width="22" height="2" rx="1" fill="#d2d0ce" />
        <rect x="18" y="38" width="26" height="2" rx="1" fill="#d2d0ce" />
        <rect x="18" y="44" width="18" height="2" rx="1" fill="#d2d0ce" />
      </svg>
    ),
  },
  {
    label: "DOC",
    color: az.blue,
    icon: (
      <svg viewBox="0 0 64 64" className="w-full h-full">
        <rect
          x="10"
          y="4"
          width="44"
          height="56"
          rx="3"
          fill="#fff"
          stroke={az.blue}
          strokeWidth="2"
        />
        <rect x="10" y="4" width="44" height="14" rx="3" fill={az.blue} />
        <text
          x="32"
          y="15"
          textAnchor="middle"
          fill="#fff"
          fontSize="10"
          fontWeight="600"
          fontFamily="'Segoe UI', sans-serif"
        >
          DOC
        </text>
        <rect x="18" y="26" width="28" height="2" rx="1" fill="#d2d0ce" />
        <rect x="18" y="32" width="22" height="2" rx="1" fill="#d2d0ce" />
        <rect x="18" y="38" width="26" height="2" rx="1" fill="#d2d0ce" />
        <rect x="18" y="44" width="18" height="2" rx="1" fill="#d2d0ce" />
      </svg>
    ),
  },
  {
    label: "PNG",
    color: "#8764b8",
    icon: (
      <svg viewBox="0 0 64 64" className="w-full h-full">
        <rect
          x="10"
          y="4"
          width="44"
          height="56"
          rx="3"
          fill="#fff"
          stroke="#8764b8"
          strokeWidth="2"
        />
        <rect x="10" y="4" width="44" height="14" rx="3" fill="#8764b8" />
        <text
          x="32"
          y="15"
          textAnchor="middle"
          fill="#fff"
          fontSize="10"
          fontWeight="600"
          fontFamily="'Segoe UI', sans-serif"
        >
          PNG
        </text>
        <rect x="18" y="28" width="28" height="18" rx="2" fill="#f3f2f1" />
        <circle cx="25" cy="33" r="3" fill="#d2d0ce" />
        <polygon points="22,44 32,34 38,40 44,36 46,44" fill="#d2d0ce" />
      </svg>
    ),
  },
  {
    label: "XLS",
    color: az.green,
    icon: (
      <svg viewBox="0 0 64 64" className="w-full h-full">
        <rect
          x="10"
          y="4"
          width="44"
          height="56"
          rx="3"
          fill="#fff"
          stroke={az.green}
          strokeWidth="2"
        />
        <rect x="10" y="4" width="44" height="14" rx="3" fill={az.green} />
        <text
          x="32"
          y="15"
          textAnchor="middle"
          fill="#fff"
          fontSize="10"
          fontWeight="600"
          fontFamily="'Segoe UI', sans-serif"
        >
          XLS
        </text>
        <rect
          x="18"
          y="26"
          width="12"
          height="6"
          rx="1"
          fill="#dff6dd"
          stroke="#d2d0ce"
          strokeWidth="0.5"
        />
        <rect
          x="34"
          y="26"
          width="12"
          height="6"
          rx="1"
          fill="#dff6dd"
          stroke="#d2d0ce"
          strokeWidth="0.5"
        />
        <rect
          x="18"
          y="35"
          width="12"
          height="6"
          rx="1"
          fill="#f3f2f1"
          stroke="#d2d0ce"
          strokeWidth="0.5"
        />
        <rect
          x="34"
          y="35"
          width="12"
          height="6"
          rx="1"
          fill="#f3f2f1"
          stroke="#d2d0ce"
          strokeWidth="0.5"
        />
      </svg>
    ),
  },
];

/* ── Shared Interfaces ── */
interface FadeInItemProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}
interface FeatureCardProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  delay: number;
}
interface ButtonProps {
  children: ReactNode;
  href: string;
  className?: string;
}
interface QuickActionProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  href: string;
  delay: number;
}
interface OnboardingStepProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  step: number;
  title: string;
  description: string;
  delay: number;
}

/* ── Shared Components ── */
const FadeInItem = ({
  children,
  delay = 0,
  className = "",
}: FadeInItemProps) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition:
          "opacity 0.6s cubic-bezier(.22,1,.36,1), transform 0.6s cubic-bezier(.22,1,.36,1)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

const useInView = (ref: RefObject<HTMLElement | null>) => {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setInView(true);
      },
      { threshold: 0.15 },
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);
  return inView;
};

/* ── Azure-Modern Feature Card with 3D tilt ── */
const FeatureCard = ({
  icon: Icon,
  title,
  description,
  delay,
}: FeatureCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -8, y: x * 8 });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView
          ? `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(0)`
          : `perspective(800px) rotateX(0deg) rotateY(0deg) translateY(24px)`,
        transition: `opacity 0.6s ease-out ${delay}ms, transform 0.4s ease-out`,
        willChange: "transform",
      }}
      className="relative bg-white/80 backdrop-blur-sm border border-[#e8e6e3] rounded-xl p-5 sm:p-6 hover:shadow-[0_8px_30px_rgba(0,120,212,0.12)] hover:border-[#0078d4]/40 transition-all duration-300 group cursor-default"
    >
      {/* Subtle gradient shimmer on hover */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(0,120,212,0.03) 0%, rgba(0,90,158,0.02) 50%, transparent 100%)",
        }}
      />
      <div className="relative z-10">
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-[#eff6fc] to-[#deecf9] flex items-center justify-center mb-4 group-hover:shadow-[0_4px_12px_rgba(0,120,212,0.15)] transition-shadow duration-300">
          <Icon className="w-5 h-5 sm:w-[22px] sm:h-[22px] text-[#0078d4]" />
        </div>
        <h3
          className="text-[15px] sm:text-[16px] font-semibold text-[#1b1a19] mb-1.5"
          style={{ fontFamily: "'Segoe UI Variable', 'Segoe UI', sans-serif" }}
        >
          {title}
        </h3>
        <p
          className="text-[13px] sm:text-[14px] text-[#605e5c] leading-relaxed"
          style={{ fontFamily: "'Segoe UI Variable', 'Segoe UI', sans-serif" }}
        >
          {description}
        </p>
      </div>
    </div>
  );
};

/* ── Greeting helper ── */
const getGreeting = (name?: string) => {
  const hour = new Date().getHours();
  let greeting: string;
  if (hour >= 5 && hour < 12) greeting = "Good morning";
  else if (hour >= 12 && hour < 17) greeting = "Good afternoon";
  else greeting = "Good evening";
  return name ? `${greeting}, ${name}` : greeting;
};

/* ── Azure-Modern buttons ── */
const PrimaryButton = ({ children, href, className = "" }: ButtonProps) => (
  <Link
    href={href}
    className={`inline-flex items-center justify-center gap-2 font-semibold px-7 py-3 rounded-lg text-white transition-all duration-200 text-[14px] sm:text-[15px] shadow-[0_2px_8px_rgba(0,120,212,0.3)] hover:shadow-[0_4px_16px_rgba(0,120,212,0.4)] hover:scale-[1.02] active:scale-[0.98] ${className}`}
    style={{
      fontFamily: "'Segoe UI Variable', 'Segoe UI', sans-serif",
      background: "linear-gradient(135deg, #0078d4 0%, #005a9e 100%)",
    }}
  >
    {children}
  </Link>
);

const SecondaryButton = ({ children, href, className = "" }: ButtonProps) => (
  <Link
    href={href}
    className={`inline-flex items-center justify-center gap-2 font-semibold px-7 py-3 rounded-lg text-[#1b1a19] bg-white/80 backdrop-blur-sm border border-[#d2d0ce] hover:bg-white hover:border-[#0078d4]/40 hover:shadow-[0_2px_12px_rgba(0,120,212,0.1)] active:bg-[#f3f2f1] transition-all duration-200 text-[14px] sm:text-[15px] hover:scale-[1.02] active:scale-[0.98] ${className}`}
    style={{ fontFamily: "'Segoe UI Variable', 'Segoe UI', sans-serif" }}
  >
    {children}
  </Link>
);

/* ── Quick Action Card (returning user) ── */
const QuickAction = ({
  icon: Icon,
  title,
  description,
  href,
  delay,
}: QuickActionProps) => (
  <FadeInItem delay={delay}>
    <Link
      href={href}
      className="group flex items-center gap-4 p-4 sm:p-5 bg-white/80 backdrop-blur-sm border border-[#e8e6e3] rounded-xl hover:border-[#0078d4]/40 hover:shadow-[0_4px_20px_rgba(0,120,212,0.1)] transition-all duration-300"
    >
      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-[#eff6fc] to-[#deecf9] flex items-center justify-center shrink-0 group-hover:shadow-[0_4px_12px_rgba(0,120,212,0.15)] transition-all duration-300">
        <Icon className="w-5 h-5 text-[#0078d4]" />
      </div>
      <div className="min-w-0 flex-1">
        <h3
          className="text-[14px] sm:text-[15px] font-semibold text-[#1b1a19] group-hover:text-[#0078d4] transition-colors"
          style={{ fontFamily: "'Segoe UI Variable', 'Segoe UI', sans-serif" }}
        >
          {title}
        </h3>
        <p
          className="text-[12px] sm:text-[13px] text-[#605e5c]"
          style={{ fontFamily: "'Segoe UI Variable', 'Segoe UI', sans-serif" }}
        >
          {description}
        </p>
      </div>
      <ChevronRight className="w-4 h-4 text-[#a19f9d] group-hover:text-[#0078d4] group-hover:translate-x-0.5 transition-all duration-200 shrink-0" />
    </Link>
  </FadeInItem>
);

/* ── Onboarding Step (new users) ── */
const OnboardingStep = ({
  icon: Icon,
  step,
  title,
  description,
  delay,
}: OnboardingStepProps) => (
  <FadeInItem delay={delay}>
    <div className="flex items-start gap-4 p-4 sm:p-5 bg-white/80 backdrop-blur-sm border border-[#e8e6e3] rounded-xl">
      <div className="relative shrink-0">
        <div
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shadow-[0_2px_8px_rgba(0,120,212,0.2)]"
          style={{
            background: "linear-gradient(135deg, #0078d4 0%, #005a9e 100%)",
          }}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div
          className="absolute -top-1.5 -right-1.5 w-5.5 h-5.5 rounded-full bg-white border-2 border-[#0078d4] flex items-center justify-center shadow-sm"
          style={{ width: 22, height: 22 }}
        >
          <span
            className="text-[10px] font-bold text-[#0078d4]"
            style={{ fontFamily: "'Segoe UI', sans-serif" }}
          >
            {step}
          </span>
        </div>
      </div>
      <div className="min-w-0">
        <h3
          className="text-[14px] sm:text-[15px] font-semibold text-[#1b1a19] mb-0.5"
          style={{ fontFamily: "'Segoe UI Variable', 'Segoe UI', sans-serif" }}
        >
          {title}
        </h3>
        <p
          className="text-[13px] sm:text-[14px] text-[#605e5c] leading-relaxed"
          style={{ fontFamily: "'Segoe UI Variable', 'Segoe UI', sans-serif" }}
        >
          {description}
        </p>
      </div>
    </div>
  </FadeInItem>
);

/* ── Check if user just registered ── */
const useIsNewUser = () => {
  const searchParams = useSearchParams();
  return searchParams.get("new") === "true";
};

/* ── Default Export with Suspense Wrapper ── */
export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#faf9f8]" />}>
      <HomeContent />
    </Suspense>
  );
}

/* ── Page Content ── */
function HomeContent() {
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  const [iconIndex, setIconIndex] = useState(0);
  const isNewUser = useIsNewUser();

  useEffect(() => {
    const id = setInterval(
      () => setIconIndex((i) => (i + 1) % fileIcons.length),
      2000,
    );
    return () => clearInterval(id);
  }, []);

  const current = fileIcons[iconIndex];
  const isLoggedIn = isLoaded && !!userId;
  const firstName = user?.firstName || "there";

  return (
    <div
      className="min-h-screen text-[#1b1a19] selection:bg-[#deecf9] selection:text-[#0078d4] overflow-x-hidden"
      style={{
        fontFamily:
          "'Segoe UI Variable', 'Segoe UI', -apple-system, sans-serif",
      }}
    >
      {/* ═══════════════════ HERO ═══════════════════ */}
      <main className="relative">
        {/* Background effects for hero */}
        <HeroGrid />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20 md:pt-28 pb-10 sm:pb-14 md:pb-16">
          {isLoggedIn && isNewUser ? (
            /* ── Just Registered Hero ── */
            <div className="max-w-2xl mx-auto space-y-5 sm:space-y-6">
              <FadeInItem delay={0}>
                <div className="bg-white/90 backdrop-blur-md border border-[#e8e6e3] rounded-xl p-5 sm:p-7 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center gap-3 sm:gap-4 mb-5">
                    <div
                      className="w-13 h-13 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center shrink-0 shadow-[0_4px_16px_rgba(216,59,1,0.15)]"
                      style={{
                        width: 56,
                        height: 56,
                        background:
                          "linear-gradient(135deg, #fff4ce 0%, #ffe8a3 100%)",
                      }}
                    >
                      <PartyPopper className="w-7 h-7 text-[#d83b01]" />
                    </div>
                    <div className="min-w-0">
                      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1b1a19] tracking-tight">
                        Welcome,{" "}
                        <span className="bg-gradient-to-r from-[#0078d4] to-[#005a9e] bg-clip-text text-transparent">
                          {firstName}
                        </span>
                      </h1>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-[#dff6dd] to-[#e8f9e6] border border-[#107c10]/30 rounded-lg px-4 py-3.5 flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-[#107c10]/10 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-[#107c10]" />
                    </div>
                    <p className="text-[14px] sm:text-[15px] text-[#1b1a19] font-medium">
                      Your account is ready. You have{" "}
                      <span className="font-bold text-[#107c10]">
                        5 GB of free storage
                      </span>
                      .
                    </p>
                  </div>
                </div>
              </FadeInItem>

              <div className="space-y-3">
                <OnboardingStep
                  icon={Upload}
                  step={1}
                  title="Upload your first file"
                  description="Drag and drop any file into your dashboard — we support PDFs, images, documents, videos, and more."
                  delay={200}
                />
                <OnboardingStep
                  icon={FolderOpen}
                  step={2}
                  title="Organize with folders"
                  description="Create folders to keep everything tidy. Your files, your structure."
                  delay={300}
                />
                <OnboardingStep
                  icon={ShieldCheck}
                  step={3}
                  title="Enjoy total privacy"
                  description="Your files are encrypted and only accessible by you. No tracking, no ads, no compromises."
                  delay={400}
                />
              </div>

              <FadeInItem delay={500}>
                <div className="flex flex-col sm:flex-row items-center justify-center pt-3 gap-3 sm:gap-4">
                  <PrimaryButton href="/dashboard" className="w-full sm:w-auto">
                    <Rocket className="w-4 h-4" />
                    Go to Dashboard
                  </PrimaryButton>
                  <div className="flex items-center gap-4 text-[12px] sm:text-[13px] font-medium text-[#605e5c]">
                    <span className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#107c10]" /> 5GB Free
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#107c10]" /> Secure
                    </span>
                  </div>
                </div>
              </FadeInItem>
            </div>
          ) : isLoggedIn ? (
            /* ── Returning User Hero ── */
            <div className="max-w-2xl mx-auto space-y-5 sm:space-y-6">
              <FadeInItem delay={0}>
                <div className="p-6 sm:p-7 space-y-2">
                  <h1 className="text-4xl sm:text-5xl md:text-[56px] font-bold text-[#1b1a19] tracking-tight leading-[1.1]">
                    {getGreeting()},{" "}
                    <span className="bg-gradient-to-r from-[#0078d4] to-[#005a9e] bg-clip-text text-transparent">
                      {firstName}
                    </span>
                  </h1>
                  <p className="text-[15px] sm:text-[16px] text-[#605e5c] font-medium">
                    System operational. Pick up where you left off.
                  </p>
                </div>
              </FadeInItem>

              <div className="space-y-3">
                <QuickAction
                  icon={FolderOpen}
                  title="Open Dashboard"
                  description="View and manage all your stored files"
                  href="/dashboard"
                  delay={150}
                />
                <QuickAction
                  icon={Upload}
                  title="Upload Files"
                  description="Add new documents to your storage"
                  href="/dashboard"
                  delay={250}
                />
              </div>
            </div>
          ) : (
            /* ── Logged-out Hero ── */
            <div className="max-w-4xl mx-auto space-y-5 sm:space-y-7 text-center">
              <FadeInItem delay={0}>
                <div className="inline-flex items-center gap-2.5 px-5 py-2 bg-white/70 backdrop-blur-sm border border-[#deecf9] rounded-full text-[12px] sm:text-[13px] text-[#0078d4] font-semibold tracking-wide shadow-[0_2px_8px_rgba(0,120,212,0.08)]">
                  <LockKeyhole className="w-3.5 h-3.5" />
                  <span>Secured by AWS Cloud</span>
                </div>
              </FadeInItem>

              <FadeInItem delay={150}>
                <div className="relative inline-block">
                  {/* Gradient glow behind title */}
                  <div
                    className="absolute inset-0 -inset-x-8 -inset-y-4 rounded-3xl opacity-100 pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,120,212,0.08) 0%, rgba(0,90,158,0.04) 40%, transparent 80%)",
                      filter: "blur(20px)",
                    }}
                  />
                  <h1
                    className="relative text-3xl sm:text-4xl md:text-5xl lg:text-[58px] font-bold text-[#1b1a19] tracking-tight leading-tight flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4"
                    style={{
                      textShadow: "0 1px 2px rgba(0,0,0,0.04)",
                    }}
                  >
                    <span>Your Data.</span>
                    <span
                      className="relative flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 md:w-[72px] md:h-[72px]  overflow-hidden shrink-0"
                      style={{
                        transform:
                          "perspective(600px) rotateY(-4deg) rotateX(2deg)",
                      }}
                    >
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={current.label}
                          initial={{ opacity: 0, y: 24, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -24, scale: 0.9 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 25,
                          }}
                          className="absolute inset-0"
                        >
                          {current.icon}
                        </motion.div>
                      </AnimatePresence>
                    </span>
                    <span className="bg-gradient-to-r from-[#0078d4] via-[#0063b1] to-[#005a9e] bg-clip-text text-transparent">
                      Only Yours.
                    </span>
                  </h1>
                </div>
              </FadeInItem>

              <FadeInItem delay={300}>
                <p className="text-[14px] sm:text-[16px] md:text-lg text-black max-w-2xl mx-auto leading-relaxed   pl-4 text-left font-medium py-3 pr-4">
                  A cloud storage platform stripped of the noise. No bloatware,
                  no complicated settings, and zero compromises on your privacy.
                </p>
              </FadeInItem>

              <FadeInItem delay={450}>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-4 sm:pt-6">
                  <PrimaryButton
                    href="/verify-regis"
                    className="w-full sm:w-auto text-[15px] sm:text-[16px] px-9 py-3.5"
                  >
                    Start for free
                    <ArrowRight className="w-4 h-4" />
                  </PrimaryButton>
                  <SecondaryButton
                    href="/supported-formats"
                    className="w-full sm:w-auto text-[15px] sm:text-[16px]"
                  >
                    Supported Formats
                  </SecondaryButton>
                </div>
              </FadeInItem>
            </div>
          )}

          {/* ═══════════════════ PRODUCT PREVIEW — logged-out only ═══════════════════ */}
          {isLoaded && !userId && (
            <section className="max-w-5xl mx-auto px-0 pt-14 sm:pt-18 md:pt-24 pb-6 sm:pb-8">
              <FadeInItem delay={0}>
                <div className="mb-7 sm:mb-10 text-center">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#dff6dd]/80 border border-[#107c10]/25 rounded-full text-[11px] sm:text-[12px] text-[#107c10] font-semibold tracking-wide mb-3 backdrop-blur-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#107c10] animate-pulse" />
                    <span>LIVE PREVIEW</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1b1a19] tracking-tight mb-1.5">
                    See it in action.
                  </h2>
                  <p className="text-[#605e5c] font-medium text-[14px] sm:text-[15px]">
                    A dashboard that respects your time and your data.
                  </p>
                </div>

                <div
                  className="relative bg-white/90 backdrop-blur-sm border border-[#e8e6e3] rounded-xl shadow-lg shadow-blue-400 overflow-hidden"
                  style={{
                    transform: "perspective(1200px) rotateX(1.5deg)",
                    transformOrigin: "center top",
                  }}
                >
                  {/* Browser-style top bar */}
                  <div className="flex items-center gap-2.5 px-4 py-3 bg-[#f6f5f4] border-b border-[#e8e6e3]">
                    <div className="flex gap-2 shrink-0">
                      <div className="w-3 h-3 rounded-full bg-[#d13438]/80" />
                      <div className="w-3 h-3 rounded-full bg-[#ffaa44]/80" />
                      <div className="w-3 h-3 rounded-full bg-[#107c10]/80" />
                    </div>
                    <div className="flex-1 min-w-0 mx-3 px-4 py-1.5 bg-white border border-[#e8e6e3] rounded-lg text-[11px] sm:text-[12px] text-[#605e5c] font-medium text-center truncate shadow-inner">
                      kosha.cloudkinshuk.in/dashboard
                    </div>
                  </div>

                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    onError={(e) => {
                      const v = e.currentTarget;
                      console.error("Video error:", {
                        code: v.error?.code,
                        message: v.error?.message,
                        networkState: v.networkState,
                        readyState: v.readyState,
                        currentSrc: v.currentSrc,
                      });
                    }}
                    onLoadedData={() =>
                      console.log("Video loaded successfully")
                    }
                    className="w-full h-auto block aspect-video object-cover bg-[#f3f2f1]"
                  >
                    <source src="/videos/brandy.mp4" type="video/mp4" />
                  </video>
                </div>
              </FadeInItem>
            </section>
          )}
        </div>
      </main>

      {/* ═══════════════════ FEATURES ═══════════════════ */}
      <section
        id="features"
        className="relative max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-18 md:py-24"
      >
        {/* Subtle divider */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-[#d2d0ce] to-transparent" />

        <div className="mb-9 sm:mb-11 md:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1b1a19] tracking-tight mb-2">
            Brilliantly Simple.
          </h2>
          <p className="text-[#0078d4] font-semibold text-[13px] sm:text-[14px] tracking-wide">
            Everything you need. Nothing you don&apos;t.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <FeatureCard
            icon={HardDrive}
            title="5 GB Free Forever"
            description="Generous AWS backed storage for everyone. Drop your files without worrying about space."
            delay={0}
          />
          <FeatureCard
            icon={ShieldCheck}
            title="Absolute Privacy"
            description="Amazon S3 Encryption. We can't see your files or sell your habits."
            delay={80}
          />
          <FeatureCard
            icon={Layout}
            title="Zero Bloat"
            description="No unnecessary features. A clean interface designed to get out of your way."
            delay={160}
          />
          <FeatureCard
            icon={Zap}
            title="Lightning Fast"
            description="Optimized for speed. Uploads and downloads in the blink of an eye."
            delay={240}
          />
          <FeatureCard
            icon={BrainCircuit}
            title="No data training for AI"
            description="We do not use your data to train AI models. Your files are yours alone."
            delay={320}
          />
          <FeatureCard
            icon={BrickWallShield}
            title="No bloated AI features"
            description="We do not offer any AI features. We focus on secure, private storage without distractions."
            delay={400}
          />
          <FeatureCard
            icon={FileCog}
            title="Multiple file formats"
            description="We support a wide range of file formats including documents, images, videos, and more."
            delay={480}
          />
          <FeatureCard
            icon={Cog}
            title="You control your data"
            description="We do not collect any data about your files or usage. Full control over what you share."
            delay={560}
          />
        </div>
      </section>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        <div
          className="relative rounded-2xl p-8 sm:p-10 md:p-14 flex flex-col items-center text-center overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #0078d4 0%, #005a9e 50%, #004578 100%)",
          }}
        >
          {/* Decorative glow */}
          <div
            className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full opacity-20 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 60%)",
              filter: "blur(40px)",
            }}
          />
          <div
            className="absolute bottom-0 left-0 w-[200px] h-[200px] rounded-full opacity-10 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 60%)",
              filter: "blur(30px)",
            }}
          />

          <div className="relative z-10">
            {isLoggedIn ? (
              <>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 tracking-tight">
                  Your files are waiting
                </h2>
                <p className="text-[#c7dff7] font-medium text-[14px] sm:text-[15px] mb-7 sm:mb-8 max-w-md">
                  Jump back into your dashboard and keep your workflow going.
                </p>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 font-semibold px-7 py-3 rounded-lg text-[#0078d4] bg-white hover:bg-[#f3f2f1] active:bg-[#edebe9] transition-all duration-200 text-[15px] shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.2)] hover:scale-[1.02] active:scale-[0.98]"
                >
                  View Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            ) : (
              <>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 tracking-tight">
                  Ready to take back your data?
                </h2>
                <p className="text-[#c7dff7] font-medium text-[14px] sm:text-[15px] mb-7 sm:mb-8 max-w-md">
                  Join thousands who have migrated to a simpler, more secure way
                  to store their digital life.
                </p>
                <Link
                  href="/verify-regis"
                  className="inline-flex items-center justify-center gap-2 font-semibold px-7 py-3 rounded-lg text-[#0078d4] bg-white hover:bg-[#f3f2f1] active:bg-[#edebe9] transition-all duration-200 text-[15px] shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.2)] hover:scale-[1.02] active:scale-[0.98]"
                >
                  Create Free Account
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
