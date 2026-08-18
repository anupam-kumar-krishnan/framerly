"use client";

import { useState } from "react";
import { ChevronDown, List, PanelTop, Minus } from "lucide-react";
import CodeBlock from "./CodeBlock";
import { CODE_FONTS, CODE_LANGUAGES, CodeSnippetState } from "./types";

// Fills the track behind the thumb, same look as the Header Size slider.
function rangeFillStyle(value: number, min: number, max: number) {
  const pct = ((value - min) / (max - min)) * 100;
  return {
    background: `linear-gradient(to right, #9a9aa5 ${pct}%, #2a2a30 ${pct}%)`,
  };
}

const THEME_OPTIONS: { id: CodeSnippetState["theme"]; label: string }[] = [
  { id: "dracula", label: "Dracula" },
  { id: "oneDark", label: "One Dark" },
  { id: "nightOwl", label: "Night Owl" },
  { id: "okaidia", label: "Okaidia" },
  { id: "solarizedlight", label: "Solarized Light" },
  { id: "vs", label: "VS Light" },
];

export default function CodeSnippetPanel({
  snippet,
  onSnippet,
  onAddToCanvas,
}: {
  snippet: CodeSnippetState;
  onSnippet: (s: CodeSnippetState) => void;
  onAddToCanvas: () => void;
}) {
  const [open, setOpen] = useState(true);

  const patch = (p: Partial<CodeSnippetState>) =>
    onSnippet({ ...snippet, ...p });

  return (
    <div className="border-b border-line-soft py-4 first:pt-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-ink-dim"
      >
        <ChevronDown
          size={13}
          className={`text-ink-faint transition-transform ${open ? "" : "-rotate-90"}`}
        />
        Add code
      </button>

      {open && (
        <div className="mt-3 space-y-3">
          <textarea
            value={snippet.code}
            onChange={(e) => patch({ code: e.target.value })}
            rows={6}
            spellCheck={false}
            placeholder="Paste your code..."
            className="w-full resize-y rounded-lg border border-line bg-panel-2 px-3 py-2 font-mono text-xs text-ink outline-none focus:border-amber"
          />

          <div className="grid grid-cols-2 gap-2">
            <select
              value={snippet.theme}
              onChange={(e) =>
                patch({ theme: e.target.value as CodeSnippetState["theme"] })
              }
              className="rounded-md border border-line bg-panel-2 px-2 py-2 text-xs text-ink outline-none"
            >
              {THEME_OPTIONS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>

            <select
              value={snippet.language}
              onChange={(e) => patch({ language: e.target.value })}
              className="rounded-md border border-line bg-panel-2 px-2 py-2 text-xs text-ink outline-none"
            >
              {CODE_LANGUAGES.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() =>
                patch({ showLineNumbers: !snippet.showLineNumbers })
              }
              className={`flex items-center justify-center gap-1.5 rounded-md border py-2 text-xs font-medium transition ${
                snippet.showLineNumbers
                  ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-400"
                  : "border-line bg-panel-2 text-ink-dim hover:border-line"
              }`}
            >
              <List size={13} />
              Lines
            </button>
            <button
              onClick={() =>
                patch({ showWindowChrome: !snippet.showWindowChrome })
              }
              className={`flex items-center justify-center gap-1.5 rounded-md border py-2 text-xs font-medium transition ${
                snippet.showWindowChrome
                  ? "border-line bg-panel-2 text-ink"
                  : "border-line bg-panel-2 text-ink-dim"
              }`}
            >
              <PanelTop size={13} />
              Window
            </button>
            <button
              onClick={() => patch({ compact: !snippet.compact })}
              className={`flex items-center justify-center gap-1.5 rounded-md border py-2 text-xs font-medium transition ${
                snippet.compact
                  ? "border-line bg-panel-2 text-ink"
                  : "border-line bg-panel-2 text-ink-dim"
              }`}
            >
              <Minus size={13} />
              Less
            </button>
          </div>

          <select
            value={snippet.font}
            onChange={(e) => patch({ font: e.target.value })}
            className="w-full rounded-md border border-line bg-panel-2 px-2 py-2 text-xs text-ink outline-none"
          >
            {CODE_FONTS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>

          <div>
            <div className="mb-1.5 flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-ink-dim">
              Font size
              <span className="font-mono text-[11px] normal-case text-ink-dim">
                {snippet.fontSize || 14}px
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={28}
              value={snippet.fontSize || 14}
              onChange={(e) => patch({ fontSize: Number(e.target.value) })}
              className="w-full"
              style={rangeFillStyle(snippet.fontSize || 14, 10, 28)}
            />
          </div>

          {/* <div className="overflow-hidden rounded-lg">
            <CodeBlock snippet={snippet} />
          </div> */}

          <button
            onClick={onAddToCanvas}
            className="w-full rounded-lg bg-emerald-500 py-2.5 text-sm font-semibold text-black transition hover:bg-emerald-400"
          >
            Add to Canvas
          </button>
        </div>
      )}
    </div>
  );
}
