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
      " 2 GB Encrypted Storage (S3 Encryption On Transit and At Rest)",
      "Standard File Sharing",
      "File Versioning (Up to 30 Days)",
      "Community Support",
    ],
    buttonText: "Current Plan",
    buttonHref: "/dashboard",
    isPopular: false,
  },
  {
    name: "Gold",
    price: "₹299",
    billingPeriod: "/Month",
    description:
      "For heavy users who need maximum security and space and customizations.",
    features: [
      "2 TB Encrypted Storage",
      "Advanced Sharing Links (Passwords & Expiration)",
      "Public links with longer expiration (Up to 1 week)",
      "Supports 3 devices max per account",
      "S3 Encrypiton with AWS KMS Support",
      "File Versioning & Recovery (Up to 30 days)",
      "Average Upload and Download Speeds",
    ],
    buttonText: "Upgrade to Pro",
    buttonHref: "/checkout",
    isPopular: true,
  },
];

// Azure-style animations: Quick, subtle, no bounce
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "tween",
      ease: "easeOut",
      duration: 0.3,
    },
  },
};

export default function PricingPage() {
  // Azure Standard Button Classes
  const primaryButtonClass =
    "w-full flex items-center justify-center gap-2 py-2 px-4 font-semibold text-[13px] bg-[#0078D4] hover:bg-[#005a9e] text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  const secondaryButtonClass =
    "w-full flex items-center justify-center gap-2 py-2 px-4 font-semibold text-[13px] bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="min-h-screen bg-[#faf9f8] text-gray-900 flex items-center justify-center p-4 md:p-8 ">
      <div className="w-full max-w-6xl mx-auto py-10">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="mb-4">
            <BsCloudRain size={40} className="text-[#0078D4]" />
          </div>
          <h1 className="text-[24px] md:text-[32px] font-semibold text-gray-900 mb-2 tracking-tight">
            Simple, Transparent Pricing
          </h1>
          <p className="text-[14px] text-gray-600 max-w-xl mx-auto leading-relaxed">
            Secure your digital life with Kosha. Choose the plan that best fits
            your storage and privacy needs.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {pricingTiers.map((tier) => (
            <motion.div
              key={tier.name}
              variants={cardVariants}
              className={`relative flex flex-col bg-white p-6 border rounded-xl shadow-sm transition-shadow hover:shadow-md ${
                tier.isPopular
                  ? "border-[#0078D4] border-t-4"
                  : "border-gray-200"
              }`}
            >
              {/* Popular Badge */}
              {tier.isPopular && (
                <div className="absolute -top-[14px] right-4 bg-[#f3f9fd] text-[#0078D4] border border-[#0078D4] text-[11px] font-semibold px-2 py-0.5 rounded-xl flex items-center gap-1.5 uppercase tracking-wide">
                  <Sparkles size={12} />
                  Most Popular
                </div>
              )}

              {/* Card Header */}
              <div className="mb-6 border-b border-gray-100 pb-6">
                <h2 className="text-[16px] font-semibold text-gray-900 mb-2">
                  {tier.name}
                </h2>
                <div className="flex items-end gap-1 mb-3">
                  <span className="text-[36px] font-semibold text-gray-900 leading-none">
                    {tier.price}
                  </span>
                  {tier.billingPeriod && (
                    <span className="text-gray-500 text-[13px] font-medium mb-1">
                      {tier.billingPeriod}
                    </span>
                  )}
                </div>
                <p className="text-[13px] text-gray-600 leading-relaxed min-h-[40px]">
                  {tier.description}
                </p>
              </div>

              {/* Features List */}
              <ul className="space-y-3.5 mb-8 flex-grow">
                {tier.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-[13px] text-gray-700"
                  >
                    <Check
                      size={16}
                      className={`shrink-0 mt-0.5 ${
                        tier.isPopular ? "text-[#0078D4]" : "text-gray-400"
                      }`}
                    />
                    <span className="leading-snug">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Action Button */}
              <div className="mt-auto pt-4 border-t border-gray-50">
                <Link
                  href={tier.buttonHref}
                  className="w-full block outline-none"
                  tabIndex={-1}
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
