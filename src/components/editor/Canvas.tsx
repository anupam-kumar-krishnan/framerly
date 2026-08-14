"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Camera,
  Globe,
  Loader2,
  Plus,
  RotateCw,
  Trash2,
  Trash2Icon,
  X,
} from "lucide-react";
import BrowserFrame, { FrameStyle } from "@/components/shared/BrowserFrame";
import CodeBlock from "./CodeBlock";
import {
  ASPECTS,
  AspectRatio,
  BackgroundPreset,
  CodeSnippetState,
  ContentMode,
  LayerItem,
  SHADOW_CSS,
  ShadowPreset,
} from "./types";
import { toast } from "sonner";

const RULER_SIZE = 20;
const TICK_GAP = 50;
const SNAP_THRESHOLD = 6; // px
const ROTATE_SNAP_THRESHOLD = 4; // deg, snaps to multiples of 45

function Ruler({
  length,
  orientation,
}: {
  length: number;
  orientation: "horizontal" | "vertical";
}) {
  const ticks = useMemo(() => {
    const count = Math.ceil(length / TICK_GAP) + 1;
    return Array.from({ length: count }, (_, i) => i * TICK_GAP);
  }, [length]);

  return (
    <div
      className={`pointer-events-none absolute bg-panel text-[9px] text-ink-faint ${
        orientation === "horizontal"
          ? "left-0 right-0 top-0 h-5"
          : "bottom-0 left-0 top-0 w-5"
      }`}
      style={{ zIndex: 5 }}
    >
      {ticks.map((pos) => (
        <div
          key={pos}
          className="absolute"
          style={
            orientation === "horizontal"
              ? { left: pos, top: 0, bottom: 0 }
              : { top: pos, left: 0, right: 0 }
          }
        >
          <div
            className={
              orientation === "horizontal"
                ? "absolute bottom-0 h-2 w-px bg-line"
                : "absolute right-0 h-px w-2 bg-line"
            }
          />
          <span
            className={
              orientation === "horizontal"
                ? "absolute left-1 top-0.5"
                : "absolute left-0.5 top-1"
            }
          >
            {pos}
          </span>
        </div>
      ))}
    </div>
  );
}

// Small square handle rendered at each corner of the selection box.
function CornerHandle({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const posClass = {
    tl: "-left-1.5 -top-1.5 cursor-nwse-resize",
    tr: "-right-1.5 -top-1.5 cursor-nesw-resize",
    bl: "-left-1.5 -bottom-1.5 cursor-nesw-resize",
    br: "-right-1.5 -bottom-1.5 cursor-nwse-resize",
  }[position];

  return (
    <div
      data-no-drag="true"
      className={`absolute h-3 w-3 rounded-[2px] bg-white shadow-sm ${posClass}`}
      style={{ border: "2px solid #3b82f6" }}
    />
  );
}

export default function Canvas({
  frameStyle,
  url,
  onUrl,
  headerSize,
  shadow,
  background,
  padding,
  radius,
  zoom,
  tiltX,
  tiltY,
  aspect,
  image,
  onImage,
  onRemoveImage,
  onRemoveCode,
  canvasRef,
  isExporting,
  contentMode,
  codeSnippet,
  showRulers,
  showGrid,
  layers,
}: {
  frameStyle: FrameStyle;
  url: string;
  onUrl: (u: string) => void;
  headerSize: number;
  shadow: ShadowPreset;
  background: BackgroundPreset;
  padding: number;
  radius: number;
  zoom: number;
  tiltX: number;
  tiltY: number;
  aspect: AspectRatio;
  image: string | null;
  isExporting: boolean;
  onImage: (dataUrl: string) => void;
  onRemoveImage: () => void;
  onRemoveCode: () => void;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  contentMode: ContentMode;
  codeSnippet: CodeSnippetState;
  showRulers: boolean;
  showGrid: boolean;
  layers: LayerItem[];
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false); // file drop hover state
  const [capturing, setCapturing] = useState(false); // website screenshot loading state
  const viewportRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  // --- Movable / selectable frame state -----------------------------------
  const frameRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [guide, setGuide] = useState({ x: false, y: false });
  const [isTransforming, setIsTransforming] = useState(false);

  const resetTransform = useCallback(() => {
    setPos({ x: 0, y: 0 });
    setRotation(0);
    setSelected(false);
  }, []);

  // Reset position/rotation whenever the content itself goes away or swaps mode
  useEffect(() => {
    resetTransform();
  }, [image, contentMode, resetTransform]);

  const handleDragStart = useCallback(
    (e: React.PointerEvent) => {
      if ((e.target as HTMLElement).closest("[data-no-drag]")) return;
      e.stopPropagation();
      setSelected(true);
      setIsTransforming(true);

      const startX = e.clientX;
      const startY = e.clientY;
      const origX = pos.x;
      const origY = pos.y;

      const handleMove = (ev: PointerEvent) => {
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;
        let nx = origX + dx;
        let ny = origY + dy;

        const snappedX = Math.abs(nx) < SNAP_THRESHOLD;
        const snappedY = Math.abs(ny) < SNAP_THRESHOLD;
        if (snappedX) nx = 0;
        if (snappedY) ny = 0;

        setGuide({ x: snappedX, y: snappedY });
        setPos({ x: nx, y: ny });
      };

      const handleUp = () => {
        setIsTransforming(false);
        setGuide({ x: false, y: false });
        window.removeEventListener("pointermove", handleMove);
        window.removeEventListener("pointerup", handleUp);
      };

      window.addEventListener("pointermove", handleMove);
      window.addEventListener("pointerup", handleUp);
    },
    [pos.x, pos.y],
  );

  const handleRotateStart = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation();
      e.preventDefault();
      if (!frameRef.current) return;
      setIsTransforming(true);

      const rect = frameRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const startPointerAngle =
        Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI);
      const startRotation = rotation;

      const handleMove = (ev: PointerEvent) => {
        const angle =
          Math.atan2(ev.clientY - cy, ev.clientX - cx) * (180 / Math.PI);
        let next = startRotation + (angle - startPointerAngle);

        // snap to the nearest 45° increment
        const nearest = Math.round(next / 45) * 45;
        if (Math.abs(next - nearest) < ROTATE_SNAP_THRESHOLD) next = nearest;

        setRotation(Math.round(next));
      };

      const handleUp = () => {
        setIsTransforming(false);
        window.removeEventListener("pointermove", handleMove);
        window.removeEventListener("pointerup", handleUp);
      };

      window.addEventListener("pointermove", handleMove);
      window.addEventListener("pointerup", handleUp);
    },
    [rotation],
  );

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (contentMode === "code") {
        onRemoveCode();
        toast.success("Code snippet removed");
      } else {
        onRemoveImage();
        toast.success("Image removed");
      }
      resetTransform();
    },
    [contentMode, onRemoveCode, onRemoveImage, resetTransform],
  );

  useEffect(() => {
    if (!viewportRef.current) return;
    const el = viewportRef.current;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setSize({ w: width, h: height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const readFile = useCallback(
    (file: File | null | undefined) => {
      if (!file || !file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = () => {
        onImage(reader.result as string);
        toast.success("Image updated");
      };
      reader.readAsDataURL(file);
    },
    [onImage],
  );

  // Capture a screenshot of the entered website URL via /api/screenshot
  // (backed by SnapRender) and load it into the canvas as the content image.
  const handleCapture = useCallback(async () => {
    const raw = url.trim();
    if (!raw) {
      toast.error("Enter a website URL first");
      return;
    }
    if (capturing) return;

    const target = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;

    setCapturing(true);
    try {
      const res = await fetch(
        `/api/screenshot?url=${encodeURIComponent(target)}`,
      );
      const body = await res.json().catch(() => null);
      if (!res.ok || !body?.image) {
        throw new Error(body?.error || `Screenshot failed (${res.status})`);
      }
      onImage(body.image);
      toast.success("Website captured");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to capture website",
      );
    } finally {
      setCapturing(false);
    }
  }, [url, capturing, onImage]);

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const item = Array.from(e.clipboardData?.items ?? []).find((i) =>
        i.type.startsWith("image/"),
      );
      if (item) readFile(item.getAsFile());
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [readFile]);

  const backgroundLayer = layers.find((l) => l.id === "background");
  const contentLayer = layers.find((l) => l.id === "content");
  const backgroundIndex = layers.findIndex((l) => l.id === "background");
  const contentIndex = layers.findIndex((l) => l.id === "content");
  const backgroundZ = layers.length - backgroundIndex;
  const contentZ = layers.length - contentIndex;

  const hasSelectableContent =
    (contentMode === "website" && !!image) || contentMode === "code";

  return (
    <div
      ref={viewportRef}
      className="relative flex flex-1 items-center justify-center overflow-hidden bg-void p-10"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {showRulers && (
        <>
          <Ruler length={size.w} orientation="horizontal" />
          <Ruler length={size.h} orientation="vertical" />
          <div
            className="absolute left-0 top-0 bg-panel"
            style={{ width: RULER_SIZE, height: RULER_SIZE, zIndex: 6 }}
          />
        </>
      )}

      <div
        ref={canvasRef}
        className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-black shadow-2xl"
        style={{ aspectRatio: `${ASPECTS[aspect]}` }}
      >
        {/* Background layer */}
        <div
          className="absolute inset-0"
          style={{
            display: backgroundLayer?.visible === false ? "none" : "block",
            zIndex: backgroundZ,
            ...(background.image
              ? {
                  backgroundImage: `url(${background.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : { background: background.css }),
          }}
        />

        {/* Content layer */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            display: contentLayer?.visible === false ? "none" : "flex",
            zIndex: contentZ,
            padding: `${padding}%`,
            perspective: "1400px",
          }}
          onPointerDown={(e) => {
            // clicking empty canvas area deselects the frame
            if (e.target === e.currentTarget) setSelected(false);
          }}
        >
          {contentMode === "code" ? (
            <div
              ref={frameRef}
              onPointerDown={handleDragStart}
              className="relative w-full max-w-xl transition-transform duration-150"
              style={{
                transform: `translate(${pos.x}px, ${pos.y}px) rotate(${rotation}deg)`,
                transitionProperty: isTransforming ? "none" : undefined,
                cursor: selected ? "grab" : "pointer",
              }}
            >
              <div
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
                  <CodeBlock snippet={codeSnippet} />
                </div>
              </div>

              {selected && !isExporting && (
                <SelectionOverlay
                  onRotateStart={handleRotateStart}
                  onDelete={handleDelete}
                />
              )}
            </div>
          ) : !image ? (
            <div className="relative flex h-full w-full items-center justify-center">
              <div
                className="absolute inset-0 scale-110 bg-cover bg-center blur-2xl"
                style={
                  background.image
                    ? { backgroundImage: `url(${background.image})` }
                    : { background: background.css }
                }
              />
              <div className="absolute inset-0 bg-black/10" />

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  readFile(e.dataTransfer.files?.[0]);
                }}
                style={{
                  borderColor: dragging ? "#ffffff" : "rgba(255,255,255,0.6)",
                }}
                className={`relative flex w-[85%] max-w-md flex-col items-center gap-4 rounded-2xl border p-8 text-center backdrop-blur-xl transition ${
                  dragging ? "bg-white/20" : "bg-white/10 hover:bg-white/15"
                }`}
              >
                <button
                  onClick={() => inputRef.current?.click()}
                  className="flex h-12 w-12 items-center justify-center rounded-full text-white/90"
                  style={{ border: "1px solid rgba(255,255,255,0.7)" }}
                >
                  <Plus size={20} />
                </button>
                <span className="text-sm font-medium text-white">
                  Drag &amp; drop, click to browse, or paste
                </span>
                <span
                  className="flex items-center gap-1.5 rounded-md bg-black/30 px-2 py-1 font-mono text-[11px] text-white/70"
                  style={{ border: "1px solid rgba(255,255,255,0.6)" }}
                >
                  ⌘V to paste
                </span>

                <div className="my-1 flex w-full items-center gap-3">
                  <span className="h-px flex-1 bg-white/40" />
                  <span className="text-[11px] uppercase tracking-widest text-white/50">
                    or
                  </span>
                  <span className="h-px flex-1 bg-white/40" />
                </div>

                <div
                  className="flex w-full items-center gap-2 rounded-lg bg-black/30 px-3 py-2"
                  style={{ border: "1px solid rgba(255,255,255,0.5)" }}
                >
                  <Globe size={14} className="shrink-0 text-white/60" />
                  <input
                    value={url}
                    onChange={(e) => onUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !capturing) {
                        e.preventDefault();
                        handleCapture();
                      }
                    }}
                    placeholder="Enter website URL..."
                    disabled={capturing}
                    className="w-full bg-transparent text-xs text-white placeholder:text-white/40 outline-none disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={handleCapture}
                    disabled={capturing}
                    aria-label="Capture website"
                    className="shrink-0 text-white/60 transition hover:text-white disabled:cursor-not-allowed"
                  >
                    {capturing ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Camera size={14} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div
              ref={frameRef}
              onPointerDown={handleDragStart}
              className="relative w-full max-w-xl transition-transform duration-150"
              style={{
                transform: `translate(${pos.x}px, ${pos.y}px) rotate(${rotation}deg)`,
                transitionProperty: isTransforming ? "none" : undefined,
                cursor: selected ? "grab" : "pointer",
              }}
            >
              <div
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
                  <BrowserFrame
                    style={frameStyle}
                    url={url || "yoursite.com"}
                    className="w-full"
                    headerScale={headerSize}
                    radius={radius}
                  >
                    <div
                      className="relative h-full w-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${image})` }}
                    />
                  </BrowserFrame>
                </div>
              </div>

              {selected && !isExporting && (
                <SelectionOverlay
                  onRotateStart={handleRotateStart}
                  onDelete={handleDelete}
                />
              )}
            </div>
          )}

          {contentMode === "website" && image && !isExporting && !selected && (
            <div
              data-export-ignore="true"
              className="absolute bottom-4 right-4 flex items-center gap-2"
            >
              <button
                onClick={() => inputRef.current?.click()}
                className="flex items-center gap-1.5 rounded-full border border-white/25 bg-black/40 px-3 py-1.5 text-xs text-white/80 backdrop-blur transition hover:bg-black/60"
              >
                <Camera size={12} />
                Replace
              </button>
              <button
                onClick={() => {
                  onRemoveImage();
                  toast.success("Image removed");
                }}
                className="flex items-center gap-1.5 rounded-full border border-white/25 bg-black/40 px-3 py-1.5 text-xs text-white/80 backdrop-blur transition hover:bg-black/60"
              >
                <Trash2Icon size={12} />
                Remove
              </button>
            </div>
          )}

          {contentMode === "code" && !isExporting && !selected && (
            <div
              data-export-ignore="true"
              className="absolute bottom-4 right-4 flex items-center gap-2"
            >
              <button
                onClick={() => {
                  onRemoveCode();
                  toast.success("Code snippet removed");
                }}
                className="flex items-center gap-1.5 rounded-full border border-white/25 bg-black/40 px-3 py-1.5 text-xs text-white/80 backdrop-blur transition hover:bg-red-500"
              >
                <Trash2 size={12} />
                Remove
              </button>
            </div>
          )}
        </div>

        {/* Center snap guides — span the full canvas, shown while dragging */}
        {hasSelectableContent && guide.x && (
          <div
            className="pointer-events-none absolute bottom-0 top-0 left-1/2 w-px -translate-x-1/2"
            style={{ zIndex: layers.length + 2, backgroundColor: "#3b82f6" }}
          />
        )}
        {hasSelectableContent && guide.y && (
          <div
            className="pointer-events-none absolute left-0 right-0 top-1/2 h-px -translate-y-1/2"
            style={{ zIndex: layers.length + 2, backgroundColor: "#3b82f6" }}
          />
        )}

        {showGrid && (
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
              zIndex: layers.length + 1,
            }}
          />
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => readFile(e.target.files?.[0])}
      />
    </div>
  );
}

// Selection border, corner handles, and the floating rotate / delete toolbar.
// Rendered as a child of the frame wrapper so it moves and rotates with it.
function SelectionOverlay({
  onRotateStart,
  onDelete,
}: {
  onRotateStart: (e: React.PointerEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}) {
  return (
    <div
      data-export-ignore="true"
      data-no-drag="true"
      className="pointer-events-none absolute inset-0 z-50"
    >
      {/* selection border */}
      <div
        className="pointer-events-none absolute inset-0 rounded-md"
        style={{ border: "2px solid #3b82f6" }}
      />

      {/* corner handles */}
      <CornerHandle position="tl" />
      <CornerHandle position="tr" />
      <CornerHandle position="bl" />
      <CornerHandle position="br" />

      {/* connecting line up to the floating toolbar */}
      <div
        data-no-drag="true"
        className="pointer-events-none absolute left-1/2 top-0 h-9 w-px -translate-x-1/2 -translate-y-full"
        style={{ backgroundColor: "#3b82f6" }}
      />

      {/* rotate + delete toolbar */}
      <div
        data-no-drag="true"
        className="pointer-events-auto absolute left-1/2 top-0 flex -translate-x-1/2 -translate-y-[calc(100%+36px)] items-center gap-2"
      >
        <button
          data-no-drag="true"
          onPointerDown={onRotateStart}
          title="Rotate"
          aria-label="Rotate"
          className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-blue-600 shadow-md active:cursor-grabbing"
          style={{ cursor: "alias", border: "2px solid #3b82f6" }}
        >
          <RotateCw size={13} />
        </button>
        <button
          data-no-drag="true"
          onClick={onDelete}
          title="Delete"
          aria-label="Delete"
          className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-red-400 bg-white text-red-500 shadow-md transition hover:bg-red-50"
          style={{ cursor: "alias", border: "2px solid #3b82f6" }}
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
}
