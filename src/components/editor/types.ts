import type { FrameStyle } from "@/components/shared/BrowserFrame";

export type ShadowPreset = "none" | "soft" | "hard" | "long";

export type BackgroundPreset = {
  id: string;
  label: string;
  css?: string;
  image?: string;
};

export type AspectRatio = "16:9" | "4:3" | "1:1" | "9:16" | "3:2";

export type EditorState = {
  frameStyle: FrameStyle;
  url: string;
  headerSize: number; // percent
  shadow: ShadowPreset;
  background: BackgroundPreset;
  padding: number; // percent of canvas
  radius: number; // px
  zoom: number; // percent
  tiltX: number; // deg
  tiltY: number; // deg
  aspect: AspectRatio;
  image: string | null;
};

export type BackgroundGroup = {
  title: string;
  presets: BackgroundPreset[];
};

export const BACKGROUND_GROUPS: BackgroundGroup[] = [
  {
    title: "Gradients",
    presets: [
      {
        id: "grad-magenta-blue",
        label: "Magenta blue",
        css: "linear-gradient(135deg, #ff3d81 0%, #a24bff 50%, #3d7bff 100%)",
      },
      {
        id: "grad-violet-sky",
        label: "Violet sky",
        css: "linear-gradient(135deg, #7b5cff 0%, #4fb3ff 100%)",
      },
      {
        id: "grad-teal-blue",
        label: "Teal blue",
        css: "linear-gradient(135deg, #1fd1a8 0%, #2e6fff 100%)",
      },
      {
        id: "grad-blue-cyan",
        label: "Blue cyan",
        css: "linear-gradient(135deg, #2e6fff 0%, #1fd1e6 100%)",
      },
      {
        id: "grad-green-cyan",
        label: "Green cyan",
        css: "linear-gradient(135deg, #1fe6a8 0%, #1fc9e6 100%)",
      },
      {
        id: "grad-lilac-magenta",
        label: "Lilac magenta",
        css: "linear-gradient(135deg, #c9a8ff 0%, #ff3d9e 100%)",
      },
      {
        id: "grad-rose-violet",
        label: "Rose violet",
        css: "linear-gradient(135deg, #ff8ac2 0%, #7b3dff 100%)",
      },
      {
        id: "grad-orange-red",
        label: "Orange red",
        css: "linear-gradient(135deg, #ffb35c 0%, #ff3d3d 100%)",
      },
      {
        id: "grad-emerald",
        label: "Emerald",
        css: "linear-gradient(135deg, #0f8f5f 0%, #0a6e4a 100%)",
      },
      {
        id: "grad-sky-magenta",
        label: "Sky magenta",
        css: "linear-gradient(135deg, #4fb3ff 0%, #ff3d9e 100%)",
      },
      {
        id: "grad-mint-teal",
        label: "Mint teal",
        css: "linear-gradient(135deg, #8affd6 0%, #1f9e8f 100%)",
      },
      {
        id: "grad-navy-lavender",
        label: "Navy lavender",
        css: "linear-gradient(135deg, #1c2e6e 0%, #a8b3ff 100%)",
      },
      {
        id: "grad-periwinkle",
        label: "Periwinkle",
        css: "linear-gradient(135deg, #a8b3ff 0%, #6a5cff 100%)",
      },
      {
        id: "grad-mint-lime",
        label: "Mint lime",
        css: "linear-gradient(135deg, #b3ff8a 0%, #4fd97a 100%)",
      },
      {
        id: "grad-turquoise",
        label: "Turquoise",
        css: "linear-gradient(135deg, #4fd9c9 0%, #1f9ecf 100%)",
      },
      {
        id: "grad-sunrise",
        label: "Sunrise",
        css: "linear-gradient(135deg, #ffd68a 0%, #ff7a5c 50%, #d94fcf 100%)",
      },
      {
        id: "grad-coral-pink",
        label: "Coral pink",
        css: "linear-gradient(135deg, #ff8a6a 0%, #ff5c9e 100%)",
      },
      {
        id: "grad-amber-rose",
        label: "Amber rose",
        css: "linear-gradient(135deg, #ffb85c 0%, #ff5c5c 100%)",
      },
      {
        id: "grad-peach",
        label: "Peach",
        css: "linear-gradient(135deg, #ffe0b3 0%, #ffb38a 100%)",
      },
      {
        id: "grad-blush",
        label: "Blush",
        css: "linear-gradient(135deg, #ffd6c9 0%, #ff9ec9 100%)",
      },
      {
        id: "grad-lavender-pink",
        label: "Lavender pink",
        css: "linear-gradient(135deg, #d6c9ff 0%, #ff9ecf 100%)",
      },
      {
        id: "grad-hot-pink",
        label: "Hot pink",
        css: "linear-gradient(135deg, #ff9ecf 0%, #ff4fa8 100%)",
      },
      {
        id: "grad-pink-blue",
        label: "Pink blue",
        css: "linear-gradient(135deg, #ffb3d6 0%, #6a8aff 100%)",
      },
      {
        id: "grad-crimson",
        label: "Crimson",
        css: "linear-gradient(135deg, #ff6a6a 0%, #a80f2e 100%)",
      },
      {
        id: "grad-cyan-pink",
        label: "Cyan pink",
        css: "linear-gradient(135deg, #4fe6ff 0%, #ff9ec9 100%)",
      },
      {
        id: "grad-slate-red",
        label: "Slate red",
        css: "linear-gradient(135deg, #6a7a8f 0%, #a8243d 100%)",
      },
      {
        id: "grad-teal-navy",
        label: "Teal navy",
        css: "linear-gradient(135deg, #4fd9c9 0%, #1c2e6e 100%)",
      },
      {
        id: "grad-sand-teal",
        label: "Sand teal",
        css: "linear-gradient(135deg, #e6c98a 0%, #1f9e8f 100%)",
      },
      {
        id: "grad-charcoal-violet",
        label: "Charcoal violet",
        css: "linear-gradient(135deg, #2a2a3d 0%, #6a4fae 100%)",
      },
      {
        id: "grad-mint-purple",
        label: "Mint purple",
        css: "linear-gradient(135deg, #8affd6 0%, #7b5cff 100%)",
      },
      {
        id: "grad-yellow-lilac",
        label: "Yellow lilac",
        css: "linear-gradient(135deg, #ffe66a 0%, #c9a8ff 100%)",
      },
      {
        id: "grad-gold",
        label: "Gold",
        css: "linear-gradient(135deg, #ffe08a 0%, #d98a3d 100%)",
      },
      {
        id: "grad-lime-green",
        label: "Lime green",
        css: "linear-gradient(135deg, #d6ff5c 0%, #2ea84f 100%)",
      },
      {
        id: "grad-magenta-yellow",
        label: "Magenta yellow",
        css: "linear-gradient(135deg, #ff3d9e 0%, #ffe66a 100%)",
      },
      {
        id: "grad-purple-gold",
        label: "Purple gold",
        css: "linear-gradient(135deg, #9e3dff 0%, #ffcf5c 100%)",
      },
      {
        id: "grad-cream",
        label: "Cream",
        css: "linear-gradient(135deg, #fff6e0 0%, #ffe8b3 100%)",
      },
      {
        id: "grad-cream-pink",
        label: "Cream pink",
        css: "linear-gradient(135deg, #fff0e0 0%, #ffc9d6 100%)",
      },
      {
        id: "grad-purple-fire",
        label: "Purple fire",
        css: "linear-gradient(135deg, #6a1fff 0%, #ff5c2e 100%)",
      },
      {
        id: "grad-frost-purple",
        label: "Frost purple",
        css: "linear-gradient(135deg, #cfe0ff 0%, #9e8aff 100%)",
      },
      {
        id: "grad-royal",
        label: "Royal",
        css: "linear-gradient(135deg, #a80fff 0%, #1c3a6e 100%)",
      },
      {
        id: "grad-dusk-glow",
        label: "Dusk glow",
        css: "radial-gradient(circle at 35% 35%, #ff9e5c 0%, #2a1c4a 70%)",
      },
      {
        id: "grad-teal-glow",
        label: "Teal glow",
        css: "radial-gradient(circle at 35% 35%, #4fd9c9 0%, #1c2a4a 70%)",
      },
      {
        id: "grad-violet-glow",
        label: "Violet glow",
        css: "radial-gradient(circle at 35% 35%, #b38aff 0%, #2a1c3d 70%)",
      },
      {
        id: "grad-blush-glow",
        label: "Blush glow",
        css: "radial-gradient(circle at 35% 35%, #ff9ec2 0%, #3d1c2a 70%)",
      },
      {
        id: "grad-amber-glow",
        label: "Amber glow",
        css: "radial-gradient(circle at 35% 35%, #ffcf8a 0%, #3d2a1c 70%)",
      },
    ],
  },
  {
    title: "Pattern",
    presets: [
      {
        id: "pattern-peach-clouds",
        label: "Peach clouds",
        image: "/backgrounds/pattern-1.jpg",
      },
      {
        id: "pattern-coral-clouds",
        label: "Coral clouds",
        image: "/backgrounds/pattern-2.jpg",
      },
      {
        id: "pattern-leaf-camo",
        label: "Leaf camo",
        image: "/backgrounds/pattern-3.jpg",
      },
      {
        id: "pattern-blue-sky-clouds",
        label: "Blue sky clouds",
        image: "/backgrounds/pattern-4.jpg",
      },
      {
        id: "pattern-storm-clouds",
        label: "Storm clouds",
        image: "/backgrounds/pattern-5.jpg",
      },
      {
        id: "pattern-dusk-clouds",
        label: "Dusk clouds",
        image: "/backgrounds/pattern-6.jpg",
      },
      {
        id: "pattern-leafs",
        label: "Leaf Pattern",
        image: "/backgrounds/pattern-7.jpg",
      },
      {
        id: "pattern-multicolor",
        label: "Multi-color Pattern",
        image: "/backgrounds/pattern-8.jpg",
      },
    ],
  },
  {
    title: "macOS",
    presets: [
      {
        id: "macos-monterey-bay",
        label: "Monterey Bay",
        css: "linear-gradient(160deg, #cdb6c4 0%, #8b7aa8 35%, #4a3f6b 65%, #241d3d 100%)",
        image: "/backgrounds/macos-1.jpg",
      },
      {
        id: "macos-big-sur-dusk",
        label: "Big Sur dusk",
        css: "linear-gradient(150deg, #f2a154 0%, #d9613f 40%, #6e2f4f 75%, #201233 100%)",
        image: "/backgrounds/macos-2.jpg",
      },
      {
        id: "macos-sonoma-dune",
        label: "Sonoma dune",
        css: "linear-gradient(155deg, #e8b968 0%, #c9793f 45%, #7a3f2c 80%, #2b1710 100%)",
        image: "/backgrounds/macos-3.jpg",
      },
      {
        id: "macos-tahoe-water",
        label: "Tahoe water",
        css: "linear-gradient(165deg, #bfe6e0 0%, #4d9cad 40%, #1f5c78 75%, #0a2436 100%)",
        image: "/backgrounds/macos-4.jpg",
      },
      {
        id: "macos-catalina-swirl",
        label: "Catalina swirl",
        css: "radial-gradient(120% 90% at 30% 20%, #ffb35c 0%, #e0673f 45%, #7a2e4a 80%, #1c1233 100%)",
        image: "/backgrounds/macos-5.jpg",
      },
      {
        id: "macos-ridgeline",
        label: "Ridgeline",
        css: "linear-gradient(160deg, #9fb37a 0%, #5c7a4a 40%, #33502f 75%, #14200f 100%)",
        image: "/backgrounds/macos-6.jpg",
      },
      {
        id: "macos-redwoods",
        label: "Redwoods",
        css: "linear-gradient(180deg, #1c2b1a 0%, #24361f 30%, #16240f 60%, #0a1408 100%)",
        image: "/backgrounds/macos-7.jpg",
      },
      {
        id: "macos-ventura-flow",
        label: "Ventura flow",
        css: "linear-gradient(115deg, #3fd0c9 0%, #4d8de0 30%, #7a5ce0 60%, #d64f9e 100%)",
        image: "/backgrounds/macos-8.jpg",
      },
    ],
  },
  {
    title: "Radiant",
    presets: [
      {
        id: "radiant-slate-orb",
        label: "Slate orb",
        css: "radial-gradient(circle at 50% 45%, #6b6f7c 0%, #34363f 55%, #17181c 100%)",
      },
      {
        id: "radiant-violet-orb",
        label: "Violet orb",
        css: "radial-gradient(circle at 45% 40%, #7a6fd6 0%, #3f3a86 50%, #171733 100%)",
      },
      {
        id: "radiant-pearl",
        label: "Pearl",
        css: "radial-gradient(circle at 50% 45%, #ffffff 0%, #f0ece3 55%, #cfc7b8 100%)",
      },
      {
        id: "radiant-flare",
        label: "Flare",
        css: "radial-gradient(circle at 50% 40%, #ffb46b 0%, #e8623a 55%, #6e1f1f 100%)",
      },
      {
        id: "radiant-coral",
        label: "Coral",
        css: "radial-gradient(circle at 50% 45%, #ff9d8a 0%, #e85a6a 55%, #7a1f3d 100%)",
      },
      {
        id: "radiant-split-sun",
        label: "Split sun",
        css: "linear-gradient(115deg, #4a7fd6 0%, #6a5fd9 40%, #e8663f 100%)",
      },
      {
        id: "radiant-orchid",
        label: "Orchid",
        css: "radial-gradient(circle at 50% 45%, #ff8ad6 0%, #b34fd9 55%, #3d1c5e 100%)",
      },
      {
        id: "radiant-eclipse",
        label: "Eclipse",
        css: "radial-gradient(circle at 50% 35%, #6a4fae 0%, #2b1c4a 55%, #0a0a12 100%)",
      },
    ],
  },
  {
    title: "Abstract",
    presets: [
      {
        id: "abstract-ember-wave",
        label: "Ember wave",
        css: "linear-gradient(125deg, #ff8a3d 0%, #d6432a 35%, #1c1024 75%, #0c0d10 100%)",
      },
      {
        id: "abstract-blue-ribbon",
        label: "Blue ribbon",
        css: "linear-gradient(120deg, #bfe3ff 0%, #4a90d9 40%, #1c3a6e 75%, #0c1a33 100%)",
      },
      {
        id: "abstract-violet-swirl",
        label: "Violet swirl",
        css: "conic-gradient(from 210deg at 40% 40%, #2a1a5e, #5b3fd9, #8f6bff, #2a1a5e)",
      },
      {
        id: "abstract-frost",
        label: "Frost",
        css: "linear-gradient(160deg, #f4f6fb 0%, #d6def0 45%, #7d93c9 100%)",
      },
      {
        id: "abstract-deep-plasma",
        label: "Deep plasma",
        css: "radial-gradient(120% 100% at 20% 10%, #4f3bd6 0%, #1a1240 45%, #06060c 100%)",
      },
      {
        id: "abstract-cloudbank",
        label: "Cloudbank",
        css: "linear-gradient(180deg, #bcdcff 0%, #eaf3ff 55%, #ffffff 100%)",
      },
      {
        id: "abstract-embercoal",
        label: "Embercoal",
        css: "radial-gradient(80% 80% at 70% 30%, #e0552f 0%, #2a1210 55%, #0c0d10 100%)",
      },
    ],
  },
];

export const BACKGROUND_PRESETS: BackgroundPreset[] = BACKGROUND_GROUPS.flatMap(
  (g) => g.presets,
);

export function getBackgroundById(id: string): BackgroundPreset {
  const preset = BACKGROUND_PRESETS.find((p) => p.id === id);
  if (!preset) {
    throw new Error(`Background preset "${id}" not found`);
  }
  return preset;
}

export const DEFAULT_BACKGROUND_ID = "pattern-peach-clouds";

export const ASPECTS: Record<AspectRatio, number> = {
  "16:9": 16 / 9,
  "4:3": 4 / 3,
  "1:1": 1,
  "9:16": 9 / 16,
  "3:2": 3 / 2,
};

export const SHADOW_CSS: Record<ShadowPreset, string> = {
  none: "none",
  soft: "0 30px 60px -20px rgba(0,0,0,0.45)",
  hard: "18px 18px 0px 0px rgba(0,0,0,0.5)",
  long: "0 60px 40px -30px rgba(0,0,0,0.6), 0 20px 20px -10px rgba(0,0,0,0.4)",
};

export type ContentMode = "website" | "code";

export type CodeTheme =
  | "dracula"
  | "oneDark"
  | "nightOwl"
  | "vs"
  | "okaidia"
  | "solarizedlight";

export type CodeSnippetState = {
  code: string;
  language: string;
  theme: CodeTheme;
  font: string;
  fontSize: number;
  showLineNumbers: boolean;
  showWindowChrome: boolean;
  compact: boolean; // "Less" padding toggle
};

export const CODE_THEME_BG: Record<CodeTheme, string> = {
  dracula: "#282a36",
  oneDark: "#282c34",
  nightOwl: "#011627",
  vs: "#ffffff",
  okaidia: "#272822",
  solarizedlight: "#fdf6e3",
};

export const CODE_LANGUAGES = [
  "javascript",
  "typescript",
  "python",
  "jsx",
  "tsx",
  "json",
  "bash",
  "css",
  "html",
  "go",
  "rust",
  "java",
];

export const CODE_FONTS = [
  "JetBrains Mono",
  "Fira Code",
  "Source Code Pro",
  "IBM Plex Mono",
];

export type LayerId = "content" | "background";

export type LayerItem = {
  id: LayerId;
  label: string;
  visible: boolean;
};

export type PageTheme = "light" | "dark";
