"use client";

import React, { ReactNode } from "react";
import Link from "next/link";

// --- DATA CONSTANTS ---
const TOC_ITEMS = [
  { id: "images", label: "Images" },
  { id: "videos", label: "Videos" },
  { id: "audio", label: "Audio" },
  { id: "documents", label: "Documents & Data" },
  { id: "archives", label: "Archives" },
];

const DOC_CATEGORIES = [
  {
    label: "PDF Documents",
    exts: [".pdf"],
    note: "Inline iframe render",
  },
  {
    label: "Presentations",
    exts: [".pptx", ".ppt", ".key"],
    note: "Fallback to download",
  },
  {
    label: "Spreadsheets & Data",
    exts: [".xlsx", ".xls", ".csv", ".json"],
    note: "Raw text or tabular preview",
  },
  {
    label: "Plain Text & Markdown",
    exts: [".md", ".txt", ".log"],
    note: "Syntax highlighting applied",
  },
];

// --- COMPONENTS ---

function FormatBadge({ ext }: { ext: string }) {
  return (
    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-mono font-medium bg-[#2a2a2a] text-neutral-300 border border-[#3a3a3a] mr-2 mb-2 select-none">
      {ext}
    </span>
  );
}

function SectionAnchor({ id, children }: { id: string; children: ReactNode }) {
  return (
    <a
      href={`#${id}`}
      className="group relative text-neutral-100 hover:text-neutral-300 transition-colors"
    >
      <span className="absolute -left-5 opacity-0 group-hover:opacity-100 text-neutral-500 font-normal">
        #
      </span>
      {children}
    </a>
  );
}

function InfoCallout({ children }: { children: ReactNode }) {
  return (
    <div className="my-6 p-4 rounded-md border border-blue-900/50 bg-blue-900/10 text-sm text-neutral-300 flex gap-3">
      <svg
        className="w-5 h-5 text-blue-400 shrink-0 mt-0.5"
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
      <div>{children}</div>
    </div>
  );
}

// --- MAIN PAGE ---

export default function SupportedFormatsPage() {
  return (
    <div className="min-h-screen text-neutral-300 pb-24 bg-[#1e1e1e] ">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[#2a2a2a] bg-[#1e1e1e]">
        <div className="max-w-4xl mx-auto flex justify-between items-center px-6 py-4">
          <Link
            href="/"
            className="text-neutral-400 hover:text-neutral-200 transition-colors text-sm font-medium flex items-center gap-2"
          >
            ← Back to Storage
          </Link>
          <span className="text-[11px] font-medium tracking-wider uppercase text-neutral-500">
            Documentation
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pt-12">
        {/* Hero Section */}
        <header className="pb-12 border-b border-[#2a2a2a] mb-12">
          <h1 className="text-3xl font-bold text-neutral-100 mb-4">
            Supported File Formats
          </h1>
          <p className="text-base text-neutral-400 leading-relaxed max-w-2xl">
            A reference guide detailing the file extensions and formats
            supported for upload, storage, and native preview within the
            platform.
          </p>
        </header>

        {/* Table of Contents */}
        <nav
          aria-label="Table of Contents"
          className="mb-16 p-6 rounded-md border border-[#2a2a2a] bg-[#222222]"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-4">
            Contents
          </p>
          <ul className="grid sm:grid-cols-2 gap-y-3 gap-x-6 text-sm list-none p-0 m-0">
            {TOC_ITEMS.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Images */}
        <section id="images" className="mb-16 scroll-mt-24">
          <h2 className="text-xl font-semibold text-neutral-100 mb-4">
            <SectionAnchor id="images">Images</SectionAnchor>
          </h2>
          <p className="text-sm text-neutral-400 mb-6 max-w-2xl leading-relaxed">
            Standard image formats are supported with native thumbnail
            generation and full-screen modal viewing.
          </p>
          <div className="flex flex-wrap">
            {[".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".heic"].map(
              (e) => (
                <FormatBadge key={e} ext={e} />
              ),
            )}
          </div>
        </section>

        {/* Videos */}
        <section id="videos" className="mb-16 scroll-mt-24">
          <h2 className="text-xl font-semibold text-neutral-100 mb-4">
            <SectionAnchor id="videos">Videos</SectionAnchor>
          </h2>
          <p className="text-sm text-neutral-400 mb-6 max-w-2xl leading-relaxed">
            Multimedia video formats using native HTML5 playback capabilities.
          </p>
          <div className="flex flex-wrap">
            {[".mp4", ".webm", ".ogg", ".mov", ".mkv"].map((e) => (
              <FormatBadge key={e} ext={e} />
            ))}
          </div>
        </section>

        {/* Audio */}
        <section id="audio" className="mb-16 scroll-mt-24">
          <h2 className="text-xl font-semibold text-neutral-100 mb-4">
            <SectionAnchor id="audio">Audio</SectionAnchor>
          </h2>
          <p className="text-sm text-neutral-400 mb-6 max-w-2xl leading-relaxed">
            Audio files include native in-browser playback and basic controls.
          </p>
          <div className="flex flex-wrap">
            {[".mp3", ".wav", ".aac", ".flac", ".m4a"].map((e) => (
              <FormatBadge key={e} ext={e} />
            ))}
          </div>
        </section>

        {/* Documents */}
        <section id="documents" className="mb-16 scroll-mt-24">
          <h2 className="text-xl font-semibold text-neutral-100 mb-4">
            <SectionAnchor id="documents">Documents & Data</SectionAnchor>
          </h2>
          <p className="text-sm text-neutral-400 mb-6 max-w-2xl leading-relaxed">
            Standard document and text-based formats. Preview capabilities vary
            based on native browser support.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {DOC_CATEGORIES.map((cat) => (
              <div
                key={cat.label}
                className="p-5 rounded-md border border-[#2a2a2a] bg-[#222222]"
              >
                <h3 className="text-sm font-semibold text-neutral-200 mb-3">
                  {cat.label}
                </h3>
                <div className="flex flex-wrap gap-1 mb-4">
                  {cat.exts.map((e) => (
                    <FormatBadge key={e} ext={e} />
                  ))}
                </div>
                {cat.note && (
                  <p className="text-xs text-neutral-500">{cat.note}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Archives */}
        <section id="archives" className="mb-16 scroll-mt-24">
          <h2 className="text-xl font-semibold text-neutral-100 mb-4">
            <SectionAnchor id="archives">Archives & Bundles</SectionAnchor>
          </h2>
          <p className="text-sm text-neutral-400 mb-6 max-w-2xl leading-relaxed">
            Compressed directories and bundled file formats. These are stored
            securely and available for direct download.
          </p>
          <div className="flex flex-wrap mb-4">
            {[".zip", ".tar", ".tar.gz", ".rar", ".7z"].map((e) => (
              <FormatBadge key={e} ext={e} />
            ))}
          </div>
          <InfoCallout>
            Archive extraction is not natively supported in the preview UI.
            These files must be downloaded to access their contents.
          </InfoCallout>
        </section>
      </main>
    </div>
  );
}
