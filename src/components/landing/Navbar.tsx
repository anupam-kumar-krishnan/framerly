import Link from "next/link";
import { Aperture, Star } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-line-soft/80 bg-void/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-amber text-amber-ink">
            <Aperture size={18} strokeWidth={2.5} />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">
            Framerly
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-ink-dim md:flex">
          <a href="#gallery" className="transition hover:text-ink">
            Styles
          </a>
          <a href="#features" className="transition hover:text-ink">
            Features
          </a>
          {/* <a
            href="https://github.com"
            className="flex items-center gap-1.5 transition hover:text-ink"
          >
            <Star size={14} className="fill-amber text-amber" />
            <span className="font-mono text-xs">1,204</span>
          </a> */}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/app"
            className="rounded-full bg-amber px-4 py-2 text-sm font-medium text-amber-ink transition hover:bg-amber-soft"
          >
            Open studio
          </Link>
        </div>
      </div>
    </header>
  );
}
