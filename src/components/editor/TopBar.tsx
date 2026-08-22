"use client";

import Link from "next/link";
import {
  Aperture,
  ChevronDown,
  Copy,
  Download,
  RotateCcw,
  Undo2,
  Redo2,
  Ruler,
  Grid3x3,
  Check,
  Wand2,
  Video,
  Trash2,
  Play,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ASPECTS, AspectRatio } from "./types";
import ExportPanel, { ExportOptions } from "./ExportPanel";

function ToolbarIconButton({
  onClick,
  title,
  active,
  disabled,
  children,
}: {
  onClick?: () => void;
  title: string;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`flex h-7 w-7 items-center justify-center rounded-md transition hover:bg-panel-2 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent ${
        active ? "text-amber" : "text-ink-faint hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

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
        <span className="font-mono  text-base font-medium">
          {formatStarCount(count)}
        </span>
      )}
    </Link>
  );
}

export default function TopBar({
  aspect,
  onAspect,
  onCopy,
  onSave,
  onReset,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  showRulers,
  onToggleRulers,
  showGrid,
  onToggleGrid,
  animateOpen,
  onToggleAnimate,
  templatesHref = "/templates",
  onExportVideo,
  onRemove,
  githubRepo,
  githubStars,
  githubIconSize,
}: {
  aspect: AspectRatio;
  onAspect: (a: AspectRatio) => void;
  onCopy: () => void;
  onSave: (options: ExportOptions) => void;
  onReset: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  showRulers: boolean;
  onToggleRulers: () => void;
  showGrid: boolean;
  onToggleGrid: () => void;

  animateOpen: boolean;
  onToggleAnimate: () => void;

  templatesHref?: string;

  onExportVideo?: () => void;

  onRemove?: () => void;

  githubRepo?: string;

  githubStars?: number;

  githubIconSize?: number;
}) {
  const [aspectOpen, setAspectOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-line-soft bg-panel px-4">
      <div className="flex items-center gap-5">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-amber text-amber-ink">
            <Aperture size={15} strokeWidth={2.5} />
          </span>
          <span className="hidden font-display text-sm font-semibold sm:block">
            Framerly
          </span>
        </Link>

        <span className="mx-1.5 h-4 w-px bg-line-soft" />

        <Link
          href={templatesHref}
          className="hidden items-center gap-1.5 text-xs text-ink-dim transition hover:text-ink md:flex"
        >
          <Wand2 size={13} />
          Templates
        </Link>
      </div>

      <div className="flex items-center gap-0.5">
        <ToolbarIconButton onClick={onUndo} disabled={!canUndo} title="Undo">
          <Undo2 size={14} />
        </ToolbarIconButton>
        <ToolbarIconButton onClick={onRedo} disabled={!canRedo} title="Redo">
          <Redo2 size={14} />
        </ToolbarIconButton>

        <span className="mx-1.5 h-4 w-px bg-line-soft" />

        <ToolbarIconButton
          onClick={onToggleRulers}
          active={showRulers}
          title="Toggle rulers"
        >
          <Ruler size={14} />
        </ToolbarIconButton>
        <ToolbarIconButton
          onClick={onToggleGrid}
          active={showGrid}
          title="Toggle grid"
        >
          <Grid3x3 size={14} />
        </ToolbarIconButton>

        <span className="mx-1.5 h-4 w-px bg-line-soft" />

        <button
          onClick={onToggleAnimate}
          title="Toggle animation timeline"
          className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition ${
            animateOpen
              ? "border-amber/60 bg-amber/10 text-amber"
              : "border-line text-ink-dim hover:border-ink-faint hover:text-ink"
          }`}
        >
          <Play size={13} />
          Animate
        </button>

        <span className="mx-1.5 h-4 w-px bg-line-soft" />

        <div className="relative">
          <button
            onClick={() => setAspectOpen((v) => !v)}
            className="flex items-center gap-1.5 rounded-md border border-line px-2.5 py-1.5 text-xs text-ink-dim transition hover:border-ink-faint hover:text-ink"
          >
            <span className="font-mono">{aspect}</span>
            <ChevronDown size={12} />
          </button>
          {aspectOpen && (
            <div className="absolute left-0 top-9 z-20 w-28 overflow-hidden rounded-lg border border-line bg-panel-2 shadow-xl">
              {(Object.keys(ASPECTS) as AspectRatio[]).map((a) => (
                <button
                  key={a}
                  onClick={() => {
                    onAspect(a);
                    setAspectOpen(false);
                  }}
                  className={`block w-full px-3 py-2 text-left font-mono text-xs transition hover:bg-panel ${
                    a === aspect ? "text-amber" : "text-ink-dim"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          )}
        </div>

        <span className="mx-1.5 h-4 w-px bg-line-soft" />

        <button
          onClick={() => {
            onCopy();
            setCopied(true);
            setTimeout(() => setCopied(false), 1400);
          }}
          className="flex items-center gap-1.5 rounded-md border border-line px-3 py-1.5 text-xs text-ink-dim transition hover:border-ink-faint hover:text-ink"
        >
          {copied ? (
            <Check size={13} className="text-success" />
          ) : (
            <Copy size={13} />
          )}
          {copied ? "Copied" : "Copy"}
        </button>

        <div className="relative ml-2">
          <button
            onClick={() => setExportOpen((v) => !v)}
            className="flex items-center gap-1.5 rounded-md bg-amber px-3.5 py-1.5 text-xs font-medium text-amber-ink transition hover:bg-amber-soft"
          >
            <Download size={13} />
            Save
          </button>

          {exportOpen && (
            <ExportPanel
              onExport={(options) => {
                onSave(options);
                setExportOpen(false);
              }}
              onClose={() => setExportOpen(false)}
            />
          )}
        </div>

        {onExportVideo && (
          <button
            onClick={onExportVideo}
            className="ml-2 flex items-center gap-1.5 rounded-md border border-line px-3 py-1.5 text-xs font-medium text-ink transition hover:border-ink-faint"
          >
            <Video size={13} />
            Export Video
          </button>
        )}

        <span className="mx-1.5 h-4 w-px bg-line-soft" />

        <ToolbarIconButton onClick={onReset} title="Reset to default">
          <RotateCcw size={14} />
        </ToolbarIconButton>

        {onRemove && (
          <button
            onClick={onRemove}
            className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs text-ink-faint transition hover:bg-panel-2 hover:text-red-400"
          >
            <Trash2 size={13} />
            Remove
          </button>
        )}
      </div>

      <div className="flex items-center">
        <GithubBadge
          repo={githubRepo}
          stars={githubStars}
          size={githubIconSize}
        />
      </div>
    </header>
  );
}
