import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { getPreset } from "./animationPresets";
import DeviceFrame from "@/components/shared/DeviceFrame";
import CodeBlock from "@/components/editor/CodeBlock";
import {
  BackgroundPreset,
  ContentMode,
  CodeSnippetState,
  DeviceType,
  SHADOW_CSS,
  ShadowPreset,
} from "@/components/editor/types";
import { FrameStyle } from "@/components/shared/BrowserFrame";

export type MockupCompositionProps = {
  presetId: string;
  padding: number;
  background: BackgroundPreset;
  frameStyle: FrameStyle;
  url: string;
  headerSize: number;
  shadow: ShadowPreset;
  radius: number;
  image: string | null;
  contentMode: ContentMode;
  codeSnippet: CodeSnippetState;
  device: DeviceType;
};

export function MockupComposition(props: MockupCompositionProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const preset = getPreset(props.presetId);

  const totalFrames = (preset.durationMs / 1000) * fps;
  const progress = Math.min(1, frame / totalFrames);
  const style = preset.keyframes(progress);

  const hasContent = props.contentMode === "code" || !!props.image;

  return (
    <AbsoluteFill
      style={
        props.background.image
          ? {
              backgroundImage: `url(${props.background.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : { background: props.background.css }
      }
    >
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          padding: `${props.padding}%`,
        }}
      >
        {hasContent && (
          <div style={{ width: "100%", maxWidth: 640, ...style }}>
            <div
              style={{
                boxShadow: SHADOW_CSS[props.shadow],
                borderRadius: props.radius,
              }}
            >
              {props.contentMode === "code" ? (
                <CodeBlock snippet={props.codeSnippet} />
              ) : (
                <DeviceFrame
                  device={props.device}
                  browserStyle={props.frameStyle}
                  url={props.url || "yoursite.com"}
                  headerScale={props.headerSize}
                  radius={props.radius}
                >
                  <div
                    style={{
                      position: "relative",
                      height: "100%",
                      width: "100%",
                      backgroundImage: `url(${props.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                </DeviceFrame>
              )}
            </div>
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
