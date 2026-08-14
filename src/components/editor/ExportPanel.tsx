"use client";

import { useState } from "react";
import { Download } from "lucide-react";

export type ExportFormat = "JPEG" | "PNG" | "WebP";
export type ExportQuality = "High" | "Medium" | "Low";
export type ExportResolution = "1x" | "2x" | "3x";

export interface ExportOptions {
  format: ExportFormat;
  quality: number; // 0-1
  scale: number; // 1, 2, 3
}

const QUALITY_MAP: Record<ExportQuality, number> = {
  High: 0.85,
  Medium: 0.6,
  Low: 0.4,
};

const QUALITY_LABEL: Record<ExportQuality, string> = {
  High: "85% quality, sharp & shareable",
  Medium: "60% quality, balanced size",
  Low: "40% quality, smallest file",
};

const FORMAT_LABEL: Record<ExportFormat, string> = {
  JPEG: "Smaller files, great for sharing",
  PNG: "Lossless, best for transparency & editing",
  WebP: "Modern format, smaller size, wide support",
};

const RESOLUTION_MAP: Record<ExportResolution, number> = {
  "1x": 1,
  "2x": 2,
  "3x": 3,
};

export default function ExportPanel({
  onExport,
  onClose,
}: {
  onExport: (options: ExportOptions) => void;
  onClose: () => void;
}) {
  const [format, setFormat] = useState<ExportFormat>("JPEG");
  const [quality, setQuality] = useState<ExportQuality>("High");
  const [resolution, setResolution] = useState<ExportResolution>("2x");

  return (
    <>
      {/* click-outside overlay */}
      <div className="fixed inset-0 z-10" onClick={onClose} />

      <div className="absolute right-0 top-11 z-20 w-80 space-y-5 rounded-xl border border-line bg-panel-2 p-5 shadow-2xl">
        {/* Format */}
        <div>
          <h3 className="mb-2 text-sm font-semibold text-ink">Format</h3>
          <div className="flex rounded-lg border border-line bg-panel p-1">
            {(["JPEG", "PNG", "WebP"] as ExportFormat[]).map((f) => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                className={`flex-1 rounded-md py-1.5 text-xs font-medium transition ${
                  format === f
                    ? "bg-panel-2 text-ink"
                    : "text-ink-faint hover:text-ink-dim"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <p className="mt-1.5 text-xs text-ink-faint">
            {FORMAT_LABEL[format]}
          </p>
        </div>

        {/* Quality */}
        <div>
          <h3 className="mb-2 text-sm font-semibold text-ink">Quality</h3>
          <div className="flex rounded-lg border border-line bg-panel p-1">
            {(["High", "Medium", "Low"] as ExportQuality[]).map((q) => (
              <button
                key={q}
                onClick={() => setQuality(q)}
                className={`flex-1 rounded-md py-1.5 text-xs font-medium transition ${
                  quality === q
                    ? "bg-panel-2 text-ink"
                    : "text-ink-faint hover:text-ink-dim"
                }`}
              >
                {q}
              </button>
            ))}
          </div>
          <p className="mt-1.5 text-xs text-ink-faint">
            {QUALITY_LABEL[quality]}
          </p>
        </div>

        {/* Resolution */}
        <div>
          <h3 className="mb-2 text-sm font-semibold text-ink">Resolution</h3>
          <div className="flex rounded-lg border border-line bg-panel p-1">
            {(["1x", "2x", "3x"] as ExportResolution[]).map((r) => (
              <button
                key={r}
                onClick={() => setResolution(r)}
                className={`flex flex-1 items-center justify-center gap-1 rounded-md py-1.5 text-xs font-medium transition ${
                  resolution === r
                    ? "bg-panel-2 text-ink"
                    : "text-ink-faint hover:text-ink-dim"
                }`}
              >
                {r}
                {r === "2x" && (
                  <span className="text-[10px] opacity-70">4K</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Export */}
        <button
          onClick={() =>
            onExport({
              format,
              quality: QUALITY_MAP[quality],
              scale: RESOLUTION_MAP[resolution],
            })
          }
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber py-2.5 text-sm font-medium text-amber-ink transition hover:bg-amber-soft"
        >
          <Download size={14} />
          Export as {format}
        </button>
      </div>
    </>
  );
}
