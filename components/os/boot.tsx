"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// The POST enumerates a real career as if it were hardware. This is the one
// deliberately theatrical moment; everything past the boot stays quiet.
const POST: [string, string][] = [
  ["WORKSTATION FIRMWARE", "v2026.08"],
  ["MEMORY TEST", "OK"],
  ["USM HONORS CS", "4.00 GPA"],
  ["ARROYODEV / ILLUMIBOT", "10,000 USERS"],
  ["SUGA", "FOUNDING ENGINEER"],
  ["TRANSWORLD FLOOR PLAN", "1M+ REQUESTS"],
  ["FHE-ROBUSTAGG_FL", "1ST OF 50+"],
  ["MOUNTING FILESYSTEM", "OK"],
];

const LINE_MS = 90;
const DOTS = 46;

function postLine(label: string, value: string) {
  const pad = Math.max(2, DOTS - label.length - value.length);
  return `${label} ${".".repeat(pad)} ${value}`;
}

export function Boot({ onDone }: { onDone: () => void }) {
  const [shown, setShown] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (shown >= POST.length) {
      const t = setTimeout(() => setLeaving(true), 220);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setShown((n) => n + 1), LINE_MS);
    return () => clearTimeout(t);
  }, [shown]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] grid place-items-center bg-os-void"
      style={{ perspective: 1600 }}
      initial={{ opacity: 1 }}
      animate={leaving ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.42, ease: "easeIn" }}
      onAnimationComplete={() => leaving && onDone()}
    >
      <motion.div
        className="flex flex-col items-center"
        initial={{ scale: 1, rotateX: 7 }}
        animate={leaving ? { scale: 3.4, rotateX: 0 } : { scale: 1, rotateX: 7 }}
        transition={{ duration: 0.42, ease: [0.4, 0, 0.9, 1] }}
        style={{ transformOrigin: "50% 38%" }}
      >
        <div
          className="bevel-out bg-os-chassis p-4"
          style={{ borderRadius: 10, boxShadow: "0 30px 80px rgba(0,0,0,0.6)" }}
        >
          <div
            className="bevel-in relative overflow-hidden bg-[#0b1210] px-6 py-5"
            style={{ width: "min(62vw, 640px)", height: "min(40vh, 360px)" }}
          >
            <pre className="os-readout whitespace-pre text-[11px] leading-[1.6]">
              {POST.slice(0, shown)
                .map(([l, v]) => postLine(l, v))
                .join("\n")}
              {shown >= POST.length ? "\nSTARTING DESKTOP" : ""}
              <span className="animate-pulse">█</span>
            </pre>

            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "repeating-linear-gradient(180deg, rgba(0,0,0,0.22) 0 1px, transparent 1px 3px)",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(120% 90% at 50% 40%, transparent 55%, rgba(0,0,0,0.55) 100%)",
              }}
            />
          </div>

          <div className="mt-2 flex items-center justify-between px-1">
            <span className="font-mono text-[9px] tracking-[0.2em] text-os-ink-soft">
              SB·WORKSTATION
            </span>
            <span
              aria-hidden
              className="size-1.5 rounded-full bg-os-phosphor shadow-[0_0_8px_var(--color-os-phosphor)]"
            />
          </div>
        </div>

        <div className="h-7 w-16 bg-os-chassis-lo" />
        <div className="h-2 w-44 rounded-sm bg-os-chassis" />
      </motion.div>

      <button
        type="button"
        onClick={() => setLeaving(true)}
        className="bevel-out absolute bottom-8 right-8 bg-os-chassis px-3 py-1.5 font-mono text-[11px] text-os-ink hover:bg-os-amber"
      >
        Skip intro
      </button>
    </motion.div>
  );
}
