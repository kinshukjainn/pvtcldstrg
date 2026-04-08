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
  CloudRain,
  LockKeyhole,
  HardDrive,
  Cloud,
  Layers,
  Database,
  Check,
} from "lucide-react";
import { FaGithub, FaTwitter } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";

import Link from "next/link";

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
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
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
        transform: inView ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
      }}
      className="bg-zinc-900/10 backdrop-blur-xs border border-zinc-800 p-8 rounded-4xl  transition-colors"
    >
      <div className="w-12 h-12 bg-black/70 backdrop-blur-xs rounded-4xl flex items-center justify-center mb-6">
        <Icon className="w-6 h-6 text-white " />
      </div>
      <h3 className="text-xl font-bold text-zinc-100 mb-3">{title}</h3>
      <p className="text-zinc-400 leading-relaxed">{description}</p>
    </div>
  );
};

/* ── Page ── */

export default function Home() {
  const [iconIndex, setIconIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setIconIndex((i) => (i + 1) % fileIcons.length),
      2400,
    );
    return () => clearInterval(id);
  }, []);

  const current = fileIcons[iconIndex];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300  selection:bg-emerald-500/30 relative">
      {/* Hero */}
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-24 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <FadeInItem delay={0}>
            <div className="inline-flex items-center gap-2 px-8 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-white text-lg font-medium mb-4">
              <LockKeyhole className="w-4 h-4" />
              <span>
                Secured by{" "}
                <span className="text-[#ff9100] font-bold font-mono">
                  AWS Cloud Storage
                </span>
              </span>
            </div>
          </FadeInItem>

          <FadeInItem delay={200}>
            <h1 className="text-5xl md:text-7xl font-bold text-zinc-100 tracking-tight leading-tight inline-flex flex-wrap items-center justify-center gap-x-4">
              <span>Your</span>

              {/* Morphing icon */}
              <span className="relative inline-flex items-center justify-center w-14 h-14 md:w-20 md:h-20 align-middle">
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

                {/* Glow */}
                <AnimatePresence mode="wait">
                  <motion.span
                    key={current.label + "-glow"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45 }}
                    className="absolute inset-0 rounded-full blur-2xl pointer-events-none"
                    style={{ backgroundColor: current.color }}
                  />
                </AnimatePresence>
              </span>

              {/* Static gradient text */}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white via-yellow-200 to-red-600">
                Only yours.
              </span>
            </h1>
          </FadeInItem>

          <FadeInItem delay={400}>
            <p className="text-lg md:text-xl text-zinc-400 leading-relaxed max-w-2xl mx-auto">
              A cloud storage platform stripped of the noise. No bloatware, no
              complicated settings, and absolutely zero compromises on your
              privacy. Just drop your files and go.
            </p>
          </FadeInItem>

          <FadeInItem delay={600}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white border-blue-500 border-3  hover:shadow-blue-600 shadow-md cursor-pointer text-zinc-950 font-bold px-8 py-4 rounded-full text-lg transition-all duration-200 group">
                Start for free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <Link
                href="/supported-formats"
                className="w-full sm:w-auto px-8 py-4 rounded-full text-lg font-medium border-2 cursor-pointer border-white hover:bg-zinc-900 transition-colors duration-200"
              >
                About Supported Formats
              </Link>
            </div>
          </FadeInItem>
        </div>
      </main>

      {/* Features */}
      <section
        id="features"
        className="max-w-7xl mx-auto px-6 py-24 border-t border-zinc-900"
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-4">
            Brilliantly Simple.
          </h2>
          <p className="text-zinc-400 text-lg">
            Everything you need. Nothing you don&apos;t.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={HardDrive}
            title="40GB Free Forever"
            description="Generous storage for everyone in our free tier. Drop your files without worrying about space limits right away."
            delay={0}
          />
          <FeatureCard
            icon={ShieldCheck}
            title="Absolute Privacy"
            description="Zero-knowledge architecture. We can't see your files, we don't scan your data, and we don't sell your habits."
            delay={150}
          />
          <FeatureCard
            icon={Layout}
            title="Zero Bloat"
            description="No unnecessary features or complicated menus. A clean, intuitive interface designed to get out of your way."
            delay={300}
          />
          <FeatureCard
            icon={Zap}
            title="Lightning Fast"
            description="Optimized for speed. Uploads and downloads happen in the blink of an eye, powered by edge networks."
            delay={450}
          />
        </div>
      </section>

      {/* Pricing Plans (Coming Soon) */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-zinc-900">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-4">
            Future-Proof Pricing
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Honest, transparent tiers with the best prices on the market.
            Scaling your storage shouldn&apos;t break the bank.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* 2TB Plan */}
          <div className="bg-zinc-900/10 backdrop-blur-xs border border-zinc-800 p-8 rounded-4xl relative overflow-hidden flex flex-col hover:border-blue-500/50 transition-colors">
            <div className="absolute top-5 right-5 bg-blue-500/10 text-blue-400 text-xs font-bold px-3 py-1 rounded-full border border-blue-500/20">
              Coming Soon
            </div>
            <div className="w-12 h-12 bg-black/70 rounded-2xl flex items-center justify-center mb-6">
              <Cloud className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-100 mb-2">2TB Plan</h3>
            <div className="text-4xl font-bold text-white mb-6">
              460₹
              <span className="text-lg text-zinc-500 font-normal">/mo</span>
            </div>
            <ul className="space-y-3 text-zinc-400 mb-8 flex-1">
              <li className="flex gap-3 items-center">
                <Check className="w-4 h-4 text-blue-400" /> Perfect for
                professionals
              </li>
              <li className="flex gap-3 items-center">
                <Check className="w-4 h-4 text-blue-400" /> End-to-end
                encryption
              </li>
              <li className="flex gap-3 items-center">
                <Check className="w-4 h-4 text-blue-400" /> Priority support
              </li>
            </ul>
            <button
              disabled
              className="w-full bg-zinc-800/50 text-zinc-500 font-bold py-3 rounded-xl cursor-not-allowed border border-zinc-800"
            >
              Available Soon
            </button>
          </div>

          {/* 8TB Plan */}
          <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 border border-blue-500/30 p-8 rounded-4xl relative overflow-hidden flex flex-col shadow-lg shadow-blue-500/5">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
            <div className="absolute top-5 right-5 bg-blue-500/10 text-blue-400 text-xs font-bold px-3 py-1 rounded-full border border-blue-500/20">
              Coming Soon
            </div>
            <div className="w-12 h-12 bg-black/70 rounded-2xl flex items-center justify-center mb-6">
              <Layers className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-100 mb-2">8TB Plan</h3>
            <div className="text-4xl font-bold text-white mb-6">
              1600₹
              <span className="text-lg text-zinc-500 font-normal">/mo</span>
            </div>
            <ul className="space-y-3 text-zinc-400 mb-8 flex-1">
              <li className="flex gap-3 items-center">
                <Check className="w-4 h-4 text-blue-400" /> Made for creators
              </li>
              <li className="flex gap-3 items-center">
                <Check className="w-4 h-4 text-blue-400" /> Advanced sharing
                controls
              </li>
              <li className="flex gap-3 items-center">
                <Check className="w-4 h-4 text-blue-400" /> Unlimited bandwidth
              </li>
            </ul>
            <button
              disabled
              className="w-full bg-zinc-800/50 text-zinc-500 font-bold py-3 rounded-xl cursor-not-allowed border border-zinc-800"
            >
              Available Soon
            </button>
          </div>

          {/* 20TB Plan */}
          <div className="bg-zinc-900/10 backdrop-blur-xs border border-zinc-800 p-8 rounded-4xl relative overflow-hidden flex flex-col hover:border-blue-500/50 transition-colors">
            <div className="absolute top-5 right-5 bg-blue-500/10 text-blue-400 text-xs font-bold px-3 py-1 rounded-full border border-blue-500/20">
              Coming Soon
            </div>
            <div className="w-12 h-12 bg-black/70 rounded-2xl flex items-center justify-center mb-6">
              <Database className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-100 mb-2">20TB Plan</h3>
            <div className="text-4xl font-bold text-white mb-6">
              3600₹
              <span className="text-lg text-zinc-500 font-normal">/mo</span>
            </div>
            <ul className="space-y-3 text-zinc-400 mb-8 flex-1">
              <li className="flex gap-3 items-center">
                <Check className="w-4 h-4 text-blue-400" /> Ultimate digital
                vault
              </li>
              <li className="flex gap-3 items-center">
                <Check className="w-4 h-4 text-blue-400" /> Dedicated account
                manager
              </li>
              <li className="flex gap-3 items-center">
                <Check className="w-4 h-4 text-blue-400" /> Custom branding
                options
              </li>
            </ul>
            <button
              disabled
              className="w-full bg-zinc-800/50 text-zinc-500 font-bold py-3 rounded-xl cursor-not-allowed border border-zinc-800"
            >
              Available Soon
            </button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-24">
        <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 hover:border-blue-500 shadow-md hover:shadow-blue-600 rounded-3xl p-12 text-center relative overflow-hidden transition-all duration-500 ease-in-out">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[4px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
          <h2 className="text-3xl font-bold text-zinc-100 mb-6">
            Ready to take back your data?
          </h2>
          <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
            Join thousands of users who have migrated to a simpler, more secure
            way to store their digital life.
          </p>
          <button className="bg-white  text-zinc-950 font-bold px-6 py-2 cursor-pointer rounded-full text-lg transition-all duration-200">
            Create Free Account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-zinc-100 font-semibold">
            <CloudRain className="w-5 h-5 text-emerald-400" />
            <span>AuraCloud</span>
          </div>
          <div className="text-zinc-500 text-sm">
            © {new Date().getFullYear()} AuraCloud. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-zinc-500">
            <a href="#" className="hover:text-emerald-400 transition-colors">
              <FaTwitter className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-emerald-400 transition-colors">
              <FaGithub className="w-5 h-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
