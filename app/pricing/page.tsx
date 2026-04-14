"use client";

import { Check, Sparkles } from "lucide-react";
import { BsCloudRain } from "react-icons/bs";
import Link from "next/link";
import { motion, Variants } from "framer-motion";

const pricingTiers = [
  {
    name: "Free",
    price: "₹0",
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
    price: "₹799",
    billingPeriod: "/MO",
    description: "For heavy users who need maximum security and space.",
    features: [
      "2 TB Encrypted Storage",
      "Advanced Sharing (Passwords & Expiration)",
      "Unlimited Devices",
      "Zero-Knowledge Encryption",
      "Priority 24/7 Support",
    ],
    buttonText: "Upgrade to Pro",
    buttonHref: "/checkout",
    isPopular: true,
  },
];

// Framer Motion animation variants (made slightly sharper/faster)
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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};

export default function PricingPage() {
  // Classic raised 3D button effect from AuthPage
  const primaryButtonClass =
    "w-full flex items-center justify-center gap-2 py-3 px-4 font-bold text-[14px] tracking-wide uppercase bg-[#0055cc] text-white border-2 border-t-[#3388ff] border-l-[#3388ff] border-r-[#002266] border-b-[#002266] active:border-t-[#002266] active:border-l-[#002266] active:border-b-[#3388ff] active:border-r-[#3388ff] hover:bg-[#0066ee] disabled:opacity-50 disabled:cursor-not-allowed rounded-none transition-none";

  const secondaryButtonClass =
    "w-full flex items-center justify-center gap-2 py-3 px-4 font-bold text-[14px] tracking-wide uppercase bg-[#dddddd] text-black border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#888888] border-b-[#888888] active:border-t-[#888888] active:border-l-[#888888] active:border-b-[#ffffff] active:border-r-[#ffffff] hover:bg-[#ffffff] disabled:opacity-50 disabled:cursor-not-allowed rounded-none transition-none";

  return (
    <div className="min-h-screen bg-[#111111] text-[#dddddd]  flex items-center justify-center p-4 md:p-8 selection:bg-[#0055cc] selection:text-white relative overflow-hidden">
      <div className="w-full max-w-5xl mx-auto z-10 py-10">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="mb-6 bg-[#000000] border border-[#444444] p-4 shadow-[6px_6px_0px_#000000]">
            <BsCloudRain size={48} className="text-[#dd7700]" />
          </div>
          <h1 className="text-[28px] md:text-[36px] font-bold text-white mb-3 uppercase tracking-tight">
            Simple, Transparent Pricing
          </h1>
          <div className="border-t-2 border-[#444444] w-full max-w-[150px] my-3"></div>
          <p className="text-[14px] font-bold text-[#aaaaaa] uppercase tracking-wide max-w-xl mx-auto leading-relaxed">
            Secure your digital life with Kosha. Choose the plan that best fits
            your storage and privacy needs.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-4xl mx-auto"
        >
          {pricingTiers.map((tier) => (
            <motion.div
              key={tier.name}
              variants={cardVariants}
              className={`relative flex flex-col bg-[#1e1e1e] p-8 border-2 rounded-none transition-all duration-300 ${
                tier.isPopular
                  ? "border-[#dd7700] shadow-[10px_10px_0px_#dd7700]"
                  : "border-[#444444] shadow-[10px_10px_0px_#000000]"
              }`}
            >
              {/* Popular Badge */}
              {tier.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#dd7700] text-black border-2 border-[#000000] text-[11px] font-bold px-3 py-1.5 uppercase tracking-wider flex items-center gap-2 shadow-[4px_4px_0px_#000000]">
                  <Sparkles size={14} className="text-black" />
                  Most Popular
                </div>
              )}

              {/* Card Header */}
              <div className="mb-6 border-b-2 border-[#333333] pb-6 text-center">
                <h2 className="text-[20px] font-bold text-white uppercase tracking-tight mb-3">
                  {tier.name}
                </h2>
                <div className="flex items-end justify-center gap-1 mb-4">
                  <span className="text-[42px] font-bold text-white tracking-tighter leading-none">
                    {tier.price}
                  </span>
                  {tier.billingPeriod && (
                    <span className="text-[#aaaaaa] text-[14px] font-bold uppercase mb-1">
                      {tier.billingPeriod}
                    </span>
                  )}
                </div>
                <p className="text-[12px] text-[#aaaaaa] font-bold uppercase tracking-wide leading-relaxed px-2">
                  {tier.description}
                </p>
              </div>

              {/* Features List */}
              <ul className="space-y-4 mb-8 flex-grow">
                {tier.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-[13px] font-bold uppercase text-[#dddddd] tracking-wide"
                  >
                    <div className="mt-0.5 w-5 h-5 bg-[#000000] border border-[#555555] flex items-center justify-center shrink-0">
                      <Check
                        size={12}
                        className={
                          tier.isPopular ? "text-[#dd7700]" : "text-[#aaaaaa]"
                        }
                      />
                    </div>
                    <span className="leading-snug pt-[1px]">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Action Button */}
              <div className="mt-auto pt-4">
                <Link
                  href={tier.buttonHref}
                  className="w-full block outline-none"
                >
                  <button
                    className={
                      tier.isPopular ? primaryButtonClass : secondaryButtonClass
                    }
                  >
                    {tier.buttonText}
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
