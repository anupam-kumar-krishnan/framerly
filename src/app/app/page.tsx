"use client";

import { useCallback, useRef, useState } from "react";
import { toPng } from "html-to-image";
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
  LayerItem,
  ShadowPreset,
} from "@/components/editor/types";

export default function StudioPage() {
  const [frameStyle, setFrameStyle] = useState<FrameStyle>("chrome-dark");
  const [url, setUrl] = useState("framerly.vercel.app");
  const [headerSize, setHeaderSize] = useState(100);
  const [shadow, setShadow] = useState<ShadowPreset>("soft");
  const [background, setBackground] = useState<BackgroundPreset>(
    BACKGROUND_PRESETS[0],
  );

  const [padding, setPadding] = useState(10);
  const [radius, setRadius] = useState(16);
  const [zoom, setZoom] = useState(100);
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);
  const [aspect, setAspect] = useState<AspectRatio>("4:3");
  const [image, setImage] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [layers, setLayers] = useState<LayerItem[]>([]);

  const [contentMode, setContentMode] = useState<ContentMode>("website");
  const [codeSnippet, setCodeSnippet] = useState<CodeSnippetState>({
    code: `function greet(name) {\n  return \`Hello, \${name}!\`;\n}`,
    language: "javascript",
    theme: "dracula",
    font: "JetBrains Mono",
    showLineNumbers: true,
    showWindowChrome: true,
    compact: false,
  });

  const canvasRef = useRef<HTMLDivElement>(null);

  const exportPng = useCallback(async () => {
    if (!canvasRef.current) return null;
    setIsExporting(true);
    // wait a frame so React actually removes the button before we capture
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

  const [showRulers, setShowRulers] = useState(false);
  const [showGrid, setShowGrid] = useState(false);

  const handleReset = useCallback(() => {
    setFrameStyle("chrome-dark");
    setUrl("framerly.vercel.app");
    setHeaderSize(100);
    setShadow("soft");
    setBackground(BACKGROUND_PRESETS[0]);
    setPadding(10);
    setRadius(16);
    setZoom(100);
    setTiltX(0);
    setTiltY(0);
    setAspect("4:3");
    setImage(null);
    setContentMode("website");
  }, []);

  const handleSave = useCallback(async () => {
    const dataUrl = await exportPng();
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "framely-shot.png";
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

  return (
    <div className="flex h-screen flex-col bg-void text-ink">
      <TopBar
        aspect={aspect}
        onAspect={setAspect}
        onCopy={handleCopy}
        onSave={handleSave}
        onReset={handleReset}
        showRulers={showRulers}
        onToggleRulers={() => setShowRulers((v) => !v)}
        showGrid={showGrid}
        onToggleGrid={() => setShowGrid((v) => !v)}
      />
      <div className="flex flex-1 overflow-hidden">
        <LeftPanel
          frameStyle={frameStyle}
          onFrameStyle={setFrameStyle}
          url={url}
          onUrl={setUrl}
          headerSize={headerSize}
          onHeaderSize={setHeaderSize}
          shadow={shadow}
          onShadow={setShadow}
          background={background}
          onBackground={setBackground}
          radius={radius}
          onRadius={setRadius}
          codeSnippet={codeSnippet}
          onCodeSnippet={setCodeSnippet}
          onAddCodeToCanvas={() => setContentMode("code")}
          layers={layers}
          onLayers={setLayers}
        />
        <Canvas
          frameStyle={frameStyle}
          url={url}
          onUrl={setUrl}
          headerSize={headerSize}
          shadow={shadow}
          background={background}
          padding={padding}
          radius={radius}
          zoom={zoom}
          tiltX={tiltX}
          tiltY={tiltY}
          aspect={aspect}
          image={image}
          onImage={setImage}
          canvasRef={canvasRef}
          isExporting={isExporting}
          contentMode={contentMode}
          codeSnippet={codeSnippet}
          showRulers={showRulers}
          showGrid={showGrid}
          layers={layers}
        />
        <RightPanel
          zoom={zoom}
          onZoom={setZoom}
          tiltX={tiltX}
          tiltY={tiltY}
          onTilt={(x, y) => {
            setTiltX(x);
            setTiltY(y);
          }}
          onPreset={(p) => {
            setZoom(p.zoom);
            setTiltX(p.tiltX);
            setTiltY(p.tiltY);
            setPadding(p.padding);
          }}
        />
      </div>
    </div>
  );
}
