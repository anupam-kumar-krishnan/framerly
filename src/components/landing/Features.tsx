import {
  Frame,
  Layers,
  Move3d,
  Palette,
  Download,
  Webhook,
} from "lucide-react";

const features = [
  {
    icon: Frame,
    title: "Browser & device chrome",
    body: "Safari, Chrome, and bare device frames in light or dark, matched pixel for pixel to the real thing.",
  },
  {
    icon: Palette,
    title: "Backdrops that don't fight the shot",
    body: "Gradient, solid, or image backgrounds tuned to sit behind your screenshot, not compete with it.",
  },
  {
    icon: Move3d,
    title: "3D tilt and zoom",
    body: "Angle the frame in space and dial the zoom until the composition feels intentional, not centered by default.",
  },
  {
    icon: Layers,
    title: "Layered shadow and padding",
    body: "Independent controls for shadow depth, corner radius, and canvas padding, so nothing looks pasted on.",
  },
  {
    icon: Download,
    title: "Export at any size",
    body: "PNG or SVG, sized for a tweet, a deck slide, an App Store listing, or a 4K hero banner.",
  },
  {
    icon: Webhook,
    title: "API for repeat jobs",
    body: "Generate the same framed shot for every release automatically, without opening the studio.",
  },
];

export default function Features() {
  return (
    <section id="features" className="relative border-t border-line-soft">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="max-w-xl">
          <span className="font-mono text-xs uppercase tracking-widest text-amber">
            In the studio
          </span>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Every control a screenshot actually needs.
          </h2>
          <p className="mt-4 text-ink-dim">
            Nothing you won&apos;t use. Nothing you have to fight to find.
          </p>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group relative bg-panel p-7 transition hover:bg-panel-2"
            >
              <f.icon
                size={20}
                className="text-amber transition group-hover:scale-110"
              />
              <h3 className="mt-5 font-display text-base font-semibold">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-dim">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
