// components/TermsOfService.tsx
import React from "react";

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-neutral-200">
      <div className="mb-8 border-b border-neutral-800 pb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Terms of Service
        </h1>
        <p className="text-neutral-500 text-sm">Last Updated: April 8, 2026</p>
      </div>

      <div className="space-y-8 text-neutral-300 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using this application (&quot;Service&quot;), you
            agree to be bound by these Terms of Service. If you do not agree,
            you may not use the Service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">
            2. Description of Service
          </h2>
          <p>
            The Service provides cloud-based file storage, management, and
            access capabilities. Features and limits depend on your selected
            plan.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">
            3. User Accounts
          </h2>
          <p>
            You must register using a valid account. You are responsible for
            maintaining the security of your account and all activities under
            it.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">
            4. Subscription & Payments
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-neutral-400">
            <li>Certain features require payment.</li>
            <li>
              Payments are processed via third-party providers (e.g., Razorpay).
            </li>
            <li>Plans are billed on a time-based basis (e.g., 30 days).</li>
            <li>Failure to renew may result in restricted access.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">
            5. Storage Limits
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-neutral-400">
            <li>Each plan has a defined storage limit.</li>
            <li>Exceeding limits may block uploads.</li>
            <li>We reserve the right to enforce limits at any time.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">
            6. Acceptable Use
          </h2>
          <p className="mb-2">You agree NOT to:</p>
          <ul className="list-disc pl-5 space-y-2 text-neutral-400">
            <li>Upload illegal, harmful, or infringing content</li>
            <li>Abuse system resources or attempt to overload the service</li>
            <li>Circumvent storage or usage limits</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">
            7. Data Availability
          </h2>
          <p>
            We strive to provide reliable access but do not guarantee
            uninterrupted availability.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">
            8. Termination
          </h2>
          <p>
            We may suspend or terminate accounts for violations or non-payment.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">
            9. Limitation of Liability
          </h2>
          <p>
            The Service is provided &ldquo;as is&quot; without warranties. We
            are not liable for data loss, service interruptions, or damages.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">
            10. Changes to Terms
          </h2>
          <p>
            We may update these terms at any time. Continued use implies
            acceptance.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">11. Contact</h2>
          <p>
            For questions, contact:{" "}
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
