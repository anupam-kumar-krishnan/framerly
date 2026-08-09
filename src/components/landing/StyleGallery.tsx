import BrowserFrame, { FrameStyle } from "@/components/shared/BrowserFrame";
import FakeScreen from "@/components/shared/FakeScreen";

const shots: { style: FrameStyle; tone: "amber" | "slate" | "mono"; label: string }[] = [
  { style: "safari-light", tone: "mono", label: "safari — light" },
  { style: "safari-dark", tone: "amber", label: "safari — dark" },
  { style: "chrome-light", tone: "slate", label: "chrome — light" },
  { style: "chrome-dark", tone: "amber", label: "chrome — dark" },
  { style: "bare", tone: "slate", label: "bare — no chrome" },
  { style: "chrome-dark", tone: "mono", label: "chrome — dark" },
];

export default function StyleGallery() {
  return (
    <section id="gallery" className="relative border-t border-line-soft">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <span className="font-mono text-xs uppercase tracking-widest text-amber">
              Contact sheet
            </span>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              One screenshot, every frame.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-ink-dim">
            Switch chrome without re-uploading. Every style reads the same
            source image, so your set stays consistent.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shots.map((s, i) => (
            <figure key={i} className="group">
              <BrowserFrame
                style={s.style}
                className="border-line-soft transition group-hover:-translate-y-1 group-hover:border-amber/40"
              >
                <FakeScreen tone={s.tone} />
              </BrowserFrame>
              <figcaption className="mt-3 font-mono text-xs text-ink-faint">
                {s.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
