"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  ImageIcon,
  Droplet,
  Blend,
  EyeOff,
  Wand2,
  X,
} from "lucide-react";
import {
  BackgroundPreset,
  CustomBackgroundKind,
  CustomBackgroundValue,
  DEFAULT_CUSTOM_BACKGROUND_VALUE,
  buildCustomGradientCss,
  createCustomBackground,
  isCustomBackground,
} from "./types";
import { extractPalette } from "./colorpalette";

const TABS: {
  kind: CustomBackgroundKind;
  label: string;
  icon: typeof ImageIcon;
}[] = [
  { kind: "image", label: "Image", icon: ImageIcon },
  { kind: "solid", label: "Solid", icon: Droplet },
  { kind: "gradient", label: "Gradient", icon: Blend },
  { kind: "fromImage", label: "From photo", icon: Wand2 },
  { kind: "transparent", label: "None", icon: EyeOff },
];

export default function CustomBackgroundSection({
  background,
  onSelect,
  mainImage,
}: {
  background: BackgroundPreset;
  onSelect: (b: BackgroundPreset) => void;
  mainImage?: string | null;
}) {
  const [open, setOpen] = useState(true);
  const [activeKind, setActiveKind] = useState<CustomBackgroundKind>(
    isCustomBackground(background) && background.kind
      ? background.kind
      : "image",
  );
  const [value, setValue] = useState<CustomBackgroundValue>(
    DEFAULT_CUSTOM_BACKGROUND_VALUE,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const commit = (kind: CustomBackgroundKind, next: CustomBackgroundValue) => {
    setValue(next);
    onSelect(createCustomBackground(kind, next));
  };

  const selectKind = (kind: CustomBackgroundKind) => {
    setActiveKind(kind);
    if (kind === "fromImage") {
      if (value.palette.length > 0) {
        onSelect(createCustomBackground(kind, value));
      }
      return;
    }
    onSelect(createCustomBackground(kind, value));
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const next = { ...value, image: reader.result as string };
      setActiveKind("image");
      commit("image", next);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    commit("image", { ...value, image: null });
  };

  const [extracting, setExtracting] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);
  const sourceInputRef = useRef<HTMLInputElement>(null);

  const autoExtractedFor = useRef<string | null>(null);

  const runExtraction = async (dataUrl: string) => {
    setExtracting(true);
    setExtractError(null);
    try {
      const palette = await extractPalette(dataUrl, 6);
      const from = palette[0] ?? value.gradientFrom;
      const to = palette[1] ?? palette[0] ?? value.gradientTo;
      const next = {
        ...value,
        sourceImage: dataUrl,
        palette,
        paletteFrom: from,
        paletteTo: to,
      };
      commit("fromImage", next);
    } catch (err) {
      console.error("Palette extraction failed:", err);
      setExtractError("Couldn't read colors from that image.");
    } finally {
      setExtracting(false);
    }
  };

  const handleSourceImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setActiveKind("fromImage");
      runExtraction(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  //   const removeSourceImage = () => {
  //     commit("fromImage", { ...value, sourceImage: null, palette: [] });
  //   };

  const removeSourceImage = () => {
    autoExtractedFor.current = null;
    commit("fromImage", { ...value, sourceImage: null, palette: [] });
  };

  useEffect(() => {
    if (
      activeKind === "fromImage" &&
      !value.sourceImage &&
      mainImage &&
      autoExtractedFor.current !== mainImage &&
      !extracting
    ) {
      console.log(
        "[CustomBackgroundSection] auto-extracting from canvas image, length:",
        mainImage.length,
      );
      autoExtractedFor.current = mainImage;
      runExtraction(mainImage);
    }
  }, [activeKind, mainImage, value.sourceImage]);

  const isActiveCustom = isCustomBackground(background);

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
        Custom background
      </button>

      {open && (
        <div className="mt-3 space-y-3">
          <div className="grid grid-cols-5 gap-1.5">
            {TABS.map(({ kind, label, icon: Icon }) => (
              <button
                key={kind}
                onClick={() => selectKind(kind)}
                title={label}
                className={`flex flex-col items-center justify-center gap-1 rounded-lg border-2 bg-panel-2 py-2 transition ${
                  activeKind === kind
                    ? "border-amber text-ink"
                    : "border-transparent text-ink-dim hover:border-line"
                }`}
              >
                <Icon size={13} />
                <span className="text-[9px] font-medium leading-none">
                  {label}
                </span>
              </button>
            ))}
          </div>

          {activeKind === "image" && (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                  e.target.value = "";
                }}
              />
              {value.image ? (
                <div className="relative overflow-hidden rounded-xl border border-line">
                  <img
                    src={value.image}
                    alt="Custom background"
                    className="h-24 w-full object-cover"
                  />
                  <button
                    onClick={removeImage}
                    aria-label="Remove image"
                    className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
                  >
                    <X size={13} />
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-2 right-2 rounded-md bg-black/60 px-2 py-1 text-[11px] text-white transition hover:bg-black/80"
                  >
                    Replace
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleFile(file);
                  }}
                  className="flex h-24 w-full flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-line bg-panel-2 text-ink-dim transition hover:border-ink-dim hover:text-ink"
                >
                  <ImageIcon size={16} />
                  <span className="text-[11px]">
                    Click to upload or drag and drop
                  </span>
                </button>
              )}
            </div>
          )}

          {activeKind === "solid" && (
            <div className="flex items-center gap-2">
              <label className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md border border-line">
                <input
                  type="color"
                  value={value.solid}
                  onChange={(e) =>
                    commit("solid", { ...value, solid: e.target.value })
                  }
                  className="absolute -left-1 -top-1 h-11 w-11 cursor-pointer border-none bg-transparent p-0"
                />
              </label>
              <input
                value={value.solid}
                onChange={(e) =>
                  commit("solid", { ...value, solid: e.target.value })
                }
                spellCheck={false}
                className="flex-1 rounded-md border border-line bg-panel-2 px-3 py-2 font-mono text-xs text-ink outline-none focus:border-amber"
              />
            </div>
          )}

          {activeKind === "gradient" && (
            <div className="space-y-2.5">
              <div
                className="h-9 w-full rounded-md border border-line"
                style={{
                  background: buildCustomGradientCss(
                    value.gradientFrom,
                    value.gradientTo,
                    value.gradientAngle,
                  ),
                }}
              />
              <div className="flex items-center gap-2">
                <label className="relative h-8 w-8 shrink-0 overflow-hidden rounded-md border border-line">
                  <input
                    type="color"
                    value={value.gradientFrom}
                    onChange={(e) =>
                      commit("gradient", {
                        ...value,
                        gradientFrom: e.target.value,
                      })
                    }
                    className="absolute -left-1 -top-1 h-10 w-10 cursor-pointer border-none bg-transparent p-0"
                  />
                </label>
                <label className="relative h-8 w-8 shrink-0 overflow-hidden rounded-md border border-line">
                  <input
                    type="color"
                    value={value.gradientTo}
                    onChange={(e) =>
                      commit("gradient", {
                        ...value,
                        gradientTo: e.target.value,
                      })
                    }
                    className="absolute -left-1 -top-1 h-10 w-10 cursor-pointer border-none bg-transparent p-0"
                  />
                </label>
                <input
                  type="range"
                  min={0}
                  max={360}
                  value={value.gradientAngle}
                  onChange={(e) =>
                    commit("gradient", {
                      ...value,
                      gradientAngle: Number(e.target.value),
                    })
                  }
                  className="flex-1"
                  style={{ accentColor: "var(--amber)" }}
                />
                <span className="w-9 shrink-0 text-right font-mono text-[11px] text-ink-dim">
                  {value.gradientAngle}°
                </span>
              </div>
            </div>
          )}

          {activeKind === "fromImage" && (
            <div className="space-y-2.5">
              <input
                ref={sourceInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleSourceImage(file);
                  e.target.value = "";
                }}
              />
              {value.sourceImage ? (
                <div className="relative overflow-hidden rounded-xl border border-line">
                  <img
                    src={value.sourceImage}
                    alt="Palette source"
                    className="h-20 w-full object-cover"
                  />
                  <button
                    onClick={removeSourceImage}
                    aria-label="Remove photo"
                    className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
                  >
                    <X size={13} />
                  </button>
                  <button
                    onClick={() => sourceInputRef.current?.click()}
                    className="absolute bottom-2 right-2 rounded-md bg-black/60 px-2 py-1 text-[11px] text-white transition hover:bg-black/80"
                  >
                    Replace
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => sourceInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleSourceImage(file);
                  }}
                  className="flex h-20 w-full flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-line bg-panel-2 text-ink-dim transition hover:border-ink-dim hover:text-ink"
                >
                  <Wand2 size={16} />
                  <span className="text-[11px]">
                    {mainImage
                      ? "Pulling colors from your canvas photo…"
                      : "Upload a photo to pull its colors"}
                  </span>
                </button>
              )}

              {extracting && (
                <p className="text-[11px] text-ink-faint">Reading colors…</p>
              )}
              {extractError && (
                <p className="text-[11px] text-red-400">{extractError}</p>
              )}

              {value.palette.length > 0 && (
                <>
                  <div className="flex flex-wrap gap-1.5">
                    {value.palette.map((color) => {
                      const isFrom = value.paletteFrom === color;
                      const isTo = value.paletteTo === color;
                      return (
                        <button
                          key={color}
                          onClick={() =>
                            commit("fromImage", {
                              ...value,
                              paletteFrom: color,
                            })
                          }
                          onContextMenu={(e) => {
                            e.preventDefault();
                            commit("fromImage", { ...value, paletteTo: color });
                          }}
                          title={`${color} — click for start, right-click for end`}
                          className="relative h-8 w-8 shrink-0 rounded-md border border-line"
                          style={{ background: color }}
                        >
                          {isFrom && (
                            <span className="absolute -left-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber text-[9px] font-bold text-panel">
                              A
                            </span>
                          )}
                          {isTo && (
                            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-ink text-[9px] font-bold text-panel">
                              B
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[10px] text-ink-faint">
                    Click a swatch for the start color, right-click for the end
                    color.
                  </p>

                  <div
                    className="h-9 w-full rounded-md border border-line"
                    style={{
                      background: buildCustomGradientCss(
                        value.paletteFrom,
                        value.paletteTo,
                        value.gradientAngle,
                      ),
                    }}
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={0}
                      max={360}
                      value={value.gradientAngle}
                      onChange={(e) =>
                        commit("fromImage", {
                          ...value,
                          gradientAngle: Number(e.target.value),
                        })
                      }
                      className="flex-1"
                      style={{ accentColor: "var(--amber)" }}
                    />
                    <span className="w-9 shrink-0 text-right font-mono text-[11px] text-ink-dim">
                      {value.gradientAngle}°
                    </span>
                  </div>
                </>
              )}
            </div>
          )}

          {activeKind === "transparent" && (
            <button
              onClick={() => selectKind("transparent")}
              className={`flex h-9 w-full items-center justify-center rounded-md border-2 text-xs font-medium text-ink-dim transition ${
                isActiveCustom && background.kind === "transparent"
                  ? "border-amber"
                  : "border-line hover:border-ink-dim"
              }`}
              style={{
                backgroundImage:
                  "repeating-conic-gradient(#00000022 0% 25%, transparent 0% 50%)",
                backgroundSize: "12px 12px",
              }}
            >
              Transparent background
            </button>
          )}
        </div>
      )}
    </div>
  );
}
