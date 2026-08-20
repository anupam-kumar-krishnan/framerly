"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import {
  Blend,
  Sparkles,
  Droplet,
  MoveDiagonal,
  Square,
  Layers,
} from "lucide-react";

import { Bricolage_Grotesque } from "next/font/google";

const displayFont = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
});

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const riseVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

// ---------- mock browser-window preview ----------

type PreviewFrame = "image1" | "yellowGradient" | "image2";

const frameBackground: Record<PreviewFrame, string> = {
  image1: "bg-[url('/backgrounds/macos-2.jpg')] bg-cover bg-center",
  yellowGradient:
    "bg-[linear-gradient(135deg,#fef08a_0%,#facc15_35%,#f59e0b_70%,#b45309_100%)]",
  image2: "bg-[url('/backgrounds/pattern-3.jpg')] bg-cover bg-center",
};

function PreviewWindow({
  frame,
  url,
  children,
}: {
  frame: PreviewFrame;
  url: string;
  children: ReactNode;
}) {
  return (
    <div className={`rounded-[28px] p-6 sm:p-7 ${frameBackground[frame]}`}>
      <div className="relative overflow-hidden rounded-2xl bg-neutral-950 shadow-2xl shadow-black/50 ring-1 ring-white/10">
        <div className="relative p-3">
          {/* title bar */}
          <div className="mb-3 flex items-center gap-2 rounded-lg bg-neutral-900/80 px-2.5 py-1.5 backdrop-blur">
            {/* classic macOS traffic lights */}
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-2 flex-1 rounded-md bg-neutral-950/60 py-0.5 text-center text-[10px] text-neutral-400 ring-1 ring-white/5">
              {url}
            </span>
          </div>

          <div className="flex gap-2 rounded-lg bg-neutral-900/80 p-2.5 backdrop-blur">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Dashboard 1 — web analytics (Northwind) */
function AnalyticsDashboard() {
  return (
    <>
      <div className="w-16 shrink-0 space-y-2 text-[9px]">
        <p className="px-1 font-semibold text-neutral-100">Northwind</p>
        <p className="rounded bg-amber-400/10 px-1 py-0.5 font-medium text-amber-400">
          Overview
        </p>
        <p className="px-1 text-neutral-500">Sessions</p>
        <p className="px-1 text-neutral-500">Funnels</p>
        <p className="px-1 text-neutral-500">Retention</p>
      </div>

      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-semibold text-neutral-100">Overview</p>
          <div className="flex items-center gap-1">
            <span className="rounded-full bg-neutral-950/60 px-1.5 py-0.5 text-[8px] text-neutral-400 ring-1 ring-white/5">
              Last 7 days
            </span>
            <span className="h-2 w-2 rounded-full bg-amber-400" />
          </div>
        </div>

        <div className="rounded-md bg-neutral-950/60 p-2 ring-1 ring-white/5">
          <p className="text-[7px] uppercase tracking-wide text-neutral-500">
            Revenue
          </p>
          <div className="mt-0.5 flex items-baseline gap-1">
            <span className="text-xs font-bold text-neutral-50">$48,120</span>
            <span className="text-[8px] font-medium text-emerald-400">
              ▲ 12.4%
            </span>
          </div>
          <div className="mt-1.5 flex items-end gap-[3px]">
            {[5, 7, 6, 8, 7, 9].map((h, i) => (
              <span
                key={i}
                className={`w-1.5 rounded-sm ${
                  i === 5 ? "bg-amber-400" : "bg-neutral-700"
                }`}
                style={{ height: `${h * 2}px` }}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <div className="flex-1 rounded-md bg-neutral-950/60 p-1.5 ring-1 ring-white/5">
            <p className="text-[7px] text-neutral-500">Signups</p>
            <p className="text-[9px] font-semibold text-neutral-100">1,284</p>
          </div>
          <div className="flex-1 rounded-md bg-neutral-950/60 p-1.5 ring-1 ring-white/5">
            <p className="text-[7px] text-neutral-500">Churn</p>
            <p className="text-[9px] font-semibold text-neutral-100">0.8%</p>
          </div>
        </div>
      </div>
    </>
  );
}

// ---------- feature grid item ----------

const features = [
  {
    icon: Blend,
    title: "44 Gradients",
    desc: "Curated two- and four-stop ramps",
  },
  {
    icon: Sparkles,
    title: "16 Photos",
    desc: "MacOS, skies, patterns, and abstracts",
  },
  {
    icon: Droplet,
    title: "15 Radiants",
    desc: "Different shades radial backgrounds",
  },
  {
    icon: MoveDiagonal,
    title: "Adjustable padding",
    desc: "Room around the screenshot",
  },
  {
    icon: Square,
    title: "Rounded corners",
    desc: "Square through fully round",
  },
  {
    icon: Layers,
    title: "3 Shadow depths",
    desc: "A whisper of lift to a full drop",
  },
];

function FeatureCard({
  icon: Icon,
  title,
  desc,
}: {
  icon: typeof Blend;
  title: string;
  desc: string;
}) {
  return (
    <motion.div
      variants={riseVariants}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="flex items-start gap-3 rounded-2xl border border-white/5 bg-neutral-900/40 p-4"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-400/10 text-amber-400">
        <Icon className="h-4 w-4" strokeWidth={2} />
      </span>
      <div>
        <p className="text-sm font-medium text-neutral-100">{title}</p>
        <p className="mt-0.5 text-sm text-neutral-500">{desc}</p>
      </div>
    </motion.div>
  );
}

// ---------- main section ----------

export default function BackgroundsSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-neutral-950 px-6 py-24">
      {/* ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-amber-400/10 blur-[120px]"
      />

      <div className="relative mx-auto max-w-5xl">
        {/* heading */}
        <motion.div
          initial={shouldReduceMotion ? undefined : "hidden"}
          whileInView={shouldReduceMotion ? undefined : "show"}
          viewport={{ once: true, margin: "-80px" }}
          variants={containerVariants}
          className="mb-14 text-center"
        >
          <motion.div
            variants={riseVariants}
            className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-400"
          >
            <Blend className="h-3.5 w-3.5" strokeWidth={2.5} />
            Backgrounds
          </motion.div>

          <motion.h2
            variants={riseVariants}
            className={`${displayFont.className} text-4xl font-semibold tracking-tight text-neutral-50 sm:text-5xl`}
          >
            A <span className="text-amber-400">backdrop</span> for every{" "}
            <span className="text-amber-400">screenshot</span>
          </motion.h2>

          <motion.p
            variants={riseVariants}
            className="mx-auto mt-4 max-w-xl text-balance text-base text-neutral-400 sm:text-lg"
          >
            Pick a background, then set how much room the shot gets, how round
            its corners are, and how far off the page it floats.
          </motion.p>
        </motion.div>

        {/* preview panel */}
        <motion.div
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 30 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-[32px] border border-white/10 bg-neutral-900/40 p-6 sm:p-8"
        >
          <motion.div
            variants={containerVariants}
            initial={shouldReduceMotion ? undefined : "hidden"}
            whileInView={shouldReduceMotion ? undefined : "show"}
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-3"
          >
            {(
              [
                { frame: "image1", url: "northwind.app" },
                { frame: "yellowGradient", url: "northwind.app" },
                { frame: "image2", url: "northwind.app" },
              ] as { frame: PreviewFrame; url: string }[]
            ).map(({ frame, url }) => (
              <motion.div
                key={frame}
                variants={riseVariants}
                whileHover={{ y: -6, scale: 1.015 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <PreviewWindow frame={frame} url={url}>
                  <AnalyticsDashboard />
                </PreviewWindow>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* feature grid */}
        <motion.div
          variants={containerVariants}
          initial={shouldReduceMotion ? undefined : "hidden"}
          whileInView={shouldReduceMotion ? undefined : "show"}
          viewport={{ once: true, margin: "-80px" }}
          className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          {features.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
