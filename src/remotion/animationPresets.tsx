export type AnimationKind = "reveal" | "slide" | "fade";

export type AnimationPreset = {
  id: string;
  label: string;
  kind: AnimationKind;
  durationMs: number;
  keyframes: (progress: number) => React.CSSProperties;
};

const ease = (t: number) => 1 - Math.pow(1 - t, 3);

export const ANIMATION_GROUPS: { title: string; presets: AnimationPreset[] }[] =
  [
    {
      title: "Reveal",
      presets: [
        {
          id: "reveal-hero",
          label: "Hero Landing",
          kind: "reveal",
          durationMs: 1200,
          keyframes: (p) => {
            const t = ease(p);
            return {
              opacity: t,
              transform: `translateY(${(1 - t) * 24}px) scale(${0.96 + t * 0.04})`,
            };
          },
        },
        {
          id: "reveal-fast",
          label: "Quick Reveal",
          kind: "reveal",
          durationMs: 1000,
          keyframes: (p) => {
            const t = ease(p);
            return { opacity: t, transform: `translateY(${(1 - t) * 12}px)` };
          },
        },
      ],
    },
    {
      title: "Slide",
      presets: [
        {
          id: "slide-left",
          label: "Slide In Left",
          kind: "slide",
          durationMs: 1000,
          keyframes: (p) => {
            const t = ease(p);
            return { opacity: t, transform: `translateX(${(1 - t) * -60}px)` };
          },
        },
        {
          id: "slide-up",
          label: "Slide Up",
          kind: "slide",
          durationMs: 1000,
          keyframes: (p) => {
            const t = ease(p);
            return { opacity: t, transform: `translateY(${(1 - t) * 60}px)` };
          },
        },
      ],
    },
    {
      title: "Fade",
      presets: [
        {
          id: "fade-simple",
          label: "Simple Fade",
          kind: "fade",
          durationMs: 900,
          keyframes: (p) => ({ opacity: ease(p), transform: "none" }),
        },
      ],
    },
  ];

export const ALL_PRESETS = ANIMATION_GROUPS.flatMap((g) => g.presets);
export const getPreset = (id: string) => ALL_PRESETS.find((p) => p.id === id)!;
