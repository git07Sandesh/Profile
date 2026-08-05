"use client";

import { useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/content";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { CaseStudiesStatic } from "@/components/showstopper/case-studies";
import dynamic from "next/dynamic";

/**
 * Lazy boundary for the showstopper.
 * - Under reduced motion (or before first mount): render the static fallback.
 * - Otherwise, once the section nears the viewport, dynamically import the
 *   GSAP + R3F case-study sequence. This keeps the heavy 3D/GSAP bundle out of
 *   the initial page load: it's only fetched when the user approaches.
 */
const CaseStudies = dynamic(
  () => import("@/components/showstopper/case-studies").then((m) => m.CaseStudies),
  { ssr: false, loading: () => null },
);

export function Showstopper({ projects }: { projects: Project[] }) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" }, // start loading ~600px before it enters
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  if (reduced) {
    return <CaseStudiesStatic projects={projects} />;
  }

  // Static case studies are the SSR/pre-scroll render, so the featured projects
  // are always in the HTML; the animated version swaps in near the viewport.
  return (
    <div ref={ref}>
      {near ? (
        <CaseStudies projects={projects} />
      ) : (
        <CaseStudiesStatic projects={projects} />
      )}
    </div>
  );
}
