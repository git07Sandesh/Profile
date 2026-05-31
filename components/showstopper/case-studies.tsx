"use client";

import { useRef, useState, lazy, Suspense, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Container } from "@/components/primitives";
import type { Project } from "@/lib/content";

const Scene = lazy(() => import("@/components/showstopper/scene"));

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * THE SHOWSTOPPER (Phase 3) — the 3 featured projects as one pinned, scroll-
 * driven cinematic sequence. ONE pinned container holds a scrubbed GSAP timeline
 * that cross-fades between case-study "scenes" (problem → approach → outcome).
 * Text lives in normal DOM layers above the single R3F element, so it stays
 * crisp and readable at every scroll position.
 *
 * The 3D <Scene> is lazy() + Suspense — its bundle is only fetched when this
 * component mounts (the parent only mounts it once near-viewport).
 */
export function CaseStudies({ projects }: { projects: Project[] }) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  useGSAP(
    () => {
      const panels = gsap.utils.toArray<HTMLElement>("[data-panel]");
      if (!panels.length) return;

      // Pin the stage for (panels * 100vh) and scrub a timeline that fades
      // each panel in/out as the user scrolls.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => `+=${panels.length * 100}%`,
          scrub: 1,
          pin: "[data-stage]",
          anticipatePin: 1,
          onUpdate: (self) => {
            setProgress(self.progress);
            setActive(Math.min(panels.length - 1, Math.floor(self.progress * panels.length)));
          },
        },
      });

      panels.forEach((panel, i) => {
        if (i === 0) {
          gsap.set(panel, { autoAlpha: 1, y: 0 });
        } else {
          tl.fromTo(
            panel,
            { autoAlpha: 0, y: 40 },
            { autoAlpha: 1, y: 0, duration: 0.5 },
            i,
          );
        }
        if (i < panels.length - 1) {
          tl.to(panel, { autoAlpha: 0, y: -40, duration: 0.5 }, i + 0.5);
        }
      });

      return () => tl.scrollTrigger?.kill();
    },
    { scope: root, dependencies: [projects.length] },
  );

  return (
    <div ref={root} className="relative z-[2]">
      {/* pinned stage — deeper than the page base so the 3D pops */}
      <div data-stage className="relative h-screen w-full overflow-hidden bg-[#070709] text-ink">
        {/* single 3D element, behind the text */}
        <div className="pointer-events-none absolute inset-0 opacity-80">
          <Suspense fallback={null}>
            <Scene progress={progress} />
          </Suspense>
        </div>

        {/* scrim so text stays legible over the 3D */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#070709] via-[#070709]/55 to-transparent" />

        {/* progress rail */}
        <div className="absolute left-6 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-3 sm:left-10 lg:flex">
          {projects.map((p, i) => (
            <div key={p.id} className="flex items-center gap-3">
              <span
                className={`h-px transition-all duration-500 ${
                  i === active ? "w-10 bg-ink" : "w-5 bg-ink/30"
                }`}
              />
              <span
                className={`text-label uppercase tracking-widest transition-colors duration-500 ${
                  i === active ? "text-ink" : "text-ink/30"
                }`}
              >
                {p.index}
              </span>
            </div>
          ))}
        </div>

        {/* stacked case-study panels */}
        <Container className="relative z-10 flex h-full items-center">
          <div className="relative w-full max-w-3xl">
            {projects.map((p) => (
              <article
                key={p.id}
                data-panel
                className="absolute inset-x-0 invisible"
                style={{ opacity: 0 }}
              >
                <p className="mb-5 flex items-center gap-3 text-label uppercase tracking-[0.18em] text-ink-soft">
                  <span className="text-glow">({p.index})</span>
                  <span className="h-px w-8 bg-line" aria-hidden />
                  {p.role}
                </p>
                <h3 className="font-display text-display-l">{p.name}</h3>
                <p className="mt-3 text-body-l text-ink-soft">{p.tagline}</p>

                <div className="mt-8 grid gap-5 sm:grid-cols-3">
                  {[
                    ["Problem", p.problem],
                    ["Approach", p.approach],
                    ["Outcome", p.outcome],
                  ].map(([label, text]) => (
                    <div key={label}>
                      <p className="mb-2 text-label uppercase tracking-widest text-ink-soft">
                        {label}
                      </p>
                      <p className="text-small leading-relaxed text-ink">{text}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2">
                  {p.metrics.map((m) => (
                    <span key={m.label} className="text-small text-ink-soft">
                      <span className="font-display text-h3 text-glow">{m.value}</span>{" "}
                      {m.label}
                    </span>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap gap-5 text-small">
                  {p.links.map((l) => (
                    <a
                      key={l.label}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border-b-2 border-[var(--color-accent)] pb-0.5 text-ink transition-opacity hover:opacity-70"
                    >
                      {l.label} →
                    </a>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </Container>

        {/* scroll hint */}
        <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-label uppercase tracking-widest text-ink/40">
          scroll
        </div>
      </div>
    </div>
  );
}

/**
 * Static, normally-scrolling fallback — used under prefers-reduced-motion (and
 * as SSR output). Full content, no pin, no 3D, fully readable.
 */
export function CaseStudiesStatic({ projects }: { projects: Project[] }) {
  return (
    <div className="space-y-px border-t border-line">
      {projects.map((p) => (
        <article key={p.id} className="border-b border-line py-12">
          <p className="mb-4 flex items-center gap-3 text-label uppercase tracking-[0.18em] text-ink-soft">
            <span className="text-accent">({p.index})</span>
            <span className="h-px w-8 bg-line" aria-hidden />
            {p.role}
          </p>
          <h3 className="font-display text-display-l">{p.name}</h3>
          <p className="mt-3 max-w-2xl text-body-l text-ink-soft">{p.tagline}</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {[
              ["Problem", p.problem],
              ["Approach", p.approach],
              ["Outcome", p.outcome],
            ].map(([label, text]) => (
              <div key={label}>
                <p className="mb-2 text-label uppercase tracking-widest text-ink-soft">
                  {label}
                </p>
                <p className="text-small leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2">
            {p.metrics.map((m) => (
              <span key={m.label} className="text-small text-ink-soft">
                <span className="font-display text-h3 text-ink">{m.value}</span> {m.label}
              </span>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-5 text-small">
            {p.links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="border-b-2 border-accent pb-0.5 text-ink hover:text-accent"
              >
                {l.label} →
              </a>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
