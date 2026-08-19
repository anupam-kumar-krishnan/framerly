"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useMotionValue, useSpring, animate } from "framer-motion";
import { Bricolage_Grotesque } from "next/font/google";

const displayFont = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
});

type Props = {
  beforeSrc?: string;
  afterSrc?: string;
  beforeLabel?: string;
  afterLabel?: string;
  url?: string;
};

export default function BeforeAfterTerminalSection({
  beforeSrc,
  afterSrc,
  beforeLabel = "Uploaded",
  afterLabel = "Framed in Framerly",
  url = "before-after.framerly.app",
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [percent, setPercent] = useState(50);
  const [dragging, setDragging] = useState(false);
  const smoothPercent = useSpring(50, { stiffness: 260, damping: 32 });

  useEffect(() => {
    smoothPercent.set(percent);
  }, [percent, smoothPercent]);

  const [display, setDisplay] = useState(50);
  useEffect(() => {
    const unsub = smoothPercent.on("change", (v) => setDisplay(v));
    return () => unsub();
  }, [smoothPercent]);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const raw = ((clientX - rect.left) / rect.width) * 100;
    setPercent(Math.min(100, Math.max(0, raw)));
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    setDragging(true);
    (e.target as Element).setPointerCapture?.(e.pointerId);
    updateFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    updateFromClientX(e.clientX);
  };
  const onPointerUp = () => setDragging(false);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") setPercent((p) => Math.max(0, p - 4));
    if (e.key === "ArrowRight") setPercent((p) => Math.min(100, p + 4));
    if (e.key === "Home") setPercent(0);
    if (e.key === "End") setPercent(100);
  };

  return (
    <section className="relative bg-[#0a0a0b] py-28 sm:py-36 px-6 overflow-hidden">
      {/* ambient glow, consistent with the studio canvas above */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[560px] w-[900px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-20 blur-[120px]"
        style={{
          background: "radial-gradient(closest-side, #f5a623, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-5xl">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14 text-center"
        >
          <p className="mb-4 font-mono text-xs tracking-[0.2em] text-[#f5a623] uppercase">
            Raw vs. Framed
          </p>
          <h2
            className={`${displayFont.className} text-4xl sm:text-5xl font-semibold tracking-tight text-white text-balance`}
          >
            Still looks like a screenshot.
            <br />
            Now it looks <span className="text-[#f5a623]">shipped.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-white/50">
            No filters, no manual masking. Drag the handle — the same source
            image, before Framerly and after.
          </p>
        </motion.div>

        {/* Terminal window */}
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-2xl border border-white/10 bg-[#111113] shadow-[0_40px_120px_-40px_rgba(0,0,0,0.8)]"
        >
          {/* title bar */}
          <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
            </div>
            <div className="mx-auto flex items-center gap-2 rounded-md bg-white/5 px-3 py-1 font-mono text-[11px] text-white/40">
              <LockIcon />
              {url}
            </div>
            <span className="hidden sm:inline-flex items-center rounded-full bg-white/5 px-2.5 py-1 font-mono text-[10px] text-white/40">
              drag to compare
            </span>
          </div>

          {/* compare area */}
          <div className="p-3 sm:p-5">
            <div
              ref={trackRef}
              role="slider"
              tabIndex={0}
              aria-label="Before and after comparison"
              aria-valuenow={Math.round(percent)}
              aria-valuemin={0}
              aria-valuemax={100}
              onKeyDown={onKeyDown}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerLeave={onPointerUp}
              className="relative aspect-[16/10] w-full select-none overflow-hidden rounded-lg border border-white/10 bg-black cursor-ew-resize touch-none"
            >
              {/* AFTER (full width, base layer) */}
              <div className="absolute inset-0">
                <ImageOrFallback
                  src={afterSrc}
                  alt={afterLabel}
                  variant="after"
                />
              </div>

              {/* BEFORE (clipped to slider position, sits on top) */}
              <div
                className="absolute inset-0"
                style={{ clipPath: `inset(0 ${100 - display}% 0 0)` }}
              >
                <ImageOrFallback
                  src={beforeSrc}
                  alt={beforeLabel}
                  variant="before"
                />
              </div>

              {/* labels */}
              <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 font-mono text-[10px] tracking-wide text-white/70 backdrop-blur">
                {beforeLabel}
              </span>
              <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-[#f5a623]/90 px-2.5 py-1 font-mono text-[10px] tracking-wide text-black backdrop-blur">
                {afterLabel}
              </span>

              {/* divider + handle */}
              <div
                className="absolute inset-y-0 z-10 w-px bg-white/70"
                style={{ left: `${display}%` }}
              >
                <motion.div
                  animate={{ scale: dragging ? 1.12 : 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-[#1a1a1d] shadow-lg"
                >
                  <HandleIcon />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ImageOrFallback({
  src,
  alt,
  variant,
}: {
  src?: string;
  alt: string;
  variant: "before" | "after";
}) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        draggable={false}
      />
    );
  }
  // Placeholder so the section renders sensibly with no assets wired up yet.
  if (variant === "before") {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[#18181a] px-6 text-center">
        <div className="h-10 w-10 rounded-md border border-white/15 bg-white/5" />
        <p className="font-mono text-[11px] text-white/30">
          raw-screenshot.png
        </p>
      </div>
    );
  }
  return (
    <div
      className="flex h-full w-full items-center justify-center p-10"
      style={{
        background:
          "linear-gradient(135deg, #ffb84d 0%, #f5a623 55%, #d9840f 100%)",
      }}
    >
      <div className="h-full w-full rounded-md border border-black/10 bg-black/10 shadow-[0_25px_60px_-20px_rgba(0,0,0,0.6)]" />
    </div>
  );
}

function LockIcon() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      className="opacity-60"
    >
      <rect
        x="5"
        y="11"
        width="14"
        height="9"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function HandleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M9 6L3 12L9 18"
        stroke="white"
        strokeOpacity="0.7"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 6L21 12L15 18"
        stroke="white"
        strokeOpacity="0.7"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
