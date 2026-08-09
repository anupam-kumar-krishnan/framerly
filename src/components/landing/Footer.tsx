import Link from "next/link";
import { Aperture } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-line-soft">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-amber text-amber-ink">
            <Aperture size={15} strokeWidth={2.5} />
          </span>
          <span className="font-display text-sm font-semibold">Framely</span>
        </Link>
        <p className="text-xs text-ink-faint">
          © {new Date().getFullYear()} Framerly. Built for people who ship
          screenshots.
        </p>
        <div className="flex gap-6 text-xs text-ink-dim">
          <a href="#" className="hover:text-ink">
            Privacy
          </a>
          <a href="#" className="hover:text-ink">
            Terms
          </a>
          <a href="#" className="hover:text-ink">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
