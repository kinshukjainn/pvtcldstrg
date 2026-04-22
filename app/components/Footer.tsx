import Link from "next/link";
import Image from "next/image";
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 pt-10 pb-6 mt-auto ">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid Area */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 mb-8">
          {/* Brand Identity */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-black font-semibold text-[34px]">
              <Image
                src="/anylogo.png"
                alt="Kosha Logo"
                width={50}
                height={50}
                className="object-contain"
              />
              <span>KOSHA</span>
            </div>
            <p className="text-[12px] text-gray-500 leading-relaxed max-w-sm">
              The personal cloud storage solution tailored for security, scale,
              and performance. Build, deploy, and manage your assets with
              enterprise-grade reliability.
            </p>
          </div>

          {/* Navigation - Platform */}
          <div className="flex flex-col gap-2.5">
            <h3 className="text-[13px] font-semibold text-gray-900 mb-1">
              Platform
            </h3>
            <Link
              href="/dashboard"
              className="text-[12px] text-gray-600 hover:text-[#0078D4] hover:underline transition-colors w-fit"
            >
              Dashboard
            </Link>
            <Link
              href="/supported-formats"
              className="text-[12px] text-gray-600 hover:text-[#0078D4] hover:underline transition-colors w-fit"
            >
              Supported Formats
            </Link>
          </div>

          {/* Navigation - Resources */}
          <div className="flex flex-col gap-2.5">
            <h3 className="text-[13px] font-semibold text-gray-900 mb-1">
              Resources
            </h3>
            <Link
              href="/git-track"
              className="text-[12px] text-gray-600 hover:text-[#0078D4] hover:underline transition-colors w-fit"
            >
              Project Logs
            </Link>
            <Link
              href="/openned-tickets"
              className="text-[12px] text-gray-600 hover:text-[#0078D4] hover:underline transition-colors w-fit"
            >
              Opened Tickets
            </Link>
            <Link
              href="/about-us"
              className="text-[12px] text-gray-600 hover:text-[#0078D4] hover:underline transition-colors w-fit"
            >
              About Us
            </Link>
          </div>

          {/* Navigation - Legal */}
          <div className="flex flex-col gap-2.5">
            <h3 className="text-[13px] font-semibold text-gray-900 mb-1">
              Legal
            </h3>
            <Link
              href="/privacy-policy"
              className="text-[12px] text-gray-600 hover:text-[#0078D4] hover:underline transition-colors w-fit"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="text-[12px] text-gray-600 hover:text-[#0078D4] hover:underline transition-colors w-fit"
            >
              Terms of Service
            </Link>
          </div>
        </div>

        {/* Bottom Row: Socials & Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200">
          <p className="text-[12px] text-gray-500">
            © {currentYear} Kosha. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[12px] text-gray-500 hover:text-[#0078D4] transition-colors"
              aria-label="Twitter"
            >
              <span className="hidden sm:inline">Twitter</span>
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[12px] text-gray-500 hover:text-[#0078D4] transition-colors"
              aria-label="GitHub"
            >
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
