"use client";

import { Check, Sparkles } from "lucide-react";
import { BsCloudRain } from "react-icons/bs";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
const pricingTiers = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for personal use to get started.",
    features: [
      "15 GB Encrypted Storage",
      "Standard File Sharing",
      "Access across 3 devices",
      "Community Support",
    ],
    buttonText: "Current Plan",
    buttonHref: "/dashboard",
    isPopular: false,
  },
  {
    name: "Pro",
    price: "$9.99",
    billingPeriod: "/month",
    description: "For heavy users who need maximum security and space.",
    features: [
      "2 TB Encrypted Storage",
      "Advanced Sharing (Passwords & Expiration)",
      "Unlimited Devices",
      "Zero-Knowledge Encryption",
      "Priority 24/7 Support",
    ],
    buttonText: "Upgrade to Pro",
    buttonHref: "/checkout", // You can change this later when adding the gateway
    isPopular: true,
  },
];

// Framer Motion animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#1e1e1e] text-neutral-200 py-20 px-4 relative overflow-hidden">
      {/* Background Subtle Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-96 bg-blue-900/[0.03] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-1/2 h-96 bg-[#ff9100]/[0.02] blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center space-y-6 mb-16 flex flex-col items-center">
          <div className="p-3.5 mb-2">
            <BsCloudRain size={55} className="text-[#ff9100]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight title-font">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-neutral-500 max-w-xl mx-auto">
            Secure your digital life with Kosha. Choose the plan that best fits
            your storage and privacy needs.
          </p>
        </div>

        {/* Pricing Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
        >
          {pricingTiers.map((tier) => (
            <motion.div
              key={tier.name}
              variants={cardVariants}
              className={`relative flex flex-col p-8 rounded-3xl border transition-all duration-300 ${
                tier.isPopular
                  ? "bg-[#1c1c1c] border-blue-800/[0.4] shadow-[0_0_40px_-15px_rgba(30,64,175,0.3)]"
                  : "bg-[#181818] border-[#444444]"
              }`}
            >
              {tier.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-700 to-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                  <Sparkles size={14} />
                  MOST POPULAR
                </div>
              )}

              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-2">
                  {tier.name}
                </h2>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-4xl font-bold text-white tracking-tight">
                    {tier.price}
                  </span>
                  {tier.billingPeriod && (
                    <span className="text-neutral-500 text-sm">
                      {tier.billingPeriod}
                    </span>
                  )}
                </div>
                <p className="text-[15px] text-neutral-400">
                  {tier.description}
                </p>
              </div>

              {/* Features List */}
              <ul className="space-y-4 mb-8 flex-grow">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-[15px]">
                    <div className="mt-0.5 rounded-full bg-blue-900/30 p-1">
                      <Check size={14} className="text-blue-400" />
                    </div>
                    <span className="text-neutral-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Action Button */}
              <Link href={tier.buttonHref} className="w-full mt-auto">
                <button
                  className={`w-full py-3.5 px-4 rounded-xl font-medium text-[16px] transition-all duration-200 active:scale-[0.98] ${
                    tier.isPopular
                      ? "bg-blue-800 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20"
                      : "bg-[#2a2a2a] hover:bg-[#333333] border border-[#444444] text-white"
                  }`}
                >
                  {tier.buttonText}
                </button>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
