"use client";

import { motion } from "framer-motion";
import { Image as ImageIcon, Wand2, Share2 } from "lucide-react";
import { Bricolage_Grotesque } from "next/font/google";

const displayFont = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
});

const steps = [
  {
    number: "01",
    icon: ImageIcon,
    title: "Add your screenshot",
    description:
      "Tap to pick one from your photos, drag and drop, or paste with Ctrl+V. PNG, JPG, and WebP all work.",
  },
  {
    number: "02",
    icon: Wand2,
    title: "Make it beautiful",
    description:
      "Pick a background, adjust padding and shadows, then annotate with arrows, text, or blur.",
  },
  {
    number: "03",
    icon: Share2,
    title: "Export and share",
    description:
      "Download your polished screenshot as a retina PNG, ready to share everywhere.",
  },
];

export default function ThreeStepsSection() {
  return (
    <section className="relative bg-[#0a0a0b] py-24 px-6 overflow-hidden">
      {/* ambient glow, consistent with the rest of the dark sections */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-15 blur-[120px]"
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
          <h2
            className={`${displayFont.className} text-4xl sm:text-5xl font-extrabold tracking-tight text-white text-balance`}
          >
            <span className="text-amber-400">Three steps.</span> That&apos;s it.
          </h2>
          <p className="mt-4 text-lg text-white/50">
            No accounts, no installs, no friction.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid gap-6 sm:grid-cols-3">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{ y: -4, borderColor: "rgba(245,166,35,0.35)" }}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm"
              >
                <div className="mb-8 flex items-start justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400">
                    <Icon className="h-5 w-5 text-black" strokeWidth={2.25} />
                  </span>
                  <span className="font-mono text-3xl font-bold text-white/10 select-none">
                    {step.number}
                  </span>
                </div>

                <h3 className="mb-2 text-lg font-semibold text-white">
                  {step.title}
                </h3>
                <p className="text-[15px] leading-relaxed text-white/50">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
