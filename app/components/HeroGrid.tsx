"use client";
import React, { useEffect, useRef, useState } from "react";

/* ═══════════════════════════════════════════════════════════
   HeroGrid – a faded perspective grid that sits behind the
   hero title area.  Renders a pure-CSS grid with:
     • bold dark lines for strong visual presence
     • radial fade so edges dissolve naturally
     • a soft animated "pulse" sweep across the grid
     • slight perspective tilt for depth
   ═══════════════════════════════════════════════════════════ */

export default function HeroGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-x-0 top-0 pointer-events-none select-none overflow-hidden"
      style={{ height: "min(720px, 90vh)" }}
    >
      {/* ── Perspective wrapper ── */}
      <div
        className="absolute inset-0"
        style={{
          perspective: "1000px",
          perspectiveOrigin: "50% 35%",
        }}
      >
        {/* ── The grid plane ── */}
        <div
          style={{
            position: "absolute",
            inset: "-10% -15%",
            width: "130%",
            height: "120%",
            transform: "rotateX(2.5deg)",
            transformOrigin: "center top",
            opacity: visible ? 1 : 0,
            transition: "opacity 1s cubic-bezier(.22,1,.36,1)",
          }}
        >
          {/* ── Primary grid: bold dark lines ── */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: [
                "linear-gradient(to bottom, rgba(0,0,0,0.10) 1px, transparent 1px)",
                "linear-gradient(to right,  rgba(0,0,0,0.10) 1px, transparent 1px)",
              ].join(", "),
              backgroundSize: "52px 52px",
              maskImage:
                "radial-gradient(ellipse 70% 65% at 50% 42%, black 25%, transparent 80%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 70% 65% at 50% 42%, black 25%, transparent 80%)",
            }}
          />

          {/* ── Major grid lines every 4th cell: heavier ── */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: [
                "linear-gradient(to bottom, rgba(0,0,0,0.16) 1.5px, transparent 1.5px)",
                "linear-gradient(to right,  rgba(0,0,0,0.16) 1.5px, transparent 1.5px)",
              ].join(", "),
              backgroundSize: "208px 208px",
              maskImage:
                "radial-gradient(ellipse 65% 60% at 50% 42%, black 15%, transparent 75%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 65% 60% at 50% 42%, black 15%, transparent 75%)",
            }}
          />

          {/* ── Blue-tinted accent lines for Azure feel ── */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: [
                "linear-gradient(to bottom, rgba(0,120,212,0.06) 1px, transparent 1px)",
                "linear-gradient(to right,  rgba(0,120,212,0.06) 1px, transparent 1px)",
              ].join(", "),
              backgroundSize: "52px 52px",
              maskImage:
                "radial-gradient(ellipse 55% 50% at 50% 42%, black 20%, transparent 70%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 55% 50% at 50% 42%, black 20%, transparent 70%)",
            }}
          />

          {/* ── Intersection dots ── */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "radial-gradient(circle 2px at center, rgba(0,0,0,0.14) 0%, transparent 100%)",
              backgroundSize: "52px 52px",
              maskImage:
                "radial-gradient(ellipse 55% 50% at 50% 42%, black 15%, transparent 65%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 55% 50% at 50% 42%, black 15%, transparent 65%)",
            }}
          />

          {/* ── Major intersection dots (bigger, darker) ── */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "radial-gradient(circle 3px at center, rgba(0,0,0,0.18) 0%, transparent 100%)",
              backgroundSize: "208px 208px",
              maskImage:
                "radial-gradient(ellipse 50% 45% at 50% 42%, black 10%, transparent 60%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 50% 45% at 50% 42%, black 10%, transparent 60%)",
            }}
          />

          {/* ── Animated sweep highlight ── */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(105deg, transparent 30%, rgba(0,120,212,0.04) 42%, rgba(0,120,212,0.07) 50%, rgba(0,120,212,0.04) 58%, transparent 70%)",
              backgroundSize: "200% 100%",
              animation: "heroGridSweep 7s ease-in-out infinite",
              maskImage:
                "radial-gradient(ellipse 60% 55% at 50% 42%, black 15%, transparent 70%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 60% 55% at 50% 42%, black 15%, transparent 70%)",
            }}
          />
        </div>
      </div>

      {/* ── Soft glow behind grid centre ── */}
      <div
        className="absolute left-1/2 top-[36%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[380px] sm:w-[850px] sm:h-[480px] rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,120,212,0.05) 0%, transparent 65%)",
          filter: "blur(60px)",
          opacity: visible ? 1 : 0,
          transition: "opacity 1.4s ease",
        }}
      />

      {/* Keyframe injection */}
      <style>{`
        @keyframes heroGridSweep {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
