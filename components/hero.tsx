"use client";

import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import { Container } from "@/components/primitives";
import { Magnetic } from "@/components/motion/magnetic";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { profile } from "@/lib/content";

/**
 * Editorial hero. anime.js choreographs the headline word reveal on mount;
 * everything else is static type. No 3D, no canvas (reserved for Phase 3).
 */
export function Hero({ start }: { start: boolean }) {
  const reduced = usePrefersReducedMotion();
  const headRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!start || reduced) return;
    const words = headRef.current?.querySelectorAll<HTMLElement>("[data-word]");
    if (words?.length) {
      animate(words, {
        opacity: [0, 1],
        y: ["0.5em", "0em"],
        rotate: ["2deg", "0deg"],
        delay: stagger(90),
        duration: 800,
        ease: "outExpo",
      });
    }
    if (subRef.current) {
      animate(subRef.current, {
        opacity: [0, 1],
        y: [16, 0],
        delay: 500,
        duration: 700,
        ease: "outQuad",
      });
    }
  }, [start, reduced]);

  const headline = ["Sandesh", "Bhattarai."];
  const animateInitial = start && !reduced ? "opacity-0" : "";

  return (
    <section id="top" className="relative z-[2]">
      <Container className="flex min-h-[88vh] flex-col justify-center py-28">
        <p className="mb-8 flex flex-wrap items-center gap-3 text-label uppercase tracking-[0.18em] text-ink-soft">
          <span className="text-accent">(00)</span>
          <span className="h-px w-8 bg-line" aria-hidden />
          {profile.location} · {profile.title}
        </p>

        <h1 className="font-display text-display-xl leading-[0.95] tracking-[-0.01em]">
          {headline.map((word, i) => (
            <span key={i} className="block overflow-hidden">
              <span data-word className={`inline-block ${animateInitial}`}>
                {word}
              </span>
            </span>
          ))}
        </h1>

        <div ref={subRef} className={animateInitial}>
          <p className="mt-8 max-w-2xl text-body-l text-ink-soft">{profile.blurb}</p>
          <div className="mt-12 flex flex-wrap items-center gap-6">
            <Magnetic>
              <a
                href="#work"
                className="btn-glow group inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 text-small font-medium text-[var(--color-accent-ink)] hover:bg-[var(--color-accent-bright)]"
              >
                See the work
                <span className="transition-transform group-hover:translate-x-1" aria-hidden>
                  →
                </span>
              </a>
            </Magnetic>
            <a
              href={profile.resumeUrl}
              className="border-b-2 border-line pb-0.5 text-small text-ink transition-colors hover:border-accent"
            >
              Résumé
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
