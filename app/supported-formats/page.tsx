import React from "react";
import Link from "next/link";

export default function SupportedFormatsPage() {
  return (
    <div className="min-h-screen bg-transparent text-neutral-300 selection:bg-white/20 selection:text-white pb-20">
      {/* --- Glassmorphism Sticky Navigation --- */}
      <div className="sticky top-0 z-30 bg-neutral-950/60 backdrop-blur-md p-4 md:p-6 mb-10 border-b border-neutral-800/80 shadow-lg">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link
            href="/"
            className="group flex items-center gap-3 text-neutral-100 hover:text-white transition-colors font-semibold uppercase tracking-wider text-sm md:text-base"
          >
            <span className="group-hover:-translate-x-1 transition-transform">
              ←
            </span>
            Back to Storage
          </Link>
          <span className="text-xs text-neutral-500 font-semibold uppercase tracking-widest px-3 py-1 bg-neutral-900/50 rounded-full border border-neutral-800">
            fss.pvt docs
          </span>
        </div>
      </div>

      {/* --- Main Content Area --- */}
      <div className="max-w-4xl mx-auto px-6 md:px-8">
        {/* Section 1 */}
        <section className="mb-12 group">
          <h1 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tighter drop-shadow-sm">
            1 Description
          </h1>
          <p className="mb-2 leading-relaxed text-sm md:text-base text-neutral-400">
            This document describes the input and output file formats supported
            by the{" "}
            <code className="text-white bg-neutral-800/50 border border-neutral-700/50 px-2 py-0.5 rounded-md font-semibold">
              fss.pvt
            </code>{" "}
            cloud storage platform.
          </p>
        </section>

        {/* Section 2 */}
        <section className="mb-12 group">
          <h1 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tighter drop-shadow-sm">
            2 Upload Options
          </h1>
          <div className="space-y-4 text-sm md:text-base text-neutral-400 leading-relaxed">
            <p>
              The platform provides unified storage capabilities. Namely, an
              uploaded file is parsed by its extension, categorized dynamically,
              and assigned a type-specific interface and generic device options
              (see the formatting manual).
            </p>
            <p>
              In addition, each supported file type may render so-called preview
              options, which are specific for that component (e.g., video
              playback vs. image rendering).
            </p>
            <p>
              Options may be set by specifying exact extensions during the
              upload phase in the{" "}
              <code className="text-white bg-neutral-800/50 border border-neutral-700/50 px-2 py-0.5 rounded-md font-semibold">
                DriveManager
              </code>{" "}
              tools, or by allowing the platform to auto-detect the MIME type
              explicitly.
            </p>
          </div>
        </section>

        {/* Section 3 */}
        <section className="mb-12">
          <h1 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tighter drop-shadow-sm">
            3 Supported Formats
          </h1>
          <div className="space-y-4 text-sm md:text-base text-neutral-400 leading-relaxed">
            <p>
              File formats are configured elements in the platform which enable
              accessing and previewing the data coming from your local system.
            </p>
            <p>
              When you configure your upload batch, all the supported formats
              are enabled by default. You can bypass the UI constraints using
              custom API routes, but the preview engine selectively enables
              rendering based on the extension.
            </p>
            <p>
              A description of the currently available file categories follows.
            </p>
          </div>

          <hr className="border-neutral-800 my-12" />

          {/* Subsection 3.1 */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-neutral-200 mb-4 tracking-tight">
              3.1 Images
            </h2>
            <div className="space-y-3 text-sm md:text-base text-neutral-400 leading-relaxed">
              <p>Standard image input device formats.</p>
              <p>
                To enable these formats, simply upload the file. The platform
                natively generates optimized thumbnails and provides full-screen
                modal viewing.
              </p>
              <p>An image identifier has the following supported extensions:</p>
            </div>

            <div className="bg-neutral-900/60 backdrop-blur-sm border border-neutral-800 text-neutral-300 p-4 rounded-xl my-6 text-sm font-semibold shadow-inner">
              .jpg, .jpeg, .png, .gif, .webp, .svg
            </div>

            <p className="mb-4 leading-relaxed text-sm md:text-base text-neutral-400">
              For example, to upload an image from a local device, you may
              select:
            </p>

            <div className="bg-neutral-900/60 backdrop-blur-sm border border-neutral-800 text-emerald-400 p-4 rounded-xl my-6 text-sm font-semibold shadow-inner flex items-center gap-3">
              <span className="text-neutral-600 select-none">&gt;</span>
              upload -f image profile_picture.webp
            </div>

            {/* Sub-subsection 3.1.1 */}
            <div className="mt-8">
              <h3 className="text-xl md:text-2xl font-semibold text-neutral-300 mb-4 tracking-tight">
                3.1.1 Options
              </h3>
              <div className="pl-6 border-l-2 border-neutral-800 space-y-6 py-2">
                <div>
                  <p className="font-semibold text-white text-sm md:text-base mb-1">
                    preview_support
                  </p>
                  <p className="text-sm md:text-base leading-relaxed text-neutral-500">
                    Set to True. Image preview is fully supported within the
                    platform UI.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-white text-sm md:text-base mb-1">
                    dimensions
                  </p>
                  <p className="text-sm md:text-base leading-relaxed text-neutral-500">
                    Original aspect ratio is maintained during preview. Default
                    is <code className="text-neutral-400">max-w-full</code>.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-neutral-800 my-12" />

          {/* Subsection 3.2 */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-neutral-200 mb-4 tracking-tight">
              3.2 Videos
            </h2>
            <div className="space-y-3 text-sm md:text-base text-neutral-400 leading-relaxed">
              <p>Multimedia video and audio-visual input format.</p>
              <p>
                This format utilizes the native HTML5{" "}
                <code className="text-white bg-neutral-800/50 border border-neutral-700/50 px-2 py-0.5 rounded-md font-semibold">
                  video
                </code>{" "}
                tag API which is available on all modern web browsers. The
                availability of playback is autodetected during render.
              </p>
              <p>Supported video extensions include:</p>
            </div>

            <div className="bg-neutral-900/60 backdrop-blur-sm border border-neutral-800 text-neutral-300 p-4 rounded-xl my-6 text-sm font-semibold shadow-inner">
              .mp4, .webm, .ogg, .mov
            </div>

            {/* Sub-subsection 3.2.1 */}
            <div className="mt-8">
              <h3 className="text-xl md:text-2xl font-semibold text-neutral-300 mb-4 tracking-tight">
                3.2.1 Options
              </h3>
              <div className="pl-6 border-l-2 border-neutral-800 space-y-6 py-2">
                <div>
                  <p className="font-semibold text-white text-sm md:text-base mb-1">
                    playback_controls
                  </p>
                  <p className="text-sm md:text-base leading-relaxed text-neutral-500">
                    Set to True. Features native play, pause, volume, and
                    timeline scrubbing.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-neutral-800 my-12" />

          {/* Subsection 3.3 */}
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold text-neutral-200 mb-4 tracking-tight">
              3.3 Documents & Spreadsheets
            </h2>
            <div className="space-y-3 text-sm md:text-base text-neutral-400 leading-relaxed mb-8">
              <p>Standard document processing and text-based formats.</p>
              <p>
                Depending on the extension, documents may either be previewed
                natively (e.g., PDF) or parsed for icon representation and
                direct download only (e.g., Office files).
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <p className="mb-2 text-white font-semibold text-sm md:text-base uppercase tracking-wider text-xs">
                  PDF Documents
                </p>
                <div className="bg-neutral-900/40 border border-neutral-800 text-neutral-300 p-3 rounded-lg text-sm shadow-inner flex justify-between items-center">
                  <span className="font-semibold">.pdf</span>
                  <span className="text-xs text-neutral-500">
                    Supports inline iframe preview
                  </span>
                </div>
              </div>

              <div>
                <p className="mb-2 text-white font-semibold text-sm md:text-base uppercase tracking-wider text-xs">
                  Presentations
                </p>
                <div className="bg-neutral-900/40 border border-neutral-800 text-neutral-300 p-3 rounded-lg text-sm shadow-inner font-semibold">
                  .pptx, .ppt
                </div>
              </div>

              <div>
                <p className="mb-2 text-white font-semibold text-sm md:text-base uppercase tracking-wider text-xs">
                  Spreadsheets & Data
                </p>
                <div className="bg-neutral-900/40 border border-neutral-800 text-neutral-300 p-3 rounded-lg text-sm shadow-inner font-semibold">
                  .xlsx, .xls, .csv
                </div>
              </div>

              <div>
                <p className="mb-2 text-white font-semibold text-sm md:text-base uppercase tracking-wider text-xs">
                  Plain Text & Markdown
                </p>
                <div className="bg-neutral-900/40 border border-neutral-800 text-neutral-300 p-3 rounded-lg text-sm shadow-inner font-semibold">
                  .md, .txt
                </div>
              </div>
            </div>

            {/* Sub-subsection 3.3.1 */}
            <div className="mt-10">
              <h3 className="text-xl md:text-2xl font-semibold text-neutral-300 mb-4 tracking-tight">
                3.3.1 Options
              </h3>
              <div className="pl-6 border-l-2 border-neutral-800 py-2">
                <p className="font-semibold text-white text-sm md:text-base mb-1">
                  fallback_behavior
                </p>
                <p className="text-sm md:text-base leading-relaxed text-neutral-500">
                  If the environment lacks a native viewer (like for .xlsx or
                  .pptx), the interface gracefully degrades to a &quot;Download
                  File&quot; prompt.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
