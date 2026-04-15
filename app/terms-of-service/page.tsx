// components/TermsOfService.tsx
"use client";

import React from "react";

const PLATFORM_NAME = "Kosha";
const PLATFORM_URL = "https://fsspvt.cloudkinshuk.in";
const SUPPORT_EMAIL = "support@cloudkinshuk.in";
const EFFECTIVE_DATE = "April 15, 2026";

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 pb-24 text-neutral-300">
      {/* ── Header ── */}
      <div className="mb-10 pb-6 border-b-2 border-[#dd7700]">
        <p className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#dd7700] mb-3">
          Legal
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Terms of Service
        </h1>
        <p className="text-neutral-500 text-sm">
          Effective Date: {EFFECTIVE_DATE}
        </p>
      </div>

      {/* ── Body ── */}
      <div className="space-y-10 leading-relaxed text-[15px]">
        {/* Intro */}
        <section>
          <p className="text-neutral-300">
            These Terms of Service ({`"Terms"`}) govern your access to and use
            of the {PLATFORM_NAME} cloud storage platform available at{" "}
            <a
              href={PLATFORM_URL}
              className="text-[#dd7700] hover:underline break-all"
            >
              {PLATFORM_URL}
            </a>{" "}
            (the {`"Service"`}). By creating an account or using the Service,
            you agree to be bound by these Terms. If you do not agree, do not
            use the Service.
          </p>
        </section>

        {/* 1 */}
        <section>
          <SectionHeading number="1" title="Description of Service" />
          <p className="mb-3">
            {PLATFORM_NAME} is a cloud-based file storage platform that allows
            you to upload, store, organize, download, and delete files through a
            web interface. The Service includes:
          </p>
          <BulletList
            items={[
              "Secure file upload and download via time-limited presigned URLs — files are never publicly accessible",
              "Per-account storage and file-count limits determined by your plan tier",
              "Account management through a third-party identity provider (Clerk)",
              "Optional paid plan upgrades with expanded storage and file limits",
            ]}
          />
        </section>

        {/* 2 */}
        <section>
          <SectionHeading number="2" title="Eligibility" />
          <p>
            You must be at least 13 years of age (or the minimum age of digital
            consent in your jurisdiction) to use the Service. By using{" "}
            {PLATFORM_NAME}, you represent that you meet this requirement. If
            you are under 18, you confirm that you have the consent of a parent
            or legal guardian.
          </p>
        </section>

        {/* 3 */}
        <section>
          <SectionHeading number="3" title="Account Registration & Security" />
          <BulletList
            items={[
              "You must sign in using a valid account through our authentication provider (Clerk). This may use Google, GitHub, email, or other supported identity providers",
              "You are responsible for all activity that occurs under your account",
              "You must not share your login credentials or allow unauthorized access to your account",
              "You must notify us immediately if you suspect unauthorized access",
              `${PLATFORM_NAME} is not liable for any loss arising from unauthorized use of your account where you have failed to maintain credential security`,
            ]}
          />
        </section>

        {/* 4 */}
        <section>
          <SectionHeading number="4" title="Plans, Limits & Payments" />

          <SubHeading title="4.1 Free Plan" />
          <p className="mb-3">
            Every account starts on the Free plan, which includes a defined
            storage capacity and file count limit. These limits are enforced
            server-side and may be updated at our discretion.
          </p>

          <SubHeading title="4.2 Paid Plans" />
          <BulletList
            items={[
              "Paid plans (e.g. Pro) offer higher storage capacity and file count limits",
              "Payments are processed by a third-party payment provider. We do not store your payment card details",
              "Paid plans are billed on a recurring basis (e.g. monthly or as specified at checkout)",
              "If payment fails or a plan is not renewed, your account may be downgraded to the Free plan. If your stored data exceeds Free plan limits, new uploads will be blocked until you reduce usage or upgrade again",
            ]}
          />

          <SubHeading title="4.3 Limit Enforcement" />
          <BulletList
            items={[
              "Storage and file count limits are checked server-side before every upload. The Service will reject uploads that would exceed your plan limits",
              "File sizes are verified against actual stored data, not client-reported values",
              "We reserve the right to modify plan limits, pricing, or available tiers at any time. Material changes will be communicated in advance",
            ]}
          />
        </section>

        {/* 5 */}
        <section>
          <SectionHeading number="5" title="Acceptable Use" />
          <p className="mb-3">
            You agree to use the Service lawfully and responsibly. You must NOT:
          </p>
          <BulletList
            items={[
              "Upload, store, or distribute content that is illegal, obscene, defamatory, threatening, or infringes on third-party intellectual property rights",
              "Upload malware, viruses, executable scripts, or any file designed to harm, exploit, or compromise systems or users",
              "Attempt to circumvent storage limits, file count restrictions, rate limits, content-type validation, or any other server-side enforcement",
              "Use automated scripts, bots, or tools to flood the Service with requests or uploads",
              "Probe, scan, or test the vulnerability of the Service or attempt to bypass authentication or authorization mechanisms",
              "Use the Service to host or distribute content for purposes unrelated to personal or organizational file storage (e.g. using it as a CDN, web hosting platform, or file-sharing service for public distribution)",
              "Impersonate another user or misrepresent your identity",
              "Use the Service in any way that violates applicable local, national, or international laws or regulations",
            ]}
          />
          <p className="mt-4 text-neutral-500 text-[13px]">
            The Service enforces a strict content-type allowlist. File types
            that could execute code in a browser or operating system (such as
            HTML, JavaScript, SVG, PHP, and executables) are automatically
            rejected.
          </p>
        </section>

        {/* 6 */}
        <section>
          <SectionHeading number="6" title="Your Content" />
          <BulletList
            items={[
              "You retain full ownership of all files you upload to the Service. We do not claim any intellectual property rights over your content",
              "You grant us a limited, non-exclusive license to store, transmit, and process your files solely for the purpose of providing the Service to you",
              "You are solely responsible for the content you upload. You represent that you have the legal right to store and distribute all files in your account",
              "We do not access, view, analyze, or scan the contents of your files. File metadata (name, size, type, timestamps) is used for Service functionality only",
            ]}
          />
        </section>

        {/* 7 */}
        <section>
          <SectionHeading number="7" title="Data Deletion" />
          <BulletList
            items={[
              "When you delete a file through the Service, it is permanently removed from both object storage and our database in a single transaction. Deleted files cannot be recovered",
              "When you delete your account through Clerk, a verified webhook triggers automatic purging of all your files from storage and all your records from our database",
              "We are not responsible for data loss resulting from your own deletion actions",
            ]}
          />
        </section>

        {/* 8 */}
        <section>
          <SectionHeading number="8" title="Service Availability" />
          <BulletList
            items={[
              `${PLATFORM_NAME} is provided on an "as available" basis. We do not guarantee uninterrupted, error-free, or continuous access to the Service`,
              "We may perform maintenance, updates, or infrastructure changes that result in temporary downtime. We will make reasonable efforts to minimize disruption",
              "We rely on third-party infrastructure providers (including AWS and Neon). Outages or issues with these providers may affect the Service and are outside our direct control",
              "We are not liable for any loss or damage resulting from service interruptions, regardless of cause",
            ]}
          />
        </section>

        {/* 9 */}
        <section>
          <SectionHeading number="9" title="Account Suspension & Termination" />
          <p className="mb-3">
            We reserve the right to suspend or terminate your account, with or
            without notice, if:
          </p>
          <BulletList
            items={[
              "You violate these Terms or the Acceptable Use policy",
              "Your account is used for illegal or harmful activity",
              "You fail to renew a paid plan and your usage exceeds Free plan limits for an extended period",
              "We are required to do so by law or legal process",
            ]}
          />
          <p className="mt-3">
            Upon termination for cause, we may delete your files and account
            data without prior notice. If you voluntarily close your account,
            deletion follows the process described in Section 7.
          </p>
        </section>

        {/* 10 */}
        <section>
          <SectionHeading number="10" title="Limitation of Liability" />
          <div className="border border-[#333333] bg-[#111111] p-5 text-[14px]">
            <p className="mb-3">
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW,{" "}
              {PLATFORM_NAME.toUpperCase()} AND ITS OPERATORS SHALL NOT BE
              LIABLE FOR:
            </p>
            <BulletList
              items={[
                "Any indirect, incidental, special, consequential, or punitive damages",
                "Loss of data, revenue, profits, or business opportunities",
                "Damages arising from unauthorized access to your account",
                "Damages arising from service interruptions, third-party provider outages, or infrastructure failures",
                "Any damages exceeding the total amount you have paid to us in the 12 months preceding the claim, or ₹500, whichever is greater",
              ]}
            />
            <p className="mt-4 text-neutral-500">
              THE SERVICE IS PROVIDED {`"AS IS"`} AND {`"AS AVAILABLE"`} WITHOUT
              WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT
              NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
              PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>
          </div>
        </section>

        {/* 11 */}
        <section>
          <SectionHeading number="11" title="Indemnification" />
          <p>
            You agree to indemnify and hold harmless {PLATFORM_NAME}, its
            operators, and its infrastructure providers from any claims,
            damages, losses, liabilities, and expenses (including legal fees)
            arising from your use of the Service, your violation of these Terms,
            or your violation of any third-party rights.
          </p>
        </section>

        {/* 12 */}
        <section>
          <SectionHeading number="12" title="Intellectual Property" />
          <BulletList
            items={[
              `The ${PLATFORM_NAME} name, logo, interface design, and underlying code are the intellectual property of their respective owners and are protected by applicable copyright and trademark laws`,
              "You may not copy, modify, distribute, or reverse-engineer any part of the Service without written permission",
              "Your content remains your own — see Section 6",
            ]}
          />
        </section>

        {/* 13 */}
        <section>
          <SectionHeading number="13" title="Governing Law & Disputes" />
          <p>
            These Terms are governed by the laws of India. Any disputes arising
            from or relating to these Terms or the Service shall be subject to
            the exclusive jurisdiction of the courts in India. Before initiating
            formal proceedings, you agree to attempt resolution by contacting us
            at{" "}
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="text-[#dd7700] hover:underline"
            >
              {SUPPORT_EMAIL}
            </a>
            .
          </p>
        </section>

        {/* 14 */}
        <section>
          <SectionHeading number="14" title="Severability" />
          <p>
            If any provision of these Terms is found to be unenforceable or
            invalid by a court of competent jurisdiction, that provision will be
            enforced to the maximum extent permitted and the remaining
            provisions will remain in full effect.
          </p>
        </section>

        {/* 15 */}
        <section>
          <SectionHeading number="15" title="Changes to These Terms" />
          <p>
            We may revise these Terms at any time by updating this page. The{" "}
            {`"Effective Date"`} at the top indicates the latest revision. If we
            make material changes, we will make reasonable efforts to notify you
            (e.g. via email or a notice on the Service). Your continued use of
            the Service after changes take effect constitutes acceptance of the
            revised Terms.
          </p>
        </section>

        {/* 16 */}
        <section>
          <SectionHeading number="16" title="Contact" />
          <div className="border border-[#333333] bg-[#111111] p-5">
            <p className="text-neutral-400 text-[13px] mb-3">
              For questions about these Terms or the Service:
            </p>
            <p className="text-white font-bold">{PLATFORM_NAME}</p>
            <p className="text-neutral-400 text-[14px] mt-1">
              <a href={PLATFORM_URL} className="text-[#dd7700] hover:underline">
                {PLATFORM_URL}
              </a>
            </p>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="inline-block mt-2 text-[#dd7700] hover:underline text-[14px]"
            >
              {SUPPORT_EMAIL}
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ── Utility components ── */

function SectionHeading({ number, title }: { number: string; title: string }) {
  return (
    <h2 className="text-xl font-bold text-white mb-4 flex items-baseline gap-3">
      <span className="text-[#dd7700] text-[14px] font-bold tabular-nums">
        {number}.
      </span>
      {title}
    </h2>
  );
}

function SubHeading({ title }: { title: string }) {
  return (
    <h3 className="text-[15px] font-bold text-neutral-200 mt-5 mb-2">
      {title}
    </h3>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 text-neutral-400 text-[14px]">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3">
          <span className="text-[#dd7700] mt-[2px] shrink-0">▪</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
