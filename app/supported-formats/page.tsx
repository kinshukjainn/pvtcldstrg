"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { Info, AlertTriangle, ChevronRight } from "lucide-react";

// --- DATA CONSTANTS ---
const TOC_ITEMS = [
  { id: "images", label: "Image Processing" },
  { id: "videos", label: "Video Streaming" },
  { id: "audio", label: "Audio Playback" },
  { id: "documents", label: "Documents & Data" },
  { id: "archives", label: "Encrypted Archives" },
];

const DOC_CATEGORIES = [
  {
    label: "Portable Document Format",
    exts: ["PDF"],
    note: "Natively rendered using secure, client-side WASM sandboxing. Text selection and pagination are fully supported without server-side processing.",
  },
  {
    label: "Presentations & Slides",
    exts: ["PPTX", "PPT", "KEY"],
    note: "Currently restricted to direct download to maintain strict formatting and prevent proprietary font rendering errors.",
  },
  {
    label: "Spreadsheets & Datasets",
    exts: ["XLSX", "XLS", "CSV", "JSON"],
    note: "Raw text parsing available for open data formats (CSV/JSON). Excel binaries must be downloaded for localized editing.",
  },
  {
    label: "Plain Text & Markdown",
    exts: ["MD", "TXT", "LOG"],
    note: "Rendered inline with secure HTML sanitization. Markdown is compiled on the fly with standard GitHub-flavored formatting.",
  },
];

// --- COMPONENTS ---

// Azure-style flat tag
function FormatBadge({ ext }: { ext: string }) {
  return (
    <span className="inline-block items-center px-2.5 py-1 bg-gray-100 text-gray-800 border border-gray-200 text-[12px] font-semibold rounded-xl mr-2 mb-2 select-none">
      {ext}
    </span>
  );
}

// Clean anchor link
function SectionAnchor({ id, children }: { id: string; children: ReactNode }) {
  return (
    <a
      href={`#${id}`}
      className="group relative text-gray-900 hover:text-[#0078D4] transition-colors duration-150"
    >
      {children}
    </a>
  );
}

// Azure-style warning callout box
function SystemNotice({ children }: { children: ReactNode }) {
  return (
    <div className="my-6 p-4 border-l-4 border-[#d13438] bg-[#fdf3f4] text-gray-900 flex gap-3 items-start rounded-r-sm">
      <AlertTriangle className="w-5 h-5 text-[#d13438] shrink-0 mt-0.5" />
      <div className="text-[13px] leading-relaxed">
        <strong className="font-semibold block mb-1">Security Notice</strong>
        {children}
      </div>
    </div>
  );
}

// --- MAIN PAGE ---

export default function SupportedFormatsPage() {
  return (
    <div className="min-h-screen text-gray-900 pb-24 bg-[#faf9f8]  selection:bg-[#cce3f5]">
      {/* Header / Command Bar */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
        <div className="max-w-[1000px] mx-auto flex justify-between items-center px-6 py-3">
          <Link
            href="/"
            className="text-[#0078D4] hover:underline text-[13px] font-semibold flex items-center gap-1"
          >
            Back to Application
          </Link>
          <span className="text-[12px] font-semibold text-gray-600 bg-gray-50 px-2.5 py-1 border border-gray-200 rounded-xl">
            System Documentation
          </span>
        </div>
      </header>

      <main className="max-w-[1000px] mx-auto px-6 pt-12">
        {/* Hero Section */}
        <header className="pb-10 border-b border-gray-200 mb-10">
          <div className="text-[13px] font-medium text-gray-500 flex items-center gap-1.5 mb-4">
            Documentation <ChevronRight size={14} /> Reference{" "}
            <ChevronRight size={14} /> Formats
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4 tracking-tight">
            Supported Data Formats
          </h1>
          <p className="text-[15px] text-gray-600 leading-relaxed max-w-3xl">
            Kosha is engineered to handle a wide array of digital assets. This
            reference guide details the file specifications, rendering
            protocols, and security measures applied to data stored within your
            private ecosystem. All files, regardless of format, are secured
            using zero-knowledge AES-256 encryption at rest.
          </p>
        </header>

        {/* Table of Contents (Azure "In this article" style) */}
        <nav
          aria-label="Table of Contents"
          className="mb-14 p-5 border border-gray-200 bg-white rounded-xl shadow-sm"
        >
          <p className="text-[14px] font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Info size={16} className="text-[#0078D4]" /> In this article
          </p>
          <ul className="grid sm:grid-cols-2 gap-y-2 gap-x-8 text-[13px] list-none p-0 m-0">
            {TOC_ITEMS.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="text-[#0078D4] hover:underline transition-all duration-150"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Images */}
        <section id="images" className="mb-16 scroll-mt-20">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            <SectionAnchor id="images">Image Processing</SectionAnchor>
          </h2>
          <p className="text-[14px] text-gray-700 mb-5 max-w-3xl leading-relaxed">
            Standard high-fidelity image formats are fully supported. Upon
            upload, Kosha automatically generates lightweight, encrypted
            thumbnails for UI performance without altering the original binary
            payload. EXIF metadata (geolocation, camera model) is strictly
            preserved by default but can be stripped via user privacy settings
            prior to upload.
          </p>
          <div className="flex flex-wrap bg-white p-5 border border-gray-200 rounded-xl shadow-sm">
            {["JPG", "JPEG", "PNG", "GIF", "WEBP", "SVG", "HEIC"].map((e) => (
              <FormatBadge key={e} ext={e} />
            ))}
          </div>
        </section>

        {/* Videos */}
        <section id="videos" className="mb-16 scroll-mt-20">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            <SectionAnchor id="videos">Video Streaming</SectionAnchor>
          </h2>
          <p className="text-[14px] text-gray-700 mb-5 max-w-3xl leading-relaxed">
            Multimedia viewing is powered by native HTML5 playback frameworks.
            Kosha handles large media files via HTTP range requests, allowing
            seamless chunked buffering directly from encrypted storage. Formats
            requiring proprietary decoding pipelines may require localized
            download for optimal viewing.
          </p>
          <div className="flex flex-wrap bg-white p-5 border border-gray-200 rounded-xl shadow-sm">
            {["MP4", "WEBM", "OGG", "MOV", "MKV"].map((e) => (
              <FormatBadge key={e} ext={e} />
            ))}
          </div>
        </section>

        {/* Audio */}
        <section id="audio" className="mb-16 scroll-mt-20">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            <SectionAnchor id="audio">Audio Playback</SectionAnchor>
          </h2>
          <p className="text-[14px] text-gray-700 mb-5 max-w-3xl leading-relaxed">
            Audio files bypass intermediate servers and stream directly to the
            client browser. Our player supports high-bitrate streams up to
            320kbps as well as lossless compression standards. Audio waveform
            visualization is generated locally on the client machine to ensure
            data privacy.
          </p>
          <div className="flex flex-wrap bg-white p-5 border border-gray-200 rounded-xl shadow-sm">
            {["MP3", "WAV", "AAC", "FLAC", "M4A"].map((e) => (
              <FormatBadge key={e} ext={e} />
            ))}
          </div>
        </section>

        {/* Documents */}
        <section id="documents" className="mb-16 scroll-mt-20">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            <SectionAnchor id="documents">Documents & Datasets</SectionAnchor>
          </h2>
          <p className="text-[14px] text-gray-700 mb-6 max-w-3xl leading-relaxed">
            Enterprise and personal document handling relies on strict browser
            isolation. To prevent cross-site scripting (XSS) and malicious macro
            execution, complex document structures are either sandboxed in
            secure iframes or restricted to raw binary downloads.
          </p>

          <div className="grid md:grid-cols-2 gap-5">
            {DOC_CATEGORIES.map((cat) => (
              <div
                key={cat.label}
                className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-[15px] font-semibold text-gray-900 mb-3">
                  {cat.label}
                </h3>
                <div className="flex flex-wrap mb-3">
                  {cat.exts.map((e) => (
                    <FormatBadge key={e} ext={e} />
                  ))}
                </div>
                {cat.note && (
                  <p className="text-[13px] text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                    {cat.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Archives */}
        <section id="archives" className="mb-16 scroll-mt-20">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            <SectionAnchor id="archives">Encrypted Archives</SectionAnchor>
          </h2>
          <p className="text-[14px] text-gray-700 mb-5 max-w-3xl leading-relaxed">
            Compressed directories and bundled system formats are treated as
            contiguous secure blobs. They benefit from dual-layer encryption
            (the archive&apos;s native encryption plus Kosha&apos;s
            platform-level AES-256 encryption).
          </p>
          <div className="flex flex-wrap bg-white p-5 border border-gray-200 rounded-xl shadow-sm mb-6">
            {["ZIP", "TAR", "TAR.GZ", "RAR", "7Z"].map((e) => (
              <FormatBadge key={e} ext={e} />
            ))}
          </div>

          <SystemNotice>
            In-browser archive extraction is disabled for security purposes.
            Attempting to parse heavily compressed directories client-side
            exposes the browser to decompression bomb (&quot;ZIP Bomb&quot;)
            attacks. These files must be securely downloaded and extracted on
            your local machine.
          </SystemNotice>
        </section>
      </main>
    </div>
  );
}
