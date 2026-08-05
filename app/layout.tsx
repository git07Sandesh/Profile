import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

// Body / UI face — quiet neo-grotesque. Self-hosted via next/font (no render-block).
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

// Utility face — paths, filenames, and the OS instrument readouts.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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

// Decides the OS-vs-editorial view before first paint so neither one flashes.
// Mirrored by useOsEligible() in components/site.tsx, which owns it after mount.
const osProbe = `try{if(matchMedia('(min-width:1024px)').matches&&matchMedia('(prefers-reduced-motion: no-preference)').matches)document.documentElement.dataset.os='on'}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: the probe below stamps data-os on <html> before
    // React hydrates, so the server markup intentionally differs by that attribute.
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable}`}
    >
      <body>
        <script dangerouslySetInnerHTML={{ __html: osProbe }} />
        {children}
      </body>
    </html>
  );
}
