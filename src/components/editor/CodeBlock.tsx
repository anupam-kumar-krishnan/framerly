import type { CSSProperties } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  dracula,
  oneDark,
  nightOwl,
  vs,
  okaidia,
  solarizedlight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { CODE_THEME_BG, CODE_FONT_FAMILY, CodeSnippetState } from "./types";

const THEME_MAP: Record<
  CodeSnippetState["theme"],
  { [key: string]: CSSProperties }
> = {
  dracula,
  oneDark,
  nightOwl,
  vs,
  okaidia,
  solarizedlight,
};

export default function CodeBlock({ snippet }: { snippet: CodeSnippetState }) {
  const {
    code,
    language,
    theme,
    font,
    fontSize,
    showLineNumbers,
    showWindowChrome,
    compact,
  } = snippet;

  const fontFamily = `${CODE_FONT_FAMILY[font] ?? `"${font}"`}, monospace`;

  return (
    <div
      className="overflow-hidden rounded-xl shadow-xl"
      style={{ backgroundColor: CODE_THEME_BG[theme] }}
    >
      {showWindowChrome && (
        <div className="flex items-center gap-1.5 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
          <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
        </div>
      )}
      <SyntaxHighlighter
        language={language}
        style={THEME_MAP[theme]}
        showLineNumbers={showLineNumbers}
        customStyle={{
          margin: 0,
          padding: compact ? "0.75rem 1rem" : "1.25rem 1.5rem",
          background: "transparent",
          fontSize: `${fontSize || 14}px`,
          lineHeight: 1.6,
          fontFamily,
        }}
        codeTagProps={{
          style: { fontFamily },
        }}
      >
        {code || " "}
      </SyntaxHighlighter>
    </div>
  );
}
