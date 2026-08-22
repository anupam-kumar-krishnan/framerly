import { AnimationPreset, getPreset } from "./animationPresets";

export const FPS = 30;

export type AnimationClip = {
  id: string;
  presetId: string;
  durationMs: number;
};

export function createClipFromPreset(preset: AnimationPreset): AnimationClip {
  return {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `clip_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    presetId: preset.id,
    durationMs: preset.durationMs,
  };
}

export function clipFrames(clip: AnimationClip): number {
  return Math.max(1, Math.round((clip.durationMs / 1000) * FPS));
}

export function totalClipFrames(clips: AnimationClip[]): number {
  if (clips.length === 0) return 1;
  return Math.max(
    1,
    clips.reduce((sum, c) => sum + clipFrames(c), 0),
  );
}

export function resolveAnimationStyle(
  frame: number,
  clips: AnimationClip[],
): React.CSSProperties {
  if (clips.length === 0) return {};

  let acc = 0;
  for (const clip of clips) {
    const frames = clipFrames(clip);
    if (frame < acc + frames) {
      const local = frame - acc;
      const progress = frames <= 1 ? 1 : local / (frames - 1);
      return getPreset(clip.presetId).keyframes(
        Math.min(1, Math.max(0, progress)),
      );
    }
    acc += frames;
  }

  const last = clips[clips.length - 1];
  return last ? getPreset(last.presetId).keyframes(1) : {};
}

export function startFrameOfClip(
  clips: AnimationClip[],
  index: number,
): number {
  return totalClipFrames(clips.slice(0, index));
}
