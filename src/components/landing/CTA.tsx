import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Bricolage_Grotesque } from "next/font/google";

const displayFont = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
});

export default function CTA() {
  return (
    <section className="relative overflow-hidden border-t border-line-soft">
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[400px]"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 100%, rgba(232,163,61,0.16), transparent)",
        }}
      />
      <div className="relative mx-auto max-w-3xl px-6 py-28 text-center">
        <h2
          className={`${displayFont.className} text-3xl font-semibold tracking-tight sm:text-5xl`}
        >
          Your next <span className="text-amber-400">screenshot</span> deserves
          <br /> better <span className="text-amber-400">lighting.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-md text-ink-dim">
          Open the studio, drop in an image, and see it framed in under ten
          seconds. No sign-up required to try it out.
        </p>
        <Link
          href="/app"
          className="group mt-9 inline-flex items-center gap-2 rounded-full bg-amber px-7 py-3.5 font-medium text-amber-ink transition hover:bg-amber-soft"
        >
          Open the studio
          <ArrowRight
            size={16}
            className="transition group-hover:translate-x-0.5"
          />
        </Link>
      </div>
    </section>
  );
}
