"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import {
  Monitor,
  AppWindow,
  Gem,
  Smartphone,
  Laptop as LaptopIcon,
  MoveDiagonal,
} from "lucide-react";

import { Bricolage_Grotesque } from "next/font/google";

const displayFont = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
});

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const riseVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

// ---------- shared dashboard content (reused inside laptop / browser) ----------

function DashboardContent() {
  return (
    <div className="p-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[11px] font-semibold text-neutral-100">Overview</p>
        <div className="flex items-center gap-1.5">
          <span className="rounded-full bg-neutral-950/60 px-1.5 py-0.5 text-[8px] text-neutral-400 ring-1 ring-white/5">
            Last 7 days
          </span>
          <span className="h-2 w-2 rounded-full bg-amber-400" />
        </div>
      </div>

      <div className="rounded-md bg-neutral-950/60 p-2.5 ring-1 ring-white/5">
        <p className="text-[7px] uppercase tracking-wide text-neutral-500">
          Revenue
        </p>
        <div className="mt-0.5 flex items-baseline gap-1">
          <span className="text-sm font-bold text-neutral-50">$48,120</span>
          <span className="text-[9px] font-medium text-emerald-400">
            ▲ 12.4%
          </span>
        </div>
        <div className="mt-2 flex items-end gap-1">
          {[5, 7, 6, 8, 7, 9].map((h, i) => (
            <span
              key={i}
              className={`w-2.5 rounded-sm ${
                i === 5 ? "bg-amber-400" : "bg-neutral-700"
              }`}
              style={{ height: `${h * 3}px` }}
            />
          ))}
        </div>
      </div>

      <div className="mt-2 flex gap-2">
        <div className="flex-1 rounded-md bg-neutral-950/60 p-2 ring-1 ring-white/5">
          <p className="text-[7px] text-neutral-500">Signups</p>
          <p className="text-[10px] font-semibold text-neutral-100">1,284</p>
        </div>
        <div className="flex-1 rounded-md bg-neutral-950/60 p-2 ring-1 ring-white/5">
          <p className="text-[7px] text-neutral-500">Churn</p>
          <p className="text-[10px] font-semibold text-neutral-100">0.8%</p>
        </div>
      </div>
    </div>
  );
}

// ---------- 1. Laptop mockup ----------
// (was w-[270px]; trimmed ~15% so the row of four fits more comfortably)

function LaptopMockup() {
  return (
    <div className="w-[228px]">
      {/* screen */}
      <div className="relative rounded-t-[14px] bg-gradient-to-b from-neutral-800 to-neutral-950 p-2 pt-3 shadow-2xl shadow-black/60 ring-1 ring-black/40">
        {/* camera notch */}
        <div className="absolute left-1/2 top-1.5 h-[4px] w-[4px] -translate-x-1/2 rounded-full bg-black ring-1 ring-neutral-700" />
        <div className="overflow-hidden rounded-[3px] bg-neutral-950 ring-1 ring-black/60">
          <DashboardContent />
        </div>
      </div>

      {/* hinge line */}
      <div className="h-[3px] bg-gradient-to-b from-neutral-600 to-neutral-500" />

      {/* aluminum base / deck, slightly wider than the screen */}
      <div className="relative -mx-2">
        <div className="h-[8px] rounded-b-[7px] bg-gradient-to-b from-neutral-300 via-neutral-200 to-neutral-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
          {/* trackpad latch notch */}
          <div className="absolute left-1/2 top-0 h-[4px] w-12 -translate-x-1/2 rounded-b-[4px] bg-neutral-400/90" />
        </div>
      </div>

      {/* soft contact shadow */}
      <div className="mx-auto mt-2.5 h-2 w-[72%] rounded-full bg-black/50 blur-md" />
    </div>
  );
}

// ---------- 2. Browser window mockup ----------

function BrowserMockup() {
  return (
    <div className="w-[204px] overflow-hidden rounded-xl border border-white/10 bg-neutral-950 shadow-2xl shadow-black/60">
      <div className="flex items-center gap-2 border-b border-white/5 bg-neutral-900/80 px-2.5 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 flex-1 rounded-md bg-neutral-950/70 py-0.5 text-center text-[10px] text-neutral-400 ring-1 ring-white/5">
          northwind.app
        </span>
      </div>
      <DashboardContent />
    </div>
  );
}

// ---------- 3. iPhone mockup ----------

function IphoneMockup() {
  const transactions = [
    { name: "Spotify", amount: "-$9.99", color: "bg-emerald-400" },
    { name: "Figma", amount: "-$15.00", color: "bg-purple-400" },
    { name: "Payout", amount: "+$320.00", color: "bg-amber-400" },
    { name: "Linear", amount: "-$8.00", color: "bg-sky-400" },
  ];

  return (
    <div className="relative h-[310px] w-[151px]">
      {/* side buttons */}
      <span className="absolute -left-[2px] top-[73px] h-5 w-[3px] rounded-l-sm bg-neutral-600" />
      <span className="absolute -left-[2px] top-[100px] h-9 w-[3px] rounded-l-sm bg-neutral-600" />
      <span className="absolute -right-[2px] top-[88px] h-12 w-[3px] rounded-r-sm bg-neutral-600" />

      {/* titanium frame */}
      <div className="absolute inset-x-0 bottom-0 h-[95%] w-full rounded-[39px] bg-gradient-to-br from-neutral-600 via-neutral-800 to-neutral-950 p-[3px] shadow-2xl shadow-black/60 ring-1 ring-black/40">
        <div className="relative h-full w-full overflow-hidden rounded-[36px] bg-black">
          {/* status bar */}
          <div className="relative z-10 flex items-center justify-between px-5 pt-2.5">
            <span className="text-[9px] font-semibold text-white">9:41</span>
            <span className="flex items-center gap-[3px]">
              <span className="flex items-end gap-[1.5px]">
                <span className="h-[3px] w-[2px] rounded-sm bg-white" />
                <span className="h-[5px] w-[2px] rounded-sm bg-white" />
                <span className="h-[6px] w-[2px] rounded-sm bg-white" />
              </span>
              <span className="relative ml-1 h-[8px] w-[14px] rounded-[2.5px] border border-white/70">
                <span className="absolute inset-[1.5px] rounded-[1px] bg-white" />
              </span>
            </span>
          </div>

          {/* dynamic island */}
          <div className="absolute left-1/2 top-2 h-[19px] w-[73px] -translate-x-1/2 rounded-full bg-black ring-1 ring-white/5" />

          {/* app content */}
          <div className="px-2.5 pt-2.5">
            <div className="mb-1.5 flex items-center justify-between">
              <p className="text-[9px] font-semibold text-neutral-100">
                Wallet
              </p>
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            </div>

            <div className="rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 p-2 text-neutral-950">
              <p className="text-[6px] font-medium opacity-80">Balance</p>
              <p className="text-[11px] font-bold">$4,208.55</p>
              <p className="text-[6px] opacity-70">2.4% this week</p>
            </div>

            <div className="mt-1.5 flex gap-1">
              <span className="flex-1 rounded-md bg-neutral-100 py-1 text-center text-[6px] font-semibold text-neutral-950">
                Send
              </span>
              <span className="flex-1 rounded-md bg-neutral-800 py-1 text-center text-[6px] font-medium text-neutral-300 ring-1 ring-white/10">
                Request
              </span>
            </div>

            <div className="mt-1.5 space-y-1">
              {transactions.map((t) => (
                <div key={t.name} className="flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${t.color}`} />
                  <span className="flex-1 truncate text-[6px] text-neutral-300">
                    {t.name}
                  </span>
                  <span className="text-[6px] font-medium text-neutral-400">
                    {t.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* home indicator */}
          <div className="absolute bottom-1.5 left-1/2 h-[3px] w-[84px] -translate-x-1/2 rounded-full bg-white/40" />
        </div>
      </div>
    </div>
  );
}

// ---------- 4. Frosted glass mockup ----------

function GlassMockup() {
  return (
    <div className="relative w-[196px]">
      {/* colorful blobs that bleed through the glass via backdrop-blur */}
      <div className="absolute -inset-3 -z-10 overflow-hidden rounded-[30px]">
        <div className="absolute left-2 top-2 h-24 w-24 rounded-full bg-amber-400/70 blur-2xl" />
        <div className="absolute right-0 top-14 h-20 w-20 rounded-full bg-orange-500/50 blur-2xl" />
        <div className="absolute bottom-0 left-10 h-24 w-24 rounded-full bg-rose-400/30 blur-2xl" />
      </div>

      {/* the glass panel itself — neutral tint, real blur, thin bright edge */}
      <div className="relative overflow-hidden rounded-[22px] border border-white/25 bg-white/10 shadow-2xl shadow-black/40 backdrop-blur-2xl">
        {/* top sheen — brighter highlight along the top edge like real glass */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-[22px] bg-gradient-to-b from-white/25 via-white/5 to-transparent" />
        {/* inner hairline for edge definition */}
        <div className="pointer-events-none absolute inset-0 rounded-[22px] ring-1 ring-inset ring-white/10" />

        <div className="relative rounded-[19px] bg-neutral-950/30 m-1.5 ring-1 ring-white/10">
          <DashboardContent />
        </div>
      </div>
    </div>
  );
}

// ---------- feature grid ----------

const features = [
  {
    icon: Monitor,
    title: "Browser frame",
    desc: "Your own domain in the URL bar",
  },
  {
    icon: AppWindow,
    title: "macOS window",
    desc: "A title bar you can name",
  },
  {
    icon: Gem,
    title: "Frosted glass",
    desc: "A soft bezel that survives export",
  },
  {
    icon: Smartphone,
    title: "iPhone",
    desc: "Dynamic Island and all",
  },
  {
    icon: LaptopIcon,
    title: "Laptop",
    desc: "Lid, deck, and webcam dot",
  },
  {
    icon: MoveDiagonal,
    title: "Perspective tilt",
    desc: "Three axes, plus film grain",
  },
];

function FeatureCard({
  icon: Icon,
  title,
  desc,
}: {
  icon: typeof Monitor;
  title: string;
  desc: string;
}) {
  return (
    <motion.div
      variants={riseVariants}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="flex items-start gap-3 rounded-2xl border border-white/5 bg-neutral-900/40 p-4 transition-colors duration-300 hover:border-amber-400/40"
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

export default function MockupsSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-black px-6 py-24">
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
            <Monitor className="h-3.5 w-3.5" strokeWidth={2.5} />
            Mockups
          </motion.div>

          <motion.h2
            variants={riseVariants}
            className={` ${displayFont.className} text-4xl font-semibold tracking-tight text-neutral-50 sm:text-5xl`}
          >
            Every <span className="text-amber-400">shot,</span> in the{" "}
            <span className="text-amber-400">right frame</span>
          </motion.h2>

          <motion.p
            variants={riseVariants}
            className="mx-auto mt-4 max-w-xl text-balance text-base text-neutral-400 sm:text-lg"
          >
            Wrap the screenshot in real window chrome or a device body, then tip
            the whole thing into perspective.
          </motion.p>
        </motion.div>

        {/* preview panel */}
        <motion.div
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 30 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-[32px] border border-white/10 bg-neutral-900/40 p-6"
        >
          {/*
            Mobile (below sm): the desktop "scale the whole row down via a
            CSS calc + transform" trick doesn't have room to work on narrow
            phones (four fixed-width mockups can't shrink enough to fit
            without becoming illegible), which is what was clipping the
            iPhone/glass mockups out of view. Below sm we swap to a
            horizontally-scrollable, snap-aligned row instead — every
            mockup stays fully visible and reachable by swiping, nothing is
            cropped. Desktop (sm and up) keeps the original layout as-is.
          */}
          <div className="sm:hidden -mx-6 overflow-x-auto px-6 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <motion.div
              variants={containerVariants}
              initial={shouldReduceMotion ? undefined : "hidden"}
              animate="show"
              className="flex w-max snap-x snap-mandatory items-end gap-5"
            >
              {[
                { key: "laptop-m", el: <LaptopMockup />, w: 228, h: 228 },
                { key: "browser-m", el: <BrowserMockup />, w: 204, h: 210 },
                { key: "iphone-m", el: <IphoneMockup />, w: 151, h: 310 },
                { key: "glass-m", el: <GlassMockup />, w: 196, h: 193 },
              ].map(({ key, el, w, h }) => {
                const scale = 0.62;
                return (
                  <motion.div
                    key={key}
                    variants={riseVariants}
                    className="relative shrink-0 snap-center"
                    style={{ width: w * scale, height: h * scale }}
                  >
                    <div
                      className="absolute left-0 top-0"
                      style={{
                        width: w,
                        transform: `scale(${scale})`,
                        transformOrigin: "top left",
                      }}
                    >
                      {el}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Desktop / tablet (sm and up): unchanged single-row layout */}
          <div
            className="mx-auto hidden overflow-hidden sm:block"
            style={
              {
                "--row-scale":
                  "min(1, calc((min(100vw, 1024px) - 72px) / 880px))",
                height: "calc(340px * var(--row-scale))",
              } as React.CSSProperties
            }
          >
            <motion.div
              variants={containerVariants}
              initial={shouldReduceMotion ? undefined : "hidden"}
              whileInView={shouldReduceMotion ? undefined : "show"}
              viewport={{ once: true, margin: "-80px" }}
              style={{
                transform: "scale(var(--row-scale))",
                transformOrigin: "top center",
                width: "880px",
              }}
              className="mx-auto flex flex-nowrap items-end justify-center gap-6"
            >
              {[
                { key: "laptop", el: <LaptopMockup /> },
                { key: "browser", el: <BrowserMockup /> },
                { key: "iphone", el: <IphoneMockup /> },
                { key: "glass", el: <GlassMockup /> },
              ].map(({ key, el }) => (
                <motion.div
                  key={key}
                  variants={riseVariants}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="shrink-0"
                >
                  {el}
                </motion.div>
              ))}
            </motion.div>
          </div>
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
