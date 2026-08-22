"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { toPng } from "html-to-image";
import {
  ChevronUp,
  Image as ImageIcon,
  Pause,
  Play,
  Plus,
  Repeat,
  Trash2,
  Wand2,
  X,
} from "lucide-react";
import TopBar from "@/components/editor/TopBar";
import LeftPanel from "@/components/editor/LeftPanel";
import Canvas from "@/components/editor/Canvas";
import RightPanel from "@/components/editor/RightPanel";
import { FrameStyle } from "@/components/shared/BrowserFrame";
import {
  AspectRatio,
  BACKGROUND_PRESETS,
  BackgroundPreset,
  CodeSnippetState,
  ContentMode,
  DeviceType,
  LayerItem,
  ShadowPreset,
  getBackgroundById,
  DEFAULT_BACKGROUND_ID,
  DEFAULT_DEVICE,
} from "@/components/editor/types";
import { toast } from "sonner";
import { PageTheme } from "@/components/editor/LeftPanel";
import { AnimationPreset, getPreset } from "@/remotion/animationPresets";
import {
  AnimationClip,
  FPS,
  clipFrames,
  createClipFromPreset,
  resolveAnimationStyle,
  startFrameOfClip,
  totalClipFrames,
} from "@/remotion/animationClips";
import MobileStudioNotice from "@/components/shared/MobileStudioNotice";

type EditorState = {
  device: DeviceType;
  frameStyle: FrameStyle;
  url: string;
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
  contentMode: ContentMode;
  codeSnippet: CodeSnippetState;
  layers: LayerItem[];
};

const DEFAULT_LAYERS: LayerItem[] = [
  { id: "content", label: "Content", visible: true },
  { id: "background", label: "Background", visible: true },
];

const DEFAULT_CODE_SNIPPET: CodeSnippetState = {
  code: `function greet(name) {\n  return \`Hello, \${name}!\`;\n}`,
  language: "javascript",
  theme: "dracula",
  font: "JetBrains Mono",
  fontSize: 14,
  showLineNumbers: true,
  showWindowChrome: true,
  compact: false,
};

const INITIAL_STATE: EditorState = {
  device: DEFAULT_DEVICE,
  frameStyle: "chrome-dark",
  url: "https://framerly-shot.vercel.app",
  headerSize: 100,
  shadow: "soft",
  background: getBackgroundById(DEFAULT_BACKGROUND_ID),
  padding: 10,
  radius: 16,
  zoom: 100,
  tiltX: 0,
  tiltY: 0,
  aspect: "4:3",
  image: null,
  contentMode: "website",
  codeSnippet: DEFAULT_CODE_SNIPPET,
  layers: DEFAULT_LAYERS,
};

const MERGE_WINDOW_MS = 400;
const HISTORY_LIMIT = 100;

// Pixels per second of timeline — controls how wide each clip block renders.
const PIXELS_PER_SECOND = 90;
const MIN_CLIP_MS = 300;

type HistoryState = { entries: EditorState[]; index: number };

type HistoryAction =
  | { type: "UPDATE"; updates: Partial<EditorState>; shouldMerge: boolean }
  | { type: "UNDO" }
  | { type: "REDO" };

function historyReducer(
  state: HistoryState,
  action: HistoryAction,
): HistoryState {
  switch (action.type) {
    case "UPDATE": {
      const { updates, shouldMerge } = action;
      const current = state.entries[state.index];
      const next = { ...current, ...updates };

      const base = shouldMerge
        ? state.entries.slice(0, state.index)
        : state.entries.slice(0, state.index + 1);

      let newEntries = [...base, next];

      if (newEntries.length > HISTORY_LIMIT) {
        newEntries = newEntries.slice(newEntries.length - HISTORY_LIMIT);
      }

      return {
        entries: newEntries,
        index: newEntries.length - 1,
      };
    }

    case "UNDO":
      return {
        ...state,
        index: Math.max(0, state.index - 1),
      };

    case "REDO":
      return {
        ...state,
        index: Math.min(state.entries.length - 1, state.index + 1),
      };

    default:
      return state;
  }
}

function formatTime(seconds: number) {
  const s = Math.max(0, seconds);
  return `0:${Math.floor(s).toString().padStart(2, "0")}`;
}

/**
 * A single clip block on the animations track: shows preset label +
 * duration, can be selected, deleted (X on hover, top-right), and resized
 * by dragging its right edge.
 */
function ClipBlock({
  clip,
  isSelected,
  onSelect,
  onDelete,
  onResize,
}: {
  clip: AnimationClip;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onResize: (durationMs: number) => void;
}) {
  const preset = getPreset(clip.presetId);
  const widthPx = Math.max(40, (clipFrames(clip) / FPS) * PIXELS_PER_SECOND);

  const handleResizeStart = (e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    (e.target as Element).setPointerCapture(e.pointerId);

    const startX = e.clientX;
    const startDuration = clip.durationMs;

    const handleMove = (ev: PointerEvent) => {
      const deltaMs = ((ev.clientX - startX) / PIXELS_PER_SECOND) * 1000;
      onResize(Math.max(MIN_CLIP_MS, Math.round(startDuration + deltaMs)));
    };

    const handleUp = () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  };

  return (
    <div
      onClick={onSelect}
      style={{ width: widthPx }}
      className={`group relative flex h-7 shrink-0 cursor-pointer select-none items-center justify-between rounded-md px-2 text-[11px] font-medium text-void transition ${
        isSelected
          ? "bg-gradient-to-r from-amber to-amber/70 ring-2 ring-amber"
          : "bg-gradient-to-r from-amber/90 to-amber/50"
      }`}
    >
      <span className="truncate">{preset.label}</span>
      <span className="ml-1 shrink-0 font-mono text-[10px] opacity-70">
        {(clip.durationMs / 1000).toFixed(1)}s
      </span>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        title="Remove clip"
        className="absolute -right-1.5 -top-1.5 hidden h-4 w-4 items-center justify-center rounded-full border border-void bg-white text-void shadow group-hover:flex"
      >
        <X size={10} />
      </button>

      <div
        onPointerDown={handleResizeStart}
        title="Drag to resize"
        className="absolute -right-1 top-0 flex h-full w-3 cursor-ew-resize items-center justify-end opacity-0 group-hover:opacity-100"
      >
        <div className="h-4 w-1 rounded bg-void/40" />
      </div>
    </div>
  );
}

function TimelineBar({
  clips,
  selectedClipId,
  onSelectClip,
  onDeleteClip,
  onResizeClip,
  isPlaying,
  onPlayToggle,
  currentSeconds,
  durationSeconds,
  currentFrame,
  durationFrames,
  onSeek,
  onAddAnimation,
  onDeleteSelected,
  onClose,
  loopEnabled,
  onToggleLoop,
  assetLabel,
  assetSubLabel,
}: {
  clips: AnimationClip[];
  selectedClipId: string | null;
  onSelectClip: (id: string) => void;
  onDeleteClip: (id: string) => void;
  onResizeClip: (id: string, durationMs: number) => void;
  isPlaying: boolean;
  onPlayToggle: () => void;
  currentSeconds: number;
  durationSeconds: number;
  currentFrame: number;
  durationFrames: number;
  onSeek: (frame: number) => void;
  onAddAnimation: () => void;
  onDeleteSelected: () => void;
  onClose: () => void;
  loopEnabled: boolean;
  onToggleLoop: () => void;
  assetLabel: string;
  assetSubLabel: string;
}) {
  const hasAnimationClip = clips.length > 0;

  return (
    <div className="flex shrink-0 flex-col border-t border-line-soft bg-panel">
      <div className="flex items-center gap-3 border-b border-line-soft px-4 py-2.5">
        <button
          onClick={onAddAnimation}
          className="flex items-center gap-1.5 rounded-md border border-line bg-panel-2 px-3 py-1.5 text-xs font-medium text-ink transition hover:border-amber/50"
        >
          <Plus size={14} />
          Add Animation
        </button>

        <button
          onClick={onToggleLoop}
          title="Loop playback"
          className={`rounded-md p-1.5 transition ${
            loopEnabled ? "text-amber" : "text-ink-faint hover:text-ink-dim"
          }`}
        >
          <Repeat size={14} />
        </button>

        <div className="flex flex-1 items-center justify-center">
          <button
            onClick={onPlayToggle}
            disabled={!hasAnimationClip}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-panel-2 text-ink transition hover:bg-panel-2/70 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isPlaying ? (
              <Pause size={14} />
            ) : (
              <Play size={14} className="ml-0.5" />
            )}
          </button>
        </div>

        <span className="font-mono text-xs text-ink-dim">
          {formatTime(currentSeconds)} / {formatTime(durationSeconds)}
        </span>

        <input
          type="range"
          min={0}
          max={Math.max(0, durationFrames - 1)}
          value={currentFrame}
          disabled={!hasAnimationClip}
          onChange={(e) => onSeek(Number(e.target.value))}
          className="w-32 disabled:opacity-40"
        />

        <button
          onClick={onDeleteSelected}
          disabled={!selectedClipId}
          title="Remove selected clip"
          className="rounded-md p-1.5 text-ink-faint transition hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <Trash2 size={14} />
        </button>

        <button
          onClick={onClose}
          title="Hide timeline"
          className="rounded-md p-1.5 text-ink-faint transition hover:text-ink"
        >
          <X size={14} />
        </button>
      </div>

      <div className="flex max-h-32 flex-col overflow-y-auto scrollbar-thin">
        <div className="flex items-stretch border-b border-line-soft">
          <div className="flex w-28 shrink-0 items-center gap-1.5 border-r border-line-soft px-3 py-2 text-xs text-ink-dim">
            <Wand2 size={12} />
            Animations
          </div>

          <div className="relative flex-1 overflow-x-auto px-2 py-2">
            <div className="flex items-center gap-1">
              {clips.map((clip) => (
                <ClipBlock
                  key={clip.id}
                  clip={clip}
                  isSelected={clip.id === selectedClipId}
                  onSelect={() => onSelectClip(clip.id)}
                  onDelete={() => onDeleteClip(clip.id)}
                  onResize={(ms) => onResizeClip(clip.id, ms)}
                />
              ))}

              <button
                onClick={onAddAnimation}
                title="Add animation"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-dashed border-line text-ink-faint transition hover:border-amber hover:text-amber"
              >
                <Plus size={14} />
              </button>

              {clips.length === 0 && (
                <div className="flex h-7 flex-1 items-center rounded-md border border-dashed border-line px-2 text-[11px] text-ink-faint">
                  No animation yet — click Add Animation
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-stretch">
          <div className="flex w-28 shrink-0 items-center gap-1.5 border-r border-line-soft px-3 py-2 text-xs text-ink-dim">
            <ImageIcon size={12} />
            Content
          </div>

          <div className="relative flex-1 px-2 py-2">
            <div className="flex h-7 w-full items-center gap-2 rounded-md bg-panel-2 px-2 text-[11px] text-ink-dim">
              <span className="truncate font-medium text-ink">
                {assetLabel}
              </span>
              {assetSubLabel && (
                <span className="truncate text-ink-faint">{assetSubLabel}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StudioPage() {
  const [historyState, dispatch] = useReducer(historyReducer, {
    entries: [INITIAL_STATE],
    index: 0,
  });

  const lastChangeRef = useRef<{ key: string; time: number } | null>(null);

  const state = historyState.entries[historyState.index];

  const [isExporting, setIsExporting] = useState(false);
  const [isVideoExporting, setIsVideoExporting] = useState(false);
  const [showRulers, setShowRulers] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [pageTheme, setPageTheme] = useState<PageTheme>("light");

  const canvasRef = useRef<HTMLDivElement>(null);

  // Right-panel tab (3D vs Motion) — lifted up so the timeline bar's
  // "Add Animation" button can switch to the Motion tab.
  const [mode, setMode] = useState<"3d" | "flat">("3d");

  // --- Animation timeline state (sequential clips) ------------------------
  const [animationClips, setAnimationClips] = useState<AnimationClip[]>([]);
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);
  const [animationFrame, setAnimationFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loopEnabled, setLoopEnabled] = useState(false);
  const [timelineOpen, setTimelineOpen] = useState(true);

  const totalFrames = useMemo(
    () => totalClipFrames(animationClips),
    [animationClips],
  );
  const animationStyle = useMemo(
    () => resolveAnimationStyle(animationFrame, animationClips),
    [animationFrame, animationClips],
  );
  const hasAnimationClip = animationClips.length > 0;

  const durationSeconds = totalFrames / FPS;
  const currentSeconds = animationFrame / FPS;

  const animationRafRef = useRef<number | null>(null);

  // Mutable mirrors so the RAF tick always reads fresh values without
  // needing to be re-created (and thus reset) every time state changes.
  const currentFrameRef = useRef(0);
  const totalFramesRef = useRef(totalFrames);
  const loopRef = useRef(loopEnabled);

  useEffect(() => {
    currentFrameRef.current = animationFrame;
  }, [animationFrame]);

  useEffect(() => {
    totalFramesRef.current = totalFrames;
  }, [totalFrames]);

  useEffect(() => {
    loopRef.current = loopEnabled;
  }, [loopEnabled]);

  const updateState = useCallback((updates: Partial<EditorState>) => {
    const keys = Object.keys(updates).sort();
    const mergeKey = keys.join(",");
    const now = Date.now();

    const shouldMerge =
      !!lastChangeRef.current &&
      lastChangeRef.current.key === mergeKey &&
      now - lastChangeRef.current.time < MERGE_WINDOW_MS;

    lastChangeRef.current = {
      key: mergeKey,
      time: now,
    };

    dispatch({
      type: "UPDATE",
      updates,
      shouldMerge,
    });
  }, []);

  const undo = useCallback(() => {
    lastChangeRef.current = null;
    dispatch({ type: "UNDO" });
  }, []);

  const redo = useCallback(() => {
    lastChangeRef.current = null;
    dispatch({ type: "REDO" });
  }, []);

  const canUndo = historyState.index > 0;
  const canRedo = historyState.index < historyState.entries.length - 1;

  const stopAnimation = useCallback(() => {
    if (animationRafRef.current !== null) {
      cancelAnimationFrame(animationRafRef.current);
      animationRafRef.current = null;
    }
  }, []);

  /**
   * Drives playback from `fromFrame` across the whole clip sequence.
   * Respects the loop toggle and stops itself (updating isPlaying) when it
   * reaches the end of the sequence and looping is off.
   */
  const runLoop = useCallback(
    (fromFrame: number) => {
      stopAnimation();

      const total = Math.max(1, totalFramesRef.current);
      let frame = fromFrame % total;
      let lastTime = performance.now();
      const frameDuration = 1000 / FPS;

      const tick = (now: number) => {
        if (now - lastTime >= frameDuration) {
          const elapsed = Math.floor((now - lastTime) / frameDuration);
          const next = frame + Math.max(1, elapsed);

          if (next >= total) {
            if (loopRef.current) {
              frame = next % total;
            } else {
              setAnimationFrame(total - 1);
              setIsPlaying(false);
              animationRafRef.current = null;
              return;
            }
          } else {
            frame = next;
          }

          lastTime = now;
          setAnimationFrame(frame);
        }

        animationRafRef.current = requestAnimationFrame(tick);
      };

      animationRafRef.current = requestAnimationFrame(tick);
    },
    [stopAnimation],
  );

  useEffect(() => {
    return () => stopAnimation();
  }, [stopAnimation]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const cmd = e.metaKey || e.ctrlKey;
      if (!cmd) return;

      const target = e.target as HTMLElement | null;

      const isEditable =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      if (isEditable) return;

      if (e.key.toLowerCase() === "z" && e.shiftKey) {
        e.preventDefault();
        redo();
      } else if (e.key.toLowerCase() === "z") {
        e.preventDefault();
        undo();
      } else if (e.key.toLowerCase() === "y") {
        e.preventDefault();
        redo();
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [undo, redo]);

  const exportPng = useCallback(async () => {
    if (!canvasRef.current) return null;

    setIsExporting(true);

    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => resolve()),
    );

    try {
      return await toPng(canvasRef.current, {
        pixelRatio: 2,
        cacheBust: true,
      });
    } finally {
      setIsExporting(false);
    }
  }, []);

  const handleReset = useCallback(() => {
    updateState({ ...INITIAL_STATE });
    stopAnimation();
    setAnimationClips([]);
    setSelectedClipId(null);
    setAnimationFrame(0);
    setIsPlaying(false);
  }, [stopAnimation, updateState]);

  const handleSave = useCallback(async () => {
    const dataUrl = await exportPng();

    if (!dataUrl) return;

    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "framerly-shot.png";
    a.click();
  }, [exportPng]);

  const handleCopy = useCallback(async () => {
    const dataUrl = await exportPng();

    if (!dataUrl) return;

    try {
      const res = await fetch(dataUrl);
      const blob = await res.blob();

      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);
    } catch {}
  }, [exportPng]);

  const handleDeleteLayer = useCallback(
    (id: LayerItem["id"]) => {
      if (id === "content") {
        updateState({
          contentMode:
            state.contentMode === "code" ? "website" : state.contentMode,
          image: null,
        });

        toast.success("Content cleared");
      } else if (id === "background") {
        updateState({
          background: getBackgroundById(DEFAULT_BACKGROUND_ID),
        });

        toast.success("Background reset");
      }
    },
    [state.contentMode, updateState],
  );

  // Appends a new clip built from `preset` to the end of the sequence,
  // selects it, jumps the playhead to its start frame, and plays from there.
  const handleAddAnimationClip = useCallback(
    (preset: AnimationPreset) => {
      const clip = createClipFromPreset(preset);

      setAnimationClips((prev) => {
        const next = [...prev, clip];
        const startFrame = startFrameOfClip(prev, prev.length);
        totalFramesRef.current = totalClipFrames(next);

        setSelectedClipId(clip.id);
        setAnimationFrame(startFrame);
        setIsPlaying(true);
        setTimelineOpen(true);
        runLoop(startFrame);

        return next;
      });
    },
    [runLoop],
  );

  const handleDeleteClip = useCallback(
    (id: string) => {
      stopAnimation();
      setIsPlaying(false);
      setAnimationClips((prev) => prev.filter((c) => c.id !== id));
      setSelectedClipId((cur) => (cur === id ? null : cur));
      setAnimationFrame(0);
    },
    [stopAnimation],
  );

  const handleDeleteSelectedClip = useCallback(() => {
    if (!selectedClipId) return;
    handleDeleteClip(selectedClipId);
  }, [selectedClipId, handleDeleteClip]);

  const handleResizeClip = useCallback((id: string, durationMs: number) => {
    setAnimationClips((prev) =>
      prev.map((c) => (c.id === id ? { ...c, durationMs } : c)),
    );
  }, []);

  const handlePlayToggle = useCallback(() => {
    if (!hasAnimationClip) return;

    if (isPlaying) {
      stopAnimation();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      runLoop(currentFrameRef.current);
    }
  }, [hasAnimationClip, isPlaying, runLoop, stopAnimation]);

  const handleSeek = useCallback(
    (frame: number) => {
      stopAnimation();
      setIsPlaying(false);
      setAnimationFrame(Math.min(totalFrames - 1, Math.max(0, frame)));
    },
    [stopAnimation, totalFrames],
  );

  const handleAddAnimation = useCallback(() => {
    setMode("flat");
    setTimelineOpen(true);
  }, []);

  const handleVideoExportingChange = useCallback(
    (value: boolean) => {
      setIsVideoExporting(value);
      if (value) {
        // Don't let the playback loop fight the frame-by-frame export.
        stopAnimation();
        setIsPlaying(false);
      }
    },
    [stopAnimation],
  );

  const assetLabel =
    state.contentMode === "code"
      ? "Code snippet"
      : state.image
        ? "Screenshot"
        : "Website";
  const assetSubLabel =
    state.contentMode === "code"
      ? state.codeSnippet.language
      : state.image
        ? state.url || "Uploaded image"
        : state.url;

  return (
    <>
      <div className="md:hidden">
        <MobileStudioNotice />
      </div>

      <div className="hidden md:flex h-screen flex-col bg-void text-ink">
        <TopBar
          aspect={state.aspect}
          onAspect={(a) => updateState({ aspect: a })}
          onCopy={handleCopy}
          onSave={handleSave}
          onReset={handleReset}
          onUndo={undo}
          onRedo={redo}
          canUndo={canUndo}
          canRedo={canRedo}
          showRulers={showRulers}
          onToggleRulers={() => setShowRulers((v) => !v)}
          showGrid={showGrid}
          onToggleGrid={() => setShowGrid((v) => !v)}
          githubRepo="anupam-kumar-krishnan/framerly"
        />

        <div className="flex flex-1 overflow-hidden">
          <LeftPanel
            device={state.device}
            onDevice={(d) => updateState({ device: d })}
            frameStyle={state.frameStyle}
            onFrameStyle={(f) => updateState({ frameStyle: f })}
            url={state.url}
            onUrl={(u) => updateState({ url: u })}
            headerSize={state.headerSize}
            onHeaderSize={(h) => updateState({ headerSize: h })}
            shadow={state.shadow}
            onShadow={(s) => updateState({ shadow: s })}
            background={state.background}
            onBackground={(b) => updateState({ background: b })}
            radius={state.radius}
            onRadius={(r) => updateState({ radius: r })}
            codeSnippet={state.codeSnippet}
            onCodeSnippet={(c) => updateState({ codeSnippet: c })}
            onAddCodeToCanvas={() => updateState({ contentMode: "code" })}
            layers={state.layers}
            onLayers={(l) => updateState({ layers: l })}
            onDeleteLayer={handleDeleteLayer}
            pageTheme={pageTheme}
            onPageTheme={setPageTheme}
            mainImage={state.image}
          />

          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="flex-1 overflow-hidden">
              <Canvas
                device={state.device}
                frameStyle={state.frameStyle}
                url={state.url}
                onUrl={(u) => updateState({ url: u })}
                headerSize={state.headerSize}
                shadow={state.shadow}
                background={state.background}
                padding={state.padding}
                radius={state.radius}
                zoom={state.zoom}
                tiltX={state.tiltX}
                tiltY={state.tiltY}
                aspect={state.aspect}
                image={state.image}
                onImage={(img) => updateState({ image: img })}
                onRemoveImage={() => updateState({ image: null })}
                canvasRef={canvasRef}
                isExporting={isExporting || isVideoExporting}
                animationStyle={animationStyle}
                contentMode={state.contentMode}
                codeSnippet={state.codeSnippet}
                onRemoveCode={() => updateState({ contentMode: "website" })}
                showRulers={showRulers}
                showGrid={showGrid}
                layers={state.layers}
                pageTheme={pageTheme}
              />
            </div>

            {timelineOpen ? (
              <TimelineBar
                clips={animationClips}
                selectedClipId={selectedClipId}
                onSelectClip={setSelectedClipId}
                onDeleteClip={handleDeleteClip}
                onResizeClip={handleResizeClip}
                isPlaying={isPlaying}
                onPlayToggle={handlePlayToggle}
                currentSeconds={currentSeconds}
                durationSeconds={durationSeconds}
                currentFrame={animationFrame}
                durationFrames={totalFrames}
                onSeek={handleSeek}
                onAddAnimation={handleAddAnimation}
                onDeleteSelected={handleDeleteSelectedClip}
                onClose={() => setTimelineOpen(false)}
                loopEnabled={loopEnabled}
                onToggleLoop={() => setLoopEnabled((v) => !v)}
                assetLabel={assetLabel}
                assetSubLabel={assetSubLabel}
              />
            ) : (
              <button
                onClick={() => setTimelineOpen(true)}
                className="flex shrink-0 items-center justify-center gap-1.5 border-t border-line-soft bg-panel py-1.5 text-xs text-ink-faint transition hover:text-ink"
              >
                <ChevronUp size={12} />
                Show timeline
              </button>
            )}
          </div>

          <RightPanel
            mode={mode}
            onModeChange={setMode}
            zoom={state.zoom}
            onZoom={(z) => updateState({ zoom: z })}
            tiltX={state.tiltX}
            tiltY={state.tiltY}
            onTilt={(x, y) => updateState({ tiltX: x, tiltY: y })}
            onPreset={(p) =>
              updateState({
                zoom: p.zoom,
                tiltX: p.tiltX,
                tiltY: p.tiltY,
                padding: p.padding,
              })
            }
            padding={state.padding}
            background={state.background}
            frameStyle={state.frameStyle}
            url={state.url}
            headerSize={state.headerSize}
            shadow={state.shadow}
            radius={state.radius}
            image={state.image}
            contentMode={state.contentMode}
            codeSnippet={state.codeSnippet}
            device={state.device}
            canvasRef={canvasRef}
            animationClips={animationClips}
            onAddAnimationClip={handleAddAnimationClip}
            totalFrames={totalFrames}
            onAnimationFrame={setAnimationFrame}
            onVideoExporting={handleVideoExportingChange}
          />
        </div>
      </div>
    </>
  );
}
