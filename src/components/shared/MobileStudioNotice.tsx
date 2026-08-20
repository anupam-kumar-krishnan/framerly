import { Aperture } from "lucide-react";

export default function MobileStudioNotice() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-void text-ink">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(244,239,230,0.5) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="pointer-events-none absolute left-1/2 top-[18%] h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/25 blur-[80px]" />

      <div className="relative z-10 flex items-center gap-2 px-6 py-5">
        <span className="flex h-6 w-6 items-center justify-center rounded-[7px] bg-gradient-to-br from-amber-400 to-amber-600 text-xs font-extrabold text-void">
          <Aperture className="h-4 w-4" />
        </span>
        <span className="text-sm font-semibold tracking-tight">Framerly</span>
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-7 pb-14 text-center">
        <svg
          width="168"
          height="118"
          viewBox="0 0 168 118"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mb-7"
        >
          <rect
            x="1"
            y="1"
            width="166"
            height="116"
            rx="13"
            fill="rgba(244,239,230,0.025)"
            stroke="rgba(244,239,230,0.12)"
            strokeWidth="1.3"
          />
          <rect
            x="1"
            y="1"
            width="166"
            height="24"
            rx="13"
            fill="rgba(244,239,230,0.045)"
          />
          <circle cx="15" cy="13" r="3.2" fill="#f2711c" opacity="0.45" />
          <circle cx="26" cy="13" r="3.2" fill="#fbbf24" opacity="0.45" />
          <circle cx="37" cy="13" r="3.2" fill="#f4efe6" opacity="0.25" />
          <rect
            x="56"
            y="8.5"
            width="64"
            height="9"
            rx="4.5"
            fill="rgba(244,239,230,0.05)"
          />
          <rect
            x="14"
            y="36"
            width="140"
            height="70"
            rx="8"
            fill="rgba(244,239,230,0.02)"
            stroke="rgba(244,239,230,0.08)"
            strokeDasharray="4 4"
          />
          <text
            x="84"
            y="80"
            fontFamily="Inter, sans-serif"
            fontSize="22"
            fontWeight="700"
            textAnchor="middle"
            fill="url(#zgrad)"
          >
            z Z z
          </text>
          <defs>
            <linearGradient
              id="zgrad"
              x1="60"
              y1="60"
              x2="120"
              y2="95"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#fbbf24" />
              <stop offset="1" stopColor="#f2711c" />
            </linearGradient>
          </defs>
        </svg>

        <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-amber-300">
          <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-amber-400 to-amber-600" />
          Desktop only, for now
        </span>

        <h1 className="mb-3.5 max-w-76 text-[26px] font-bold leading-tight tracking-tight">
          The studio needs a{" "}
          <span className="bg-gradient-to-br from-amber-400 to-amber-500 bg-clip-text text-transparent">
            bigger canvas.
          </span>
        </h1>

        <p className="max-w-76 text-[14.5px] leading-relaxed text-ink/60">
          Framerly's drag, zoom, and export controls are built for a
          desktop-sized canvas — more room than a phone screen has to give. Pull
          this page up on your laptop to start framing.
        </p>
      </div>

      <div className="relative z-5 pb-20 text-center text-[11.5px] text-ink/40">
        Mobile support for the studio is{" "}
        <span className="text-ink/60 font-medium">coming soon.</span>
      </div>
    </div>
  );
}
