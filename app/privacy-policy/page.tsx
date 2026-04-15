// components/PrivacyPolicy.tsx
"use client";

import React from "react";

const PLATFORM_NAME = "Kosha";
const PLATFORM_URL = "https://fsspvt.cloudkinshuk.in";
const SUPPORT_EMAIL = "kinshuk25jan04@gmail.com";
const COMPANY_NAME = "Kosha";
const EFFECTIVE_DATE = "April 15, 2026";

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 pb-24 text-neutral-300">
      {/* ── Header ── */}
      <div className="mb-10 pb-6 border-b-2 border-[#dd7700]">
        <p className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#dd7700] mb-3">
          Legal
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Privacy Policy
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
            {PLATFORM_NAME} ({`"we", "us", "our"`}) operates the cloud storage
            platform available at{" "}
            <a
              href={PLATFORM_URL}
              className="text-[#dd7700] hover:underline break-all"
            >
              {PLATFORM_URL}
            </a>{" "}
            (the {`"Service"`}). This Privacy Policy explains what information
            we collect, how we use it, and your choices regarding that
            information. By using the Service you agree to this policy.
          </p>
        </section>

        {/* 1 */}
        <section>
          <SectionHeading number="1" title="Information We Collect" />

          <SubHeading title="1.1 Account Information" />
          <p className="mb-3">
            When you sign up through our authentication provider (Clerk), we
            receive and store:
          </p>
          <BulletList
            items={[
              "Your email address (primary email from your SSO / OAuth provider)",
              "Display name and profile picture URL, if provided by your identity provider (e.g. Google, GitHub)",
              "A unique user identifier assigned by Clerk",
            ]}
          />

          <SubHeading title="1.2 Files & Storage Data" />
          <p className="mb-3">
            When you upload, download, or delete files we process:
          </p>
          <BulletList
            items={[
              "The files themselves — stored in encrypted-at-rest object storage (AWS S3)",
              "File metadata: original filename, file size (bytes), MIME type, upload timestamp, and an internal storage key",
              "Aggregate storage usage per account, used to enforce plan limits",
            ]}
          />

          <SubHeading title="1.3 Usage & Technical Data" />
          <p className="mb-3">
            We automatically collect limited technical information when you
            interact with the Service:
          </p>
          <BulletList
            items={[
              "Server-side access logs (timestamps, HTTP status codes, request paths) — retained for security and debugging",
              "Plan tier and quota counters (file count, bytes used)",
              "Rate-limit counters — short-lived, in-memory only, not persisted",
            ]}
          />
          <p className="mt-3 text-neutral-500 text-[13px]">
            We do not use third-party analytics trackers, advertising pixels, or
            fingerprinting scripts on the Service.
          </p>

          <SubHeading title="1.4 Payment Information" />
          <p>
            If you upgrade to a paid plan, payment is processed entirely by our
            third-party payment processor. We do not receive or store your full
            credit card number, CVV, or bank account details. We may receive a
            truncated card identifier, billing email, and transaction status for
            record-keeping.
          </p>
        </section>

        {/* 2 */}
        <section>
          <SectionHeading number="2" title="How We Use Your Information" />
          <BulletList
            items={[
              "Provide, operate, and maintain the Service — including file storage, retrieval, listing, and deletion",
              "Enforce plan limits (storage capacity, file count) and prevent abuse via server-side rate limiting",
              "Authenticate your identity and authorize access to your files — every API action verifies your session and ownership before proceeding",
              "Generate time-limited presigned URLs so you can securely upload to and download from storage without files ever being publicly exposed",
              "Process account lifecycle events — provisioning your account on first sign-in, syncing profile updates, and purging all your data if you delete your account through your identity provider",
              "Respond to support requests and communicate important service changes",
              "Comply with legal obligations",
            ]}
          />
        </section>

        {/* 3 */}
        <section>
          <SectionHeading number="3" title="How We Store & Protect Your Data" />

          <SubHeading title="3.1 Infrastructure" />
          <BulletList
            items={[
              "Files are stored in AWS S3 with server-side encryption at rest (SSE). Files are never served from a public bucket — access is granted exclusively through short-lived presigned URLs that expire within minutes",
              "Database records (account info, file metadata, plan data) are stored in a managed PostgreSQL database (Neon) with encrypted connections",
              "Authentication tokens and session management are handled by Clerk and are never stored on our servers",
            ]}
          />

          <SubHeading title="3.2 Access Controls" />
          <BulletList
            items={[
              "Every server action verifies your authenticated session before executing",
              "Ownership checks ensure you can only access, download, or delete your own files — requests for another user's files are rejected",
              "File uploads are validated against a strict content-type allowlist to prevent storage of executable or potentially malicious file types (e.g. HTML, JavaScript, SVG, executables)",
              "File size is verified server-side against actual S3 object metadata, not client-provided values, before confirming any upload",
              "Webhook endpoints verify cryptographic signatures before processing any account lifecycle event",
            ]}
          />

          <SubHeading title="3.3 Limitations" />
          <p>
            No system is 100% secure. While we implement industry-standard
            safeguards — encryption at rest, encrypted connections, presigned
            URLs, input validation, and server-side auth — we cannot guarantee
            absolute security. You are responsible for maintaining the security
            of your own authentication credentials.
          </p>
        </section>

        {/* 4 */}
        <section>
          <SectionHeading number="4" title="Data Sharing & Third Parties" />
          <p className="mb-4 font-semibold text-white">
            We do not sell, rent, or trade your personal data.
          </p>
          <p className="mb-3">
            We share data only with the following categories of service
            providers who are necessary to operate the Service:
          </p>

          <div className="border border-[#333333] bg-[#111111] overflow-hidden">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-[#333333] bg-[#0a0a0a]">
                  <th className="text-left px-4 py-3 text-[#dd7700] font-bold uppercase tracking-wider text-[11px]">
                    Provider
                  </th>
                  <th className="text-left px-4 py-3 text-[#dd7700] font-bold uppercase tracking-wider text-[11px]">
                    Purpose
                  </th>
                  <th className="text-left px-4 py-3 text-[#dd7700] font-bold uppercase tracking-wider text-[11px]">
                    Data Shared
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222222]">
                <tr>
                  <td className="px-4 py-3 text-white font-medium">Clerk</td>
                  <td className="px-4 py-3 text-neutral-400">
                    Authentication & identity
                  </td>
                  <td className="px-4 py-3 text-neutral-400">
                    Email, name, avatar, user&nbsp;ID
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-white font-medium">AWS (S3)</td>
                  <td className="px-4 py-3 text-neutral-400">File storage</td>
                  <td className="px-4 py-3 text-neutral-400">
                    Uploaded files & object metadata
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-white font-medium">Neon</td>
                  <td className="px-4 py-3 text-neutral-400">
                    Managed database
                  </td>
                  <td className="px-4 py-3 text-neutral-400">
                    Account info, file metadata, plan&nbsp;data
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-white font-medium">
                    Payment processor
                  </td>
                  <td className="px-4 py-3 text-neutral-400">
                    Billing for paid plans
                  </td>
                  <td className="px-4 py-3 text-neutral-400">
                    Email, plan tier, transaction&nbsp;status
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-4">
            We may also disclose information if required by law, regulation,
            legal process, or enforceable governmental request; or to protect
            the rights, property, or safety of {PLATFORM_NAME}, our users, or
            the public.
          </p>
        </section>

        {/* 5 */}
        <section>
          <SectionHeading number="5" title="Data Retention" />
          <BulletList
            items={[
              `Account data and files are retained for as long as your account is active`,
              `When you delete a file, it is permanently removed from both object storage (S3) and our database within the same operation. Deleted files are not recoverable`,
              `If you delete your account through Clerk, we receive a webhook event and automatically purge all your files from S3 and remove all associated records from our database. No user data is intentionally retained after account deletion`,
              `Server access logs may be retained for up to 90 days for security and debugging, after which they are deleted`,
              `Anonymized, aggregate usage statistics (e.g. total platform storage) may be retained indefinitely`,
            ]}
          />
        </section>

        {/* 6 */}
        <section>
          <SectionHeading number="6" title="Your Rights & Choices" />
          <p className="mb-3">
            Depending on your jurisdiction, you may have the right to:
          </p>
          <BulletList
            items={[
              "Access the personal data we hold about you",
              "Correct inaccurate information — profile changes made through your identity provider (Google, GitHub, etc.) are synced automatically",
              "Delete your account and all associated data — you can do this at any time through Clerk's account management. Deletion is permanent and irreversible",
              "Export your files — you can download any of your files at any time through the Service",
              "Object to or restrict processing — contact us at the email below",
            ]}
          />
          <p className="mt-3">
            To exercise any of these rights, email{" "}
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="text-[#dd7700] hover:underline"
            >
              {SUPPORT_EMAIL}
            </a>
            . We will respond within 30 days.
          </p>
        </section>

        {/* 7 */}
        <section>
          <SectionHeading number="7" title="Cookies & Tracking" />
          <p>
            The Service uses only essential cookies required for authentication
            and session management (set by Clerk). We do not use advertising
            cookies, social media trackers, analytics pixels, or any third-party
            tracking technology. There is no cross-site tracking.
          </p>
        </section>

        {/* 8 */}
        <section>
          <SectionHeading number="8" title="Children's Privacy" />
          <p>
            The Service is not directed to individuals under the age of 13 (or
            the applicable age of digital consent in your jurisdiction). We do
            not knowingly collect personal information from children. If you
            believe a child has provided us with personal data, please contact
            us and we will delete it promptly.
          </p>
        </section>

        {/* 9 */}
        <section>
          <SectionHeading number="9" title="International Data Transfers" />
          <p>
            Your data may be processed and stored in regions outside your
            country of residence, including the United States, where our
            infrastructure providers operate. By using the Service you consent
            to such transfers. We rely on the security measures described in
            Section 3 to protect your data regardless of where it is processed.
          </p>
        </section>

        {/* 10 */}
        <section>
          <SectionHeading number="10" title="Changes to This Policy" />
          <p>
            We may update this Privacy Policy from time to time. If we make
            material changes, we will notify you by updating the{" "}
            {`"Effective
            Date"`}{" "}
            at the top of this page and, where feasible, by email. Your
            continued use of the Service after changes take effect constitutes
            acceptance of the revised policy.
          </p>
        </section>

        {/* 11 */}
        <section>
          <SectionHeading number="11" title="Contact" />
          <div className="border border-[#333333] bg-[#111111] p-5">
            <p className="text-neutral-400 text-[13px] mb-3">
              For privacy-related questions, data requests, or concerns:
            </p>
            <p className="text-white font-bold">{COMPANY_NAME}</p>
            <p className="text-neutral-400 text-[14px] mt-1">
              Operating as <span className="text-white">{PLATFORM_NAME}</span>
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
