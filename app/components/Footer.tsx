import Link from "next/link";
import { CloudRain } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-900 bg-black py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Brand Identity */}
          <div className="flex items-center gap-2 text-zinc-100 font-semibold text-lg">
            <CloudRain className="w-6 h-6 text-emerald-400" />
            <span>Kosha</span>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-8 text-sm font-medium text-zinc-500">
            <Link
              href="/terms-of-service"
              className="hover:text-emerald-400 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy-policy"
              className="hover:text-emerald-400 transition-colors"
            >
              Privacy Policy
            </Link>
          </nav>

          {/* Socials & Copyright */}
          <div className="flex flex-col items-center md:items-end gap-4">
            <div className="flex items-center gap-5 font-semibold text-zinc-200">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-all hover:scale-110"
                aria-label="Twitter"
              >
                Twitter
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-all hover:scale-110"
                aria-label="GitHub"
              >
                Github
              </a>
            </div>
            <p className="text-zinc-600 text-xs tracking-wide">
              © {currentYear} AuraCloud. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
