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
import { useAuth, useUser } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import HeroGrid from "./components/HeroGrid";

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

/* ── Simple fade-in using IntersectionObserver (no JS timers per item) ── */
const FadeInItem = ({
  children,
  delay = 0,
  className = "",
}: FadeInItemProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ease-out ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

/* ── Simple InView hook ── */
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

/* ── Clean Feature Card (no 3D tilt, just a simple hover lift) ── */
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
      className="bg-gray-200/80 border border-[#e8e6e3] rounded-xl p-5 sm:p-6 hover:shadow-lg hover:border-[#0078d4]/30 hover:-translate-y-0.5 transition-all duration-300 group"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 0.5s ease-out ${delay}ms, transform 0.5s ease-out ${delay}ms, box-shadow 0.3s, border-color 0.3s`,
      }}
    >
      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-gradient-to-br from-[#eff6fc] to-[#deecf9] flex items-center justify-center mb-3.5 group-hover:shadow-md transition-shadow duration-300">
        <Icon className="w-5 h-5 text-[#0078d4]" />
      </div>
      <h3
        className="text-[15px] sm:text-base font-semibold text-[#1b1a19] mb-1"
        style={{ fontFamily: "'Segoe UI Variable', 'Segoe UI', sans-serif" }}
      >
        {title}
      </h3>
      <p
        className="text-[13px] sm:text-sm text-[#605e5c] leading-relaxed"
        style={{ fontFamily: "'Segoe UI Variable', 'Segoe UI', sans-serif" }}
      >
        {description}
      </p>
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

/* ── Buttons ── */
const PrimaryButton = ({ children, href, className = "" }: ButtonProps) => (
  <Link
    href={href}
    className={`inline-flex items-center justify-center gap-2 font-semibold px-7 py-3 rounded-lg text-white transition-all duration-200 text-sm sm:text-[15px] shadow-md hover:shadow-lg hover:brightness-110 active:scale-[0.98] ${className}`}
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
    className={`inline-flex items-center justify-center gap-2 font-semibold px-7 py-3 rounded-lg text-[#1b1a19] bg-white border border-[#d2d0ce] hover:bg-[#faf9f8] hover:border-[#0078d4]/40 active:bg-[#f3f2f1] transition-all duration-200 text-sm sm:text-[15px] ${className}`}
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
      className="group flex items-center gap-4 p-4 sm:p-5 bg-white rounded-xl border border-gray-300 hover:border-[#0078d4]/40 hover:shadow-md transition-all duration-200"
    >
      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-gradient-to-br from-[#eff6fc] to-[#deecf9] flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-[#0078d4]" />
      </div>
      <div className="min-w-0 flex-1">
        <h3
          className="text-sm sm:text-[15px] font-semibold text-[#1b1a19] group-hover:text-[#0078d4] transition-colors"
          style={{ fontFamily: "'Segoe UI Variable', 'Segoe UI', sans-serif" }}
        >
          {title}
        </h3>
        <p
          className="text-xs sm:text-[13px] text-[#605e5c]"
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
    <div className="flex items-start gap-3.5 p-4 sm:p-5 bg-white border border-[#e8e6e3] rounded-xl">
      <div className="relative shrink-0">
        <div
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #0078d4 0%, #005a9e 100%)",
          }}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white border-2 border-[#0078d4] flex items-center justify-center">
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
          className="text-sm sm:text-[15px] font-semibold text-[#1b1a19] mb-0.5"
          style={{ fontFamily: "'Segoe UI Variable', 'Segoe UI', sans-serif" }}
        >
          {title}
        </h3>
        <p
          className="text-[13px] sm:text-sm text-[#605e5c] leading-relaxed"
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

/* ── Simple CSS-only file icon crossfade (replaces framer-motion) ── */

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
  const isNewUser = useIsNewUser();

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
        <HeroGrid />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-14 sm:pt-20 md:pt-28 pb-8 sm:pb-12 md:pb-16">
          {isLoggedIn && isNewUser ? (
            /* ── Just Registered Hero ── */
            <div className="max-w-2xl mx-auto space-y-4 sm:space-y-5">
              <FadeInItem delay={0}>
                <div className="bg-white border border-[#e8e6e3] rounded-xl p-5 sm:p-7 shadow-sm">
                  <div className="flex items-center gap-3 sm:gap-4 mb-5">
                    <div
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        background:
                          "linear-gradient(135deg, #fff4ce 0%, #ffe8a3 100%)",
                      }}
                    >
                      <PartyPopper className="w-6 h-6 sm:w-7 sm:h-7 text-[#d83b01]" />
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
                  <div className="bg-gradient-to-r from-[#dff6dd] to-[#e8f9e6] border border-[#107c10]/25 rounded-lg px-4 py-3 flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#107c10]/10 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-[#107c10]" />
                    </div>
                    <p className="text-sm sm:text-[15px] text-[#1b1a19] font-medium">
                      Your account is ready. You have{" "}
                      <span className="font-bold text-[#107c10]">
                        5 GB of free storage
                      </span>
                      .
                    </p>
                  </div>
                </div>
              </FadeInItem>

              <div className="space-y-2.5">
                <OnboardingStep
                  icon={Upload}
                  step={1}
                  title="Upload your first file"
                  description="Drag and drop any file into your dashboard — we support PDFs, images, documents, videos, and more."
                  delay={100}
                />
                <OnboardingStep
                  icon={FolderOpen}
                  step={2}
                  title="Organize with folders"
                  description="Create folders to keep everything tidy. Your files, your structure."
                  delay={180}
                />
                <OnboardingStep
                  icon={ShieldCheck}
                  step={3}
                  title="Enjoy total privacy"
                  description="Your files are encrypted and only accessible by you. No tracking, no ads, no compromises."
                  delay={260}
                />
              </div>

              <FadeInItem delay={340}>
                <div className="flex flex-col sm:flex-row items-center justify-center pt-2 gap-3 sm:gap-4">
                  <PrimaryButton href="/dashboard" className="w-full sm:w-auto">
                    <Rocket className="w-4 h-4" />
                    Go to Dashboard
                  </PrimaryButton>
                  <div className="flex items-center gap-4 text-xs sm:text-[13px] font-medium text-[#605e5c]">
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
            <div className="max-w-2xl mx-auto space-y-4 sm:space-y-5">
              <FadeInItem delay={0}>
                <div className="p-5 sm:p-7 space-y-1.5">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1b1a19] tracking-tight leading-tight">
                    {getGreeting()},{" "}
                    <span className="bg-gradient-to-r from-[#0078d4] to-[#005a9e] bg-clip-text text-transparent">
                      {firstName}
                    </span>
                  </h1>
                  <p className="text-sm sm:text-base text-[#605e5c] font-medium">
                    System operational. Pick up where you left off.
                  </p>
                </div>
              </FadeInItem>

              <div className="space-y-2.5">
                <QuickAction
                  icon={FolderOpen}
                  title="Open Dashboard"
                  description="View and manage all your stored files"
                  href="/dashboard"
                  delay={100}
                />
                <QuickAction
                  icon={Upload}
                  title="Upload Files"
                  description="Add new documents to your storage"
                  href="/dashboard"
                  delay={180}
                />
              </div>
            </div>
          ) : (
            /* ── Logged-out Hero ── */
            <div className="max-w-4xl mx-auto space-y-5 sm:space-y-6 text-center">
              <FadeInItem delay={0}>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/70 border border-[#deecf9] rounded-full text-xs sm:text-[13px] text-[#0078d4] font-semibold tracking-wide shadow-sm">
                  <LockKeyhole className="w-3.5 h-3.5" />
                  <span>Secured by AWS Cloud</span>
                </div>
              </FadeInItem>

              <FadeInItem delay={100}>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold text-[#1b1a19] tracking-tight leading-tight flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                  <span>Your Data.</span>
                  <span className="bg-gradient-to-r from-[#0078d4] via-[#0063b1] to-[#005a9e] bg-clip-text text-transparent">
                    Only Yours.
                  </span>
                </h1>
              </FadeInItem>

              <FadeInItem delay={200}>
                <p className="text-sm sm:text-base md:text-lg text-black max-w-2xl mx-auto leading-relaxed text-left font-medium py-2 px-4">
                  A cloud storage platform stripped of the noise. No bloatware,
                  no complicated settings, and zero compromises on your privacy.
                </p>
              </FadeInItem>

              <FadeInItem delay={300}>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-3 sm:pt-5">
                  <PrimaryButton
                    href="/verify-regis"
                    className="w-full sm:w-auto text-[15px] px-9 py-3.5"
                  >
                    Start for free
                    <ArrowRight className="w-4 h-4" />
                  </PrimaryButton>
                  <SecondaryButton
                    href="/supported-formats"
                    className="w-full sm:w-auto"
                  >
                    Supported Formats
                  </SecondaryButton>
                </div>
              </FadeInItem>
            </div>
          )}

          {/* ═══════════════ PRODUCT PREVIEW — logged-out only ═══════════════ */}
          {isLoaded && !userId && (
            <section className="max-w-5xl mx-auto pt-12 sm:pt-16 md:pt-20 pb-4 sm:pb-6">
              <FadeInItem delay={0}>
                <div className="mb-6 sm:mb-8 text-center">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#dff6dd]/80 border border-[#107c10]/20 rounded-full text-[11px] sm:text-xs text-[#107c10] font-semibold tracking-wide mb-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#107c10] animate-pulse" />
                    <span>LIVE PREVIEW</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1b1a19] tracking-tight mb-1">
                    See it in action.
                  </h2>
                  <p className="text-[#605e5c] font-medium text-sm">
                    A dashboard that respects your time and your data.
                  </p>
                </div>

                <div className="relative bg-white border border-[#e8e6e3] rounded-xl shadow-lg shadow-blue-300/40 overflow-hidden">
                  {/* Browser top bar */}
                  <div className="flex items-center gap-2.5 px-4 py-2.5 bg-[#f6f5f4] border-b border-[#e8e6e3]">
                    <div className="flex gap-1.5 shrink-0">
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#d13438]/70" />
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ffaa44]/70" />
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#107c10]/70" />
                    </div>
                    <div className="flex-1 min-w-0 mx-2 sm:mx-3 px-3 py-1 bg-white border border-[#e8e6e3] rounded-md text-[10px] sm:text-xs text-[#605e5c] font-medium text-center truncate">
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
        className="relative max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-[#d2d0ce] to-transparent" />

        <div className="mb-8 sm:mb-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1b1a19] tracking-tight mb-1.5">
            Brilliantly Simple.
          </h2>
          <p className="text-[#0078d4] font-semibold text-[13px] sm:text-sm tracking-wide">
            Everything you need. Nothing you don&apos;t.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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
            delay={60}
          />
          <FeatureCard
            icon={Layout}
            title="Zero Bloat"
            description="No unnecessary features. A clean interface designed to get out of your way."
            delay={120}
          />
          <FeatureCard
            icon={Zap}
            title="Lightning Fast"
            description="Optimized for speed. Uploads and downloads in the blink of an eye."
            delay={180}
          />
          <FeatureCard
            icon={BrainCircuit}
            title="No data training for AI"
            description="We do not use your data to train AI models. Your files are yours alone."
            delay={240}
          />
          <FeatureCard
            icon={BrickWallShield}
            title="No bloated AI features"
            description="We do not offer any AI features. We focus on secure, private storage without distractions."
            delay={300}
          />
          <FeatureCard
            icon={FileCog}
            title="Multiple file formats"
            description="We support a wide range of file formats including documents, images, videos, and more."
            delay={360}
          />
          <FeatureCard
            icon={Cog}
            title="You control your data"
            description="We do not collect any data about your files or usage. Full control over what you share."
            delay={420}
          />
        </div>
      </section>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 md:py-18">
        <div
          className="relative rounded-2xl p-7 sm:p-10 md:p-12 flex flex-col items-center text-center overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #0078d4 0%, #005a9e 50%, #004578 100%)",
          }}
        >
          {/* Decorative glow */}
          <div
            className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-15 pointer-events-none blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 60%)",
            }}
          />

          <div className="relative z-10">
            {isLoggedIn ? (
              <>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2.5 tracking-tight">
                  Your files are waiting
                </h2>
                <p className="text-[#c7dff7] font-medium text-sm sm:text-[15px] mb-6 sm:mb-7 max-w-md">
                  Jump back into your dashboard and keep your workflow going.
                </p>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 font-semibold px-7 py-3 rounded-lg text-[#0078d4] bg-white hover:bg-[#f3f2f1] active:bg-[#edebe9] transition-all duration-200 text-[15px] shadow-lg hover:shadow-xl active:scale-[0.98]"
                >
                  View Dashboard <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            ) : (
              <>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2.5 tracking-tight">
                  Ready to take back your data?
                </h2>
                <p className="text-[#c7dff7] font-medium text-sm sm:text-[15px] mb-6 sm:mb-7 max-w-md">
                  Join thousands who have migrated to a simpler, more secure way
                  to store their digital life.
                </p>
                <Link
                  href="/verify-regis"
                  className="inline-flex items-center justify-center gap-2 font-semibold px-7 py-3 rounded-lg text-[#0078d4] bg-white hover:bg-[#f3f2f1] active:bg-[#edebe9] transition-all duration-200 text-[15px] shadow-lg hover:shadow-xl active:scale-[0.98]"
                >
                  Create Free Account <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
