type Tone = "amber" | "slate" | "mono";

const tones: Record<Tone, { a: string; b: string; c: string }> = {
  amber: { a: "#3a2a12", b: "#e8a33d", c: "#f4c579" },
  slate: { a: "#141b22", b: "#6c88a4", c: "#9fb8cc" },
  mono: { a: "#1a1a1a", b: "#f2f1ec", c: "#96979e" },
};

export default function FakeScreen({ tone = "amber" }: { tone?: Tone }) {
  const c = tones[tone];
  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        background: `linear-gradient(155deg, ${c.a} 0%, #0c0d10 55%)`,
      }}
    >
      <div
        className="absolute -top-10 -right-10 h-40 w-40 rounded-full blur-3xl opacity-60"
        style={{ background: c.b }}
      />
      <div className="relative z-10 flex h-full flex-col gap-[6%] p-[8%]">
        <div className="flex items-center justify-between">
          <div
            className="h-[10%] w-[28%] rounded-sm"
            style={{ background: c.c, opacity: 0.9 }}
          />
          <div className="flex gap-[4%]">
            <div
              className="h-3.5 w-3.5 rounded-full"
              style={{ background: c.b, opacity: 0.5 }}
            />
            <div
              className="h-3.5 w-3.5 rounded-full"
              style={{ background: c.b, opacity: 0.3 }}
            />
          </div>
        </div>
        <div className="grid flex-1 grid-cols-3 gap-[6%]">
          <div
            className="col-span-2 rounded-lg"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          />
          <div className="flex flex-col gap-[8%]">
            <div
              className="flex-1 rounded-lg"
              style={{ background: c.b, opacity: 0.85 }}
            />
            <div
              className="flex-1 rounded-lg"
              style={{ background: "rgba(255,255,255,0.06)" }}
            />
          </div>
        </div>
        <div className="flex gap-[4%]">
          <div
            className="h-[10%] w-[18%] rounded-full"
            style={{ background: c.c, opacity: 0.8 }}
          />
          <div
            className="h-[10%] w-[12%] rounded-full"
            style={{ background: "rgba(255,255,255,0.08)" }}
          />
        </div>
      </div>
    </div>
  );
}
