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
  LockKeyhole,
  HardDrive,
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

/* ── File Icons (Simplified for solid/flat aesthetic) ── */
const fileIcons = [
  {
    label: "PDF",
    color: "#EF4444",
    icon: (
      <svg viewBox="0 0 64 64" className="w-full h-full">
        <path d="M12 4h28l12 12v44H12V4z" fill="#EF4444" />
        <path d="M40 4v12h12" fill="#B91C1C" />
        <text
          x="32"
          y="44"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="14"
          fontWeight="bold"
          fontFamily="sans-serif"
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
      <svg viewBox="0 0 64 64" className="w-full h-full">
        <path d="M12 4h28l12 12v44H12V4z" fill="#3B82F6" />
        <path d="M40 4v12h12" fill="#1D4ED8" />
        <text
          x="32"
          y="44"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="14"
          fontWeight="bold"
          fontFamily="sans-serif"
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
      <svg viewBox="0 0 64 64" className="w-full h-full">
        <path d="M12 4h28l12 12v44H12V4z" fill="#A855F7" />
        <path d="M40 4v12h12" fill="#7E22CE" />
        <text
          x="32"
          y="44"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="14"
          fontWeight="bold"
          fontFamily="sans-serif"
        >
          PNG
        </text>
      </svg>
    ),
  },
  {
    label: "XLS",
    color: "#22C55E",
    icon: (
      <svg viewBox="0 0 64 64" className="w-full h-full">
        <path d="M12 4h28l12 12v44H12V4z" fill="#22C55E" />
        <path d="M40 4v12h12" fill="#15803D" />
        <text
          x="32"
          y="44"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="14"
          fontWeight="bold"
          fontFamily="sans-serif"
        >
          XLS
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
        transform: visible ? "translateY(0)" : "translateY(8px)",
        transition: "opacity 0.4s ease-out, transform 0.4s ease-out",
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
        transform: inView ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 0.4s ease-out ${delay}ms, transform 0.4s ease-out ${delay}ms`,
      }}
      className="bg-[#1e1e1e] border-2 border-[#444444] p-4 sm:p-5 shadow-[3px_3px_0px_#000000] sm:shadow-[4px_4px_0px_#000000] hover:-translate-y-1 hover:shadow-[5px_5px_0px_#000000] sm:hover:shadow-[6px_6px_0px_#000000] transition-transform duration-200"
    >
      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#000000] border-2 border-[#555555] flex items-center justify-center mb-3 sm:mb-4">
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#ff9900]" />
      </div>
      <h3 className="text-[16px] sm:text-[18px] font-bold text-white mb-1.5 sm:mb-2">
        {title}
      </h3>
      <p className="text-[14px] sm:text-[15px] text-[#aaaaaa] leading-snug">
        {description}
      </p>
    </div>
  );
};

/* ── Advanced Greeting helper ── */
const getGreeting = (name?: string) => {
  const hour = new Date().getHours();
  let greeting: string;
  if (hour >= 5 && hour < 12) greeting = "Good morning";
  else if (hour >= 12 && hour < 17) greeting = "Good afternoon";
  else greeting = "Good evening";
  return name ? `${greeting}, ${name}` : greeting;
};

/* ── UI Constants ── */
const solidButtonClass =
  "inline-flex items-center gap-2 font-bold px-5 sm:px-6 py-2.5 sm:py-3 border-2 border-[#000000] shadow-[3px_3px_0px_#000000] sm:shadow-[4px_4px_0px_#000000] active:translate-y-[3px] active:translate-x-[3px] sm:active:translate-y-[4px] sm:active:translate-x-[4px] active:shadow-none transition-all duration-150 rounded-none";

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
      className="group flex items-center gap-3 sm:gap-4 p-3 bg-[#1e1e1e] border-2 border-[#444444] shadow-[3px_3px_0px_#000000] sm:shadow-[4px_4px_0px_#000000] hover:border-[#ff9900] active:translate-y-[3px] active:translate-x-[3px] sm:active:translate-y-[4px] sm:active:translate-x-[4px] active:shadow-none w-full transition-all duration-150"
    >
      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#000000] border-2 border-[#444444] flex items-center justify-center shrink-0 group-hover:border-[#ff9900] transition-colors">
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:text-[#ff9900]" />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-[15px] sm:text-[16px] font-bold text-white group-hover:text-[#ff9900] transition-colors truncate">
          {title}
        </h3>
        <p className="text-[13px] sm:text-[14px] text-[#aaaaaa] truncate">
          {description}
        </p>
      </div>
      <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-[#000000] border-2 border-[#444444] group-hover:bg-[#ff9900] group-hover:border-[#ff9900] transition-colors shrink-0">
        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
      </div>
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
    <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-[#1e1e1e] border-2 border-[#444444] shadow-[3px_3px_0px_#000000] sm:shadow-[4px_4px_0px_#000000]">
      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#0055cc] border-2 border-[#000000] flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] sm:text-[12px] tracking-widest text-[#0088ff] font-bold mb-1">
          Step {step}
        </p>
        <h3 className="text-[15px] sm:text-[16px] font-bold text-white mb-1">
          {title}
        </h3>
        <p className="text-[13px] sm:text-[14px] text-[#aaaaaa] leading-snug">
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
    <Suspense fallback={<div className="min-h-screen bg-[#111111]" />}>
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
    <div className="min-h-screen bg-[#111111] text-[#dddddd] selection:bg-[#ff9900] selection:text-black overflow-x-hidden">
      {/* ════════════════════════════════════════════════════════════════════
          HERO — three different experiences
          ════════════════════════════════════════════════════════════════════ */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20 md:pt-24 pb-10 sm:pb-14 md:pb-16">
        {isLoggedIn && isNewUser ? (
          /* ── Just Registered Hero ── */
          <div className="max-w-2xl mx-auto space-y-5 sm:space-y-7 md:space-y-8">
            <FadeInItem delay={0}>
              <div className="bg-[#1e1e1e] border-2 border-[#444444] p-4 sm:p-5 md:p-6 shadow-[4px_4px_0px_#000000] sm:shadow-[6px_6px_0px_#000000] md:shadow-[8px_8px_0px_#000000]">
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#ff9900] border-2 border-[#000000] flex items-center justify-center shrink-0">
                    <PartyPopper className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-black" />
                  </div>
                  <div className="min-w-0">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight truncate">
                      Welcome,{" "}
                      <span className="text-[#ff9900]">{firstName}</span>
                    </h1>
                  </div>
                </div>
                <div className="bg-[#000000] border-2 border-[#555555] p-3">
                  <p className="text-[14px] sm:text-[15px] md:text-[16px] text-[#cccccc] font-bold">
                    Your account is ready. You have{" "}
                    <span className="text-[#00cc44]">5 GB of free storage</span>
                    .
                  </p>
                </div>
              </div>
            </FadeInItem>

            {/* Onboarding steps */}
            <div className="space-y-3 sm:space-y-4">
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

            {/* CTA */}
            <FadeInItem delay={500}>
              <div className="flex flex-col sm:flex-row items-center justify-center pt-2 sm:pt-4 gap-3 sm:gap-4">
                <Link
                  href="/dashboard"
                  className={`${solidButtonClass} bg-[#ff9900] text-black text-[16px] sm:text-[18px] w-full sm:w-auto justify-center`}
                >
                  <Rocket className="w-4 h-4 sm:w-5 sm:h-5" />
                  Go to Dashboard
                </Link>
                <div className="flex items-center gap-3 sm:gap-4 text-[12px] sm:text-[13px] font-bold text-[#aaaaaa]">
                  <span className="flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00cc44]" />{" "}
                    5GB Free
                  </span>
                  <span className="flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00cc44]" />{" "}
                    Secure
                  </span>
                </div>
              </div>
            </FadeInItem>
          </div>
        ) : isLoggedIn ? (
          /* ── Returning User Hero ── */
          <div className="max-w-2xl mx-auto space-y-5 sm:space-y-7 md:space-y-8">
            <FadeInItem delay={0}>
              <div className="bg-[#1e1e1e] border-2 border-[#444444] p-4 sm:p-5 md:p-6 shadow-[4px_4px_0px_#000000] sm:shadow-[6px_6px_0px_#000000] md:shadow-[8px_8px_0px_#000000]">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight mb-1.5 sm:mb-2 break-words">
                  {getGreeting()},{" "}
                  <span className="text-[#0088ff]">{firstName}</span>
                </h1>
                <p className="text-[14px] sm:text-[15px] md:text-[16px] text-[#aaaaaa] font-bold">
                  System operational. Pick up where you left off.
                </p>
              </div>
            </FadeInItem>

            {/* Quick actions */}
            <div className="space-y-3 sm:space-y-4">
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
          <div className="max-w-4xl mx-auto space-y-5 sm:space-y-7 md:space-y-8 text-center">
            <FadeInItem delay={0}>
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#000000] border-2 border-[#333333] text-[11px] sm:text-[13px] text-[#aaaaaa] font-bold tracking-wider">
                <LockKeyhole className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ff9900]" />
                <span>Secured by AWS Cloud</span>
              </div>
            </FadeInItem>

            <FadeInItem delay={150}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4">
                <span>Your Data.</span>
                <span className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-[#1e1e1e] border-2 border-[#444444] shadow-[3px_3px_0px_#000000] sm:shadow-[4px_4px_0px_#000000] overflow-hidden shrink-0">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={current.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                      }}
                      className="absolute inset-0 p-1.5 sm:p-2"
                    >
                      {current.icon}
                    </motion.div>
                  </AnimatePresence>
                </span>
                <span className="text-[#ff9900] bg-[#000000] px-2 sm:px-3 border-2 border-[#ff9900]">
                  Only Yours.
                </span>
              </h1>
            </FadeInItem>

            <FadeInItem delay={300}>
              <p className="text-[14px] sm:text-[16px] md:text-xl text-[#aaaaaa] font-bold max-w-2xl mx-auto border-l-4 border-[#0055cc] pl-3 sm:pl-4 text-left">
                A cloud storage platform stripped of the noise. No bloatware, no
                complicated settings, and zero compromises on your privacy.
              </p>
            </FadeInItem>

            <FadeInItem delay={450}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 md:gap-5 pt-4 sm:pt-6 md:pt-8">
                <Link
                  href="/verify-regis"
                  className={`${solidButtonClass} bg-[#ffffff] text-black text-[15px] sm:text-[16px] w-full sm:w-auto justify-center`}
                >
                  Start for free
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
                <Link
                  href="/supported-formats"
                  className={`${solidButtonClass} bg-[#1e1e1e] text-[#dddddd] text-[15px] sm:text-[16px] border-[#444444] w-full sm:w-auto justify-center`}
                >
                  Supported Formats
                </Link>
              </div>
            </FadeInItem>
          </div>
        )}
        {/* ════════════════════════════════════════════════════════════════════
    PRODUCT PREVIEW VIDEO — only for logged-out users
    ════════════════════════════════════════════════════════════════════ */}
        {isLoaded && !userId && (
          <section className="max-w-6xl mx-auto px-0 pt-12 sm:pt-16 md:pt-20 pb-6 sm:pb-8">
            <FadeInItem delay={0}>
              <div className="mb-6 sm:mb-8 text-center">
                <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#000000] border-2 border-[#333333] text-[11px] sm:text-[13px] text-[#aaaaaa] font-bold tracking-wider mb-3 sm:mb-4">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#00cc44] animate-pulse" />
                  <span>LIVE PREVIEW</span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight mb-1.5 sm:mb-2">
                  See it in action.
                </h2>
                <p className="text-[#aaaaaa] font-bold text-[14px] sm:text-[15px] md:text-[16px]">
                  A dashboard that respects your time and your data.
                </p>
              </div>

              <div className="relative bg-[#1e1e1e] border-2 sm:border-4 border-[#444444] shadow-[4px_4px_0px_#000000] sm:shadow-[6px_6px_0px_#000000] md:shadow-[8px_8px_0px_#000000] overflow-hidden">
                {/* Browser-style top bar */}
                <div className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-[#000000] border-b-2 border-[#444444]">
                  <div className="flex gap-1.5 sm:gap-2 shrink-0">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[#ff5555] border border-[#000000]" />
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[#ffbb00] border border-[#000000]" />
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[#00cc44] border border-[#000000]" />
                  </div>
                  <div className="flex-1 min-w-0 mx-2 sm:mx-4 px-2 sm:px-3 py-1 bg-[#1e1e1e] border border-[#444444] text-[10px] sm:text-[12px] text-[#aaaaaa] font-bold text-center truncate">
                    kosha.cloudkinshuk.in/dashboard
                  </div>
                </div>

                {/* Looping video */}
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
                  onLoadedData={() => console.log("Video loaded successfully")}
                  className="w-full h-auto block aspect-video object-cover bg-[#000000]"
                >
                  <source src="/videos/branding.mp4" type="video/mp4" />
                </video>
              </div>
            </FadeInItem>
          </section>
        )}
      </main>

      {/* ════════════════════════════════════════════════════════════════════
          FEATURES — shown to everyone
          ════════════════════════════════════════════════════════════════════ */}
      <section
        id="features"
        className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 border-t-4 border-[#333333]"
      >
        <div className="mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight mb-1.5 sm:mb-2">
            Brilliantly Simple.
          </h2>
          <p className="text-[#ff9900] font-bold text-[13px] sm:text-[15px] md:text-[16px] tracking-widest">
            Everything you need. Nothing you don&apos;t.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
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
            delay={100}
          />
          <FeatureCard
            icon={Layout}
            title="Zero Bloat"
            description="No unnecessary features. A clean interface designed to get out of your way."
            delay={200}
          />
          <FeatureCard
            icon={Zap}
            title="Lightning Fast"
            description="Optimized for speed. Uploads and downloads in the blink of an eye."
            delay={300}
          />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          CTA — adapts based on auth state
          ════════════════════════════════════════════════════════════════════ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        <div className="bg-[#0055cc] border-2 sm:border-4 border-[#000000] p-6 sm:p-8 md:p-12 shadow-[4px_4px_0px_#000000] sm:shadow-[6px_6px_0px_#000000] md:shadow-[8px_8px_0px_#000000] flex flex-col items-center text-center">
          {isLoggedIn ? (
            <>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4 tracking-tight">
                Your files are waiting
              </h2>
              <p className="text-[#cccccc] font-bold text-[14px] sm:text-[15px] md:text-[16px] mb-6 sm:mb-8 max-w-md">
                Jump back into your dashboard and keep your workflow going.
              </p>
              <Link
                href="/dashboard"
                className={`${solidButtonClass} bg-[#000000] text-white text-[15px] sm:text-[16px] w-full sm:w-auto justify-center`}
              >
                View Dashboard
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </>
          ) : (
            <>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4 tracking-tight">
                Ready to take back your data?
              </h2>
              <p className="text-[#cccccc] font-bold text-[14px] sm:text-[15px] md:text-[16px] mb-6 sm:mb-8 max-w-md">
                Join thousands who have migrated to a simpler, more secure way
                to store their digital life.
              </p>
              <Link
                href="/verify-regis"
                className={`${solidButtonClass} bg-[#ff9900] text-black text-[15px] sm:text-[16px] w-full sm:w-auto justify-center`}
              >
                Create Free Account
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
