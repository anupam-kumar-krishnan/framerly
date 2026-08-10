"use client";

import { useState } from "react";
import { SlidersHorizontal, Palette, Layers, ChevronDown } from "lucide-react";
import BrowserFrame, { FrameStyle } from "@/components/shared/BrowserFrame";
import FakeScreen from "@/components/shared/FakeScreen";
import { BACKGROUND_GROUPS, BackgroundPreset, ShadowPreset } from "./types";
import { Code2 } from "lucide-react"; // add to your lucide-react import line
import CodeSnippetPanel from "./CodeSnippetPanel";
import { CodeSnippetState } from "./types";
import { LayerItem } from "./types";
import LayersPanel from "./LayersPanel";

const STYLES: { id: FrameStyle; label: string }[] = [
  { id: "safari-light", label: "Safari" },
  { id: "safari-dark", label: "Safari Dark" },
  { id: "chrome-light", label: "Chrome" },
  { id: "chrome-dark", label: "Chrome Dark" },
];

const SHADOWS: { id: ShadowPreset; label: string }[] = [
  { id: "none", label: "None" },
  { id: "soft", label: "Soft" },
  { id: "hard", label: "Hard" },
  { id: "long", label: "Long" },
];

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-line-soft py-5 first:pt-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-xs font-semibold uppercase tracking-widest text-ink-dim"
      >
        {title}
        <span className="text-ink-faint">{open ? "–" : "+"}</span>
      </button>
      {open && <div className="mt-4">{children}</div>}
    </div>
  );
}

function BackgroundGroupSection({
  title,
  presets,
  selectedId,
  onSelect,
}: {
  title: string;
  presets: BackgroundPreset[];
  selectedId: string;
  onSelect: (b: BackgroundPreset) => void;
}) {
  const [open, setOpen] = useState(true);
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
        {title}
      </button>
      {open && (
        <div className="mt-3 grid grid-cols-4 gap-2.5">
          {presets.map((p) => (
            <button
              key={p.id}
              onClick={() => onSelect(p)}
              title={p.label}
              aria-label={p.label}
              className={`aspect-square rounded-xl border-2 transition ${
                selectedId === p.id
                  ? "border-amber"
                  : "border-transparent hover:border-line"
              }`}
              style={
                p.image
                  ? {
                      backgroundImage: `url(${p.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }
                  : { background: p.css }
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function LeftPanel({
  frameStyle,
  onFrameStyle,
  url,
  onUrl,
  headerSize,
  onHeaderSize,
  shadow,
  onShadow,
  background,
  onBackground,
  radius,
  onRadius,
  codeSnippet,
  onCodeSnippet,
  onAddCodeToCanvas,
  layers,
  onLayers,
  onDeleteLayer,
}: {
  frameStyle: FrameStyle;
  onFrameStyle: (s: FrameStyle) => void;
  url: string;
  onUrl: (u: string) => void;
  headerSize: number;
  onHeaderSize: (n: number) => void;
  shadow: ShadowPreset;
  onShadow: (s: ShadowPreset) => void;
  background: BackgroundPreset;
  onBackground: (b: BackgroundPreset) => void;
  radius: number;
  onRadius: (n: number) => void;
  codeSnippet: CodeSnippetState;
  onCodeSnippet: (s: CodeSnippetState) => void;
  onAddCodeToCanvas: () => void;
  layers: LayerItem[];
  onLayers: (l: LayerItem[]) => void;
  onDeleteLayer: (id: LayerItem["id"]) => void;
}) {
  const [tab, setTab] = useState<"design" | "background" | "code" | "layers">(
    "design",
  );

  return (
    <aside className="flex w-72 shrink-0 flex-col border-r border-line-soft bg-panel">
      <div className="flex items-center gap-1 border-b border-line-soft p-3">
        {[
          { id: "design" as const, icon: SlidersHorizontal, label: "Design" },
          { id: "background" as const, icon: Palette, label: "Background" },
          { id: "code" as const, icon: Code2, label: "Code" },
          { id: "layers" as const, icon: Layers, label: "Layers" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-xs font-medium transition ${
              tab === t.id
                ? "bg-panel-2 text-ink"
                : "text-ink-faint hover:text-ink-dim"
            }`}
          >
            <t.icon size={14} />
            {tab === t.id && t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-none px-4 py-4">
        {tab === "design" && (
          <>
            <Section title="Style">
              <div className="grid grid-cols-2 gap-3">
                {STYLES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => onFrameStyle(s.id)}
                    className={`overflow-hidden rounded-lg border-2 text-left transition ${
                      frameStyle === s.id
                        ? "border-amber"
                        : "border-transparent hover:border-line"
                    }`}
                  >
                    <div className="pointer-events-none scale-100">
                      <BrowserFrame style={s.id} className="rounded-md">
                        <FakeScreen
                          tone={s.id.endsWith("dark") ? "amber" : "mono"}
                        />
                      </BrowserFrame>
                    </div>
                    <p className="mt-1.5 px-0.5 text-[11px] text-ink-dim">
                      {s.label}
                    </p>
                  </button>
                ))}
              </div>
            </Section>

            <Section title="URL">
              <input
                value={url}
                onChange={(e) => onUrl(e.target.value)}
                placeholder="yoursite.com"
                className="w-full rounded-md border border-line bg-panel-2 px-3 py-2 font-mono text-xs text-ink outline-none focus:border-amber"
              />
            </Section>

            <Section title="Header size">
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={60}
                  max={140}
                  value={headerSize}
                  onChange={(e) => onHeaderSize(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="w-10 text-right font-mono text-xs text-ink-dim">
                  {headerSize}%
                </span>
              </div>
            </Section>

            <Section title="Corner radius">
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={48}
                  value={radius}
                  onChange={(e) => onRadius(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="w-10 text-right font-mono text-xs text-ink-dim">
                  {radius}px
                </span>
              </div>
            </Section>

            <Section title="Shadow">
              <div className="grid grid-cols-4 gap-2">
                {SHADOWS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => onShadow(s.id)}
                    title={s.label}
                    className={`flex h-12 items-center justify-center rounded-lg border-2 bg-panel-2 transition ${
                      shadow === s.id
                        ? "border-amber"
                        : "border-transparent hover:border-line"
                    }`}
                  >
                    <div
                      className="h-5 w-6 rounded-sm bg-ink-dim"
                      style={{
                        boxShadow:
                          s.id === "none"
                            ? "none"
                            : s.id === "soft"
                              ? "0 6px 10px -3px rgba(0,0,0,0.6)"
                              : s.id === "hard"
                                ? "3px 3px 0 0 rgba(0,0,0,0.6)"
                                : "0 8px 6px -4px rgba(0,0,0,0.7)",
                      }}
                    />
                  </button>
                ))}
              </div>
            </Section>
          </>
        )}

        {tab === "background" && (
          <div className="space-y-1">
            {BACKGROUND_GROUPS.map((group) => (
              <BackgroundGroupSection
                key={group.title}
                title={group.title}
                presets={group.presets}
                selectedId={background.id}
                onSelect={onBackground}
              />
            ))}
          </div>
        )}

        {tab === "layers" && (
          <LayersPanel
            layers={layers}
            onLayers={onLayers}
            onDeleteLayer={onDeleteLayer}
          />
        )}

        {tab === "code" && (
          <CodeSnippetPanel
            snippet={codeSnippet}
            onSnippet={onCodeSnippet}
            onAddToCanvas={onAddCodeToCanvas}
          />
        )}
      </div>
    </aside>
  );
}
