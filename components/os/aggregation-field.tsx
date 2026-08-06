"use client";

import { useEffect, useRef } from "react";

const NODES = 64;
const RADIUS = 0.42;
const RIPPLE_MS = 900;
const EDGE_ALPHA = 0.34;
const ICON_COLUMN = 130;

/**
 * Live wallpaper: client nodes drift, and in slow rounds their edges to a
 * wandering centroid brighten in an outward ripple. Secure aggregation, running
 * continuously behind the desktop.
 */
export function AggregationField({
  paused = false,
  intensity = 1,
}: {
  paused?: boolean;
  intensity?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const halted = useRef(paused);
  halted.current = paused;
  const amp = useRef(intensity);
  amp.current = intensity;

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    const animate = !matchMedia("(prefers-reduced-motion: reduce)").matches;

    const nodes = Array.from({ length: NODES }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 1e-4,
      vy: (Math.random() - 0.5) * 1e-4,
    }));

    let w = 0;
    let h = 0;
    let raf = 0;
    let last = 0;

    const size = () => {
      w = cv.clientWidth;
      h = cv.clientHeight;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const frame = (t: number) => {
      if (animate) raf = requestAnimationFrame(frame);
      if (document.hidden || t - last < 33) return;
      const dt = Math.min(t - last, 100);
      last = t;

      // Nothing to see when a window covers the desktop, so skip the work.
      if (halted.current || amp.current <= 0) {
        ctx.clearRect(0, 0, w, h);
        return;
      }

      ctx.clearRect(0, 0, w, h);

      const cx = (0.5 + Math.sin(t / 21000) * 0.16) * w;
      const cy = (0.5 + Math.cos(t / 17000) * 0.12) * h;

      for (const n of nodes) {
        n.x += n.vx * dt;
        n.y += n.vy * dt;
        if (n.x < 0 || n.x > 1) n.vx *= -1;
        if (n.y < 0 || n.y > 1) n.vy *= -1;

        const px = n.x * w;
        const py = n.y * h;
        if (px < ICON_COLUMN) continue;

        const d = Math.hypot((px - cx) / w, (py - cy) / h);
        if (d > RADIUS) continue;

        // Floored so the constellation is always present and the round reads as
        // a wave travelling through it, not edges blinking in and out.
        const wave = 0.55 + 0.45 * Math.sin(t / RIPPLE_MS - d * 14);
        const falloff = 0.35 + 0.65 * (1 - d / RADIUS);
        const a = falloff * wave * EDGE_ALPHA * amp.current;

        ctx.strokeStyle = `rgba(124,224,176,${a})`;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(cx, cy);
        ctx.stroke();

        ctx.fillStyle = `rgba(124,224,176,${Math.min(a * 2.4, 0.55)})`;
        ctx.fillRect(px - 1, py - 1, 2, 2);
      }
    };

    size();
    addEventListener("resize", size);
    if (animate) raf = requestAnimationFrame(frame);
    else frame(0);

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("resize", size);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 size-full mix-blend-screen"
    />
  );
}
