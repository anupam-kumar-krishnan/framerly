import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Framerly — Turn plain screenshots into polished shots",
  description:
    "Drop in any screenshot and Framerly wraps it in a browser, device, or app chrome, casts the shadow, and hands you back a PNG worth shipping.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  );
}
