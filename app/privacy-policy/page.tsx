// components/PrivacyPolicy.tsx
import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-neutral-200">
      <div className="mb-8 border-b border-neutral-800 pb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Privacy Policy
        </h1>
        <p className="text-neutral-500 text-sm">Last Updated: April 8, 2026</p>
      </div>

      <div className="space-y-8 text-neutral-300 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">
            1. Information We Collect
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-neutral-400">
            <li>Account information (email, user ID)</li>
            <li>Uploaded files and metadata</li>
            <li>Usage data (storage, access logs)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">
            2. How We Use Information
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-neutral-400">
            <li>To provide and maintain the Service</li>
            <li>To enforce limits and prevent abuse</li>
            <li>To process payments</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">
            3. Data Storage
          </h2>
          <p>
            Your data is stored securely using third-party infrastructure
            providers (e.g., AWS).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">
            4. Data Sharing
          </h2>
          <p className="mb-2">
            We do not sell your personal data. We may share data with:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-neutral-400">
            <li>Payment processors</li>
            <li>Infrastructure providers</li>
            <li>Legal authorities if required</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">5. Security</h2>
          <p>
            We implement reasonable safeguards, but no system is completely
            secure.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">
            6. Data Retention
          </h2>
          <p>
            Data may be retained while your account is active. We may delete
            data after account termination.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">
            7. Your Rights
          </h2>
          <p>You may request deletion of your account and associated data.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">
            8. Changes to Policy
          </h2>
          <p>We may update this policy periodically.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">9. Contact</h2>
          <p>
            For privacy concerns:{" "}
            <a
              href="mailto:support@example.com"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              support@example.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
