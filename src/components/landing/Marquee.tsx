const tags = [
  "Safari",
  "Chrome",
  "MacBook",
  "iPhone",
  "Glass",
  "3D Tilt",
  "Layered Shadow",
  "PNG Export",
  "SVG Export",
  "REST API",
  "4K Ready",
  "Zero Sign-up",
];

export default function MarqueeStrip() {
  const loop = [...tags, ...tags];
  return (
    <div className="relative overflow-hidden border-y border-border bg-bg-soft py-4">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-bg-soft to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-bg-soft to-transparent" />
      <div className="flex w-max animate-marquee gap-3">
        {loop.map((tag, i) => (
          <span
            key={i}
            className="flex items-center gap-2 whitespace-nowrap rounded-full border border-border-strong bg-surface px-4 py-1.5 font-mono text-[12px] text-text-dim"
          >
            <span className="h-1 w-1 rounded-full bg-accent" />
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
