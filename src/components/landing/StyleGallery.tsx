"use client";

import { motion, useAnimationControls } from "motion/react";
import { Bricolage_Grotesque } from "next/font/google";

const displayFont = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
});

const frames = [
  {
    label: "safari — light",
    bg: "bg-[#f4f0e8]",
    bar: "bg-[#d8d2c4]",
    blob: "bg-accent-2",
  },
  {
    label: "safari — dark",
    bg: "bg-[#18151b]",
    bar: "bg-accent-2",
    blob: "bg-accent",
  },
  {
    label: "chrome — light",
    bg: "bg-[#eceef2]",
    bar: "bg-[#c7cbd4]",
    blob: "bg-blue",
  },
  {
    label: "chrome — dark",
    bg: "bg-[#151318]",
    bar: "bg-accent",
    blob: "bg-accent-2",
  },
  {
    label: "bare — no chrome",
    bg: "bg-[#101014]",
    bar: "bg-[#4a4756]",
    blob: "bg-blue",
  },
  { label: "glass", bg: "bg-[#131318]", bar: "bg-white/40", blob: "bg-purple" },
];

export default function StyleGallery() {
  const controls = useAnimationControls();
  const loop = [...frames, ...frames];

  return (
    <section
      id="gallery"
      className="border-y border-border bg-bg-soft px-6 py-28"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-3 font-mono text-[12px] uppercase tracking-wider text-accent-2">
              Contact sheet
            </div>
            <h2
              className={`${displayFont.className} font-display text-[28px] font-semibold md:text-[34px]`}
            >
              One <span className="text-amber-400">screenshot</span>, every{" "}
              <span className="text-amber-400">frame.</span>
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-xs text-[14px] text-text-dim"
          >
            Switch chrome without re-uploading. Every style reads the same
            source image, so your set stays consistent.
          </motion.p>
        </div>
      </div>

      <div
        className="relative overflow-hidden"
        onMouseEnter={() => controls.stop()}
        onMouseLeave={() =>
          controls.start({
            x: ["0%", "-50%"],
            transition: { duration: 22, ease: "linear", repeat: Infinity },
          })
        }
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-bg-soft to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-bg-soft to-transparent" />
        <motion.div
          animate={controls}
          initial={{ x: "0%" }}
          onViewportEnter={() =>
            controls.start({
              x: ["0%", "-50%"],
              transition: { duration: 22, ease: "linear", repeat: Infinity },
            })
          }
          className="flex w-max gap-5 px-6"
        >
          {loop.map((f, i) => (
            <div
              key={i}
              className="w-64 shrink-0 overflow-hidden rounded-xl border border-border bg-surface transition-transform hover:-translate-y-1.5"
            >
              <div className="flex items-center gap-1.5 border-b border-border px-3 py-2">
                <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                <span className="ml-2 rounded bg-surface-2 px-2 py-0.5 font-mono text-[9px] text-text-dimmer">
                  framerly.app
                </span>
              </div>
              <div className={`relative h-32 ${f.bg}`}>
                <div
                  className={`absolute left-3.5 top-4 h-[3px] w-2/5 rounded ${f.bar}`}
                />
                <div
                  className={`absolute bottom-3.5 right-3.5 h-9 w-14 rounded-md ${f.blob}`}
                />
              </div>
              <div className="px-3 py-2 font-mono text-[11px] text-text-dimmer">
                {f.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
