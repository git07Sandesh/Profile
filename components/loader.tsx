"use client";

import { useEffect, useRef, useState } from "react";
import { animate, stagger } from "animejs";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Brief branded loader (anime.js). Skippable, ~1.3s perceived, then unmounts.
 * Under reduced motion it shows nothing (no flash) and resolves immediately.
 */
export function Loader({ onDone }: { onDone: () => void }) {
  const reduced = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (reduced) {
      onDone();
      return;
    }
    const root = rootRef.current;
    if (!root) return;

    const chars = root.querySelectorAll<HTMLElement>("[data-char]");
    animate(chars, {
      opacity: [0, 1],
      y: ["0.4em", "0em"],
      delay: stagger(40, { start: 150 }),
      duration: 500,
      ease: "outExpo",
    });

    const t = window.setTimeout(() => {
      animate(root, {
        opacity: [1, 0],
        duration: 450,
        ease: "inOutQuad",
        onComplete: () => {
          setHidden(true);
          onDone();
        },
      });
    }, 1300);

    return () => window.clearTimeout(t);
  }, [reduced, onDone]);

  if (reduced || hidden) return null;

  const name = "Sandesh Bhattarai";
  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-paper"
      aria-hidden
    >
      <span className="font-display text-display-l">
        {name.split("").map((c, i) => (
          <span key={i} data-char className="inline-block opacity-0">
            {c === " " ? " " : c}
          </span>
        ))}
      </span>
    </div>
  );
}
