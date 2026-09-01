"use client";
import Link from "next/link";
import { Aperture } from "lucide-react";
import { useEffect, useState } from "react";

function GithubIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.09 3.29 9.4 7.86 10.93.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.24 2.75.12 3.04.74.81 1.18 1.84 1.18 3.1 0 4.43-2.7 5.41-5.27 5.69.42.36.78 1.07.78 2.15 0 1.56-.01 2.81-.01 3.19 0 .31.2.66.79.55A10.52 10.52 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
    </svg>
  );
}

function formatStarCount(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return `${n}`;
}

function GithubBadge({
  repo,
  stars,
  size = 20,
}: {
  repo?: string;
  stars?: number;
  size?: number;
}) {
  const [fetchedStars, setFetchedStars] = useState<number | null>(
    stars ?? null,
  );

  useEffect(() => {
    if (stars !== undefined || !repo) return;

    let cancelled = false;

    fetch(`https://api.github.com/repos/${repo}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data && typeof data.stargazers_count === "number") {
          setFetchedStars(data.stargazers_count);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [repo, stars]);

  if (!repo && stars === undefined) return null;

  const href = repo ? `https://github.com/${repo}` : undefined;
  const count = stars ?? fetchedStars;

  return (
    <Link
      href={href ?? "#"}
      target="_blank"
      rel="noopener noreferrer"
      title="Star on GitHub"
      className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-ink-dim transition hover:text-ink"
    >
      <GithubIcon size={size} />
      {count !== null && (
        <span className="font-mono text-base font-medium">
          {formatStarCount(count)}
        </span>
      )}
    </Link>
  );
}

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
        </nav>

        <div className="flex items-center gap-3">
          <GithubBadge repo="anupam-kumar-krishnan/framerly" size={18} />
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
