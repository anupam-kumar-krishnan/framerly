"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  PlayCircle,
  Shapes,
  Download,
  Loader2,
  Plus,
  X,
  Check,
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

/**
 * Amber dot-matrix loader — 19 dots hex-packed into rows of 3-4-5-4-3
 * (matching the reference clip), each an amber radial-gradient "bead" that
 * twinkles independently: opacity/scale pulse from dim to bright and back
 * on its own staggered, deterministic delay, so brightness appears to
 * sparkle/scatter across the grid rather than sweep in one direction.
 */
function DotMatrixLoader() {
  const rowCounts = [3, 4, 5, 4, 3];
  const dotSize = 9;
  const gapX = 11;
  const gapY = 9.5;
  const total = rowCounts.reduce((a, b) => a + b, 0);

  const dots: { x: number; y: number; delay: number; dur: number }[] = [];
  let idx = 0;

  rowCounts.forEach((count, r) => {
    const rowWidth = (count - 1) * gapX;

    for (let c = 0; c < count; c++) {
      const x = c * gapX - rowWidth / 2;
      const y = (r - (rowCounts.length - 1) / 2) * gapY;

      // idx * 7 mod total is a coprime step through 0..total-1, giving a
      // fixed but scrambled (non-sequential) spread of start delays so the
      // twinkle reads as organic sparkle rather than a clean sweep.
      const delay = ((idx * 7) % total) / total;

      dots.push({
        x,
        y,
        delay: delay * 1.8,
        dur: 1.7 + ((idx * 3) % 3) * 0.15,
      });

      idx++;
    }
  });

  return (
    <div className="relative mx-auto h-16 w-16">
      <style>{`
        @keyframes dot-twinkle {
          0%, 100% { opacity: 0.25; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <div className="absolute left-1/2 top-1/2">
        {dots.map((d, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: dotSize,
              height: dotSize,
              left: d.x - dotSize / 2,
              top: d.y - dotSize / 2,
              background:
                "radial-gradient(circle at 35% 30%, #fde68a, #fbbf24 55%, #b45309 100%)",
              animation: `dot-twinkle ${d.dur}s ease-in-out ${d.delay}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * One-shot confetti burst. Particles are generated once (ref) and animate
 * outward with randomized angle/distance/rotation via CSS custom
 * properties, then the parent unmounts this after ~1s.
 */
function ConfettiBurst() {
  const pieces = useRef(
    Array.from({ length: 26 }, (_, i) => {
      const angle = (Math.PI * 2 * i) / 26 + Math.random() * 0.5;
      const distance = 55 + Math.random() * 55;
      const colors = ["#f5a623", "#fbbf24", "#f97316", "#facc15", "#ffffff"];

      return {
        id: i,
        tx: Math.cos(angle) * distance,
        ty: Math.sin(angle) * distance,
        tr: Math.round(Math.random() * 360),
        color: colors[i % colors.length],
        delay: Math.random() * 0.08,
        size: 5 + Math.random() * 4,
        round: i % 3 === 0,
      };
    }),
  ).current;

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <style>{`
        @keyframes confetti-burst {
          0% { transform: translate(0, 0) rotate(0deg) scale(1); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) rotate(var(--tr)) scale(0.4); opacity: 0; }
        }
      `}</style>

      {pieces.map((p) => (
        <span
          key={p.id}
          style={
            {
              position: "absolute",
              // Absolutely-positioned children of a flex container don't
              // reliably land at the centered "static position" across
              // browsers — pin each particle to the exact center explicitly
              // instead of depending on the parent's flex centering.
              left: `calc(50% - ${p.size / 2}px)`,
              top: `calc(50% - ${p.size / 2}px)`,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              borderRadius: p.round ? "9999px" : "2px",
              "--tx": `${p.tx}px`,
              "--ty": `${p.ty}px`,
              "--tr": `${p.tr}deg`,
              animation: `confetti-burst 0.9s cubic-bezier(0.2,0.7,0.3,1) ${p.delay}s forwards`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

/**
 * Full-screen modal shown while a video export is in progress. Mirrors the
 * "Exporting Video" flow from Screenshot Studio: title, subtitle, an
 * animated capture icon, a live percentage, a progress bar, a status line,
 * a format badge, and a cancel action. At 100% the icon morphs into a
 * checkmark and a confetti burst fires once.
 */
function ExportModal({
  progress,
  stage,
  onCancel,
}: {
  progress: number;
  stage: "capturing" | "finalizing";
  onCancel: () => void;
}) {
  const done = progress >= 100;
  const [celebrate, setCelebrate] = useState(false);
  const firedRef = useRef(false);

  useEffect(() => {
    if (done && !firedRef.current) {
      firedRef.current = true;
      setCelebrate(true);
      const t = setTimeout(() => setCelebrate(false), 1000);
      return () => clearTimeout(t);
    }

    if (!done) {
      firedRef.current = false;
    }
  }, [done]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-void/70 backdrop-blur-sm">
      {/* Local keyframes — scoped inline so no tailwind.config changes are
          required. */}
      <style>{`
        @keyframes export-modal-in {
          from { opacity: 0; transform: translateY(6px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes export-pop {
          0% { transform: scale(0.4); opacity: 0; }
          65% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes export-ring-pulse {
          0% { transform: scale(0.9); opacity: 0.6; }
          100% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>

      <div
        className="w-full max-w-sm rounded-2xl border border-line bg-panel p-6 shadow-2xl"
        style={{ animation: "export-modal-in 0.18s ease-out" }}
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-semibold text-ink">
              Exporting Video
            </h3>
            <p className="mt-1 text-xs text-ink-dim">
              Sit back while we render your creation
            </p>
          </div>

          <button
            onClick={onCancel}
            aria-label="Close"
            className="rounded-md p-1 text-ink-faint transition hover:text-ink"
          >
            <X size={16} />
          </button>
        </div>

        <div className="relative mx-auto my-8 h-16 w-16">
          {done && (
            <>
              <div className="absolute inset-0 rounded-xl border-2 border-amber/30" />
              <div
                className="absolute inset-0 rounded-xl border-2 border-amber"
                style={{ animation: "export-ring-pulse 1s ease-out infinite" }}
              />
              <div
                className="absolute inset-0 rounded-xl border-2 border-amber"
                style={{
                  animation: "export-ring-pulse 1s ease-out 0.5s infinite",
                }}
              />
            </>
          )}

          <div className="absolute inset-0 flex items-center justify-center">
            {done ? (
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber"
                style={{ animation: "export-pop 0.4s ease-out" }}
              >
                <Check size={18} className="text-void" strokeWidth={3} />
              </div>
            ) : (
              <DotMatrixLoader />
            )}
          </div>

          {celebrate && <ConfettiBurst />}
        </div>

        <p className="text-center font-mono text-3xl font-bold tabular-nums text-ink">
          {progress}%
        </p>

        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-panel-2">
          <div
            className="h-full rounded-full bg-amber transition-[width] duration-150 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="mt-4 text-center text-xs text-ink-dim">
          {done
            ? "Done!"
            : stage === "capturing"
              ? "Capturing frames…"
              : "Finalizing video…"}
        </p>

        <div className="mt-4 flex justify-center">
          <span className="inline-block rounded-full border border-line bg-panel-2 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-ink-faint">
            Exporting as WebM
          </span>
        </div>

        <button
          onClick={onCancel}
          className="mt-6 w-full rounded-lg border border-line py-2.5 text-xs font-semibold text-ink-dim transition hover:border-red-500/40 hover:text-red-400"
        >
          Cancel
        </button>
      </div>
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
  const [stage, setStage] = useState<"capturing" | "finalizing">("capturing");
  const cancelledRef = useRef(false);

  const handleCancelExport = () => {
    // Flag checked inside the per-frame loop below; the export routine
    // handles its own teardown once it notices the flag is set.
    cancelledRef.current = true;
  };

  const handleExport = async () => {
    const captureEl = canvasRef.current;

    if (!captureEl) return;

    cancelledRef.current = false;
    setExporting(true);
    setStage("capturing");
    setProgress(0);
    onVideoExporting(true);

    try {
      const durationInFrames = Math.max(1, totalFrames);

      // Measure the actual rendered size of the canvas element instead of
      // assuming CANVAS_REFERENCE_WIDTH/HEIGHT. Forcing toCanvas to a fixed
      // width/height that didn't match the element's real aspect ratio was
      // what caused the black letterboxed border on export — html-to-image
      // doesn't rescale content to fit a mismatched target size, it just
      // leaves the extra space blank.
      const rect = captureEl.getBoundingClientRect();
      const pixelRatio = 2;
      const outputWidth = Math.round(rect.width * pixelRatio);
      const outputHeight = Math.round(rect.height * pixelRatio);

      const recordCanvas = document.createElement("canvas");

      recordCanvas.width = outputWidth;
      recordCanvas.height = outputHeight;

      const ctx = recordCanvas.getContext("2d", { alpha: false });

      if (!ctx) {
        throw new Error("Could not get 2D context for export canvas");
      }

      // Auto-sample at the target FPS instead of manually calling
      // requestFrame() after every (variably slow) toCanvas() capture —
      // that manual pacing was what made the exported video choppy, since
      // each recorded frame's on-screen duration was however long that
      // particular capture happened to take, not a consistent frame time.
      const stream = recordCanvas.captureStream(FPS);
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

      onAnimationFrame(0);
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      );

      const frameDurationMs = 1000 / FPS;
      const exportStart = performance.now();
      let wasCancelled = false;

      for (let frame = 0; frame < durationInFrames; frame++) {
        if (cancelledRef.current) {
          wasCancelled = true;
          break;
        }

        onAnimationFrame(frame);

        await new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        );

        const frameCanvas = await toCanvas(captureEl, {
          width: rect.width,
          height: rect.height,
          pixelRatio,
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

        // Hold each canvas update until its proper slot on the FPS grid so
        // captureStream(FPS) samples evenly-spaced, correctly-timed frames
        // rather than drifting with however long each capture took.
        const targetElapsed = (frame + 1) * frameDurationMs;
        const actualElapsed = performance.now() - exportStart;
        if (actualElapsed < targetElapsed) {
          await new Promise((resolve) =>
            setTimeout(resolve, targetElapsed - actualElapsed),
          );
        }

        setProgress(Math.round(((frame + 1) / durationInFrames) * 100));
      }

      if (!wasCancelled) {
        setStage("finalizing");

        // Give the auto-sampling stream one more tick to pick up the final
        // frame before we stop recording.
        await new Promise((resolve) =>
          setTimeout(resolve, frameDurationMs * 2),
        );
      }

      recorder.stop();
      await recordingStopped;

      if (!wasCancelled) {
        const blob = new Blob(chunks, { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "framerly-export.webm";
        a.click();

        setTimeout(() => URL.revokeObjectURL(url), 1000);

        // Hold the modal at 100% briefly so the success checkmark and
        // confetti burst are actually visible before it closes — without
        // this the modal was unmounting mid-animation.
        await new Promise((resolve) => setTimeout(resolve, 1100));
      }
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      onAnimationFrame(0);
      onVideoExporting(false);
      setExporting(false);
      setProgress(0);
      setStage("capturing");
      cancelledRef.current = false;
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
          </>
        ) : (
          <>
            <Download size={14} />
            Export WebM
          </>
        )}
      </button>

      {exporting && (
        <ExportModal
          progress={progress}
          stage={stage}
          onCancel={handleCancelExport}
        />
      )}

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

                        {/* Hover overlay: centered glassmorphism square with Plus icon */}
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                          <div className="flex h-9 w-9 items-center justify-center rounded-md border border-white bg-white/10 backdrop-blur-md">
                            <Plus
                              size={18}
                              className="text-white"
                              strokeWidth={2.5}
                            />
                          </div>
                        </div>
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

  canvasRef: React.RefObject<HTMLDivElement | null>;
  animationClips: AnimationClip[];
  onAddAnimationClip: (preset: AnimationPreset) => void;
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
