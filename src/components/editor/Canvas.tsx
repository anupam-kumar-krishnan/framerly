"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Camera, Globe, Plus, Trash2, Trash2Icon, X } from "lucide-react";
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
  const [dragging, setDragging] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

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
        >
          {contentMode === "code" ? (
            <div
              className="relative w-full max-w-xl transition-transform duration-150"
              style={{
                transform: `scale(${zoom / 100}) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
                transformStyle: "preserve-3d",
              }}
            >
              <div
                style={{ boxShadow: SHADOW_CSS[shadow], borderRadius: radius }}
              >
                <CodeBlock snippet={codeSnippet} />
              </div>
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
                    placeholder="Enter website URL..."
                    className="w-full bg-transparent text-xs text-white placeholder:text-white/40 outline-none"
                  />
                  <Camera size={14} className="shrink-0 text-white/60" />
                </div>
              </div>
            </div>
          ) : (
            <div
              className="relative w-full max-w-xl transition-transform duration-150"
              style={{
                transform: `scale(${zoom / 100}) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
                transformStyle: "preserve-3d",
              }}
            >
              <div
                style={{ boxShadow: SHADOW_CSS[shadow], borderRadius: radius }}
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
          )}

          {contentMode === "website" && image && !isExporting && (
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

          {contentMode === "code" && !isExporting && (
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
