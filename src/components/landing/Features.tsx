"use client";

import { motion, Variants } from "framer-motion";
import { Frame, Palette, Layers, Download, Link2 } from "lucide-react";
import { Bricolage_Grotesque } from "next/font/google";

const displayFont = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
});

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] },
  },
};

export default function BentoFeatures() {
  return (
    <section id="features" className="px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="mb-14 max-w-lg"
        >
          <div className="mb-3 font-mono text-[12px] uppercase tracking-wider text-accent-2">
            In the studio
          </div>
          <h2
            className={`${displayFont.className} font-display text-[32px] font-semibold leading-tight md:text-[38px]`}
          >
            Every control a <span className="text-amber-400">screenshot</span>{" "}
            actually needs.
          </h2>
          <p className="mt-3 text-[15px] text-text-dim">
            Nothing you won&apos;t use. Nothing you have to fight to find.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
          {/* large tile: live tilt demo */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="group relative col-span-1 row-span-2 overflow-hidden rounded-2xl border border-border bg-surface p-7 md:col-span-3"
          >
            <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-lg bg-grad-accent text-[#160c04]">
              <Frame size={18} strokeWidth={2.4} />
            </div>
            <h3 className="text-[17px] font-semibold">3D tilt and zoom</h3>
            <p className="mt-2 max-w-xs text-[13.5px] leading-relaxed text-text-dim">
              Angle the frame in space and dial the zoom until the composition
              feels intentional, not centered by default.
            </p>
            <div className="mt-8 flex items-center justify-center perspective-[900px]">
              <motion.div
                animate={{ rotateY: [-14, 14, -14], rotateX: [6, -4, 6] }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{ transformStyle: "preserve-3d" }}
                className="h-40 w-64 rounded-xl bg-grad-studio shadow-2xl shadow-black/60"
              >
                <div className="flex h-full w-full flex-col justify-between rounded-xl border border-white/15 p-4">
                  <div className="flex gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-white/60" />
                    <span className="h-2 w-2 rounded-full bg-white/60" />
                    <span className="h-2 w-2 rounded-full bg-white/60" />
                  </div>
                  <div className="h-16 self-end w-24 rounded-md bg-white/25 backdrop-blur" />
                </div>
              </motion.div>
            </div>
          </motion.div>

          <FeatureTile
            icon={<Palette size={17} strokeWidth={2.4} />}
            title="Backdrops that don't fight the shot"
            desc="Gradient, solid, or image backgrounds tuned to sit behind your screenshot, not compete with it."
            className="md:col-span-3"
          />
          <FeatureTile
            icon={<Layers size={17} strokeWidth={2.4} />}
            title="Layered shadow and padding"
            desc="Independent controls for shadow depth, corner radius, and canvas padding."
            className="md:col-span-3"
          />
          <FeatureTile
            icon={<Download size={17} strokeWidth={2.4} />}
            title="Export at any size"
            desc="PNG or SVG, sized for a tweet, a deck slide, or a 4K hero banner."
            className="md:col-span-2"
          />
          <FeatureTile
            icon={<Link2 size={17} strokeWidth={2.4} />}
            title="Link to capture screenshot through link"
            desc="Generate screenshot using product link with option to change theme dark/light"
            className="md:col-span-4"
          />
        </div>
      </div>
    </section>
  );
}

function FeatureTile({
  icon,
  title,
  desc,
  className = "",
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeUp}
      whileHover={{ y: -4 }}
      className={`rounded-2xl border border-border bg-surface p-6 transition-colors hover:bg-surface-2 ${className}`}
    >
      <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-grad-accent text-[#160c04]">
        {icon}
      </div>
      <h3 className="text-[15.5px] font-semibold">{title}</h3>
      <p className="mt-2 text-[13.5px] leading-relaxed text-text-dim">{desc}</p>
    </motion.div>
  );
}
