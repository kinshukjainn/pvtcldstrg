import React from "react";
import Link from "next/link";

export default function SupportedFormatsPage() {
  return (
    <div className="min-h-screen bg-[#333333] text-[#cccccc]  selection:bg-[#66cc66] selection:text-black pb-12">
      {/* Optional: Simple navigation to go back */}
      <div className="bg-[#222222] p-4 mb-6 border-b border-[#444444]">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Link
            href="/"
            className="text-[#66cc66] hover:text-[#88ee88] transition-colors font-semibold"
          >
            ← Back to Storage
          </Link>
          <span className="text-sm text-[#888888]">fss.pvt documentation</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8">
        {/* Section 1 */}
        <section className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#5cb85c] mb-3">
            1 Description
          </h1>
          <p className="mb-2 leading-relaxed text-sm md:text-base">
            This document describes the input and output file formats supported
            by the <code className="text-[#5cb85c]">fss.pvt</code> cloud storage
            platform.
          </p>
        </section>

        {/* Section 2 */}
        <section className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#5cb85c] mb-3">
            2 Upload Options
          </h1>
          <p className="mb-2 leading-relaxed text-sm md:text-base">
            The platform provides unified storage capabilities. Namely, an
            uploaded file is parsed by its extension, categorized dynamically,
            and assigned a type-specific interface and generic device options
            (see the formatting manual).
          </p>
          <p className="mb-2 leading-relaxed text-sm md:text-base">
            In addition, each supported file type may render so-called preview
            options, which are specific for that component (e.g., video playback
            vs. image rendering).
          </p>
          <p className="mb-2 leading-relaxed text-sm md:text-base">
            Options may be set by specifying exact extensions during the upload
            phase in the <code className="text-[#5cb85c]">DriveManager</code>{" "}
            tools, or by allowing the platform to auto-detect the MIME type
            explicitly.
          </p>
        </section>

        {/* Section 3 */}
        <section className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#5cb85c] mb-3">
            3 Supported Formats
          </h1>
          <p className="mb-2 leading-relaxed text-sm md:text-base">
            File formats are configured elements in the platform which enable
            accessing and previewing the data coming from your local system.
          </p>
          <p className="mb-2 leading-relaxed text-sm md:text-base">
            When you configure your upload batch, all the supported formats are
            enabled by default. You can bypass the UI constraints using custom
            API routes, but the preview engine selectively enables rendering
            based on the extension.
          </p>
          <p className="mb-4 leading-relaxed text-sm md:text-base">
            A description of the currently available file categories follows.
          </p>

          <hr className="border-[#555555] my-6" />

          {/* Subsection 3.1 */}
          <div className="mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-[#5cb85c] mb-3">
              3.1 Images
            </h2>
            <p className="mb-2 leading-relaxed text-sm md:text-base">
              Standard image input device formats.
            </p>
            <p className="mb-2 leading-relaxed text-sm md:text-base">
              To enable these formats, simply upload the file. The platform
              natively generates optimized thumbnails and provides full-screen
              modal viewing.
            </p>
            <p className="mb-2 leading-relaxed text-sm md:text-base">
              An image identifier has the following supported extensions:
            </p>

            <div className="bg-white text-black p-3 my-4  text-xs md:text-sm overflow-x-auto shadow-inner">
              .jpg, .jpeg, .png, .gif, .webp, .svg
            </div>

            <p className="mb-2 leading-relaxed text-sm md:text-base">
              For example, to upload an image from a local device, you may
              select:
            </p>

            <div className="bg-white text-black p-3 my-4  text-xs md:text-sm overflow-x-auto shadow-inner">
              upload -f image profile_picture.webp
            </div>

            {/* Sub-subsection 3.1.1 */}
            <hr className="border-[#444444] my-6" />
            <h3 className="text-lg md:text-xl font-bold text-[#5cb85c] mb-3">
              3.1.1 Options
            </h3>
            <div className="pl-4 border-l-2 border-[#555555]">
              <p className="font-bold text-[#eeeeee] text-sm md:text-base">
                preview_support
              </p>
              <p className="mb-4 text-sm md:text-base leading-relaxed">
                Set to True. Image preview is fully supported within the
                platform UI.
              </p>

              <p className="font-bold text-[#eeeeee] text-sm md:text-base">
                dimensions
              </p>
              <p className="text-sm md:text-base leading-relaxed">
                Original aspect ratio is maintained during preview. Default is
                max-w-full.
              </p>
            </div>
          </div>

          <hr className="border-[#555555] my-6" />

          {/* Subsection 3.2 */}
          <div className="mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-[#5cb85c] mb-3">
              3.2 Videos
            </h2>
            <p className="mb-2 leading-relaxed text-sm md:text-base">
              Multimedia video and audio-visual input format.
            </p>
            <p className="mb-2 leading-relaxed text-sm md:text-base">
              This format utilizes the native HTML5 `
              <code className="text-[#5cb85c]">video</code>` tag API which is
              available on all modern web browsers. The availability of playback
              is autodetected during render.
            </p>
            <p className="mb-2 leading-relaxed text-sm md:text-base">
              Supported video extensions include:
            </p>

            <div className="bg-white text-black p-3 my-4  text-xs md:text-sm overflow-x-auto shadow-inner">
              .mp4, .webm, .ogg, .mov
            </div>

            <hr className="border-[#444444] my-6" />
            <h3 className="text-lg md:text-xl font-bold text-[#5cb85c] mb-3">
              3.2.1 Options
            </h3>
            <div className="pl-4 border-l-2 border-[#555555]">
              <p className="font-bold text-[#eeeeee] text-sm md:text-base">
                playback_controls
              </p>
              <p className="mb-4 text-sm md:text-base leading-relaxed">
                Set to True. Features native play, pause, volume, and timeline
                scrubbing.
              </p>
            </div>
          </div>

          <hr className="border-[#555555] my-6" />

          {/* Subsection 3.3 */}
          <div className="mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-[#5cb85c] mb-3">
              3.3 Documents & Spreadsheets
            </h2>
            <p className="mb-2 leading-relaxed text-sm md:text-base">
              Standard document processing and text-based formats.
            </p>
            <p className="mb-2 leading-relaxed text-sm md:text-base">
              Depending on the extension, documents may either be previewed
              natively (e.g., PDF) or parsed for icon representation and direct
              download only (e.g., Office files).
            </p>

            <p className="mb-2 mt-4 text-[#eeeeee] font-semibold text-sm md:text-base">
              PDF Documents:
            </p>
            <div className="bg-white text-black p-3 my-2  text-xs md:text-sm overflow-x-auto shadow-inner">
              .pdf (Supports inline iframe preview)
            </div>

            <p className="mb-2 mt-4 text-[#eeeeee] font-semibold text-sm md:text-base">
              Presentations:
            </p>
            <div className="bg-white text-black p-3 my-2  text-xs md:text-sm overflow-x-auto shadow-inner">
              .pptx, .ppt
            </div>

            <p className="mb-2 mt-4 text-[#eeeeee] font-semibold text-sm md:text-base">
              Spreadsheets & Data:
            </p>
            <div className="bg-white text-black p-3 my-2  text-xs md:text-sm overflow-x-auto shadow-inner">
              .xlsx, .xls, .csv
            </div>

            <p className="mb-2 mt-4 text-[#eeeeee] font-semibold text-sm md:text-base">
              Plain Text & Markdown:
            </p>
            <div className="bg-white text-black p-3 my-2  text-xs md:text-sm overflow-x-auto shadow-inner">
              .md, .txt
            </div>

            <hr className="border-[#444444] my-6" />
            <h3 className="text-lg md:text-xl font-bold text-[#5cb85c] mb-3">
              3.3.1 Options
            </h3>
            <div className="pl-4 border-l-2 border-[#555555]">
              <p className="font-bold text-[#eeeeee] text-sm md:text-base">
                fallback_behavior
              </p>
              <p className="mb-4 text-sm md:text-base leading-relaxed">
                If the environment lacks a native viewer (like for .xlsx or
                .pptx), the interface gracefully degrades to a &quot;Download
                File&quot; prompt.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
