"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import {
  RotateCcw,
  Undo2,
  Redo2,
  Paperclip,
  Grid3x3,
  Copy,
  Download,
  Zap,
  Lock,
} from "lucide-react";
import { Bricolage_Grotesque } from "next/font/google";

const badges = [
  { icon: Zap, label: "Free — no sign-up" },
  { icon: Lock, label: "100% in your browser" },
  { icon: Download, label: "Retina PNG, JPG & SVG" },
];

const displayFont = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
});

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const springX = useSpring(mx, { stiffness: 140, damping: 22 });
  const springY = useSpring(my, { stiffness: 140, damping: 22 });
  const rotateY = useTransform(springX, [0, 1], [-5, 5]);
  const rotateX = useTransform(springY, [0, 1], [5, -5]);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  }

  function handleLeave() {
    mx.set(0.5);
    my.set(0.5);
  }

  return (
    <section className="relative overflow-hidden px-6 pb-10 pt-20 md:pt-28">
      {/* ambient glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-10%] h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-accent/10 blur-[130px]" />
      </div>

      {/* centered copy */}
      <div className="mx-auto max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto mb-6 inline-flex rounded-full p-[1px] overflow-hidden"
        >
          {/* running border — oversized square that rotates, clipped by the static pill above */}
          <motion.span
            aria-hidden
            className="absolute left-1/2 top-1/2 h-[200%] w-[200%] -translate-x-1/2 -translate-y-1/2"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0deg, transparent 260deg, rgba(251,191,36,0.9) 300deg, #fbbf24 330deg, transparent 360deg)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
          />

          <div className="relative inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface px-3.5 py-1.5 font-mono text-[12px] text-accent-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            New Angle Unlocked
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1 }}
          className={`${displayFont.className} text-balance text-[50px] font-semibold leading-[1.1] tracking-tight md:text-[64px]`}
        >
          Every Screenshot deserves{" "}
          <span className="bg-grad-accent bg-clip-text text-transparent">
            a Studio.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mx-auto mt-5 max-w-lg text-[15.5px] leading-relaxed text-text-dim"
        >
          Drop in any screenshot, pick a frame, and export in seconds. Same
          canvas you see below — no separate preview, no surprises.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.38 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <motion.a
            href="/app"
            whileHover={{
              y: -2,
              boxShadow: "0 14px 34px -10px rgba(255,138,61,0.55)",
            }}
            whileTap={{ y: 0 }}
            className="rounded-xl bg-grad-accent px-5 py-3 text-sm font-semibold text-[#160c04]"
          >
            Open the studio →
          </motion.a>
          <motion.a
            href="#gallery"
            whileHover={{ y: -2 }}
            className="rounded-xl border border-border-strong px-5 py-3 text-sm font-semibold text-text hover:bg-surface"
          >
            See the styles
          </motion.a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
        >
          {badges.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="flex items-center gap-1.5 text-[13px] text-white"
            >
              <Icon className="h-3.5 w-3.5" strokeWidth={2.25} />
              {label}
            </span>
          ))}
        </motion.div>
      </div>

      {/* product screenshot, front and center */}
      <div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className="relative mx-auto mt-16 max-w-5xl [perspective:2000px]"
      >
        <div className="pointer-events-none absolute -inset-x-10 -inset-y-10 -z-10 animate-breathe rounded-[48px] bg-grad-studio opacity-25 blur-[100px]" />

        <motion.div
          initial={{ opacity: 0, y: 70, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 0.9, 0.25, 1] }}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="overflow-hidden rounded-2xl border border-[#ffffff] bg-[#0d0c10] shadow-[0_50px_120px_-30px_rgba(0,0,0,0.8)]"
        >
          {/* topbar */}
          <div className="flex items-center justify-between border-b border-border bg-[#131116] px-4 py-3">
            <div className="flex items-center gap-3 text-text-dim">
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-grad-accent" />
              <span className="font-mono text-[12px]">Framerly</span>
              <span className="hidden rounded-md border border-border-strong px-2 py-0.5 font-mono text-[11px] sm:inline">
                4:3 ▾
              </span>
            </div>
            <div className="hidden items-center gap-3 text-text-dimmer sm:flex">
              <RotateCcw size={13} />
              <Undo2 size={13} />
              <Redo2 size={13} />
              <Paperclip size={13} />
              <Grid3x3 size={13} />
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 rounded-md border border-border-strong px-2.5 py-1 text-[11px] text-text-dim">
                <Copy size={11} /> Copy
              </span>
              <span className="flex items-center gap-1 rounded-md bg-grad-accent px-2.5 py-1 text-[11px] font-semibold text-[#160c04]">
                <Download size={11} /> Save
              </span>
            </div>
          </div>

          {/* body */}
          <div className="grid grid-cols-1 sm:grid-cols-[170px_1fr_190px]">
            <div className="hidden border-r border-border p-4 sm:block">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-text-dimmer">
                Device
              </p>
              <div className="mb-4 grid grid-cols-2 gap-2">
                {["None", "Browser", "MacBook", "iPhone"].map((d, i) => (
                  <div
                    key={d}
                    className={`rounded-md border px-1.5 py-2 text-center font-mono text-[9px] ${
                      i === 0
                        ? "border-accent text-accent-2"
                        : "border-border text-text-dimmer"
                    }`}
                  >
                    <div className="mb-1.5 h-5 rounded bg-surface-2" />
                    {d}
                  </div>
                ))}
              </div>
              <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-text-dimmer">
                Style
              </p>
              <div className="flex flex-col gap-1.5">
                {["Safari", "Safari Dark", "Chrome", "Glass"].map((s) => (
                  <div
                    key={s}
                    className="flex items-center gap-2 rounded-md border border-border px-2 py-1.5 font-mono text-[9px] text-text-dimmer"
                  >
                    <span className="h-2.5 w-3.5 rounded-sm bg-surface-2" />
                    {s}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative flex min-h-[300px] items-center justify-center overflow-hidden bg-grad-studio md:min-h-[380px]">
              <div className="flex h-[74%] w-[68%] flex-col items-center justify-center gap-2.5 rounded-2xl border border-dashed border-[#ffffff] bg-white/5 text-center text-white backdrop-blur-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#ffffff] text-lg text-black">
                  +
                </div>
                <p className="text-[12px] font-semibold text-black">
                  Drag &amp; drop, click to browse, or paste
                </p>
                <span className="rounded-md border border-[#ffffff] px-2 py-0.5 text-[9px] text-black">
                  ⌘V to paste
                </span>
              </div>

              {/* floating annotation chips */}
              <motion.div
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0, y: [0, -6, 0] }}
                transition={{
                  opacity: { duration: 0.6, delay: 1 },
                  x: { duration: 0.6, delay: 1 },
                  y: {
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  },
                }}
                className="absolute left-4 top-4 hidden items-center gap-1.5 rounded-full bg-bg/80 px-3 py-1.5 font-mono text-[10px] text-text backdrop-blur md:flex"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                exports in &lt;10s
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0, y: [0, 7, 0] }}
                transition={{
                  opacity: { duration: 0.6, delay: 1.15 },
                  x: { duration: 0.6, delay: 1.15 },
                  y: {
                    duration: 4.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.15,
                  },
                }}
                className="absolute bottom-4 right-4 hidden items-center gap-1.5 rounded-full bg-bg/80 px-3 py-1.5 font-mono text-[10px] text-text backdrop-blur md:flex"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-blue" />
                PNG · SVG · 4K
              </motion.div>
            </div>

            <div className="hidden border-l border-border p-4 sm:block">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-text-dimmer">
                Tilt
              </p>
              <div className="relative mb-4 aspect-square rounded-lg bg-grad-studio">
                <div className="absolute left-[52%] top-[48%] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#ffffff] bg-accent" />
              </div>
              <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-text-dimmer">
                Zoom · 100%
              </p>
              <div className="relative mb-5 h-[3px] rounded bg-border-strong">
                <div className="absolute left-[60%] top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
              </div>
              <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-text-dimmer">
                Layout presets
              </p>
              <div className="h-14 rounded-lg bg-grad-studio" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
