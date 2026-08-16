import BrowserFrame, { FrameStyle } from "@/components/shared/BrowserFrame";
import { ReactNode } from "react";
import { DeviceType } from "@/components/editor/types"; // adjust to your real types.ts path

export default function DeviceFrame({
  device,
  browserStyle,
  url = "framerly.app",
  children,
  className = "",
  radius,
  headerScale,
}: {
  device: DeviceType;
  browserStyle: FrameStyle;
  url?: string;
  children: ReactNode;
  className?: string;
  radius?: number;
  headerScale?: number;
}) {
  // "browser" delegates entirely to BrowserFrame, which already handles
  // Safari/Chrome + light/dark chrome, header scale, and its own 16:10
  // aspect ratio.
  if (device === "browser") {
    return (
      <BrowserFrame
        style={browserStyle}
        url={url}
        radius={radius}
        headerScale={headerScale}
        className={className}
      >
        {children}
      </BrowserFrame>
    );
  }

  // "none" reuses BrowserFrame's existing "bare" style (no chrome, 16:12
  // aspect ratio) so behavior matches exactly what you already ship today.
  if (device === "none") {
    return (
      <BrowserFrame style="bare" radius={radius} className={className}>
        {children}
      </BrowserFrame>
    );
  }

  if (device === "iphone") {
    // Reference mockup: dark graphite/space-black metal body, thin metal
    // rim, a distinct black bezel ring between the metal and the screen,
    // very rounded — genuinely CIRCULAR — corners, buttons always on the
    // visual LEFT edge, and a small camera pill offset toward the top with
    // a single lens dot near one end (not centered). Landscape only.
    //
    // A single border-radius percentage stretches into an OVAL on this
    // wide ~2:1 landscape box, since X% of the wide dimension is a much
    // bigger pixel radius than X% of the short dimension. Measured against
    // the reference photo directly (radius ~80px on an ~821x400px device),
    // the real corner is circular, which needs CSS's two-value radius
    // syntax — "horizontal% / vertical%" — rather than one number.
    //
    // If `radius` is explicitly passed, honor it as a plain px radius (opt
    // -out escape hatch, stays circular in px terms automatically);
    // otherwise default to the measured relative values below.
    // Unlike browser/macbook/glass, a real iPhone has a fixed physical
    // corner shape — it shouldn't take an arbitrary px radius from the
    // generic "Corner radius" slider (that produces a tiny, barely-rounded
    // corner once the frame renders at full canvas size, since px doesn't
    // scale with the box). So `radius` is intentionally ignored here; the
    // iPhone frame always uses its own proportional squircle radius.
    const outerRadius = "10% / 20%";
    const bezelRadius = "8% / 17%";
    const screenRadius = "6% / 14%";
    // Bezel ring sits between the metal case and the screen.
    const bezelPad = "1.5%";

    return (
      <div
        className={`relative ${className}`}
        style={{
          aspectRatio: "19.5 / 9",
          padding: "1.4%",
        }}
      >
        {/* Metal body — separate layer so its rounded corners/shadow don't
            also clip the buttons (which sit slightly outside this box). */}
        <div
          className="absolute inset-0"
          style={{
            borderRadius: outerRadius,
            clipPath: `inset(0 round ${outerRadius})`,
            // Dark graphite / space-black metal: several light/dark bands
            // catching light differently, not one flat tone or a single
            // light-to-dark sweep — that's what reads as brushed metal
            // instead of flat plastic.
            background:
              "linear-gradient(135deg, #6b6d72 0%, #3d3e42 8%, #2a2b2e 18%, #57585d 30%, #232427 42%, #4a4b50 55%, #26272a 68%, #64656a 82%, #34353a 100%)",
            boxShadow:
              "inset 0 1px 1px rgba(255,255,255,0.18), inset 0 -1px 2px rgba(0,0,0,0.5)",
            filter: "drop-shadow(0 22px 30px rgba(0,0,0,0.55))",
          }}
        />

        {/* Physical buttons — always on the visual left edge. Pill-shaped
            (fully rounded ends, not a rectangle with a slight radius),
            flush with the case's outer edge, and a darker brushed-metal
            tone than the body so they read as separate components. */}
        <div
          className="absolute rounded-full"
          style={{
            top: "15%",
            left: "-0.3%",
            height: "3.3%",
            width: "1.7%",
            background: "linear-gradient(90deg, #6b6d72, #26272a)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            top: "21%",
            left: "-0.3%",
            height: "7%",
            width: "1.7%",
            background: "linear-gradient(90deg, #6b6d72, #26272a)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            top: "30.5%",
            left: "-0.3%",
            height: "7%",
            width: "1.7%",
            background: "linear-gradient(90deg, #6b6d72, #26272a)",
          }}
        />

        {/* Black bezel ring — sits inside the metal case, around the
            screen. This is what reads as the "thin black border" in the
            reference; without it the metal appears to touch the screen
            directly. */}
        <div
          className="relative h-full w-full overflow-hidden bg-black"
          style={{
            borderRadius: bezelRadius,
            padding: bezelPad,
            clipPath: `inset(0 round ${bezelRadius})`,
          }}
        >
          {/* Screen */}
          <div
            className="relative h-full w-full overflow-hidden bg-black"
            style={{
              borderRadius: screenRadius,
              // border-radius + overflow-hidden alone can fail to clip a
              // GPU-composited <canvas> (common with WebGL/animated
              // canvas content) since it can render on its own compositing
              // layer. clip-path clips at the compositing level and
              // reliably contains canvas/video children too.
              clipPath: `inset(0 round ${screenRadius})`,
            }}
          >
            {/* Camera island — elongated black pill, centered on the top
                edge of the screen, with a single lens dot offset toward
                one end (matches reference; not a centered dot). */}
            <div
              className="absolute z-10 rounded-full bg-black"
              style={{
                top: "5%",
                left: "50%",
                transform: "translateX(-50%)",
                width: "15%",
                height: "5.5%",
              }}
            >
              <div
                className="absolute rounded-full"
                style={{
                  top: "50%",
                  right: "8%",
                  transform: "translateY(-50%)",
                  // Sized off the pill's HEIGHT, not width — the pill is
                  // short and wide, so a width-based aspect-ratio circle
                  // overflows top/bottom of it. Height-based keeps the
                  // lens a small dot that sits inside the pill.
                  height: "70%",
                  aspectRatio: "1 / 1",
                  width: "auto",
                  background:
                    "radial-gradient(circle at 35% 35%, #5a5d66, #1a1b1e 70%)",
                }}
              />
            </div>

            {children}

            {/* Home indicator */}
            <div
              className="absolute rounded-full bg-white/60"
              style={{
                bottom: "3%",
                left: "50%",
                transform: "translateX(-50%)",
                width: "22%",
                height: "1.2%",
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (device === "macbook") {
    const r = radius ?? 12;
    return (
      <div
        className={`flex flex-col ${className}`}
        // Aspect ratio lives on this outer wrapper (not the inner screen
        // div) so it has a *definite* computed height — otherwise the
        // hinge bar's height:6% below has nothing real to resolve
        // against and collapses to ~0.
        style={{ aspectRatio: "16 / 10.6" }}
      >
        <div
          className="relative flex-1 overflow-hidden border-[10px] border-b-0 bg-black"
          style={{
            borderColor: "#000",
            borderTopLeftRadius: r,
            borderTopRightRadius: r,
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.04)",
          }}
        >
          {/* Camera notch */}
          <div
            className="absolute left-1/2 top-0 z-10 h-[7px] w-12 -translate-x-1/2 rounded-b-[3px]"
            style={{ background: "#000" }}
          />
          <div className="h-full w-full overflow-hidden">{children}</div>
        </div>
        {/* Base / hinge */}
        <div
          className="mx-auto shrink-0 rounded-b-[10px] bg-gradient-to-b from-[#d8d8dd] to-[#a8a8ae]"
          style={{ height: "6%", width: "104%", marginLeft: "-2%" }}
        >
          <div
            className="mx-auto h-[4px] w-16 rounded-b-[3px]"
            style={{ background: "#87878d" }}
          />
        </div>
      </div>
    );
  }

  if (device === "glass") {
    const r = radius ?? 12;
    // Real inner padding for the glass "frame" around the content, not
    // just a hairline gradient border. Scales down a bit at small radii so
    // tiny thumbnails (see LeftPanel's DeviceCard) don't look squeezed.
    const pad = Math.max(10, Math.min(20, r + 4));
    const outerRadius = r + pad / 2;
    return (
      <div
        className={`relative overflow-hidden ${className}`}
        style={{
          borderRadius: outerRadius,
          aspectRatio: "16 / 10",
          padding: pad,
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.22), rgba(255,255,255,0.04) 40%, rgba(255,255,255,0.1) 100%)",
          backdropFilter: "blur(28px) saturate(160%)",
          WebkitBackdropFilter: "blur(28px) saturate(160%)",
          border: "1px solid rgba(255, 255, 255, 0.45)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -1px 12px rgba(255,255,255,0.08), inset 0 0 0 1px rgba(255,255,255,0.05), 0 12px 40px rgba(0,0,0,0.35)",
        }}
      >
        {/* diagonal glossy sheen, like light raking across the glass */}
        <div
          className="pointer-events-none absolute -inset-1"
          style={{
            borderRadius: outerRadius,
            background:
              "linear-gradient(115deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.05) 22%, rgba(255,255,255,0) 45%, rgba(255,255,255,0) 65%, rgba(255,255,255,0.12) 80%, rgba(255,255,255,0) 100%)",
            mixBlendMode: "screen",
          }}
        />
        {/* fine grain so the blur reads as frosted glass, not a flat tint */}
        <div
          className="pointer-events-none absolute -inset-1 opacity-[0.06]"
          style={{
            borderRadius: outerRadius,
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
        <div
          className="relative h-full w-full overflow-hidden bg-black/35"
          style={{ borderRadius: r }}
        >
          {children}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
