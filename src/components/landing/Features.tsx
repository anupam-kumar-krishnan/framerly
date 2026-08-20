"use client";

import { motion } from "motion/react";
import type { Variants } from "motion/react";
import {
  Globe,
  Camera,
  Download,
  Image as ImageIcon,
  Droplet,
  Blend,
  Wand2,
  EyeOff,
} from "lucide-react";
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

const NOISE_URL =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const FRAME_CHIPS = [
  { label: "macOS", rotate: -7, x: -18 },
  { label: "Windows", rotate: 0, x: 0 },
  { label: "Arc", rotate: 7, x: 18 },
];

const STYLE_SWATCHES = ["Noise", "Solid", "Blur", "Grain", "Mesh"];

const SHADOW_TABS = ["None", "Soft", "Hard", "Long"];

const BG_OPTIONS = [
  { key: "image", label: "Image", icon: ImageIcon },
  { key: "solid", label: "Solid", icon: Droplet },
  { key: "gradient", label: "Gradient", icon: Blend },
  { key: "photo", label: "From photo", icon: Wand2 },
  { key: "none", label: "None", icon: EyeOff },
];

// One canvas fill per BG_OPTIONS entry, in the same order, so the swatch
// and the active chip stay in sync as they cycle.
const BG_CANVAS_FILLS = [
  "linear-gradient(135deg, #78716c 0%, #44403c 45%, #1c1917 100%)", // image
  "linear-gradient(180deg, #d6d3d1 0%, #78716c 100%)", // solid
  "linear-gradient(135deg, #fbbf24 0%, #b45309 60%, #451a03 100%)", // gradient
  "linear-gradient(135deg, #fbbf24 0%, #78716c 50%, #1c1917 100%)", // from photo
  "transparent", // none
];

export default function BentoFeatures() {
  return (
    <section id="features" className="bg-black px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="mb-14 max-w-lg"
        >
          <div className="mb-3 font-mono text-[12px] uppercase tracking-wider text-amber-400">
            In the studio
          </div>
          <h2
            className={`${displayFont.className} font-display text-[32px] font-semibold leading-tight text-white md:text-[38px]`}
          >
            Every control a <span className="text-amber-400">screenshot</span>{" "}
            actually needs.
          </h2>
          <p className="mt-3 text-[15px] text-neutral-400">
            Nothing you won&apos;t use. Nothing you have to fight to find.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-6 md:grid-flow-row-dense">
          <Tile
            eyebrow="Frames"
            title="Device Frames"
            desc="Browser, MacBook, iPhone, Glass."
            className="md:col-span-2"
          >
            <FramesIllustration />
          </Tile>

          <Tile
            eyebrow="Depth"
            title="3D Transforms"
            desc="Tilt and zoom presets for perspective that feels real."
            className="md:col-span-2"
          >
            <DepthIllustration />
          </Tile>

          <Tile
            eyebrow="Style"
            title="Beautiful Backdrops"
            desc="Gradient, solid, or image backgrounds tuned to sit behind the shot, not compete with it."
            className="md:col-span-2 md:row-span-2"
          >
            <StyleIllustration />
          </Tile>

          <Tile
            eyebrow="Layout"
            title="Shadow & Radius"
            desc="Independent controls for shadow depth, corner radius, and canvas padding."
            className="md:col-span-4"
          >
            <ShadowIllustration />
          </Tile>

          <Tile
            eyebrow="Export"
            title="High-Res Export"
            desc="PNG, sized for a tweet, a deck slide, or a 4K hero banner."
            className="md:col-span-2"
          >
            <ExportIllustration />
          </Tile>

          <Tile
            eyebrow="Capture"
            title="Capture by Link"
            desc="Paste a URL, choose light or dark, done."
            className="md:col-span-2"
          >
            <CaptureIllustration />
          </Tile>

          <Tile
            eyebrow="Canvas"
            title="Custom Backgrounds"
            desc="Upload your own image, drop in a solid color or gradient, lift a gradient straight from your photo, or go fully transparent."
            className="md:col-span-2"
          >
            <BackgroundIllustration />
          </Tile>
        </div>
      </div>
    </section>
  );
}

function Tile({
  eyebrow,
  title,
  desc,
  className = "",
  children,
}: {
  eyebrow: string;
  title: string;
  desc: string;
  className?: string;
  children: React.ReactNode;
}) {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty("--glow-x", `${x}%`);
    e.currentTarget.style.setProperty("--glow-y", `${y}%`);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty("--glow-intensity", "1");
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty("--glow-intensity", "0");
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeUp}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={
        {
          "--glow-x": "50%",
          "--glow-y": "50%",
          "--glow-intensity": 0,
          "--glow-radius": "260px",
        } as React.CSSProperties
      }
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-800/80 bg-neutral-950 p-6 ${className}`}
    >
      {/* soft interior wash — fades with --glow-intensity, tracks the cursor */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-500 ease-out"
        style={{
          opacity: "var(--glow-intensity)",
          background:
            "radial-gradient(var(--glow-radius) circle at var(--glow-x) var(--glow-y), rgba(251,191,36,0.10), transparent 70%)",
        }}
      />

      {/* masked ring — only the border stroke nearest the cursor lights up */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-500 ease-out"
        style={{
          opacity: "var(--glow-intensity)",
          padding: 1,
          background:
            "radial-gradient(var(--glow-radius) circle at var(--glow-x) var(--glow-y), rgba(251,191,36,0.95), transparent 70%)",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      <div className="relative z-10 mb-1 font-mono text-[11px] uppercase tracking-widest text-neutral-500">
        {eyebrow}
      </div>

      <div className="relative z-10 my-6 flex flex-1 items-center justify-center overflow-hidden">
        {children}
      </div>

      <h3 className="relative z-10 text-[15.5px] font-semibold text-white">
        {title}
      </h3>
      <p className="relative z-10 mt-2 text-[13.5px] leading-relaxed text-neutral-400">
        {desc}
      </p>
    </motion.div>
  );
}

function FramesIllustration() {
  return (
    <div className="relative flex h-28 w-full items-center justify-center">
      {FRAME_CHIPS.map(({ label, rotate, x }, i) => (
        <motion.div
          key={label}
          initial={{ rotate, x }}
          animate={{
            y: [0, i === 1 ? -6 : 0, 0],
            boxShadow: [
              "0 12px 24px -8px rgba(0,0,0,0.6)",
              i === 1
                ? "0 16px 32px -6px rgba(251,191,36,0.25)"
                : "0 12px 24px -8px rgba(0,0,0,0.6)",
              "0 12px 24px -8px rgba(0,0,0,0.6)",
            ],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
          style={{ rotate, x, zIndex: i === 1 ? 10 : 5 - i }}
          className="absolute h-16 w-24 overflow-hidden rounded-lg border border-neutral-800 bg-gradient-to-b from-neutral-800 to-neutral-900"
        >
          <div className="flex h-full flex-col justify-between p-2">
            <div className="flex gap-1">
              <span className="h-1 w-1 rounded-full bg-neutral-600" />
              <span className="h-1 w-1 rounded-full bg-neutral-600" />
              <span className="h-1 w-1 rounded-full bg-neutral-600" />
            </div>
            <span className="self-start rounded-sm bg-black/40 px-1 py-0.5 text-[7px] font-medium uppercase tracking-wide text-neutral-400">
              {label}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function DepthIllustration() {
  return (
    <div
      className="flex items-center justify-center"
      style={{ perspective: 700 }}
    >
      <motion.div
        animate={{ rotateY: [-16, 16, -16], rotateX: [7, -5, 7] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative h-20 w-32 overflow-hidden rounded-xl border border-neutral-800 bg-gradient-to-br from-neutral-800 via-neutral-850 to-neutral-950 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.8)]"
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(115deg, rgba(255,255,255,0.08) 0%, transparent 35%)",
          }}
        />
        <div className="flex h-full w-full flex-col justify-between p-3">
          <div className="flex gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-neutral-600" />
            <span className="h-1.5 w-1.5 rounded-full bg-neutral-600" />
            <span className="h-1.5 w-1.5 rounded-full bg-neutral-600" />
          </div>
          <div className="h-8 w-14 self-end rounded-md bg-amber-400/25 shadow-[0_0_16px_rgba(251,191,36,0.3)]" />
        </div>
      </motion.div>
    </div>
  );
}

function StyleIllustration() {
  // Duplicate the list so the strip can loop seamlessly: once the first
  // copy has scrolled fully out of view, the second copy is in the exact
  // position the first one started in, so the loop point is invisible.
  const loopSwatches = [...STYLE_SWATCHES, ...STYLE_SWATCHES];

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
        maskImage:
          "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
      }}
    >
      <motion.div
        className="flex items-center gap-2.5"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
      >
        {loopSwatches.map((label, i) => (
          <div
            key={`${label}-${i}`}
            className="relative aspect-[3/4] w-24 shrink-0 overflow-hidden rounded-xl border border-neutral-800"
          >
            <SwatchTexture kind={label} />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 pt-6">
              <span className="text-[9px] font-medium uppercase tracking-wide text-neutral-200">
                {label}
              </span>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function SwatchTexture({ kind }: { kind: string }) {
  if (kind === "Noise") {
    return (
      <div
        className="h-full w-full bg-neutral-800"
        style={{
          backgroundImage: NOISE_URL,
          backgroundSize: "120px 120px",
          opacity: 0.9,
          filter: "contrast(1.1) brightness(0.7)",
        }}
      />
    );
  }
  if (kind === "Solid") {
    return (
      <div className="h-full w-full bg-gradient-to-br from-neutral-600 to-neutral-800" />
    );
  }
  if (kind === "Blur") {
    return (
      <div className="relative h-full w-full overflow-hidden bg-neutral-900">
        <div
          className="absolute -inset-4 blur-2xl"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(251,191,36,0.5), transparent 60%), radial-gradient(circle at 70% 70%, rgba(120,113,108,0.6), transparent 60%)",
          }}
        />
      </div>
    );
  }
  if (kind === "Grain") {
    return (
      <div
        className="h-full w-full bg-gradient-to-b from-neutral-700 to-neutral-900"
        style={{
          backgroundImage: `${NOISE_URL}, linear-gradient(to bottom, #404040, #171717)`,
          backgroundSize: "100px 100px, 100% 100%",
          backgroundBlendMode: "overlay",
        }}
      />
    );
  }
  // Mesh
  return (
    <div
      className="h-full w-full"
      style={{
        background:
          "radial-gradient(at 25% 20%, rgba(251,191,36,0.4), transparent 50%), radial-gradient(at 80% 30%, rgba(120,113,108,0.5), transparent 55%), radial-gradient(at 50% 85%, rgba(0,0,0,0.9), transparent 60%), #171717",
      }}
    />
  );
}

function ShadowIllustration() {
  const glow = [
    "0 0px 0px rgba(251,191,36,0)",
    "0 8px 18px -4px rgba(251,191,36,0.35)",
    "4px 4px 0 0 rgba(251,191,36,0.4)",
    "0 12px 10px -6px rgba(251,191,36,0.4)",
  ];
  return (
    <div className="flex items-center gap-6">
      {SHADOW_TABS.map((label, i) => (
        <div key={label} className="flex flex-col items-center gap-2.5">
          <motion.div
            animate={{ boxShadow: ["0 0px 0px rgba(251,191,36,0)", glow[i]] }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: i * 0.3,
            }}
            className="h-10 w-14 rounded-lg border border-neutral-800"
            style={{
              backgroundImage: "linear-gradient(to bottom, #3f3f3f, #1c1c1c)",
            }}
          />
          <span className="text-[9px] uppercase tracking-wide text-neutral-600">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

function ExportIllustration() {
  return (
    <div className="flex items-center gap-5">
      <div className="relative flex h-14 w-14 items-center justify-center">
        <div
          className="absolute inset-0 rounded-full opacity-40 blur-lg"
          style={{ background: "rgba(251,191,36,0.6)" }}
        />
        <motion.div
          animate={{ scale: [1, 1.06, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="relative flex h-12 w-12 items-center justify-center rounded-full border border-amber-400/50 bg-gradient-to-b from-amber-400/20 to-amber-400/5 text-amber-400"
        >
          <Download size={18} strokeWidth={2.2} />
        </motion.div>
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="rounded-full border border-neutral-800 bg-gradient-to-b from-neutral-900 to-neutral-950 px-2.5 py-1 text-[10px] text-neutral-400">
          PNG · 2x
        </span>
        <span className="rounded-full border border-neutral-800 bg-gradient-to-b from-neutral-900 to-neutral-950 px-2.5 py-1 text-[10px] text-neutral-400">
          PNG · 5x
        </span>
      </div>
    </div>
  );
}

function CaptureIllustration() {
  return (
    <div className="flex w-full max-w-[220px] items-center gap-2 rounded-lg border border-neutral-800 bg-gradient-to-b from-neutral-900 to-neutral-950 px-3 py-2.5 shadow-[0_8px_20px_-8px_rgba(0,0,0,0.6)]">
      <Globe size={13} className="shrink-0 text-neutral-600" />
      <motion.span
        className="h-1.5 flex-1 rounded-full bg-neutral-700"
        animate={{ scaleX: [0.2, 1, 0.2] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "left" }}
      />
      <motion.div
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <Camera size={13} className="text-amber-400" />
      </motion.div>
    </div>
  );
}

function BackgroundIllustration() {
  // A checkerboard base (so "None"/transparent has something to show against),
  // with a fill that cycles through image / solid / gradient / from-photo /
  // transparent, timed to match the icon row highlighting below it.
  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="relative h-14 w-24 overflow-hidden rounded-lg border border-neutral-800"
        style={{
          backgroundImage:
            "linear-gradient(45deg, #262626 25%, transparent 25%), linear-gradient(-45deg, #262626 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #262626 75%), linear-gradient(-45deg, transparent 75%, #262626 75%)",
          backgroundSize: "10px 10px",
          backgroundPosition: "0 0, 0 5px, 5px -5px, -5px 0px",
          backgroundColor: "#171717",
        }}
      >
        <motion.div
          className="absolute inset-0"
          animate={{ backgroundImage: BG_CANVAS_FILLS }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.2, 0.4, 0.6, 0.8],
          }}
        />
      </div>

      <div className="flex items-center gap-1 rounded-full border border-neutral-800 bg-neutral-900/80 px-1.5 py-1.5">
        {BG_OPTIONS.map(({ key, icon: Icon }, i) => (
          <motion.div
            key={key}
            animate={{
              backgroundColor: [
                "rgba(251,191,36,0)",
                "rgba(251,191,36,0.18)",
                "rgba(251,191,36,0)",
              ],
              color: ["#737373", "#fbbf24", "#737373"],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 2,
            }}
            className="flex h-6 w-6 items-center justify-center rounded-full"
          >
            <Icon size={12} strokeWidth={2.2} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
