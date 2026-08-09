"use client";

import Link from "next/link";
import {
  Aperture,
  ChevronDown,
  Copy,
  Download,
  RotateCcw,
  Ruler,
  Grid3x3,
  Check,
} from "lucide-react";
import { useState } from "react";
import { ASPECTS, AspectRatio } from "./types";

export default function TopBar({
  aspect,
  onAspect,
  onCopy,
  onSave,
  onReset,
  showRulers,
  onToggleRulers,
  showGrid,
  onToggleGrid,
}: {
  aspect: AspectRatio;
  onAspect: (a: AspectRatio) => void;
  onCopy: () => void;
  onSave: () => void;
  onReset: () => void;
  showRulers: boolean;
  onToggleRulers: () => void;
  showGrid: boolean;
  onToggleGrid: () => void;
}) {
  const [aspectOpen, setAspectOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-line-soft bg-panel px-4">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-amber text-amber-ink">
            <Aperture size={15} strokeWidth={2.5} />
          </span>
          <span className="hidden font-display text-sm font-semibold sm:block">
            Framerly
          </span>
        </Link>

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
      </div>

      <div className="flex items-center gap-1 rounded-lg border border-line bg-panel-2 p-1">
        <button
          onClick={onReset}
          title="Reset to default"
          className="flex h-7 w-7 items-center justify-center rounded-md text-ink-faint transition hover:bg-panel hover:text-ink"
        >
          <RotateCcw size={14} />
        </button>
        <span className="mx-0.5 h-4 w-px bg-line-soft" />
        <button
          onClick={onToggleRulers}
          title="Toggle rulers"
          className={`flex h-7 w-7 items-center justify-center rounded-md transition hover:bg-panel ${
            showRulers ? "text-amber" : "text-ink-faint hover:text-ink"
          }`}
        >
          <Ruler size={14} />
        </button>
        <button
          onClick={onToggleGrid}
          title="Toggle grid"
          className={`flex h-7 w-7 items-center justify-center rounded-md transition hover:bg-panel ${
            showGrid ? "text-amber" : "text-ink-faint hover:text-ink"
          }`}
        >
          <Grid3x3 size={14} />
        </button>
      </div>

      <div className="flex items-center gap-2">
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
        <button
          onClick={onSave}
          className="flex items-center gap-1.5 rounded-md bg-amber px-3.5 py-1.5 text-xs font-medium text-amber-ink transition hover:bg-amber-soft"
        >
          <Download size={13} />
          Save
        </button>
      </div>
    </header>
  );
}
