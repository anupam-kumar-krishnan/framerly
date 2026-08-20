"use client";

import { useState } from "react";
import {
  SlidersHorizontal,
  Palette,
  Layers,
  ChevronDown,
  Shuffle,
  Sun,
  Moon,
  Smartphone,
  Laptop,
  Globe,
  Sparkles,
  Square,
} from "lucide-react";
import BrowserFrame, { FrameStyle } from "@/components/shared/BrowserFrame";
import DeviceFrame from "@/components/shared/DeviceFrame";
import FakeScreen from "@/components/shared/FakeScreen"; // adjust path to match your project
import {
  BACKGROUND_GROUPS,
  BackgroundPreset,
  ShadowPreset,
  DeviceType,
} from "./types";
import { Code2 } from "lucide-react"; // add to your lucide-react import line
import CodeSnippetPanel from "./CodeSnippetPanel";
import { CodeSnippetState } from "./types";
import { LayerItem } from "./types";
import LayersPanel from "./LayersPanel";
import CustomBackgroundSection from "./CustomBackgroundSection";

const DEVICES: { id: DeviceType; label: string; icon: typeof Smartphone }[] = [
  { id: "none", label: "None", icon: Square },
  { id: "browser", label: "Browser", icon: Globe },
  { id: "macbook", label: "MacBook", icon: Laptop },
  { id: "iphone", label: "iPhone", icon: Smartphone },
  { id: "glass", label: "Glass", icon: Sparkles },
];

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

export type PageTheme = "light" | "dark";

const SCROLLABLE_GROUPS = new Set(["Gradients", "Pattern"]);

function rangeFillStyle(value: number, min: number, max: number) {
  const pct = ((value - min) / (max - min)) * 100;
  return {
    background: `linear-gradient(to right, var(--ink-dim) ${pct}%, var(--line) ${pct}%)`,
  };
}

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

function CollapsibleSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
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
      {open && <div className="mt-3">{children}</div>}
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
  const scrollable = SCROLLABLE_GROUPS.has(title);
  const shufflable = title === "Gradients";

  const handleShuffle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (presets.length === 0) return;
    const choices =
      presets.length > 1 ? presets.filter((p) => p.id !== selectedId) : presets;
    const pick = choices[Math.floor(Math.random() * choices.length)];
    onSelect(pick);
  };

  return (
    <div className="border-b border-line-soft py-4 first:pt-0">
      <div className="flex w-full items-center justify-between">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex flex-1 items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-ink-dim"
        >
          <ChevronDown
            size={13}
            className={`text-ink-faint transition-transform ${open ? "" : "-rotate-90"}`}
          />
          {title}
        </button>
        {shufflable && (
          <button
            onClick={handleShuffle}
            title="Shuffle gradient"
            aria-label="Shuffle gradient"
            className="rounded-md p-1 text-ink-faint transition hover:text-ink hover:bg-panel-2"
          >
            <Shuffle size={13} />
          </button>
        )}
      </div>
      {open &&
        (scrollable ? (
          <div className="mt-3 -mx-4 px-4">
            <div
              className="grid grid-rows-2 grid-flow-col auto-cols-[56px] gap-2.5 overflow-x-auto pb-1 snap-x snap-mandatory scrollbar-none"
              style={{ scrollbarWidth: "none" }}
            >
              {presets.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onSelect(p)}
                  title={p.label}
                  aria-label={p.label}
                  className={`h-14 w-14 shrink-0 rounded-xl border-2 snap-start transition ${
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
          </div>
        ) : (
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
        ))}
    </div>
  );
}

const THUMB_BASE_HEIGHT: Record<DeviceType, number> = {
  browser: 150,
  none: 180,
  macbook: 165,
  iphone: 111,
  glass: 150,
};
const THUMB_BASE_WIDTH: Record<DeviceType, number> = {
  browser: 240,
  none: 240,
  macbook: 240,
  iphone: 240,
  glass: 240,
};

function DeviceCard({
  deviceOption,
  active,
  browserStyle,
  onSelect,
}: {
  deviceOption: { id: DeviceType; label: string; icon: typeof Smartphone };
  active: boolean;
  browserStyle: FrameStyle;
  onSelect: (d: DeviceType) => void;
}) {
  const Icon = deviceOption.icon;
  const boxHeight = 64; // fixed thumbnail box height, in px
  const verticalPadding = 10; // px of breathing room top and bottom
  const usableHeight = boxHeight - verticalPadding * 2;
  const baseHeight = THUMB_BASE_HEIGHT[deviceOption.id];
  const baseWidth = THUMB_BASE_WIDTH[deviceOption.id];
  const scale = usableHeight / baseHeight;

  return (
    <button
      onClick={() => onSelect(deviceOption.id)}
      className="flex flex-col items-center gap-1.5"
    >
      <div
        className={`flex w-full items-center justify-center overflow-hidden rounded-xl border bg-panel-2 transition ${
          active ? "border-ink-dim" : "border-transparent hover:border-line"
        }`}
        style={{ height: boxHeight }}
      >
        <div
          className="pointer-events-none shrink-0"
          style={{
            width: baseWidth * scale,
            height: baseHeight * scale,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: baseWidth,
              height: baseHeight,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            <DeviceFrame
              device={deviceOption.id}
              browserStyle={browserStyle}
              className="h-full w-full"
            >
              <FakeScreen tone="mono" />
            </DeviceFrame>
          </div>
        </div>
      </div>
      <p
        className={`flex items-center gap-1 text-[11px] transition ${
          active ? "font-semibold text-ink" : "text-ink-dim"
        }`}
      >
        <Icon size={11} />
        {deviceOption.label}
      </p>
    </button>
  );
}

export default function LeftPanel({
  device,
  onDevice,
  frameStyle,
  onFrameStyle,
  url,
  onUrl,
  pageTheme,
  onPageTheme,
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
  mainImage,
}: {
  device: DeviceType;
  onDevice: (d: DeviceType) => void;
  frameStyle: FrameStyle;
  onFrameStyle: (s: FrameStyle) => void;
  url: string;
  onUrl: (u: string) => void;
  pageTheme: PageTheme;
  onPageTheme: (t: PageTheme) => void;
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
  mainImage?: string | null;
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
            <CollapsibleSection title="Device">
              <div className="grid grid-cols-2 gap-3">
                {DEVICES.map((d) => (
                  <DeviceCard
                    key={d.id}
                    deviceOption={d}
                    active={device === d.id}
                    browserStyle={frameStyle}
                    onSelect={onDevice}
                  />
                ))}
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Style">
              <div className="grid grid-cols-2 gap-3">
                {STYLES.map((s) => {
                  const selected = frameStyle === s.id;
                  const isDark = s.id.endsWith("dark");
                  return (
                    <button
                      key={s.id}
                      onClick={() => onFrameStyle(s.id)}
                      className="flex flex-col items-center gap-1.5"
                    >
                      <div
                        className={`w-full overflow-hidden rounded-xl border transition ${
                          selected
                            ? "border-ink-dim"
                            : "border-transparent hover:border-line"
                        }`}
                      >
                        <div className="pointer-events-none">
                          <BrowserFrame style={s.id} className="rounded-lg">
                            <div
                              className="h-14 w-full"
                              style={{
                                background: isDark ? "#242424" : "#ffffff",
                              }}
                            />
                          </BrowserFrame>
                        </div>
                      </div>
                      <p
                        className={`text-[11px] transition ${
                          selected ? "font-semibold text-ink" : "text-ink-dim"
                        }`}
                      >
                        {s.label}
                      </p>
                    </button>
                  );
                })}
              </div>
            </CollapsibleSection>

            <Section title="URL">
              <input
                value={url}
                onChange={(e) => onUrl(e.target.value)}
                placeholder="yoursite.com"
                className="w-full rounded-md border border-line bg-panel-2 px-3 py-2 font-mono text-xs text-ink outline-none focus:border-amber"
              />
            </Section>

            <Section title="Theme">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onPageTheme("light")}
                  className={`flex items-center justify-center gap-1.5 rounded-lg border-2 bg-panel-2 py-2 text-xs font-medium transition ${
                    pageTheme === "light"
                      ? "border-amber text-ink"
                      : "border-transparent text-ink-dim hover:border-line"
                  }`}
                >
                  <Sun size={13} />
                  Light
                </button>
                <button
                  onClick={() => onPageTheme("dark")}
                  className={`flex items-center justify-center gap-1.5 rounded-lg border-2 bg-panel-2 py-2 text-xs font-medium transition ${
                    pageTheme === "dark"
                      ? "border-amber text-ink"
                      : "border-transparent text-ink-dim hover:border-line"
                  }`}
                >
                  <Moon size={13} />
                  Dark
                </button>
              </div>
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
                  style={rangeFillStyle(headerSize, 60, 140)}
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
                  style={rangeFillStyle(radius, 0, 48)}
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
            <CustomBackgroundSection
              background={background}
              onSelect={onBackground}
              mainImage={mainImage}
            />
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
