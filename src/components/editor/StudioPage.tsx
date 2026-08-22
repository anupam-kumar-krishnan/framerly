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
import { PageTheme } from "./types";
import { AnimationPreset, getPreset } from "@/remotion/animationPresets";
import {
  AnimationClip,
  FPS,
  createClipFromPreset,
  resolveAnimationStyle,
  totalClipFrames,
} from "@/remotion/animationClips";

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

      return { entries: newEntries, index: newEntries.length - 1 };
    }
    case "UNDO":
      return { ...state, index: Math.max(0, state.index - 1) };
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

function TimelineBar({
  hasAnimationClip,
  activePresetLabel,
  isPlaying,
  onPlayToggle,
  currentSeconds,
  durationSeconds,
  currentFrame,
  durationFrames,
  onSeek,
  onAddAnimation,
  onDelete,
  onClose,
  loopEnabled,
  onToggleLoop,
  assetLabel,
  assetSubLabel,
}: {
  hasAnimationClip: boolean;
  activePresetLabel: string;
  isPlaying: boolean;
  onPlayToggle: () => void;
  currentSeconds: number;
  durationSeconds: number;
  currentFrame: number;
  durationFrames: number;
  onSeek: (frame: number) => void;
  onAddAnimation: () => void;
  onDelete: () => void;
  onClose: () => void;
  loopEnabled: boolean;
  onToggleLoop: () => void;
  assetLabel: string;
  assetSubLabel: string;
}) {
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
          onClick={onDelete}
          disabled={!hasAnimationClip}
          title="Remove animation"
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

          <div className="relative flex-1 px-2 py-2">
            {hasAnimationClip ? (
              <div className="flex h-7 w-40 items-center justify-between rounded-md bg-gradient-to-r from-amber/90 to-amber/50 px-2 text-[11px] font-medium text-void">
                <span className="truncate">{activePresetLabel}</span>
                <span className="font-mono">{formatTime(durationSeconds)}</span>
              </div>
            ) : (
              <div className="flex h-7 w-full items-center rounded-md border border-dashed border-line px-2 text-[11px] text-ink-faint">
                No animation yet — click Add Animation
              </div>
            )}
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

  // Timeline is now a sequence of clips rather than a single active preset.
  const [animationClips, setAnimationClips] = useState<AnimationClip[]>([]);
  const [animationFrame, setAnimationFrame] = useState(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [loopEnabled, setLoopEnabled] = useState(true);
  const [timelineOpen, setTimelineOpen] = useState(true);

  const hasAnimationClip = animationClips.length > 0;

  const animationFrameRef = useRef(0);
  useEffect(() => {
    animationFrameRef.current = animationFrame;
  }, [animationFrame]);

  const updateState = useCallback((updates: Partial<EditorState>) => {
    const keys = Object.keys(updates).sort();
    const mergeKey = keys.join(",");
    const now = Date.now();

    const shouldMerge =
      !!lastChangeRef.current &&
      lastChangeRef.current.key === mergeKey &&
      now - lastChangeRef.current.time < MERGE_WINDOW_MS;

    lastChangeRef.current = { key: mergeKey, time: now };

    dispatch({ type: "UPDATE", updates, shouldMerge });
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

  const durationFrames = totalClipFrames(animationClips);
  const durationSeconds = durationFrames / FPS;
  const currentSeconds = animationFrame / FPS;

  const animationStyle = useMemo(
    () => resolveAnimationStyle(animationFrame, animationClips),
    [animationFrame, animationClips],
  );

  const activePresetLabel = useMemo(() => {
    if (animationClips.length === 0) return "";
    if (animationClips.length === 1) {
      return getPreset(animationClips[0].presetId).label;
    }
    return `${animationClips.length} clips`;
  }, [animationClips]);

  // Plays the clip sequence directly on the real center canvas.
  // Runs only while `isPlaying` is true, resuming from the current frame
  // rather than restarting from 0 each time playback is toggled.
  useEffect(() => {
    if (isVideoExporting || !isPlaying || !hasAnimationClip) return;

    let frame = animationFrameRef.current % durationFrames;
    let raf = 0;
    let lastTime = performance.now();
    const frameDuration = 1000 / FPS;

    const tick = (now: number) => {
      if (now - lastTime >= frameDuration) {
        const elapsedFrames = Math.floor((now - lastTime) / frameDuration);
        const next = frame + Math.max(1, elapsedFrames);

        if (next >= durationFrames) {
          if (!loopEnabled) {
            setAnimationFrame(durationFrames - 1);
            setIsPlaying(false);
            return;
          }
          frame = next % durationFrames;
        } else {
          frame = next;
        }

        lastTime = now;
        setAnimationFrame(frame);
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [
    isPlaying,
    hasAnimationClip,
    loopEnabled,
    durationFrames,
    isVideoExporting,
  ]);

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
    await new Promise((resolve) => requestAnimationFrame(resolve));
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
  }, [updateState]);

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
        new ClipboardItem({ [blob.type]: blob }),
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
        updateState({ background: getBackgroundById(DEFAULT_BACKGROUND_ID) });
        toast.success("Background reset");
      }
    },
    [state.contentMode, updateState],
  );

  // Timeline bar handlers.
  const handlePlayToggle = useCallback(() => {
    if (!hasAnimationClip) return;
    setIsPlaying((p) => !p);
  }, [hasAnimationClip]);

  const handleSeek = useCallback(
    (frame: number) => {
      setIsPlaying(false);
      setAnimationFrame(Math.min(durationFrames - 1, Math.max(0, frame)));
    },
    [durationFrames],
  );

  const handleAddAnimation = useCallback(() => {
    setMode("flat");
    setTimelineOpen(true);
  }, []);

  // Called from RightPanel's Motion tab when the user picks a preset —
  // appends it to the clip sequence and plays the result back.
  const handleAddAnimationClip = useCallback((preset: AnimationPreset) => {
    setAnimationClips((prev) => [...prev, createClipFromPreset(preset)]);
    setAnimationFrame(0);
    setIsPlaying(true);
    setTimelineOpen(true);
  }, []);

  const handleDeleteAnimation = useCallback(() => {
    setAnimationClips([]);
    setIsPlaying(false);
    setAnimationFrame(0);
  }, []);

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
    <div className="flex h-screen flex-col bg-void text-ink">
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
              hasAnimationClip={hasAnimationClip}
              activePresetLabel={activePresetLabel}
              isPlaying={isPlaying}
              onPlayToggle={handlePlayToggle}
              currentSeconds={currentSeconds}
              durationSeconds={durationSeconds}
              currentFrame={animationFrame}
              durationFrames={durationFrames}
              onSeek={handleSeek}
              onAddAnimation={handleAddAnimation}
              onDelete={handleDeleteAnimation}
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
          totalFrames={durationFrames}
          onAnimationFrame={setAnimationFrame}
          onVideoExporting={setIsVideoExporting}
        />
      </div>
    </div>
  );
}
