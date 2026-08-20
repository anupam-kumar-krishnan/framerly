"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { toPng } from "html-to-image";
import TopBar from "@/components/editor/TopBar";
import LeftPanel, { PageTheme } from "@/components/editor/LeftPanel";
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
} from "@/components/editor/types";
import { toast } from "sonner";

type EditorState = {
  device: DeviceType;
  frameStyle: FrameStyle;
  url: string;
  pageTheme: PageTheme;
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
  device: "browser",
  frameStyle: "chrome-dark",
  url: "https://framerly-shot.vercel.app",
  pageTheme: "dark",
  headerSize: 100,
  shadow: "soft",
  background: BACKGROUND_PRESETS[0],
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

export default function StudioPage() {
  const [historyState, dispatch] = useReducer(historyReducer, {
    entries: [INITIAL_STATE],
    index: 0,
  });
  const lastChangeRef = useRef<{ key: string; time: number } | null>(null);

  const state = historyState.entries[historyState.index];

  const [isExporting, setIsExporting] = useState(false);
  const [showRulers, setShowRulers] = useState(false);
  const [showGrid, setShowGrid] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);

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
    } catch {
      // clipboard write can fail without permissions; silently ignore
    }
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
        updateState({ background: BACKGROUND_PRESETS[8] });
        toast.success("Background reset");
      }
    },
    [state.contentMode, updateState],
  );

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
          pageTheme={state.pageTheme}
          onPageTheme={(t) => updateState({ pageTheme: t })}
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
          mainImage={state.image}
        />
        <Canvas
          device={state.device}
          frameStyle={state.frameStyle}
          url={state.url}
          onUrl={(u) => updateState({ url: u })}
          pageTheme={state.pageTheme}
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
          isExporting={isExporting}
          contentMode={state.contentMode}
          codeSnippet={state.codeSnippet}
          onRemoveCode={() => updateState({ contentMode: "website" })}
          showRulers={showRulers}
          showGrid={showGrid}
          layers={state.layers}
        />
        <RightPanel
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
        />
      </div>
    </div>
  );
}
