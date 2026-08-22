import BrowserFrame from "@/components/shared/BrowserFrame";
import FakeScreen from "@/components/shared/FakeScreen";

const frames: {
  style: "safari-light" | "chrome-dark" | "safari-dark" | "chrome-light";
  tone: "amber" | "slate" | "mono";
  rotate: number;
  translate: string;
  z: number;
  width: string;
}[] = [
  {
    style: "chrome-light",
    tone: "mono",
    rotate: -9,
    translate: "-14% 6%",
    z: 10,
    width: "82%",
  },
  {
    style: "safari-dark",
    tone: "slate",
    rotate: -3,
    translate: "-2% 0%",
    z: 20,
    width: "88%",
  },
  {
    style: "chrome-dark",
    tone: "amber",
    rotate: 4,
    translate: "6% -2%",
    z: 30,
    width: "92%",
  },
  {
    style: "safari-light",
    tone: "amber",
    rotate: 10,
    translate: "16% 4%",
    z: 15,
    width: "80%",
  },
];

export default function FrameStack() {
  return (
    <div className="relative mx-auto h-[420px] w-full max-w-lg sm:h-[480px]">
      <div
        className="absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-[90px]"
        style={{ background: "var(--amber)" }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        {frames.map((f, i) => {
          const [tx, ty] = f.translate.split(" ");
          return (
            <div
              key={i}
              className="absolute animate-drift"
              style={
                {
                  width: f.width,
                  zIndex: f.z,
                  transform: `translate(${tx}, ${ty}) rotate(${f.rotate}deg)`,
                  "--r": `${f.rotate}deg`,
                  animationDelay: `${i * 0.6}s`,
                } as React.CSSProperties
              }
            >
              <BrowserFrame
                style={f.style}
                url={i === 2 ? "your-product.com" : "framerly.app"}
                className="shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)]"
              >
                <FakeScreen tone={f.tone} />
              </BrowserFrame>
            </div>
          );
        })}
      </div>
    </div>
  );
}
