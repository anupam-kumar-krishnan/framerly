import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import FrameStack from "./FrameStack";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="grain" />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-150"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% -10%, rgba(232,163,61,0.18), transparent)",
        }}
      />
      <div className="mx-auto grid max-w-6xl items-center gap-16 px-6 pb-20 pt-16 lg:grid-cols-2 lg:pb-28 lg:pt-24">
        <div className="relative z-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-panel px-3 py-1 text-xs text-ink-dim">
            <Sparkles size={12} className="text-amber" />
            <span className="font-mono">Now with 3D tilt</span>
          </div>

          <h1 className="font-display text-[2.6rem] font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            Plain screenshots
            <br />
            <span className="text-ink-dim">walk into the studio.</span>
            <br />
            <span className="relative inline-block">
              Portfolio shots
              <span className="absolute -bottom-1 left-0 h-1.5 w-full rounded-full bg-amber/70" />
            </span>{" "}
            walk out.
          </h1>

          <p className="mt-6 max-w-md text-lg text-ink-dim">
            Drop in any screenshot. Framerly wraps it in a browser or device
            frame, sets the backdrop, casts the shadow, and hands back a PNG
            ready for your landing page, deck, or tweet.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/app"
              className="group flex items-center gap-2 rounded-full bg-amber px-6 py-3 font-medium text-amber-ink transition hover:bg-amber-soft"
            >
              Open the studio
              <ArrowRight
                size={16}
                className="transition group-hover:translate-x-0.5"
              />
            </Link>
            <a
              href="#gallery"
              className="rounded-full border border-line px-6 py-3 font-medium text-ink transition hover:border-ink-faint hover:bg-panel"
            >
              See the styles
            </a>
          </div>

          <p className="mt-6 text-sm text-ink-faint">
            No account needed to try it. Free for up to 20 exports a month.
          </p>
        </div>

        <FrameStack />
      </div>
    </section>
  );
}
