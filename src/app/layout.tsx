import type { Metadata } from "next";
import {
  JetBrains_Mono,
  Fira_Code,
  Source_Code_Pro,
  IBM_Plex_Mono,
} from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
  display: "swap",
});

const sourceCodePro = Source_Code_Pro({
  subsets: ["latin"],
  variable: "--font-source-code-pro",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

export const metadata = {
  title: "Framerly — Turn plain screenshots into polished shots",
  description:
    "Drop in any screenshot and Framerly wraps it in a browser, device, or app chrome, casts the shadow, and hands you back a PNG worth shipping.",
  openGraph: {
    title: "Framerly — Turn plain screenshots into polished shots",
    description: "Every screenshot deserves a studio.",
    url: "https://framerly-shot.vercel.app",
    siteName: "Framerly",
    images: [
      {
        url: "https://framerly-shot.vercel.app/og-image.png",
        width: 1200,
        height: 675,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Framerly — Turn plain screenshots into polished shots",
    description: "Every screenshot deserves a studio.",
    images: ["https://framerly-shot.vercel.app/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`dark ${jetbrainsMono.variable} ${firaCode.variable} ${sourceCodePro.variable} ${ibmPlexMono.variable}`}
    >
      <body className="antialiased">
        {children}
        <Toaster theme="dark" position="bottom-right" />
      </body>
    </html>
  );
}
