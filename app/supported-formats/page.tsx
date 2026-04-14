"use client";

import React, { ReactNode } from "react";
import Link from "next/link";

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

function FormatBadge({ ext }: { ext: string }) {
  // Converted to bold uppercase labels instead of terminal-style dot extensions
  return (
    <span className="inline-block items-center px-3 py-1 bg-[#ffffff] text-black border-2 border-[#000000] text-[13px] font-bold uppercase tracking-wider shadow-[2px_2px_0px_#000000] mr-3 mb-3 select-none">
      {ext}
    </span>
  );
}

function SectionAnchor({ id, children }: { id: string; children: ReactNode }) {
  return (
    <a
      href={`#${id}`}
      className="group relative text-white uppercase tracking-tight hover:text-[#ff9900] transition-colors duration-150 flex items-center gap-3"
    >
      <span className="w-4 h-4 bg-[#ff9900] border-2 border-[#000000] opacity-0 group-hover:opacity-100 transition-opacity duration-150 inline-block"></span>
      {children}
    </a>
  );
}

function SystemNotice({ children }: { children: ReactNode }) {
  return (
    <div className="my-8 p-6 border-4 border-[#000000] bg-[#0055cc] shadow-[8px_8px_0px_#000000] text-white flex flex-col sm:flex-row gap-5 items-start">
      <div className="bg-[#ffffff] text-black border-2 border-[#000000] p-2 shrink-0 font-bold uppercase text-[12px] tracking-widest shadow-[2px_2px_0px_#000000]">
        Notice
      </div>
      <div className="text-[15px] font-bold leading-relaxed pt-1">
        {children}
      </div>
    </div>
  );
}

// --- MAIN PAGE ---

export default function SupportedFormatsPage() {
  return (
    <div className="min-h-screen text-[#dddddd] pb-24 bg-[#111111] font-sans selection:bg-[#ff9900] selection:text-black">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b-4 border-[#000000] bg-[#1e1e1e]">
        <div className="max-w-5xl mx-auto flex justify-between items-center px-6 py-4">
          <Link
            href="/"
            className="text-white hover:text-[#ff9900] transition-colors text-[14px] font-bold uppercase tracking-wide flex items-center gap-2"
          >
            Back to Application
          </Link>
          <span className="text-[12px] font-bold tracking-widest uppercase text-[#aaaaaa] bg-[#000000] px-3 py-1 border-2 border-[#333333]">
            System Documentation
          </span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pt-16">
        {/* Hero Section */}
        <header className="pb-16 border-b-4 border-[#333333] mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 uppercase tracking-tight">
            Supported Data Formats
          </h1>
          <p className="text-[16px] md:text-lg text-[#aaaaaa] font-bold leading-relaxed max-w-3xl">
            Kosha is engineered to handle a wide array of digital assets. This
            reference guide details the file specifications, rendering
            protocols, and security measures applied to data stored within your
            private ecosystem. All files, regardless of format, are secured
            using zero-knowledge AES-256 encryption at rest.
          </p>
        </header>

        {/* Table of Contents */}
        <nav
          aria-label="Table of Contents"
          className="mb-16 p-8 border-4 border-[#000000] bg-[#1e1e1e] shadow-[8px_8px_0px_#000000]"
        >
          <p className="text-[16px] font-bold uppercase tracking-widest text-[#ff9900] mb-6 border-b-2 border-[#333333] pb-2">
            Documentation Index
          </p>
          <ul className="grid sm:grid-cols-2 gap-y-4 gap-x-8 text-[15px] font-bold list-none p-0 m-0 uppercase">
            {TOC_ITEMS.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="text-white hover:text-[#0088ff] hover:underline hover:bg-[#000000] px-1 transition-all duration-150"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Images */}
        <section id="images" className="mb-20 scroll-mt-28">
          <h2 className="text-2xl font-bold text-white mb-6 uppercase border-l-8 border-[#ff9900] pl-4">
            <SectionAnchor id="images">Image Processing</SectionAnchor>
          </h2>
          <p className="text-[16px] text-[#aaaaaa] font-bold mb-6 max-w-3xl leading-relaxed">
            Standard high-fidelity image formats are fully supported. Upon
            upload, Kosha automatically generates lightweight, encrypted
            thumbnails for UI performance without altering the original binary
            payload. EXIF metadata (geolocation, camera model) is strictly
            preserved by default but can be stripped via user privacy settings
            prior to upload.
          </p>
          <div className="flex flex-wrap bg-[#1e1e1e] p-6 border-2 border-[#333333]">
            {["JPG", "JPEG", "PNG", "GIF", "WEBP", "SVG", "HEIC"].map((e) => (
              <FormatBadge key={e} ext={e} />
            ))}
          </div>
        </section>

        {/* Videos */}
        <section id="videos" className="mb-20 scroll-mt-28">
          <h2 className="text-2xl font-bold text-white mb-6 uppercase border-l-8 border-[#0055cc] pl-4">
            <SectionAnchor id="videos">Video Streaming</SectionAnchor>
          </h2>
          <p className="text-[16px] text-[#aaaaaa] font-bold mb-6 max-w-3xl leading-relaxed">
            Multimedia viewing is powered by native HTML5 playback frameworks.
            Kosha handles large media files via HTTP range requests, allowing
            seamless chunked buffering directly from encrypted storage. Formats
            requiring proprietary decoding pipelines may require localized
            download for optimal viewing.
          </p>
          <div className="flex flex-wrap bg-[#1e1e1e] p-6 border-2 border-[#333333]">
            {["MP4", "WEBM", "OGG", "MOV", "MKV"].map((e) => (
              <FormatBadge key={e} ext={e} />
            ))}
          </div>
        </section>

        {/* Audio */}
        <section id="audio" className="mb-20 scroll-mt-28">
          <h2 className="text-2xl font-bold text-white mb-6 uppercase border-l-8 border-[#00cc44] pl-4">
            <SectionAnchor id="audio">Audio Playback</SectionAnchor>
          </h2>
          <p className="text-[16px] text-[#aaaaaa] font-bold mb-6 max-w-3xl leading-relaxed">
            Audio files bypass intermediate servers and stream directly to the
            client browser. Our player supports high-bitrate streams up to
            320kbps as well as lossless compression standards. Audio waveform
            visualization is generated locally on the client machine to ensure
            data privacy.
          </p>
          <div className="flex flex-wrap bg-[#1e1e1e] p-6 border-2 border-[#333333]">
            {["MP3", "WAV", "AAC", "FLAC", "M4A"].map((e) => (
              <FormatBadge key={e} ext={e} />
            ))}
          </div>
        </section>

        {/* Documents */}
        <section id="documents" className="mb-20 scroll-mt-28">
          <h2 className="text-2xl font-bold text-white mb-6 uppercase border-l-8 border-[#a855f7] pl-4">
            <SectionAnchor id="documents">Documents & Datasets</SectionAnchor>
          </h2>
          <p className="text-[16px] text-[#aaaaaa] font-bold mb-8 max-w-3xl leading-relaxed">
            Enterprise and personal document handling relies on strict browser
            isolation. To prevent cross-site scripting (XSS) and malicious macro
            execution, complex document structures are either sandboxed in
            secure iframes or restricted to raw binary downloads.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {DOC_CATEGORIES.map((cat) => (
              <div
                key={cat.label}
                className="p-6 bg-[#1e1e1e] border-4 border-[#000000] shadow-[6px_6px_0px_#000000]"
              >
                <h3 className="text-[16px] font-bold text-white uppercase mb-4 tracking-wide border-b-2 border-[#333333] pb-2">
                  {cat.label}
                </h3>
                <div className="flex flex-wrap gap-1 mb-5">
                  {cat.exts.map((e) => (
                    <FormatBadge key={e} ext={e} />
                  ))}
                </div>
                {cat.note && (
                  <p className="text-[14px] text-[#aaaaaa] font-bold leading-relaxed">
                    {cat.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Archives */}
        <section id="archives" className="mb-20 scroll-mt-28">
          <h2 className="text-2xl font-bold text-white mb-6 uppercase border-l-8 border-[#ff3333] pl-4">
            <SectionAnchor id="archives">Encrypted Archives</SectionAnchor>
          </h2>
          <p className="text-[16px] text-[#aaaaaa] font-bold mb-6 max-w-3xl leading-relaxed">
            Compressed directories and bundled system formats are treated as
            contiguous secure blobs. They benefit from dual-layer encryption
            (the archive&apos;s native encryption plus Kosha&apos;s
            platform-level AES-256 encryption).
          </p>
          <div className="flex flex-wrap bg-[#1e1e1e] p-6 border-2 border-[#333333] mb-8">
            {["ZIP", "TAR", "TAR.GZ", "RAR", "7Z"].map((e) => (
              <FormatBadge key={e} ext={e} />
            ))}
          </div>

          <SystemNotice>
            IN-BROWSER ARCHIVE EXTRACTION IS DISABLED FOR SECURITY PURPOSES.
            ATTEMPTING TO PARSE HEAVILY COMPRESSED DIRECTORIES CLIENT-SIDE
            EXPOSES THE BROWSER TO DECOMPRESSION BOMB (&quot;ZIP BOMB&quot;)
            ATTACKS. THESE FILES MUST BE SECURELY DOWNLOADED AND EXTRACTED ON
            YOUR LOCAL MACHINE.
          </SystemNotice>
        </section>
      </main>
    </div>
  );
}
