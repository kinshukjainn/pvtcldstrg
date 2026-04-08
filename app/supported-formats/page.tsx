"use client";

import React, { useState, useCallback, ReactNode } from "react";
import Link from "next/link";

// --- DATA CONSTANTS ---
// ... the rest of your code stays exactly the same!
// --- DATA CONSTANTS ---
const TOC_ITEMS = [
  { id: "upload-options", label: "Upload Options" },
  { id: "images", label: "Images" },
  { id: "videos", label: "Videos" },
  { id: "documents-spreadsheets", label: "Documents & Spreadsheets" },
];

const DOC_CATEGORIES = [
  {
    label: "PDF Documents",
    exts: [".pdf"],
    note: "Inline iframe preview",
  },
  {
    label: "Presentations",
    exts: [".pptx", ".ppt"],
    note: null,
  },
  {
    label: "Spreadsheets & Data",
    exts: [".xlsx", ".xls", ".csv"],
    note: null,
  },
  {
    label: "Plain Text & Markdown",
    exts: [".md", ".txt"],
    note: null,
  },
];

// --- COMPONENTS ---

// Typed the text prop
function CopyButton({ text = "" }: { text?: string }) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);

  const handleCopy = useCallback(async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setError(false);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      aria-label="Copy code to clipboard"
      className={`absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
        copied
          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
          : error
            ? "bg-red-500/10 border-red-500/30 text-red-400"
            : "bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10 hover:text-neutral-200"
      }`}
    >
      {copied ? (
        <>
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
          Copied
        </>
      ) : error ? (
        "Failed"
      ) : (
        <>
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

// Typed children and language props
function CodeBlock({
  children,
  language,
}: {
  children: ReactNode;
  language?: string;
}) {
  return (
    <div className="relative group my-6 rounded-xl overflow-hidden border border-neutral-700/50 bg-[#111418] shadow-lg shadow-black/20">
      {language && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-800/80 bg-[#161b22]">
          <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-500 select-none">
            {language}
          </span>
        </div>
      )}
      <CopyButton text={String(children)} />
      <pre className="p-4 pr-24 text-sm font-mono leading-relaxed overflow-x-auto text-emerald-400 whitespace-pre scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent">
        <code>{children}</code>
      </pre>
    </div>
  );
}

// Typed ext prop
function FormatBadge({ ext }: { ext: string }) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 mr-2 mb-2 transition-colors hover:bg-blue-500/20 hover:border-blue-500/40 cursor-default select-none">
      {ext}
    </span>
  );
}

// Typed name and children props
function OptionRow({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-8 py-4 border-b border-neutral-800/50 last:border-0 hover:bg-white/[0.02] transition-colors px-2 -mx-2 rounded-lg">
      <div className="sm:w-48 shrink-0 flex items-center">
        <code className="text-[13px] font-mono font-semibold text-sky-400 bg-sky-400/10 px-2 py-0.5 rounded border border-sky-400/20">
          {name}
        </code>
      </div>
      <p className="text-sm leading-relaxed text-neutral-400 m-0 self-center">
        {children}
      </p>
    </div>
  );
}

// Typed id and children props
function SectionAnchor({ id, children }: { id: string; children: ReactNode }) {
  return (
    <a
      href={`#${id}`}
      className="group/anchor relative inline-flex items-center no-underline text-inherit focus:outline-none rounded-md"
    >
      {children}
      <span
        aria-hidden="true"
        className="absolute -left-6 opacity-0 group-hover/anchor:opacity-100 transition-opacity text-neutral-500 font-normal select-none"
      >
        #
      </span>
    </a>
  );
}

// Typed children prop
function InfoCallout({ children }: { children: ReactNode }) {
  return (
    <aside className="my-8 flex gap-4 rounded-xl border border-sky-500/20 bg-sky-500/5 px-5 py-4 shadow-sm shadow-sky-900/10">
      <div className="shrink-0 text-sky-400">
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <p className="text-sm leading-relaxed text-neutral-300 m-0 self-center">
        {children}
      </p>
    </aside>
  );
}

// --- MAIN PAGE ---

export default function SupportedFormatsPage() {
  return (
    <div
      className="min-h-screen text-neutral-300 pb-24 scroll-smooth"
      style={{
        background: "#0a0c10",
        fontFamily:
          "'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Sticky Header */}
      <header
        className="sticky top-0 z-40 border-b border-neutral-800/80 shadow-sm"
        style={{
          background: "rgba(10,12,16,0.85)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <div className="max-w-4xl mx-auto flex justify-between items-center px-6 py-4">
          {/* Replaced <a> with Next.js <Link> */}
          <Link
            href="/"
            className="group flex items-center gap-2 text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-neutral-600"
          >
            <svg
              className="w-4 h-4 transition-transform group-hover:-translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Storage
          </Link>
          <span className="text-[11px] font-bold tracking-[.25em] uppercase text-blue-400/90 border border-neutral-700/60 rounded-full px-4 py-1.5 bg-neutral-900/40 select-none">
            Fss.Pvt Docs
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pt-16">
        {/* Hero Section */}
        <header className="pb-12">
          <p className="text-xs font-bold uppercase tracking-[.25em] text-blue-500 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Reference Guide
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight mb-6">
            Supported File Formats
          </h1>
          <p className="text-lg text-neutral-400 leading-relaxed max-w-2xl">
            Complete reference for input and output file formats supported by
            the{" "}
            <code className="text-white bg-neutral-800/60 border border-neutral-700/50 px-2 py-0.5 rounded text-sm font-mono font-bold mx-1">
              fss.pvt
            </code>{" "}
            cloud storage platform.
          </p>
          <div className="mt-10 h-px bg-gradient-to-r from-blue-500/50 via-neutral-800/80 to-transparent" />
        </header>

        {/* Table of Contents */}
        <nav
          aria-label="Table of Contents"
          className="mb-16 rounded-xl border border-neutral-800/60 bg-[#111418]/50 p-6 shadow-sm"
        >
          <p className="text-xs font-bold uppercase tracking-[.2em] text-neutral-500 mb-4">
            In this article
          </p>
          <ul className="grid sm:grid-cols-2 gap-y-2.5 gap-x-6 text-sm list-none p-0 m-0">
            {TOC_ITEMS.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="group flex items-center text-neutral-400 hover:text-blue-400 transition-colors py-1 focus:outline-none focus:text-blue-400"
                >
                  <span className="opacity-0 -ml-4 mr-2 text-blue-500 transition-all group-hover:opacity-100 group-hover:ml-0">
                    →
                  </span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Upload Options */}
        <section id="upload-options" className="mb-20 scroll-mt-24">
          <h2 className="text-2xl font-bold text-white mb-5 tracking-tight flex items-center">
            <SectionAnchor id="upload-options">Upload Options</SectionAnchor>
          </h2>
          <div className="space-y-4 text-[15px] text-neutral-300 leading-relaxed max-w-3xl">
            <p>
              The platform provides unified storage capabilities. An uploaded
              file is parsed by its extension, categorized dynamically, and
              assigned a type-specific interface along with generic device
              options (see the formatting manual).
            </p>
            <p>
              Each supported file type may render{" "}
              <strong className="text-white font-semibold">
                preview options
              </strong>{" "}
              that are specific to its component — for example, video playback
              controls vs. image rendering.
            </p>
            <p>
              Options may be set by specifying exact extensions during the
              upload phase in the{" "}
              <code className="text-emerald-300 bg-emerald-400/10 border border-emerald-400/20 px-1.5 py-0.5 rounded text-sm font-mono font-bold mx-1">
                DriveManager
              </code>{" "}
              tools, or by allowing the platform to auto-detect the MIME type.
            </p>
          </div>
          <InfoCallout>
            When you configure your upload batch, all supported formats are
            enabled by default. You can bypass UI constraints using custom API
            routes, but the preview engine selectively enables rendering based
            on the file extension.
          </InfoCallout>
        </section>

        <hr className="border-neutral-800/80 mb-16" />

        {/* Images */}
        <section id="images" className="mb-20 scroll-mt-24">
          <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">
            <SectionAnchor id="images">Images</SectionAnchor>
          </h2>
          <p className="text-[15px] text-neutral-400 mb-8 max-w-3xl leading-relaxed">
            Standard image input formats with native thumbnail generation and
            full-screen modal viewing.
          </p>

          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[.2em] text-neutral-500 mb-4">
              Supported Extensions
            </p>
            <div className="flex flex-wrap">
              {[".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"].map((e) => (
                <FormatBadge key={e} ext={e} />
              ))}
            </div>
          </div>

          <div className="mb-10">
            <p className="text-xs font-bold uppercase tracking-[.2em] text-neutral-500 mb-3">
              Example CLI Usage
            </p>
            <CodeBlock language="bash">
              upload -f image profile_picture.webp
            </CodeBlock>
          </div>

          <h3 className="text-lg font-bold text-neutral-200 mt-10 mb-4 tracking-tight border-b border-neutral-800/60 pb-2">
            Configuration Options
          </h3>
          <div className="rounded-xl border border-neutral-800/60 bg-[#111418]/40 px-6">
            <OptionRow name="preview_support">
              Set to{" "}
              <code className="text-emerald-400 font-mono text-xs">True</code>.
              Image preview is fully supported within the platform UI.
            </OptionRow>
            <OptionRow name="dimensions">
              Original aspect ratio is maintained during preview. Default is{" "}
              <code className="font-mono text-xs text-neutral-300 bg-neutral-800 px-1 py-0.5 rounded">
                max-w-full
              </code>
              .
            </OptionRow>
          </div>
        </section>

        <hr className="border-neutral-800/80 mb-16" />

        {/* Videos */}
        <section id="videos" className="mb-20 scroll-mt-24">
          <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">
            <SectionAnchor id="videos">Videos</SectionAnchor>
          </h2>
          <p className="text-[15px] text-neutral-400 mb-8 max-w-3xl leading-relaxed">
            Multimedia video formats using the native HTML5{" "}
            <code className="text-sky-300 bg-sky-400/10 border border-sky-400/20 px-1.5 py-0.5 rounded text-xs font-mono font-bold mx-1">
              {"<video>"}
            </code>{" "}
            API. Playback availability is autodetected during render.
          </p>

          <div className="mb-10">
            <p className="text-xs font-bold uppercase tracking-[.2em] text-neutral-500 mb-4">
              Supported Extensions
            </p>
            <div className="flex flex-wrap">
              {[".mp4", ".webm", ".ogg", ".mov"].map((e) => (
                <FormatBadge key={e} ext={e} />
              ))}
            </div>
          </div>

          <h3 className="text-lg font-bold text-neutral-200 mt-10 mb-4 tracking-tight border-b border-neutral-800/60 pb-2">
            Configuration Options
          </h3>
          <div className="rounded-xl border border-neutral-800/60 bg-[#111418]/40 px-6">
            <OptionRow name="playback_controls">
              Set to{" "}
              <code className="text-emerald-400 font-mono text-xs">True</code>.
              Features native play, pause, volume, and timeline scrubbing.
            </OptionRow>
          </div>
        </section>

        <hr className="border-neutral-800/80 mb-16" />

        {/* Documents */}
        <section id="documents-spreadsheets" className="mb-20 scroll-mt-24">
          <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">
            <SectionAnchor id="documents-spreadsheets">
              Documents &amp; Spreadsheets
            </SectionAnchor>
          </h2>
          <p className="text-[15px] text-neutral-400 mb-8 max-w-3xl leading-relaxed">
            Standard document and text-based formats. Depending on the
            extension, documents may be previewed natively (e.g., PDF) or parsed
            for icon representation and direct download.
          </p>

          <div className="space-y-4 mb-10">
            {DOC_CATEGORIES.map((cat) => (
              <div
                key={cat.label}
                className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 rounded-xl border border-neutral-800/50 bg-[#111418]/40 px-6 py-4 hover:border-neutral-700 transition-colors"
              >
                <span className="text-xs font-bold uppercase tracking-[.18em] text-neutral-300 sm:w-56 shrink-0">
                  {cat.label}
                </span>
                <div className="flex flex-wrap items-center gap-1.5 flex-1">
                  {cat.exts.map((e) => (
                    <FormatBadge key={e} ext={e} />
                  ))}
                </div>
                {cat.note && (
                  <span className="text-[12px] text-neutral-500 font-medium shrink-0 flex items-center gap-1.5">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    {cat.note}
                  </span>
                )}
              </div>
            ))}
          </div>

          <h3 className="text-lg font-bold text-neutral-200 mt-10 mb-4 tracking-tight border-b border-neutral-800/60 pb-2">
            Configuration Options
          </h3>
          <div className="rounded-xl border border-neutral-800/60 bg-[#111418]/40 px-6">
            <OptionRow name="fallback_behavior">
              If the environment lacks a native viewer (e.g., for .xlsx or
              .pptx), the interface gracefully degrades to a{" "}
              <strong className="text-white font-medium">
                &quot;Download File&quot;
              </strong>{" "}
              prompt.
            </OptionRow>
          </div>
        </section>
      </main>
    </div>
  );
}
