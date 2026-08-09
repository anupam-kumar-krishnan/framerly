import { Lock } from "lucide-react";
import { ReactNode } from "react";

export type FrameStyle =
  | "safari-light"
  | "safari-dark"
  | "chrome-light"
  | "chrome-dark"
  | "bare";

export default function BrowserFrame({
  style,
  url = "framerly.app",
  children,
  className = "",
  headerScale = 100,
  radius,
}: {
  style: FrameStyle;
  url?: string;
  children: ReactNode;
  className?: string;
  headerScale?: number;
  radius?: number;
}) {
  if (style === "bare") {
    return (
      <div
        className={`overflow-hidden ${className}`}
        style={{ borderRadius: radius ?? 12, aspectRatio: "16 / 12" }}
      >
        {children}
      </div>
    );
  }

  const dark = style.endsWith("dark");
  const isSafari = style.startsWith("safari");

  const chromeBg = dark ? "#1c1d21" : "#eceef1";
  const barBg = dark ? "#232427" : "#f6f7f9";
  const textDim = dark ? "#8b8d94" : "#6b6d76";
  const scale = headerScale / 100;

  return (
    <div
      className={`overflow-hidden border ${className}`}
      style={{
        background: chromeBg,
        borderColor: dark ? "#2c2d31" : "#dcdfe4",
        borderRadius: radius ?? 12,
      }}
    >
      <div
        className="flex items-center gap-3 px-4"
        style={{ background: chromeBg, paddingBlock: `${10 * scale}px` }}
      >
        <div className="flex gap-1.5">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ background: "#ec6a5f" }}
          />
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ background: "#f4bf4f" }}
          />
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ background: "#61c454" }}
          />
        </div>
        {isSafari ? (
          <div
            className="mx-auto flex w-2/3 min-w-0 items-center justify-center gap-1.5 rounded-md py-1 text-[11px]"
            style={{ background: barBg, color: textDim }}
          >
            <Lock size={10} className="shrink-0" />
            <span className="truncate font-mono">{url}</span>
          </div>
        ) : (
          <div
            className="flex min-w-0 flex-1 items-center gap-1.5 rounded-md px-3 py-1 text-[11px]"
            style={{ background: barBg, color: textDim }}
          >
            <Lock size={10} className="shrink-0" />
            <span className="truncate font-mono">{url}</span>
          </div>
        )}
      </div>
      <div className="relative w-full" style={{ aspectRatio: "16 / 10" }}>
        {children}
      </div>
    </div>
  );
}
