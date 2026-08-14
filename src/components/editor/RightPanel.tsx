"use client";

import { useRef, useState } from "react";
import { ChevronDown, ChevronUp, PlayCircle, Shapes } from "lucide-react";
import BrowserFrame, { FrameStyle } from "@/components/shared/BrowserFrame";
import CodeBlock from "./CodeBlock";
import {
  BackgroundPreset,
  CodeSnippetState,
  ContentMode,
  SHADOW_CSS,
  ShadowPreset,
} from "./types";

type Preset = {
  label: string;
  zoom: number;
  tiltX: number;
  tiltY: number;
  padding: number;
};

const GROUPS: { title: string; presets: Preset[] }[] = [
  {
    title: "Popular",
    presets: [
      { label: "Flat", zoom: 100, tiltX: 0, tiltY: 0, padding: 10 },
      { label: "Gentle lift", zoom: 96, tiltX: 6, tiltY: -10, padding: 12 },
      { label: "Showcase", zoom: 92, tiltX: 8, tiltY: -16, padding: 14 },
    ],
  },
  {
    title: "Basic",
    presets: [
      { label: "Centered", zoom: 100, tiltX: 0, tiltY: 0, padding: 8 },
      { label: "Tight crop", zoom: 112, tiltX: 0, tiltY: 0, padding: 2 },
    ],
  },
  {
    title: "Dramatic",
    presets: [
      { label: "Deep angle", zoom: 88, tiltX: 14, tiltY: -24, padding: 16 },
      { label: "Swoop", zoom: 90, tiltX: -10, tiltY: 20, padding: 16 },
    ],
  },
  {
    title: "Perspective",
    presets: [
      { label: "Left rise", zoom: 94, tiltX: 4, tiltY: -18, padding: 12 },
      { label: "Right rise", zoom: 94, tiltX: 4, tiltY: 18, padding: 12 },
    ],
  },
  {
    title: "Float",
    presets: [{ label: "Hover", zoom: 86, tiltX: 10, tiltY: -6, padding: 20 }],
  },
];

function TiltPad({
  tiltX,
  tiltY,
  onChange,
  zoom,
  padding,
  background,
  frameStyle,
  url,
  headerSize,
  shadow,
  radius,
  image,
  contentMode,
  codeSnippet,
}: {
  tiltX: number;
  tiltY: number;
  onChange: (x: number, y: number) => void;
  zoom: number;
  padding: number;
  background: BackgroundPreset;
  frameStyle: FrameStyle;
  url: string;
  headerSize: number;
  shadow: ShadowPreset;
  radius: number;
  image: string | null;
  contentMode: ContentMode;
  codeSnippet: CodeSnippetState;
}) {
  const padRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const updateFromEvent = (clientX: number, clientY: number) => {
    const pad = padRef.current;
    if (!pad) return;
    const rect = pad.getBoundingClientRect();
    const px = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const py = Math.min(1, Math.max(0, (clientY - rect.top) / rect.height));
    const x = (py - 0.5) * -40; // tiltX range -20..20
    const y = (px - 0.5) * 40; // tiltY range -20..20
    onChange(Math.round(x), Math.round(y));
  };

  const dotX = 50 + (tiltY / 40) * 100;
  const dotY = 50 - (tiltX / 40) * 100;

  return (
    <div
      ref={padRef}
      onPointerDown={(e) => {
        setDragging(true);
        (e.target as Element).setPointerCapture(e.pointerId);
        updateFromEvent(e.clientX, e.clientY);
      }}
      onPointerMove={(e) => dragging && updateFromEvent(e.clientX, e.clientY)}
      onPointerUp={() => setDragging(false)}
      className="relative aspect-4/3 w-full cursor-crosshair overflow-hidden rounded-xl border border-line bg-panel-2"
    >
      {/* live preview fills the pad — dragging anywhere on it sets tilt */}
      <MiniStage
        zoom={zoom}
        tiltX={tiltX}
        tiltY={tiltY}
        padding={padding}
        background={background}
        frameStyle={frameStyle}
        url={url}
        headerSize={headerSize}
        shadow={shadow}
        radius={radius}
        image={image}
        contentMode={contentMode}
        codeSnippet={codeSnippet}
        className="pointer-events-none absolute inset-0 rounded-none border-0"
      />

      {/* faint alignment grid on top of the preview */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.25) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />

      <div
        className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-void bg-amber shadow-[0_0_0_1px_var(--amber)]"
        style={{ left: `${dotX}%`, top: `${dotY}%` }}
      />
    </div>
  );
}

// Renders a scaled-down replica of the canvas (background + frame/content)
// at a given zoom/tilt/padding, so both the live preview and each preset
// button can show what that setting actually looks like with the user's
// real screenshot/code, background, and frame style.
function MiniStage({
  zoom,
  tiltX,
  tiltY,
  padding,
  background,
  frameStyle,
  url,
  headerSize,
  shadow,
  radius,
  image,
  contentMode,
  codeSnippet,
  className = "",
}: {
  zoom: number;
  tiltX: number;
  tiltY: number;
  padding: number;
  background: BackgroundPreset;
  frameStyle: FrameStyle;
  url: string;
  headerSize: number;
  shadow: ShadowPreset;
  radius: number;
  image: string | null;
  contentMode: ContentMode;
  codeSnippet: CodeSnippetState;
  className?: string;
}) {
  // Clamp padding/radius so a preset with a large value doesn't overwhelm
  // a small thumbnail; the live preview (larger box) still reads clearly.
  const safePadding = Math.min(padding, 20);
  const safeRadius = Math.min(radius, 14);

  const hasContent = contentMode === "code" || !!image;

  return (
    <div
      className={`relative aspect-4/3 w-full overflow-hidden rounded-lg border border-line bg-black ${className}`}
    >
      <div
        className="absolute inset-0"
        style={
          background.image
            ? {
                backgroundImage: `url(${background.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : { background: background.css }
        }
      />
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ padding: `${safePadding}%`, perspective: "900px" }}
      >
        {!hasContent ? (
          <span className="text-[10px] text-white/40">No content yet</span>
        ) : (
          <div
            className="w-full max-w-[220px]"
            style={{
              transform: `scale(${zoom / 100}) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
              transformStyle: "preserve-3d",
            }}
          >
            <div
              style={{
                boxShadow: SHADOW_CSS[shadow],
                borderRadius: safeRadius,
              }}
            >
              {contentMode === "code" ? (
                <CodeBlock snippet={codeSnippet} />
              ) : (
                <BrowserFrame
                  style={frameStyle}
                  url={url || "yoursite.com"}
                  className="w-full"
                  headerScale={headerSize}
                  radius={safeRadius}
                >
                  <div
                    className="relative h-full w-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${image})` }}
                  />
                </BrowserFrame>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function RightPanel({
  zoom,
  onZoom,
  tiltX,
  tiltY,
  onTilt,
  onPreset,
  padding,
  background,
  frameStyle,
  url,
  headerSize,
  shadow,
  radius,
  image,
  contentMode,
  codeSnippet,
}: {
  zoom: number;
  onZoom: (n: number) => void;
  tiltX: number;
  tiltY: number;
  onTilt: (x: number, y: number) => void;
  onPreset: (p: Preset) => void;
  padding: number;
  background: BackgroundPreset;
  frameStyle: FrameStyle;
  url: string;
  headerSize: number;
  shadow: ShadowPreset;
  radius: number;
  image: string | null;
  contentMode: ContentMode;
  codeSnippet: CodeSnippetState;
}) {
  const [mode, setMode] = useState<"3d" | "flat">("3d");
  const [openGroup, setOpenGroup] = useState<string>("Popular");

  const stageProps = {
    background,
    frameStyle,
    url,
    headerSize,
    shadow,
    radius,
    image,
    contentMode,
    codeSnippet,
  };

  return (
    <aside className="flex w-72 shrink-0 flex-col border-l border-line-soft bg-panel">
      <div className="flex items-center gap-1 border-b border-line-soft p-3">
        <button
          onClick={() => setMode("3d")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-xs font-medium transition ${
            mode === "3d"
              ? "bg-panel-2 text-ink"
              : "text-ink-faint hover:text-ink-dim"
          }`}
        >
          <Shapes size={14} />
          3D
        </button>
        <button
          onClick={() => setMode("flat")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-xs font-medium transition ${
            mode === "flat"
              ? "bg-panel-2 text-ink"
              : "text-ink-faint hover:text-ink-dim"
          }`}
        >
          <PlayCircle size={14} />
          Flat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-4">
        {mode === "3d" && (
          <>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-dim">
              Tilt
            </p>
            <TiltPad
              tiltX={tiltX}
              tiltY={tiltY}
              onChange={onTilt}
              zoom={zoom}
              padding={padding}
              {...stageProps}
            />
            <p className="mt-2 text-center font-mono text-[11px] text-ink-faint">
              x {tiltX}° · y {tiltY}°
            </p>
          </>
        )}

        <div className="mt-6 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-widest text-ink-dim">
            Zoom
          </span>
          <span className="font-mono text-xs text-ink-dim">{zoom}%</span>
        </div>
        <input
          type="range"
          min={60}
          max={140}
          value={zoom}
          onChange={(e) => onZoom(Number(e.target.value))}
          className="mt-3 w-full"
        />

        <div className="mt-7 border-t border-line-soft pt-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-dim">
            Layout presets
          </p>
          <div className="space-y-1">
            {GROUPS.map((g) => (
              <div key={g.title}>
                <button
                  onClick={() =>
                    setOpenGroup((cur) => (cur === g.title ? "" : g.title))
                  }
                  className="flex w-full items-center justify-between py-2 text-xs text-ink-dim transition hover:text-ink"
                >
                  <span className="uppercase tracking-widest">{g.title}</span>
                  {openGroup === g.title ? (
                    <ChevronUp size={13} />
                  ) : (
                    <ChevronDown size={13} />
                  )}
                </button>
                {openGroup === g.title && (
                  <div className="grid grid-cols-1 gap-2 pb-3">
                    {g.presets.map((p) => (
                      <button
                        key={p.label}
                        onClick={() => onPreset(p)}
                        className="group overflow-hidden rounded-lg border border-line bg-panel-2 text-left transition hover:border-amber/50"
                      >
                        <MiniStage
                          zoom={p.zoom}
                          tiltX={p.tiltX}
                          tiltY={p.tiltY}
                          padding={p.padding}
                          {...stageProps}
                          className="rounded-none border-0 border-b border-line"
                        />
                        <span className="block px-2.5 py-1.5 text-[11px] text-ink-dim transition group-hover:text-ink">
                          {p.label}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
