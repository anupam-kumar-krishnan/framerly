"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  PlayCircle,
  Shapes,
  Download,
  Loader2,
} from "lucide-react";
import { toCanvas } from "html-to-image";
import { FrameStyle } from "@/components/shared/BrowserFrame";
import DeviceFrame from "@/components/shared/DeviceFrame";
import CodeBlock from "./CodeBlock";
import {
  BackgroundPreset,
  CodeSnippetState,
  ContentMode,
  DeviceType,
  SHADOW_CSS,
  ShadowPreset,
} from "./types";
// Only used for its prop-shape via `Parameters<typeof MockupComposition>`
// below — it is no longer rendered directly in this panel.
import { MockupComposition } from "@/remotion/MockupComposition";
import { ANIMATION_GROUPS, AnimationPreset } from "@/remotion/animationPresets";
import { AnimationClip, FPS } from "@/remotion/animationClips";

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
    presets: [
      {
        label: "Hover",
        zoom: 86,
        tiltX: 10,
        tiltY: -6,
        padding: 20,
      },
    ],
  },
];

const CANVAS_REFERENCE_WIDTH = 860;
const CANVAS_REFERENCE_HEIGHT = (CANVAS_REFERENCE_WIDTH * 3) / 4;

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
  device,
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
  device: DeviceType;
}) {
  const padRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const updateFromEvent = (clientX: number, clientY: number) => {
    const pad = padRef.current;
    if (!pad) return;

    const rect = pad.getBoundingClientRect();

    const px = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));

    const py = Math.min(1, Math.max(0, (clientY - rect.top) / rect.height));

    const x = (py - 0.5) * -40;
    const y = (px - 0.5) * 40;

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
        device={device}
        className="pointer-events-none absolute inset-0 rounded-none border-0"
      />

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
        style={{
          left: `${dotX}%`,
          top: `${dotY}%`,
        }}
      />
    </div>
  );
}

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
  device,
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
  device: DeviceType;
  className?: string;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;

      if (width) {
        setScale(width / CANVAS_REFERENCE_WIDTH);
      }
    });

    ro.observe(el);

    return () => ro.disconnect();
  }, []);

  const hasContent = contentMode === "code" || !!image;

  return (
    <div
      ref={wrapperRef}
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
            : {
                background: background.css,
              }
        }
      />

      {scale > 0 && (
        <div
          className="absolute left-0 top-0 flex items-center justify-center"
          style={{
            width: CANVAS_REFERENCE_WIDTH,
            height: CANVAS_REFERENCE_HEIGHT,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            padding: `${padding}%`,
            perspective: "900px",
          }}
        >
          {!hasContent ? (
            <span className="text-sm text-white/40">No content yet</span>
          ) : (
            <div
              className="w-full max-w-[640px]"
              style={{
                transform: `scale(${zoom / 100}) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
                transformStyle: "preserve-3d",
              }}
            >
              <div
                style={{
                  boxShadow: SHADOW_CSS[shadow],
                  borderRadius: radius,
                }}
              >
                {contentMode === "code" ? (
                  <CodeBlock snippet={codeSnippet} />
                ) : (
                  <DeviceFrame
                    device={device}
                    browserStyle={frameStyle}
                    url={url || "yoursite.com"}
                    className="w-full"
                    headerScale={headerSize}
                    radius={radius}
                  >
                    <div
                      className="relative h-full w-full bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${image})`,
                      }}
                    />
                  </DeviceFrame>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MotionPanel({
  clips,
  onAddClip,
  stageProps,
  padding,
  canvasRef,
  totalFrames,
  onAnimationFrame,
  onVideoExporting,
}: {
  clips: AnimationClip[];
  onAddClip: (preset: AnimationPreset) => void;
  stageProps: Omit<
    Parameters<typeof MockupComposition>[0],
    "presetId" | "padding"
  >;
  padding: number;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  /** Total length (in frames, at FPS) of the full clip sequence. */
  totalFrames: number;
  onAnimationFrame: (frame: number) => void;
  onVideoExporting: (value: boolean) => void;
}) {
  const [openGroup, setOpenGroup] = useState<string>("Reveal");
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleExport = async () => {
    const captureEl = canvasRef.current;

    if (!captureEl) return;

    setExporting(true);
    setProgress(0);
    onVideoExporting(true);

    try {
      const durationInFrames = Math.max(1, totalFrames);
      const outputWidth = CANVAS_REFERENCE_WIDTH * 2;
      const outputHeight = CANVAS_REFERENCE_HEIGHT * 2;
      const recordCanvas = document.createElement("canvas");

      recordCanvas.width = outputWidth;
      recordCanvas.height = outputHeight;

      const ctx = recordCanvas.getContext("2d", { alpha: false });

      if (!ctx) {
        throw new Error("Could not get 2D context for export canvas");
      }

      const stream = recordCanvas.captureStream(0);
      const track = stream.getVideoTracks()[0] as
        | CanvasCaptureMediaStreamTrack
        | undefined;

      if (!track) {
        throw new Error("Could not create canvas video track");
      }

      const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
        ? "video/webm;codecs=vp9"
        : "video/webm";

      const chunks: Blob[] = [];
      const recorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 16_000_000,
      });

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      const recordingStopped = new Promise<void>((resolve) => {
        recorder.onstop = () => resolve();
      });

      recorder.start();

      // Start from the exact first frame. The real editor canvas re-renders
      // in response to `onAnimationFrame`, which is what we capture below.
      onAnimationFrame(0);
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      );

      for (let frame = 0; frame < durationInFrames; frame++) {
        onAnimationFrame(frame);

        // Wait until React has committed the frame and the browser has painted it.
        await new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        );

        const frameCanvas = await toCanvas(captureEl, {
          width: CANVAS_REFERENCE_WIDTH,
          height: CANVAS_REFERENCE_HEIGHT,
          pixelRatio: 2,
          cacheBust: true,
          skipFonts: false,
          filter: (node) => {
            return !(
              node instanceof HTMLElement &&
              node.dataset.exportIgnore === "true"
            );
          },
        });

        ctx.clearRect(0, 0, outputWidth, outputHeight);
        ctx.drawImage(frameCanvas, 0, 0, outputWidth, outputHeight);

        track.requestFrame();
        setProgress(Math.round(((frame + 1) / durationInFrames) * 100));
      }

      recorder.stop();
      await recordingStopped;

      const blob = new Blob(chunks, { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "framerly-export.webm";
      a.click();

      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      onAnimationFrame(0);
      onVideoExporting(false);
      setExporting(false);
      setProgress(0);
    }
  };

  return (
    <div>
      <button
        onClick={handleExport}
        disabled={exporting || clips.length === 0}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber py-2.5 text-xs font-semibold text-void transition hover:opacity-90 disabled:opacity-60"
      >
        {exporting ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            Exporting…
            {progress > 0 ? ` ${progress}%` : ""}
          </>
        ) : (
          <>
            <Download size={14} />
            Export WebM
          </>
        )}
      </button>

      <div className="mt-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-dim">
          Motion presets
        </p>

        <div className="space-y-1">
          {ANIMATION_GROUPS.map((g) => (
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
                      key={p.id}
                      onClick={() => onAddClip(p)}
                      title="Add to timeline"
                      className="group relative overflow-hidden rounded-lg border border-line text-left transition border-line hover:border-amber/50 bg-panel-2"
                    >
                      <div className="relative">
                        <MiniStage
                          zoom={100}
                          tiltX={0}
                          tiltY={0}
                          padding={padding}
                          {...stageProps}
                          className="rounded-none border-0 border-b border-line"
                        />

                        <span className="absolute right-2 top-2 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-mono text-white/80">
                          {(p.durationMs / 1000).toFixed(1)}s
                        </span>
                      </div>

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
  );
}

export default function RightPanel({
  mode,
  onModeChange,
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
  device,
  canvasRef,
  animationClips,
  onAddAnimationClip,
  totalFrames,
  onAnimationFrame,
  onVideoExporting,
}: {
  mode: "3d" | "flat";
  onModeChange: (mode: "3d" | "flat") => void;
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
  device: DeviceType;

  /*
   * Ref of the MAIN CENTER CANVAS.
   */
  canvasRef: React.RefObject<HTMLDivElement | null>;
  /** The clips currently placed on the timeline, in order. */
  animationClips: AnimationClip[];
  /** Appends a new clip built from this preset to the end of the timeline. */
  onAddAnimationClip: (preset: AnimationPreset) => void;
  /** Combined length (frames) of the whole clip sequence. */
  totalFrames: number;
  onAnimationFrame: (frame: number) => void;
  onVideoExporting: (value: boolean) => void;
}) {
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
    device,
  };

  return (
    <aside className="flex w-72 shrink-0 flex-col border-l border-line-soft bg-panel">
      <div className="flex items-center gap-1 border-b border-line-soft p-3">
        <button
          onClick={() => onModeChange("3d")}
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
          onClick={() => onModeChange("flat")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-xs font-medium transition ${
            mode === "flat"
              ? "bg-panel-2 text-ink"
              : "text-ink-faint hover:text-ink-dim"
          }`}
        >
          <PlayCircle size={14} />
          Motion
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
                      <span className="uppercase tracking-widest">
                        {g.title}
                      </span>

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
          </>
        )}

        {mode === "flat" && (
          <MotionPanel
            clips={animationClips}
            onAddClip={onAddAnimationClip}
            stageProps={stageProps}
            padding={padding}
            canvasRef={canvasRef}
            totalFrames={totalFrames}
            onAnimationFrame={onAnimationFrame}
            onVideoExporting={onVideoExporting}
          />
        )}
      </div>
    </aside>
  );
}
