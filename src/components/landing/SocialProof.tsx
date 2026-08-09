const quotes = [
  {
    quote:
      "Swapped our whole landing page gallery in an afternoon. The shadows finally look like they belong there.",
    name: "Priya Nair",
    role: "Founder, Lattice Notes",
  },
  {
    quote:
      "The 3D tilt is the first one I've seen that doesn't look like a PowerPoint effect.",
    name: "Owen Marsh",
    role: "Design lead, Fielded",
  },
  {
    quote:
      "We generate release screenshots through the API now. Zero manual framing since we set it up.",
    name: "Theo Alaoui",
    role: "Eng, Portside",
  },
];

export default function SocialProof() {
  return (
    <section className="border-t border-line-soft bg-panel/40">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <span className="font-mono text-xs uppercase tracking-widest text-amber">
          From the studio floor
        </span>
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {quotes.map((q) => (
            <div key={q.name} className="flex flex-col justify-between">
              <p className="font-display text-lg leading-snug text-ink">
                “{q.quote}”
              </p>
              <div className="mt-6 text-sm">
                <p className="text-ink">{q.name}</p>
                <p className="text-ink-faint">{q.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
