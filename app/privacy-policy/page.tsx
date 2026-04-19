import React from "react";
import { ChevronRight, Shield, Mail } from "lucide-react";

const PLATFORM_NAME = "Kosha";
const PLATFORM_URL = "https://fsspvt.cloudkinshuk.in";
const SUPPORT_EMAIL = "support@cloudkinshuk.in";
const COMPANY_NAME = "Kosha";
const EFFECTIVE_DATE = "April 15, 2026";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#faf9f8] text-gray-900 font-sans pb-12">
      {/* PAGE HEADER */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="text-[13px] font-medium text-[#0078D4] flex items-center gap-1.5 mb-4 w-fit">
            <span className="hover:underline cursor-pointer">Home</span>
            <ChevronRight size={14} className="text-gray-500" />
            <span className="hover:underline cursor-pointer">Legal</span>
            <ChevronRight size={14} className="text-gray-500" />
            <span className="text-gray-600">Privacy Policy</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#0078D4] rounded-sm flex items-center justify-center shrink-0">
              <Shield size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900 tracking-tight leading-tight">
                Privacy Policy
              </h1>
              <p className="text-[13px] text-gray-600 mt-0.5">
                Effective Date: {EFFECTIVE_DATE}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="max-w-[1000px] mx-auto px-4 sm:px-6 mt-6 sm:mt-8">
        <div className="bg-white border border-gray-200 shadow-sm rounded-sm p-6 sm:p-8 space-y-8">
          {/* Intro */}
          <section className="text-[14px] text-gray-700 leading-relaxed border-b border-gray-100 pb-6">
            <p>
              <strong className="font-semibold text-gray-900">
                {PLATFORM_NAME}
              </strong>{" "}
              (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates the
              platform at{" "}
              <a
                href={PLATFORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0078D4] hover:underline"
              >
                {PLATFORM_URL}
              </a>
              . This policy explains how we collect, use, and protect your data.
            </p>
          </section>

          {/* Section 1 */}
          <section>
            <SectionHeading number="1" title="Information We Collect" />

            <div className="ml-1 sm:ml-6 space-y-5">
              <div>
                <SubHeading title="1.1 Account Information" />
                <BulletList
                  items={[
                    "Email address",
                    "Display name and profile data",
                    "User ID from authentication provider",
                  ]}
                />
              </div>

              <div>
                <SubHeading title="1.2 Files & Storage Data" />
                <BulletList
                  items={[
                    "Uploaded files stored securely in AWS S3",
                    "File metadata (name, size, type, timestamps)",
                    "Storage usage per account",
                  ]}
                />
              </div>

              <div>
                <SubHeading title="1.3 Usage Data" />
                <BulletList
                  items={[
                    "Server logs (timestamps, request paths)",
                    "Usage quotas and rate limits",
                  ]}
                />
              </div>

              <div>
                <SubHeading title="1.4 Payment Information" />
                <p className="text-[13px] text-gray-700 leading-relaxed mt-2">
                  Payments are processed by third-party providers. We do not
                  store card or banking details.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <SectionHeading number="2" title="How We Use Data" />
            <div className="ml-1 sm:ml-6 mt-3">
              <BulletList
                items={[
                  "Operate and maintain the service",
                  "Authenticate users and secure access",
                  "Enforce usage limits",
                  "Respond to support requests",
                  "Comply with legal obligations",
                ]}
              />
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <SectionHeading number="3" title="Data Security" />
            <div className="ml-1 sm:ml-6 mt-3">
              <BulletList
                items={[
                  "Encrypted storage (AWS S3)",
                  "Secure database connections",
                  "Strict access controls",
                  "Session-based authentication",
                ]}
              />
              <p className="text-[13px] text-gray-500 mt-4 bg-[#f3f2f1] p-3 rounded-sm border border-gray-200">
                <strong className="font-semibold text-gray-700">Note:</strong>{" "}
                No system is completely secure. Users are responsible for
                maintaining the confidentiality of their credentials.
              </p>
            </div>
          </section>

          {/* Section 4 - Table */}
          <section>
            <SectionHeading number="4" title="Third-Party Services" />
            <div className="ml-1 sm:ml-6 mt-4">
              <div className="overflow-x-auto border border-gray-200 rounded-sm">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="bg-[#fafafa] border-b border-gray-200">
                      <th className="px-4 py-2.5 text-[12px] font-semibold text-gray-600 uppercase tracking-wider">
                        Provider
                      </th>
                      <th className="px-4 py-2.5 text-[12px] font-semibold text-gray-600 uppercase tracking-wider">
                        Purpose
                      </th>
                      <th className="px-4 py-2.5 text-[12px] font-semibold text-gray-600 uppercase tracking-wider">
                        Data Shared
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-[#f8f8f8] transition-colors">
                      <td className="px-4 py-3 text-[13px] font-medium text-gray-900">
                        Clerk
                      </td>
                      <td className="px-4 py-3 text-[13px] text-gray-700">
                        Authentication
                      </td>
                      <td className="px-4 py-3 text-[13px] text-gray-700">
                        Email, user ID
                      </td>
                    </tr>
                    <tr className="hover:bg-[#f8f8f8] transition-colors">
                      <td className="px-4 py-3 text-[13px] font-medium text-gray-900">
                        AWS S3
                      </td>
                      <td className="px-4 py-3 text-[13px] text-gray-700">
                        File storage
                      </td>
                      <td className="px-4 py-3 text-[13px] text-gray-700">
                        Uploaded files
                      </td>
                    </tr>
                    <tr className="hover:bg-[#f8f8f8] transition-colors">
                      <td className="px-4 py-3 text-[13px] font-medium text-gray-900">
                        Neon
                      </td>
                      <td className="px-4 py-3 text-[13px] text-gray-700">
                        Database
                      </td>
                      <td className="px-4 py-3 text-[13px] text-gray-700">
                        Metadata
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Section 11 - Contact */}
          <section>
            <SectionHeading number="11" title="Contact" />
            <div className="ml-1 sm:ml-6 mt-4 border border-gray-200 bg-[#fafafa] rounded-sm p-5">
              <p className="text-[13px] text-gray-600 mb-3">
                For privacy-related requests or inquiries, please contact our
                support team:
              </p>
              <div className="space-y-1">
                <p className="font-semibold text-[14px] text-gray-900">
                  {COMPANY_NAME}
                </p>
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="flex items-center gap-1.5 text-[13px] text-[#0078D4] hover:underline w-fit"
                >
                  <Mail size={14} />
                  {SUPPORT_EMAIL}
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

/* ============================================================================
 * Utilities
 * ============================================================================ */

function SectionHeading({ number, title }: { number: string; title: string }) {
  return (
    <h2 className="text-[16px] font-semibold text-gray-900 mb-3 border-b border-gray-100 pb-2 flex items-center gap-2">
      <span className="text-[#0078D4] font-mono text-[14px]">{number}.</span>
      {title}
    </h2>
  );
}

function SubHeading({ title }: { title: string }) {
  return (
    <h3 className="text-[14px] font-semibold text-gray-800 mb-2">{title}</h3>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 text-gray-700 text-[13px]">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2 items-start">
          <span className="text-[#0078D4] mt-[3px] shrink-0 text-[10px]">
            ■
          </span>
          <span className="leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}
