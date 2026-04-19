// components/TermsOfService.tsx
"use client";

import React from "react";

const PLATFORM_NAME = "Kosha";
const PLATFORM_URL = "https://kosha.cloudkinshuk.in";
const SUPPORT_EMAIL = "kinshuk25jan04@gmail.com";
const EFFECTIVE_DATE = "April 15, 2026";

export default function TermsOfService() {
  return (
    <div className="bg-white text-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 pb-24">
        {/* Header */}
        <div className="mb-10 pb-6 border-b border-slate-200">
          <p className="text-xs font-semibold tracking-widest uppercase text-blue-600 mb-2">
            Legal
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-1">
            Terms of Service
          </h1>
          <p className="text-sm text-slate-500">
            Effective Date: {EFFECTIVE_DATE}
          </p>
        </div>

        {/* Body */}
        <div className="space-y-10 leading-relaxed text-[15px]">
          {/* Intro */}
          <section>
            <p className="text-slate-700">
              These Terms of Service (&quot;Terms&quot;) govern your access to
              and use of the {PLATFORM_NAME} platform available at{" "}
              <a
                href={PLATFORM_URL}
                className="text-blue-600 hover:underline break-all"
              >
                {PLATFORM_URL}
              </a>
              . By using the Service, you agree to these Terms.
            </p>
          </section>

          {/* Section Example */}
          <section>
            <SectionHeading number="1" title="Description of Service" />
            <p className="mb-3 text-slate-700">
              {PLATFORM_NAME} is a cloud-based file storage platform that allows
              users to upload, store, and manage files.
            </p>
            <BulletList
              items={[
                "Secure uploads and downloads using presigned URLs",
                "Per-account storage limits",
                "Authentication via Clerk",
                "Optional paid plans",
              ]}
            />
          </section>

          {/* Limitation Box */}
          <section>
            <SectionHeading number="10" title="Limitation of Liability" />
            <div className="border border-slate-200 bg-slate-50 rounded-lg p-5 text-sm">
              <p className="mb-3 font-medium text-slate-800">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW:
              </p>
              <BulletList
                items={[
                  "No liability for indirect or consequential damages",
                  "No liability for data loss or service interruptions",
                  "Maximum liability capped at fees paid or ₹500",
                ]}
              />
              <p className="mt-4 text-slate-500">
                The Service is provided &quot;as is&quot; without warranties.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section>
            <SectionHeading number="16" title="Contact" />
            <div className="border border-slate-200 rounded-lg p-5 bg-white">
              <p className="text-sm text-slate-500 mb-2">For questions:</p>
              <p className="font-medium text-slate-900">{PLATFORM_NAME}</p>
              <a
                href={PLATFORM_URL}
                className="text-blue-600 hover:underline block mt-1"
              >
                {PLATFORM_URL}
              </a>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="text-blue-600 hover:underline block mt-1"
              >
                {SUPPORT_EMAIL}
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

/* Utilities */

function SectionHeading({ number, title }: { number: string; title: string }) {
  return (
    <h2 className="text-xl font-semibold text-slate-900 mb-4 flex gap-2">
      <span className="text-blue-600 font-mono">{number}.</span>
      {title}
    </h2>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 text-slate-600 text-sm">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2">
          <span className="text-blue-600">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
