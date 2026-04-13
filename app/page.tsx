"use client";
import React, {
  useState,
  useEffect,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";
import {
  ShieldCheck,
  Zap,
  Layout,
  ArrowRight,
  LockKeyhole,
  HardDrive,
  Cloud,
  Layers,
  Database,
  Check,
  FolderOpen,
  Upload,
  PartyPopper,
  Rocket,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth, useUser } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FaInfoCircle } from "react-icons/fa";

/* ── File Icons ── */
const fileIcons = [
  {
    label: "PDF",
    color: "#EF4444",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
        <path
          d="M12 4h28l12 12v44a4 4 0 01-4 4H16a4 4 0 01-4-4V8a4 4 0 014-4z"
          fill="#EF4444"
          fillOpacity="0.15"
          stroke="#EF4444"
          strokeWidth="2"
        />
        <path
          d="M40 4v12h12"
          stroke="#EF4444"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <text
          x="32"
          y="44"
          textAnchor="middle"
          fill="#EF4444"
          fontSize="13"
          fontWeight="700"
          fontFamily="system-ui"
        >
          PDF
        </text>
      </svg>
    ),
  },
  {
    label: "DOC",
    color: "#3B82F6",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
        <path
          d="M12 4h28l12 12v44a4 4 0 01-4 4H16a4 4 0 01-4-4V8a4 4 0 014-4z"
          fill="#3B82F6"
          fillOpacity="0.15"
          stroke="#3B82F6"
          strokeWidth="2"
        />
        <path
          d="M40 4v12h12"
          stroke="#3B82F6"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <text
          x="32"
          y="44"
          textAnchor="middle"
          fill="#3B82F6"
          fontSize="12"
          fontWeight="700"
          fontFamily="system-ui"
        >
          DOC
        </text>
      </svg>
    ),
  },
  {
    label: "PNG",
    color: "#A855F7",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
        <path
          d="M12 4h28l12 12v44a4 4 0 01-4 4H16a4 4 0 01-4-4V8a4 4 0 014-4z"
          fill="#A855F7"
          fillOpacity="0.15"
          stroke="#A855F7"
          strokeWidth="2"
        />
        <path
          d="M40 4v12h12"
          stroke="#A855F7"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="25" cy="36" r="4" fill="#A855F7" fillOpacity="0.5" />
        <path
          d="M20 50l8-10 5 6 7-9 8 13H20z"
          fill="#A855F7"
          fillOpacity="0.4"
        />
      </svg>
    ),
  },
  {
    label: "XLS",
    color: "#22C55E",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
        <path
          d="M12 4h28l12 12v44a4 4 0 01-4 4H16a4 4 0 01-4-4V8a4 4 0 014-4z"
          fill="#22C55E"
          fillOpacity="0.15"
          stroke="#22C55E"
          strokeWidth="2"
        />
        <path
          d="M40 4v12h12"
          stroke="#22C55E"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <text
          x="32"
          y="44"
          textAnchor="middle"
          fill="#22C55E"
          fontSize="12"
          fontWeight="700"
          fontFamily="system-ui"
        >
          XLS
        </text>
      </svg>
    ),
  },
  {
    label: "MP4",
    color: "#F59E0B",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
        <path
          d="M12 4h28l12 12v44a4 4 0 01-4 4H16a4 4 0 01-4-4V8a4 4 0 014-4z"
          fill="#F59E0B"
          fillOpacity="0.15"
          stroke="#F59E0B"
          strokeWidth="2"
        />
        <path
          d="M40 4v12h12"
          stroke="#F59E0B"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path d="M27 32v12l10-6z" fill="#F59E0B" />
      </svg>
    ),
  },
  {
    label: "ZIP",
    color: "#EC4899",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
        <path
          d="M12 4h28l12 12v44a4 4 0 01-4 4H16a4 4 0 01-4-4V8a4 4 0 014-4z"
          fill="#EC4899"
          fillOpacity="0.15"
          stroke="#EC4899"
          strokeWidth="2"
        />
        <path
          d="M40 4v12h12"
          stroke="#EC4899"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <text
          x="32"
          y="44"
          textAnchor="middle"
          fill="#EC4899"
          fontSize="13"
          fontWeight="700"
          fontFamily="system-ui"
        >
          ZIP
        </text>
      </svg>
    ),
  },
];

/* ── Shared Components ── */

interface FadeInItemProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

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
          "opacity 0.7s cubic-bezier(0.23,1,0.32,1), transform 0.7s cubic-bezier(0.23,1,0.32,1)",
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

interface FeatureCardProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  delay,
}: FeatureCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef);
  return (
    <div
      ref={cardRef}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.6s cubic-bezier(0.23,1,0.32,1) ${delay}ms, transform 0.6s cubic-bezier(0.23,1,0.32,1) ${delay}ms`,
      }}
      className="bg-[#181818]  p-3 rounded-xl  transition-all duration-500"
    >
      <div className="w-11 h-11 bg-white/[0.04] rounded-lg flex items-center justify-center mb-5">
        <Icon className="w-5 h-5 text-white group-hover:text-[#ff9100] transition-colors duration-300" />
      </div>
      <h3 className="text-[19px] font-medium text-white mb-2">{title}</h3>
      <p className="text-[15px] text-neutral-200 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

/* ── Advanced Greeting helper (English only) ── */
const getGreeting = (name?: string) => {
  const hour = new Date().getHours();

  let greeting: string;

  if (hour >= 5 && hour < 12) {
    greeting = "Good morning";
  } else if (hour >= 12 && hour < 17) {
    greeting = "Good afternoon";
  } else if (hour >= 17 && hour < 21) {
    greeting = "Good evening";
  } else {
    greeting = "Good evening"; // keeps UI consistent instead of "Good night"
  }

  return name ? `${greeting}, ${name}` : greeting;
};
/* ── Quick Action Card (logged-in hero) ── */
interface QuickActionProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  href: string;
  delay: number;
}

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
      className="group flex items-start gap-4 p-2 rounded-lg bg-[#181818] border border-white/[0.06]  hover:border-2 hover:border-[#ff9100] w-full transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.98]"
    >
      <div className="w-12 h-12 bg-[#141414] rounded-xl flex items-center justify-center shrink-0  transition-colors duration-300">
        <Icon className="w-5 h-5 text-white group-hover:text-[#ff9100] transition-colors duration-300" />
      </div>
      <div className="min-w-0">
        <h3 className="text-[17px] font-medium text-white mb-0.5 group-hover:text-white transition-colors">
          {title}
        </h3>
        <p className="text-[14px] text-neutral-200 group-hover:text-neutral-400 transition-colors duration-300">
          {description}
        </p>
      </div>
      <ArrowRight className="w-4 h-4 text-neutral-700 group-hover:text-neutral-400 group-hover:translate-x-0.5 transition-all duration-300 mt-1 shrink-0 ml-auto" />
    </Link>
  </FadeInItem>
);

/* ── Onboarding step for new users ── */
interface OnboardingStepProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  step: number;
  title: string;
  description: string;
  delay: number;
}

const OnboardingStep = ({
  icon: Icon,
  step,
  title,
  description,
  delay,
}: OnboardingStepProps) => (
  <FadeInItem delay={delay}>
    <div className="group flex items-start gap-4 p-4 rounded-xl bg-[#181818] border border-white/[0.06]">
      <div className="w-10 h-10 bg-[#ff9100]/10 rounded-lg flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-[#ff9100]" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-widest text-[#ff9100] font-semibold mb-1">
          Step {step}
        </p>
        <h3 className="text-[16px] font-medium text-white mb-0.5">{title}</h3>
        <p className="text-[13px] text-neutral-400 leading-relaxed">
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

/* ── Page ── */

export default function Home() {
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  const [iconIndex, setIconIndex] = useState(0);
  const isNewUser = useIsNewUser();

  useEffect(() => {
    const id = setInterval(
      () => setIconIndex((i) => (i + 1) % fileIcons.length),
      2400,
    );
    return () => clearInterval(id);
  }, []);

  const current = fileIcons[iconIndex];
  const isLoggedIn = isLoaded && !!userId;
  const firstName = user?.firstName || "there";

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-neutral-300 selection:bg-blue-500/20 relative">
      {/* ════════════════════════════════════════════════════════════════════
          HERO — three different experiences
          ════════════════════════════════════════════════════════════════════ */}
      <main className="max-w-7xl mx-auto px-6 pt-28 pb-20">
        {isLoggedIn && isNewUser ? (
          /* ── Just Registered Hero ── */
          <div className="max-w-2xl mx-auto space-y-10">
            <FadeInItem delay={0}>
              <div className="text-center space-y-4">
                {/* Animated welcome icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 12,
                    delay: 0.2,
                  }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-[#ff9100]/10 rounded-2xl mb-2"
                >
                  <PartyPopper className="w-8 h-8 text-[#ff9100]" />
                </motion.div>

                <h1 className="text-3xl md:text-5xl font-semibold text-white tracking-tight">
                  Welcome aboard,{" "}
                  <span className="text-[#ff9100]">{firstName}!</span>
                </h1>
                <p className="text-[17px] text-neutral-300 max-w-md mx-auto leading-relaxed">
                  Your account is ready. You&apos;ve got{" "}
                  <span className="text-white font-medium">
                    5 GB of free storage
                  </span>{" "}
                  waiting for you. Here&apos;s how to get started:
                </p>
              </div>
            </FadeInItem>

            {/* Onboarding steps */}
            <div className="space-y-3">
              <OnboardingStep
                icon={Upload}
                step={1}
                title="Upload your first file"
                description="Drag and drop any file into your dashboard — we support PDFs, images, documents, videos, and more."
                delay={300}
              />
              <OnboardingStep
                icon={FolderOpen}
                step={2}
                title="Organize with folders"
                description="Create folders to keep everything tidy. Your files, your structure."
                delay={450}
              />
              <OnboardingStep
                icon={ShieldCheck}
                step={3}
                title="Enjoy total privacy"
                description="Your files are encrypted and only accessible by you. No tracking, no ads, no compromises."
                delay={600}
              />
            </div>

            {/* CTA */}
            <FadeInItem delay={750}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 bg-[#ff9100] text-black font-semibold px-7 py-3.5 rounded-xl text-[16px] hover:bg-[#ffab40] active:scale-[0.97] transition-all duration-200 group"
                >
                  <Rocket className="w-4 h-4" />
                  Go to My Dashboard
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                </Link>
              </div>
            </FadeInItem>

            {/* Subtle reassurance */}
            <FadeInItem delay={900}>
              <div className="flex items-center justify-center gap-6 text-[12px] text-neutral-600 pt-2">
                <span className="flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-emerald-500" /> 5 GB free
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-emerald-500" /> No credit card
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-emerald-500" /> Cancel anytime
                </span>
              </div>
            </FadeInItem>
          </div>
        ) : isLoggedIn ? (
          /* ── Returning User Hero ── */
          <div className="max-w-2xl mx-auto space-y-10">
            <FadeInItem delay={0}>
              <div className="text-center space-y-3">
                <h1 className="text-3xl md:text-5xl font-semibold text-white tracking-tight">
                  {getGreeting()},{" "}
                  <span className="text-[#ff9100]">{firstName}</span>
                </h1>
                <p className="text-[18px] text-neutral-100 max-w-md mx-auto">
                  Pick up where you left off, or start something new.
                </p>
              </div>
            </FadeInItem>

            {/* Quick actions */}
            <div className="space-y-3">
              <QuickAction
                icon={FolderOpen}
                title="Open Dashboard"
                description="View and manage all your files"
                href="/dashboard"
                delay={200}
              />
              <QuickAction
                icon={Upload}
                title="Upload Files"
                description="Drag and drop or browse to upload"
                href="/dashboard"
                delay={300}
              />
            </div>

            {/* Go to dashboard CTA */}
            <FadeInItem delay={500}>
              <div className="flex justify-center pt-2">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 bg-blue-800 text-white font-medium px-6 py-3 rounded-xl text-[17px] hover:bg-blue-700 active:scale-[0.97] transition-all duration-200 group"
                >
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                </Link>
              </div>
            </FadeInItem>
          </div>
        ) : (
          /* ── Logged-out Hero ── */
          <div className="max-w-3xl mx-auto space-y-8 text-center">
            <FadeInItem delay={0}>
              <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-[13px] text-neutral-300 font-medium mb-4">
                <LockKeyhole className="w-3.5 h-3.5" />
                <span>
                  Secured by{" "}
                  <span className="text-white font-semibold">
                    AWS Cloud Storage
                  </span>
                </span>
              </div>
            </FadeInItem>

            <FadeInItem delay={200}>
              <h1 className="text-4xl md:text-6xl font-semibold text-white tracking-tight leading-[1.1] inline-flex flex-wrap items-center justify-center gap-x-3">
                <span>Your</span>
                <span className="relative inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 align-middle">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={current.label}
                      initial={{ opacity: 0, scale: 0.55, filter: "blur(6px)" }}
                      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, scale: 0.55, filter: "blur(6px)" }}
                      transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                      className="absolute inset-0"
                    >
                      {current.icon}
                    </motion.span>
                  </AnimatePresence>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={current.label + "-glow"}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.3 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.45 }}
                      className="absolute inset-0 rounded-full blur-2xl pointer-events-none"
                      style={{ backgroundColor: current.color }}
                    />
                  </AnimatePresence>
                </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-neutral-400">
                  Only yours.
                </span>
              </h1>
            </FadeInItem>

            <FadeInItem delay={400}>
              <p className="text-[16px] md:text-lg text-neutral-500 leading-relaxed max-w-xl mx-auto">
                A cloud storage platform stripped of the noise. No bloatware, no
                complicated settings, and zero compromises on your privacy.
              </p>
            </FadeInItem>

            <FadeInItem delay={600}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-6">
                <Link
                  href="/verify-regis"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-black font-medium px-7 py-3 rounded-xl text-[15px] hover:bg-neutral-200 active:scale-[0.97] transition-all duration-200 group"
                >
                  Start for free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                </Link>
                <Link
                  href="/supported-formats"
                  className="w-full sm:w-auto px-7 py-3 rounded-xl text-[15px] font-medium border border-white/[0.1] text-neutral-300 hover:bg-white/[0.04] hover:border-white/[0.15] transition-all duration-300"
                >
                  Supported Formats
                </Link>
              </div>
            </FadeInItem>
          </div>
        )}
      </main>

      {/* ════════════════════════════════════════════════════════════════════
          FEATURES — shown to everyone
          ════════════════════════════════════════════════════════════════════ */}
      <section
        id="features"
        className="max-w-7xl mx-auto px-6 py-24 border-t border-white/[0.04]"
      >
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-semibold text-white mb-3 tracking-tight">
            Brilliantly Simple.
          </h2>
          <p className="text-neutral-200 text-[15px]">
            Everything you need. Nothing you don&apos;t.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          <FeatureCard
            icon={HardDrive}
            title="5 GB Free Forever"
            description="Generous storage for everyone. Drop your files without worrying about space."
            delay={0}
          />
          <FeatureCard
            icon={ShieldCheck}
            title="Absolute Privacy"
            description="Zero-knowledge architecture. We can't see your files or sell your habits."
            delay={120}
          />
          <FeatureCard
            icon={Layout}
            title="Zero Bloat"
            description="No unnecessary features. A clean interface designed to get out of your way."
            delay={240}
          />
          <FeatureCard
            icon={Zap}
            title="Lightning Fast"
            description="Optimized for speed. Uploads and downloads in the blink of an eye."
            delay={360}
          />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          PRICING — shown to everyone, CTA adapts
          ════════════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-white/[0.04]">
        <div className="text-center mb-14">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3 tracking-tight">
            Future-Proof Pricing
          </h2>
          <p className="text-neutral-500 text-[15px] max-w-xl mx-auto">
            Honest, transparent tiers. Scaling your storage shouldn&apos;t break
            the bank.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {/* 2TB */}
          <div className="bg-[#181818] border border-[#444444]  p-7 rounded-lg relative overflow-hidden flex flex-col transition-all duration-500">
            <div className="absolute top-4 right-4 bg-blue-800 text-white text-[10px] font-semibold px-2.5 py-1 rounded-sm border border-blue-500/[0.15] tracking-wide">
              Coming Soon
            </div>
            <div className="w-13 h-13 bg-blue-800 rounded-lg flex items-center justify-center mb-5">
              <Cloud className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-1.5">
              2TB Plan
            </h3>
            <div className="text-3xl font-semibold text-white mb-5">
              460₹
              <span className="text-sm text-neutral-100 font-normal">/mo</span>
            </div>
            <ul className="space-y-2.5 text-[13px] text-neutral-100 mb-7 flex-1">
              <li className="flex gap-2.5 items-center">
                <Check className="w-3.5 h-3.5 text-blue-400" /> Perfect for
                professionals
              </li>
              <li className="flex gap-2.5 items-center">
                <Check className="w-3.5 h-3.5 text-blue-400" /> End-to-end
                encryption
              </li>
              <li className="flex gap-2.5 items-center">
                <Check className="w-3.5 h-3.5 text-blue-400" /> Priority support
              </li>
            </ul>
            <button
              disabled
              className="w-full bg-white/[0.04] text-neutral-600 w-max font-medium px-4 py-2.5 rounded-lg cursor-not-allowed border border-white/[0.06] text-[13px]"
            >
              Available Soon
            </button>
          </div>

          {/* 8TB — highlighted */}
          <div className="bg-white/[0.03] border border-[#444444] p-7 rounded-lg relative overflow-hidden flex flex-col ">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
            <div className="absolute top-4 right-4 bg-blue-800 text-white text-[10px] font-semibold px-2.5 py-1 rounded-sm border border-blue-500/[0.15] tracking-wide">
              Coming Soon
            </div>
            <div className="w-13 h-13 bg-blue-800 rounded-lg flex items-center justify-center mb-5">
              <Layers className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-1.5">
              8TB Plan
            </h3>
            <div className="text-3xl font-semibold text-white mb-5">
              1600₹
              <span className="text-sm text-neutral-100 font-normal">/mo</span>
            </div>
            <ul className="space-y-2.5 text-[13px] text-neutral-100 mb-7 flex-1">
              <li className="flex gap-2.5 items-center">
                <Check className="w-3.5 h-3.5 text-blue-400" /> Made for
                creators
              </li>
              <li className="flex gap-2.5 items-center">
                <Check className="w-3.5 h-3.5 text-blue-400" /> Advanced sharing
                controls
              </li>
              <li className="flex gap-2.5 items-center">
                <Check className="w-3.5 h-3.5 text-blue-400" /> Unlimited
                bandwidth
              </li>
            </ul>
            <button
              disabled
              className="w-full w-max px-4 bg-white/[0.04] text-neutral-600 font-medium py-2.5 rounded-xl cursor-not-allowed border border-white/[0.06] text-[13px]"
            >
              Available Soon
            </button>
          </div>

          {/* 20TB */}
          <div className="bg-[#181818]  p-7 rounded-lg border border-[#444444] relative overflow-hidden flex flex-col transition-all duration-500">
            <div className="absolute top-4 right-4 bg-blue-800 text-white text-[10px] font-semibold px-2.5 py-1 rounded-sm border border-blue-500/[0.15] tracking-wide">
              Coming Soon
            </div>
            <div className="w-13 h-13 bg-blue-800 rounded-lg flex items-center justify-center mb-5">
              <Database className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-1.5">
              20TB Plan
            </h3>
            <div className="text-3xl font-semibold text-white mb-5">
              3200₹
              <span className="text-sm text-neutral-100 font-normal">/mo</span>
            </div>
            <ul className="space-y-2.5 text-[13px] text-neutral-100 mb-7 flex-1">
              <li className="flex gap-2.5 items-center">
                <Check className="w-3.5 h-3.5 text-blue-400" /> Perfect for
                professionals
              </li>
              <li className="flex gap-2.5 items-center">
                <Check className="w-3.5 h-3.5 text-blue-400" /> End-to-end
                encryption
              </li>
              <li className="flex gap-2.5 items-center">
                <Check className="w-3.5 h-3.5 text-blue-400" /> Priority support
              </li>
            </ul>
            <button
              disabled
              className="w-full w-max px-4 bg-white/[0.04] text-neutral-600 font-medium py-2.5 rounded-xl cursor-not-allowed border border-white/[0.06] text-[13px]"
            >
              Available Soon
            </button>
          </div>
        </div>

        <div className="w-full max-w-3xl mx-auto mt-12 px-4">
          <div className="relative overflow-hidden rounded-2xl bg-[#18181b]/50 border border-white/10 p-5 sm:p-6 backdrop-blur-xl shadow-lg transition-all duration-300 hover:bg-white/[0.04] hover:border-white/20 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] group">
            {/* Left glowing accent line */}
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-blue-500 to-emerald-400 opacity-80 rounded-l-2xl"></div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              {/* Icon */}
              <div className="flex-shrink-0 p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 shadow-inner mt-1 sm:mt-0 group-hover:scale-110 transition-transform duration-300">
                <FaInfoCircle size={18} />
              </div>

              {/* Text Content */}
              <div className="text-center sm:text-left flex-1">
                <h4 className="text-[14px] font-semibold text-white mb-1.5 tracking-wide">
                  Early Access & Prototype Pricing
                </h4>
                <p className="text-[13px] sm:text-[14px] leading-relaxed text-neutral-400 ">
                  The pricing you currently see is strictly for{" "}
                  <span className="text-neutral-200 font-medium">
                    prototype testing
                  </span>
                  . Final prices may vary at launch, but we are committed to
                  keeping them affordable and transparent.
                  <span className="block mt-2 text-[12px] sm:text-[13px] font-semibold text-emerald-400 tracking-wider uppercase">
                    No hidden fees. No surprises.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          CTA — adapts based on auth state
          ════════════════════════════════════════════════════════════════════ */}
      <section className="max-w-3xl mx-auto px-6 py-24">
        <div className="bg-[#181818] border-2 border-blue-700  rounded-2xl p-10 md:p-14 text-center relative overflow-hidden transition-all duration-500">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[4px] bg-gradient-to-r from-transparent via-blue-500 to-transparent" />

          {isLoggedIn ? (
            <>
              <h2 className="text-3xl font-semibold text-white mb-3 tracking-tight">
                Your files are waiting
              </h2>
              <p className="text-neutral-200 text-[17px] mb-7 max-w-md mx-auto">
                Jump back into your dashboard and keep your workflow going.
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 bg-blue-800 text-white font-medium px-6 py-2.5 rounded-xl text-[16px] hover:bg-blue-700 active:scale-[0.97] transition-all duration-200 group"
              >
                View Dashboard
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
              </Link>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold text-white mb-3 tracking-tight">
                Ready to take back your data?
              </h2>
              <p className="text-neutral-500 text-[15px] mb-7 max-w-md mx-auto">
                Join thousands who have migrated to a simpler, more secure way
                to store their digital life.
              </p>
              <Link
                href="/verify-regis"
                className="inline-flex items-center gap-2 bg-white text-black font-medium px-6 py-2.5 rounded-xl text-[14px] hover:bg-neutral-200 active:scale-[0.97] transition-all duration-200 group"
              >
                Create Free Account
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
              </Link>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
