import { Composition } from "remotion";
import { MockupComposition, MockupCompositionProps } from "./MockupComposition";

const defaultProps: MockupCompositionProps = {
  presetId: "reveal-hero",
  padding: 10,
  background: { css: "#000000" } as any,
  frameStyle: "browser" as any,
  url: "yoursite.com",
  headerSize: 1,
  shadow: "soft" as any,
  radius: 12,
  image: null,
  contentMode: "screenshot" as any,
  codeSnippet: { code: "", language: "tsx" } as any,
  device: "desktop" as any,
};

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="MockupExport"
      component={MockupComposition}
      durationInFrames={90}
      fps={30}
      width={1600}
      height={1200}
      defaultProps={defaultProps}
    />
  );
};
