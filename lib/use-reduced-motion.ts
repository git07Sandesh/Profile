"use client";

import { useEffect, useState } from "react";

/**
 * Single source of truth for motion preference, consumed by every animated
 * component. Returns true when the user has requested reduced motion, so
 * callers can skip/disable non-essential animation.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
