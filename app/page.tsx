"use client";

import React, {
  useState,
  useEffect,
  useRef,
  Suspense,
  type ReactNode,
  type ComponentType,
  type SVGProps,
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
import { useAuth, useUser } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import HeroGrid from "./components/HeroGrid";

/* ══════════════════════════════════════════════════════════════════
   KOSHA — refined white theme, mono typography.
   All original routes & clerk auth preserved.
   ══════════════════════════════════════════════════════════════════ */

const MONO = "'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace";
const SERIF = "'Fraunces', 'Iowan Old Style', Georgia, serif";

/* Design tokens */
const INK = "#0a0a0a";
const INK_2 = "#0a0a0a";
const INK_3 = "#78716c";
const MUTED = "#a8a29e";
const PAPER = "#faf9f4";
const PAPER_2 = "#f4f2ea";
const LINE = "#e4e1d5";
const LINE_2 = "#d8d4c3";
const BLUE = "#1d4ed8";
const BLUE_SOFT = "#eef2ff";
const AMBER = "#b45309";
const AMBER_SOFT = "#fef3c7";
const EMERALD = "#15803d";

/* ═══════════ Types ═══════════ */
type Tone = "blue" | "amber";
type IconType = ComponentType<SVGProps<SVGSVGElement>>;

interface KProps {
  children: ReactNode;
  tone?: Tone;
}
interface BarBlockProps {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}
interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}
interface Feature {
  id: string;
  title: string;
  body: string;
  icon: IconType;
}
interface OnboardingStepProps {
  icon: IconType;
  step: number;
  title: string;
  description: string;
  delay: number;
}
interface QuickActionProps {
  icon: IconType;
  title: string;
  description: string;
  href: string;
  delay: number;
}

/* ═══════════ Inline highlighted keyword ═══════════ */
const K = ({ children, tone = "blue" }: KProps) => {
  const color = tone === "amber" ? AMBER : BLUE;
  const bg = tone === "amber" ? AMBER_SOFT : BLUE_SOFT;
  return (
    <span
      style={{
        color,
        background: `linear-gradient(180deg, transparent 60%, ${bg} 60%)`,
        padding: "0 2px",
        fontWeight: 500,
      }}
    >
      {children}
    </span>
  );
};

/* ═══════════ Vertical accent bar ═══════════ */
const BarBlock = ({
  children,
  tone = "blue",
  className = "",
}: BarBlockProps) => {
  const color = tone === "amber" ? AMBER : BLUE;
  return (
    <div
      className={`relative pl-5 sm:pl-6 ${className}`}
      style={{ borderLeft: `2px solid ${color}` }}
    >
      {children}
    </div>
  );
};

/* ═══════════ Fade-in on view ═══════════ */
const useInView = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView] as const;
};

const Reveal = ({ children, delay = 0, className = "" }: RevealProps) => {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(8px)",
        transition: `opacity .6s ease-out ${delay}ms, transform .6s ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

/* ═══════════ Greeting helper ═══════════ */
const getGreeting = () => {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return "Good morning";
  if (h >= 12 && h < 17) return "Good afternoon";
  return "Good evening";
};

/* ═══════════ New-user flag ═══════════ */
const useIsNewUser = () => {
  const searchParams = useSearchParams();
  return searchParams.get("new") === "true";
};

/* ═══════════ Primary & secondary link buttons ═══════════ */
const PrimaryLink = ({
  children,
  href,
  className = "",
}: {
  children: ReactNode;
  href: string;
  className?: string;
}) => (
  <Link
    href={href}
    className={`inline-flex items-center gap-2 px-5 py-3 rounded-lg text-[13.5px] transition hover:opacity-90 ${className}`}
    style={{
      background: INK,
      color: PAPER,
      fontFamily: MONO,
      fontWeight: 500,
    }}
  >
    {children}
  </Link>
);

const SecondaryLink = ({
  children,
  href,
  className = "",
}: {
  children: ReactNode;
  href: string;
  className?: string;
}) => (
  <Link
    href={href}
    className={`inline-flex items-center gap-2 px-5 py-3 rounded-lg text-[13.5px] transition hover:bg-[#fcfaf3] ${className}`}
    style={{
      background: "transparent",
      color: INK_2,
      border: `1px solid ${LINE_2}`,
      fontFamily: MONO,
    }}
  >
    {children}
  </Link>
);

/* ═══════════ Onboarding step (new-user) ═══════════ */
const OnboardingStep = ({
  icon: Icon,
  step,
  title,
  description,
  delay,
}: OnboardingStepProps) => (
  <Reveal delay={delay}>
    <div
      className="group flex items-start gap-4 p-4 sm:p-5 rounded-lg transition-colors hover:bg-[#fcfaf3]"
      style={{
        background: "#fff",
        border: `1px solid ${LINE}`,
        fontFamily: MONO,
      }}
    >
      <span
        className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-[12px] transition-colors"
        style={{
          background: PAPER_2,
          border: `1px solid ${LINE}`,
          color: INK_3,
          fontFamily: MONO,
          fontWeight: 500,
        }}
      >
        {step.toString().padStart(2, "0")}
      </span>
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: BLUE_SOFT, border: `1px solid #dbe4ff` }}
      >
        <Icon className="w-[18px] h-[18px]" style={{ color: BLUE }} />
      </div>
      <div className="min-w-0 flex-1 pt-0.5">
        <h3
          className="text-[15px] mb-0.5"
          style={{ color: INK, fontWeight: 600 }}
        >
          {title}
        </h3>
        <p className="text-[13px] leading-[1.65]" style={{ color: INK_3 }}>
          {description}
        </p>
      </div>
    </div>
  </Reveal>
);

/* ═══════════ Quick action (returning user) ═══════════ */
const QuickAction = ({
  icon: Icon,
  title,
  description,
  href,
  delay,
}: QuickActionProps) => (
  <Reveal delay={delay}>
    <Link
      href={href}
      className="group flex items-center gap-4 p-4 sm:p-5 rounded-lg transition-all hover:bg-[#fcfaf3]"
      style={{
        background: "#fff",
        border: `1px solid ${LINE}`,
        fontFamily: MONO,
      }}
    >
      <span
        className="shrink-0 text-[15px] transition-colors"
        style={{ color: MUTED, fontFamily: MONO }}
        aria-hidden
      >
        →
      </span>
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: BLUE_SOFT, border: `1px solid #dbe4ff` }}
      >
        <Icon className="w-[18px] h-[18px]" style={{ color: BLUE }} />
      </div>
      <div className="min-w-0 flex-1">
        <h3
          className="text-[15px] transition-colors group-hover:text-[#1d4ed8]"
          style={{ color: INK, fontWeight: 600 }}
        >
          {title}
        </h3>
        <p className="text-[13px]" style={{ color: INK_3 }}>
          {description}
        </p>
      </div>
      <ChevronRight
        className="w-4 h-4 shrink-0 transition-all group-hover:translate-x-0.5"
        style={{ color: MUTED }}
      />
    </Link>
  </Reveal>
);

/* ═══════════ Hero — new user ═══════════ */
const NewUserHero = ({ firstName }: { firstName: string }) => (
  <div className="relative max-w-3xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-16">
    <Reveal delay={0}>
      <div
        className="inline-flex items-center gap-2 text-[12px] mb-6"
        style={{ fontFamily: MONO, color: INK_3 }}
      >
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full"
          style={{
            background: AMBER_SOFT,
            border: `1px solid #fde68a`,
            color: AMBER,
          }}
        >
          <PartyPopper className="w-3 h-3" />
          account provisioned
        </span>
      </div>
    </Reveal>

    <Reveal delay={80}>
      <h1
        className="text-[38px] sm:text-[52px] md:text-[60px] leading-[1.04] tracking-[-0.03em]"
        style={{ fontFamily: MONO, color: INK, fontWeight: 500 }}
      >
        Welcome,{" "}
        <span
          style={{
            fontFamily: SERIF,
            fontStyle: "italic",
            color: BLUE,
            fontWeight: 400,
          }}
        >
          {firstName}
        </span>
        .
      </h1>
    </Reveal>

    <Reveal delay={160}>
      <div className="mt-8">
        <BarBlock>
          <p
            className="text-[15px] sm:text-[16px] leading-[1.75] max-w-[58ch]"
            style={{ fontFamily: MONO, color: INK_2 }}
          >
            Your workspace is ready. You have <K>5 GB</K> of encrypted storage
            on <K>AWS S3</K> — private by default, yours forever. No credit
            card, no trial.
          </p>
        </BarBlock>
      </div>
    </Reveal>

    <Reveal delay={240}>
      <div
        className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12.5px]"
        style={{
          background: "#f4faf5",
          border: `1px solid #d9ecdd`,
          color: EMERALD,
          fontFamily: MONO,
        }}
      >
        <Check className="w-3.5 h-3.5" />
        All systems go. You&apos;re in.
      </div>
    </Reveal>

    <Reveal delay={320}>
      <div className="mt-12 mb-5">
        <h2
          className="text-[22px] sm:text-[26px] tracking-tight"
          style={{ fontFamily: MONO, color: INK, fontWeight: 600 }}
        >
          Quick start.
        </h2>
      </div>
    </Reveal>

    <div className="space-y-2.5">
      <OnboardingStep
        icon={Upload}
        step={1}
        title="Upload your first file"
        description="Drag and drop any file into your dashboard — we support PDFs, images, documents, videos, and more."
        delay={380}
      />
      <OnboardingStep
        icon={FolderOpen}
        step={2}
        title="Organize with folders"
        description="Create folders to keep everything tidy. Your files, your structure."
        delay={440}
      />
      <OnboardingStep
        icon={ShieldCheck}
        step={3}
        title="Enjoy total privacy"
        description="Your files are encrypted and only accessible by you. No tracking, no ads, no compromises."
        delay={500}
      />
    </div>

    <Reveal delay={580}>
      <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <PrimaryLink href="/dashboard">
          <Rocket className="w-4 h-4" />
          Go to Dashboard
          <ArrowRight className="w-3.5 h-3.5" />
        </PrimaryLink>
        <div
          className="flex items-center gap-4 text-[12px]"
          style={{ fontFamily: MONO, color: INK_3 }}
        >
          <span className="flex items-center gap-1.5">
            <Check className="w-3 h-3" style={{ color: EMERALD }} />
            5GB Free
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-3 h-3" style={{ color: EMERALD }} />
            Secure
          </span>
        </div>
      </div>
    </Reveal>
  </div>
);

/* ═══════════ Hero — returning user ═══════════ */
const ReturningUserHero = ({ firstName }: { firstName: string }) => (
  <div className="relative max-w-3xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-16">
    <Reveal delay={0}>
      <h1
        className="text-[38px] sm:text-[52px] md:text-[60px] leading-[1.04] tracking-[-0.03em]"
        style={{ fontFamily: MONO, color: INK, fontWeight: 500 }}
      >
        {getGreeting()},{" "}
        <span
          style={{
            fontFamily: SERIF,
            fontStyle: "italic",
            color: BLUE,
            fontWeight: 400,
          }}
        >
          {firstName}
        </span>
        .
      </h1>
    </Reveal>

    <Reveal delay={120}>
      <div className="mt-6">
        <BarBlock>
          <p
            className="text-[15px] sm:text-[16px] leading-[1.75]"
            style={{ fontFamily: MONO, color: INK_2 }}
          >
            System <K>operational</K>. Pick up where you left off.
          </p>
        </BarBlock>
      </div>
    </Reveal>

    <Reveal delay={220}>
      <div
        className="mt-10 mb-4 text-[12px] uppercase tracking-[0.14em]"
        style={{ fontFamily: MONO, color: MUTED }}
      >
        Jump back in
      </div>
    </Reveal>

    <div className="space-y-2.5">
      <QuickAction
        icon={FolderOpen}
        title="Open Dashboard"
        description="View and manage all your stored files"
        href="/dashboard"
        delay={280}
      />
      <QuickAction
        icon={Upload}
        title="Upload Files"
        description="Add new documents to your storage"
        href="/dashboard"
        delay={340}
      />
    </div>
  </div>
);

/* ═══════════ Hero — logged-out ═══════════ */
const LoggedOutHero = () => (
  <section className="relative overflow-hidden">
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none opacity-[0.45]"
      style={{
        backgroundImage: `linear-gradient(${LINE} 1px, transparent 1px), linear-gradient(90deg, ${LINE} 1px, transparent 1px)`,
        backgroundSize: "64px 64px",
        maskImage:
          "radial-gradient(ellipse at 50% 0%, black 30%, transparent 75%)",
        WebkitMaskImage:
          "radial-gradient(ellipse at 50% 0%, black 30%, transparent 75%)",
      }}
    />
    <div className="relative max-w-4xl mx-auto px-5 sm:px-8 pt-20 sm:pt-32 pb-16 sm:pb-20 text-center">
      <Reveal delay={0}>
        <div
          className="inline-flex items-center gap-2 text-[12px] mb-10"
          style={{ fontFamily: MONO, color: INK_3 }}
        >
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full"
            style={{
              background: PAPER_2,
              border: `1px solid ${LINE}`,
              color: INK_2,
            }}
          >
            <LockKeyhole className="w-3 h-3" style={{ color: BLUE }} />
            Secured by AWS Cloud
          </span>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <h1
          className="text-[44px] sm:text-[60px] md:text-[76px] leading-[1.02] tracking-[-0.03em]"
          style={{ fontFamily: MONO, color: INK, fontWeight: 500 }}
        >
          Your data.
          <br />
          <span
            style={{
              fontFamily: SERIF,
              fontWeight: 400,
              fontStyle: "italic",
              color: BLUE,
            }}
          >
            Only yours.
          </span>
        </h1>
      </Reveal>

      <Reveal delay={180}>
        <div className="mt-12 flex justify-center">
          <BarBlock className="text-left">
            <p
              className="text-[15px] sm:text-[16.5px] leading-[1.75] max-w-[58ch]"
              style={{ fontFamily: MONO, color: INK_2 }}
            >
              A cloud storage platform stripped of the noise. No{" "}
              <K>bloatware</K>, no complicated settings, and{" "}
              <K tone="amber">zero</K> compromises on your privacy.
            </p>
          </BarBlock>
        </div>
      </Reveal>

      <Reveal delay={280}>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <PrimaryLink href="/verify-regis">
            Start for free
            <ArrowRight className="w-3.5 h-3.5" />
          </PrimaryLink>
          <SecondaryLink href="/supported-formats">
            Supported Formats
          </SecondaryLink>
        </div>
      </Reveal>

      <Reveal delay={360}>
        <div
          className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[12.5px]"
          style={{ fontFamily: MONO, color: INK_3 }}
        >
          <span className="flex items-center gap-1.5">
            <Check className="w-3 h-3" style={{ color: EMERALD }} />
            no credit card
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-3 h-3" style={{ color: EMERALD }} />
            encrypted
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-3 h-3" style={{ color: EMERALD }} />
            zero AI training
          </span>
        </div>
      </Reveal>
    </div>
  </section>
);

/* ═══════════ Preview section (video, logged-out only) ═══════════ */
const PreviewSection = () => (
  <section className="relative max-w-5xl mx-auto px-5 sm:px-8 pb-12 sm:pb-20">
    <Reveal delay={0}>
      <div className="mb-8 text-center">
        <div
          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] mb-3"
          style={{
            background: "#f4faf5",
            border: `1px solid #d9ecdd`,
            color: EMERALD,
            fontFamily: MONO,
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: EMERALD }}
          />
          LIVE PREVIEW
        </div>
        <h2
          className="text-[26px] sm:text-[32px] md:text-[36px] leading-[1.1] tracking-[-0.02em]"
          style={{ fontFamily: MONO, color: INK, fontWeight: 500 }}
        >
          See it{" "}
          <span
            style={{
              fontFamily: SERIF,
              fontStyle: "italic",
              color: BLUE,
              fontWeight: 400,
            }}
          >
            in action
          </span>
          .
        </h2>
        <p
          className="mt-2 text-[14px]"
          style={{ fontFamily: MONO, color: INK_3 }}
        >
          A dashboard that respects your time and your data.
        </p>
      </div>
    </Reveal>

    <Reveal delay={80}>
      <div
        className="relative rounded-xl overflow-hidden"
        style={{
          background: "#fff",
          border: `1px solid ${LINE}`,
          boxShadow: `0 1px 2px rgba(0,0,0,0.04), 0 24px 60px -30px rgba(29,78,216,0.2)`,
        }}
      >
        <div
          className="flex items-center gap-2.5 px-4 py-2.5"
          style={{ background: PAPER_2, borderBottom: `1px solid ${LINE}` }}
        >
          <div className="flex gap-1.5 shrink-0">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: "#fff", border: `1px solid ${LINE_2}` }}
            />
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: "#fff", border: `1px solid ${LINE_2}` }}
            />
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: "#fff", border: `1px solid ${LINE_2}` }}
            />
          </div>
          <div
            className="flex-1 min-w-0 mx-2 sm:mx-3 px-3 py-1 rounded text-[11.5px] text-center truncate"
            style={{
              background: "#fff",
              border: `1px solid ${LINE}`,
              color: INK_3,
              fontFamily: MONO,
            }}
          >
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
            });
          }}
          className="w-full h-auto block aspect-video object-cover"
          style={{ background: PAPER_2 }}
        >
          <source src="/videos/brandy.mp4" type="video/mp4" />
        </video>
      </div>
    </Reveal>
  </section>
);

/* ═══════════ Features grid (all 8 from original) ═══════════ */
const FEATURES: Feature[] = [
  {
    id: "01",
    title: "5 GB Free Forever",
    body: "Generous AWS backed storage for everyone. Drop your files without worrying about space.",
    icon: HardDrive,
  },
  {
    id: "02",
    title: "Absolute Privacy",
    body: "Amazon S3 Encryption. We can't see your files or sell your habits.",
    icon: ShieldCheck,
  },
  {
    id: "03",
    title: "Zero Bloat",
    body: "No unnecessary features. A clean interface designed to get out of your way.",
    icon: Layout,
  },
  {
    id: "04",
    title: "Lightning Fast",
    body: "Optimized for speed. Uploads and downloads in the blink of an eye.",
    icon: Zap,
  },
  {
    id: "05",
    title: "No AI training",
    body: "We do not use your data to train AI models. Your files are yours alone.",
    icon: BrainCircuit,
  },
  {
    id: "06",
    title: "No bloated AI",
    body: "We do not offer any AI features. We focus on secure, private storage without distractions.",
    icon: BrickWallShield,
  },
  {
    id: "07",
    title: "Multiple Formats",
    body: "We support a wide range of file formats including documents, images, videos, and more.",
    icon: FileCog,
  },
  {
    id: "08",
    title: "You Control Your Data",
    body: "We do not collect any data about your files or usage. Full control over what you share.",
    icon: Cog,
  },
];

const FeaturesGrid = () => (
  <section
    id="features"
    className="relative max-w-7xl mx-auto px-5 sm:px-8 py-20 sm:py-24"
    style={{ borderTop: `1px solid ${LINE}` }}
  >
    <Reveal>
      <div className="max-w-3xl mx-auto text-center mb-14">
        <h2
          className="text-[32px] sm:text-[44px] leading-[1.05] tracking-[-0.025em]"
          style={{ fontFamily: MONO, color: INK, fontWeight: 500 }}
        >
          Brilliantly{" "}
          <span
            style={{
              fontFamily: SERIF,
              fontStyle: "italic",
              color: BLUE,
              fontWeight: 400,
            }}
          >
            simple
          </span>
          .
        </h2>
        <p
          className="mt-4 text-[15px] leading-[1.7]"
          style={{ fontFamily: MONO, color: INK_3 }}
        >
          Everything you need. Nothing you don&apos;t.
        </p>
      </div>
    </Reveal>

    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto"
      style={{
        border: `1px solid ${LINE}`,
        borderRadius: "4px",
        background: "#fff",
        overflow: "hidden",
      }}
    >
      {FEATURES.map((f, i) => {
        const Icon = f.icon;
        const cols = 4;
        const col = i % cols;
        const row = Math.floor(i / cols);
        const lastRow = row === Math.ceil(FEATURES.length / cols) - 1;
        return (
          <Reveal key={f.id} delay={i * 50}>
            <div
              className="group h-full p-6 sm:p-7 relative transition-colors hover:bg-[#fcfaf3]"
              style={{
                borderRight: col < cols - 1 ? `1px solid ${LINE}` : "none",
                borderBottom: !lastRow ? `1px solid ${LINE}` : "none",
                fontFamily: MONO,
              }}
            >
              <div className="flex items-start justify-between mb-5">
                <Icon
                  className="w-5 h-5 transition-colors"
                  style={{ color: INK_2 }}
                />
                <span
                  className="text-[11px]"
                  style={{ color: MUTED, letterSpacing: "0.1em" }}
                >
                  {f.id}
                </span>
              </div>
              <h3
                className="text-[15.5px] mb-2.5 tracking-tight"
                style={{ color: INK, fontWeight: 600 }}
              >
                {f.title}
              </h3>
              <p className="text-[13px] leading-[1.7]" style={{ color: INK_3 }}>
                {f.body}
              </p>
              <div
                className="absolute bottom-0 left-0 h-[2px] transition-all duration-500 group-hover:w-full w-0"
                style={{ background: BLUE }}
              />
            </div>
          </Reveal>
        );
      })}
    </div>
  </section>
);

/* ═══════════ CTA (logged-in vs logged-out) ═══════════ */
const CTA = ({ isLoggedIn }: { isLoggedIn: boolean }) => (
  <section
    id="pricing"
    className="relative max-w-7xl mx-auto px-5 sm:px-8 py-20 sm:py-24"
  >
    <Reveal>
      <div
        className="relative overflow-hidden rounded-lg p-8 sm:p-14"
        style={{ background: "#fff", border: `1px solid ${LINE}` }}
      >
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-[0.5]"
          style={{
            backgroundImage: `linear-gradient(${LINE} 1px, transparent 1px), linear-gradient(90deg, ${LINE} 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
            maskImage:
              "radial-gradient(ellipse at 80% 30%, black 0%, transparent 60%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at 80% 30%, black 0%, transparent 60%)",
          }}
        />
        <div className="relative">
          {isLoggedIn ? (
            <div className="max-w-2xl">
              <h2
                className="text-[32px] sm:text-[44px] leading-[1.05] tracking-[-0.025em]"
                style={{ fontFamily: MONO, color: INK, fontWeight: 500 }}
              >
                Your files are{" "}
                <span
                  style={{
                    fontFamily: SERIF,
                    fontStyle: "italic",
                    color: BLUE,
                    fontWeight: 400,
                  }}
                >
                  waiting
                </span>
                .
              </h2>
              <p
                className="mt-4 max-w-[54ch] text-[15px] leading-[1.8]"
                style={{ fontFamily: MONO, color: INK_3 }}
              >
                Jump back into your dashboard and keep your workflow going.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <PrimaryLink href="/dashboard">
                  View Dashboard
                  <ArrowRight className="w-3.5 h-3.5" />
                </PrimaryLink>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7">
                <h2
                  className="text-[32px] sm:text-[48px] leading-[1.05] tracking-[-0.025em]"
                  style={{ fontFamily: MONO, color: INK, fontWeight: 500 }}
                >
                  Ready to take back{" "}
                  <span
                    style={{
                      fontFamily: SERIF,
                      fontStyle: "italic",
                      color: BLUE,
                      fontWeight: 400,
                    }}
                  >
                    your data
                  </span>
                  ?
                </h2>
                <p
                  className="mt-4 max-w-[54ch] text-[15px] leading-[1.8]"
                  style={{ fontFamily: MONO, color: INK_3 }}
                >
                  Join thousands who have migrated to a simpler, more secure way
                  to store their digital life.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <PrimaryLink href="/verify-regis">
                    Create Free Account
                    <ArrowRight className="w-3.5 h-3.5" />
                  </PrimaryLink>
                  <SecondaryLink href="/supported-formats">
                    Learn more
                  </SecondaryLink>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div
                  className="p-5 rounded-lg"
                  style={{
                    background: PAPER,
                    border: `1px solid ${LINE}`,
                    fontFamily: MONO,
                  }}
                >
                  <div
                    className="text-[11px] uppercase tracking-[0.15em]"
                    style={{ color: MUTED }}
                  >
                    free plan
                  </div>
                  <div
                    className="mt-2 flex items-baseline gap-1.5"
                    style={{ color: INK, fontWeight: 600 }}
                  >
                    <span className="text-[38px] tracking-tight">Free</span>
                    <span
                      className="text-[13px]"
                      style={{ color: INK_3, fontWeight: 400 }}
                    >
                      / forever
                    </span>
                  </div>
                  <ul
                    className="mt-4 space-y-2 text-[12.5px]"
                    style={{ color: INK_2 }}
                  >
                    {[
                      "5 GB encrypted storage",
                      "Unlimited file types",
                      "Private by default",
                      "Fast downloads, anywhere",
                      "No AI training, ever",
                    ].map((x) => (
                      <li key={x} className="flex items-start gap-2">
                        <Check
                          className="w-3.5 h-3.5 mt-0.5 shrink-0"
                          style={{ color: EMERALD }}
                        />
                        {x}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Reveal>
  </section>
);

/* ═══════════ Footer ═══════════ */
const Footer = () => (
  <footer
    style={{
      borderTop: `1px solid ${LINE}`,
      background: PAPER,
      fontFamily: MONO,
    }}
  >
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
      <div
        className="flex items-center gap-3 text-[13px]"
        style={{ color: INK_2 }}
      >
        <span
          className="inline-flex items-center justify-center w-6 h-6 rounded-lg text-white text-[11px] font-bold"
          style={{ background: INK }}
        >
          K
        </span>
        <span style={{ fontWeight: 600, color: INK }}>kosha</span>
        <span style={{ color: MUTED }}>·</span>
        <span>© 2026 · built with care</span>
      </div>
      <div
        className="flex flex-wrap items-center gap-5 text-[12.5px]"
        style={{ color: INK_3 }}
      >
        <Link href="/privacy" className="hover:text-black transition">
          privacy
        </Link>
        <Link href="/terms" className="hover:text-black transition">
          terms
        </Link>
        <Link href="/supported-formats" className="hover:text-black transition">
          formats
        </Link>
      </div>
    </div>
  </footer>
);

/* ═══════════ Root — Suspense wrapper (original) ═══════════ */
export default function Home() {
  return (
    <Suspense
      fallback={<div className="min-h-screen" style={{ background: PAPER }} />}
    >
      <HomeContent />
    </Suspense>
  );
}

/* ═══════════ HomeContent — clerk auth + variant routing (original) ═══════════ */
function HomeContent() {
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  const isNewUser = useIsNewUser();

  const isLoggedIn = isLoaded && !!userId;
  const firstName = user?.firstName || "there";

  return (
    <div
      className="min-h-screen"
      style={{ background: PAPER, color: INK, fontFamily: MONO }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&display=swap');

        html { scroll-behavior: smooth; }

        body {
          background-color: ${PAPER};
          background-image:
            url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.035 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
        }

        ::selection {
          background: ${BLUE_SOFT};
          color: ${BLUE};
        }
      `}</style>

      <main className="relative">
        <HeroGrid />

        {isLoggedIn && isNewUser ? (
          <NewUserHero firstName={firstName} />
        ) : isLoggedIn ? (
          <ReturningUserHero firstName={firstName} />
        ) : (
          <LoggedOutHero />
        )}

        {/* Preview video — logged-out only (original behavior) */}
        {isLoaded && !userId && <PreviewSection />}
      </main>

      <FeaturesGrid />
      <CTA isLoggedIn={isLoggedIn} />
      <Footer />
    </div>
  );
}
