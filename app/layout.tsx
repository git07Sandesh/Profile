import type { Metadata } from "next";
import { Geist, Instrument_Serif } from "next/font/google";
import "./globals.css";

// Body / UI face — quiet neo-grotesque. Self-hosted via next/font (no render-block).
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

// Display face — editorial serif headlines.
const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

const siteUrl = "https://sandeshbhattarai.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Sandesh Bhattarai — Full-stack Software Engineer",
  description:
    "Full-stack software engineer who ships end-to-end. Production work across React, Next.js, Python, and Flutter — plus award-winning ML research.",
  openGraph: {
    title: "Sandesh Bhattarai — Full-stack Software Engineer",
    description:
      "Full-stack software engineer who ships end-to-end. Selected works, experience, and research.",
    url: siteUrl,
    siteName: "Sandesh Bhattarai",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${instrumentSerif.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
