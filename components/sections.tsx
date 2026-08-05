"use client";

import { Container, Section, SectionLabel } from "@/components/primitives";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Showstopper } from "@/components/showstopper";
import {
  about,
  awards,
  experience,
  profile,
  projects,
  skills,
} from "@/lib/content";

/* ----------------------------------------------------------------- About --- */
export function About() {
  return (
    <Section id="about">
      <Container>
        <SectionLabel n="01">About</SectionLabel>
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <Reveal>
              <p className="font-display text-display-l">{about.lead}</p>
            </Reveal>
            <div className="mt-8 max-w-2xl space-y-5">
              {about.body.map((p, i) => (
                <Reveal key={i} delay={0.05 * i}>
                  <p className="text-body-l text-ink-soft">{p}</p>
                </Reveal>
              ))}
            </div>
          </div>
          <Reveal delay={0.1}>
            {/* single owner-image placeholder: swap when a photo is provided */}
            <div className="aspect-[4/5] w-full overflow-hidden rounded-sm border border-line bg-paper-dim">
              <div className="flex h-full items-center justify-center text-small text-ink-soft">
                portrait placeholder
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

/* -------------------------------------------------- Selected works (shell) -- */
/* Phase 2 renders ALL projects as editorial cards. Phase 3 upgrades the 3
   featured ones into the pinned cinematic showstopper. */
export function SelectedWorks() {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <section id="work" className="relative z-[2]">
      {/* intro label sits on paper, before the dark pinned stage */}
      <Container className="pt-24 sm:pt-32">
        <SectionLabel n="02">Selected Works</SectionLabel>
        <p className="max-w-xl text-body-l text-ink-soft">
          Three projects, each shipped end-to-end. Scroll through the case
          studies: problem, approach, outcome.
        </p>
      </Container>

      {/* THE SHOWSTOPPER: pinned, scroll-driven cinematic case studies
          (reduced-motion → static fallback; 3D lazy-loaded near viewport). */}
      <div className="mt-12">
        <Showstopper projects={featured} />
      </div>

      {/* compact list: remaining projects, no showstopper */}
      <Container className="py-24 sm:py-32">
        <p className="mb-6 text-label uppercase tracking-[0.18em] text-ink-soft">
          More projects
        </p>
        <RevealGroup className="grid gap-px border-t border-line sm:grid-cols-2">
          {rest.map((p) => (
            <RevealItem key={p.id}>
              <a
                href={p.links[0]?.href}
                target="_blank"
                rel="noopener noreferrer"
                className="glass group flex h-full flex-col gap-2 rounded-md p-6 transition-colors hover:border-[var(--color-accent)]"
              >
                <span className="font-display text-h3 transition-colors group-hover:text-accent">
                  {p.name}
                </span>
                <span className="text-small text-ink-soft">{p.tagline}</span>
                <span className="mt-auto pt-3 text-small text-ink-soft">
                  {p.stack.slice(0, 4).join(" · ")}
                </span>
              </a>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}

/* ---------------------------------------------------------------- Skills --- */
export function Skills() {
  return (
    <Section id="skills">
      <Container>
        <SectionLabel n="03">Skills</SectionLabel>
        <RevealGroup className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((s) => (
            <RevealItem key={s.group}>
              <p className="mb-3 text-small uppercase tracking-widest text-ink-soft">
                {s.group}
              </p>
              <ul className="flex flex-wrap gap-2">
                {s.items.map((it) => (
                  <li
                    key={it}
                    className="rounded-sm border border-line px-3 py-1 text-small"
                  >
                    {it}
                  </li>
                ))}
              </ul>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}

/* ------------------------------------------------------------ Experience --- */
export function Experience() {
  return (
    <Section id="experience" alt>
      <Container>
        <SectionLabel n="04">Experience</SectionLabel>
        <div className="border-t border-line">
          {experience.map((e) => (
            <Reveal key={e.org}>
              <div className="grid gap-2 border-b border-line py-8 sm:grid-cols-[1fr_2fr] sm:gap-8">
                <div>
                  <a
                    href={e.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-display text-h3 hover:text-accent"
                  >
                    {e.org}
                  </a>
                  <p className="text-small text-ink-soft">{e.period}</p>
                </div>
                <div>
                  <p className="text-body font-medium">{e.role}</p>
                  <p className="mt-1 text-body text-ink-soft">{e.summary}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-12">
          <p className="mb-4 text-label uppercase tracking-[0.18em] text-ink-soft">
            Awards & Honors
          </p>
          <RevealGroup className="grid gap-2 sm:grid-cols-2">
            {awards.map((a) => (
              <RevealItem key={a}>
                <p className="flex gap-3 text-body text-ink-soft">
                  <span className="text-accent">·</span>
                  {a}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Container>
    </Section>
  );
}

/* --------------------------------------------------------------- Contact --- */
export function Contact() {
  return (
    <Section id="contact">
      <Container>
        <SectionLabel n="05">Contact</SectionLabel>
        <Reveal>
          <p className="max-w-3xl font-display text-display-l">
            Open to new-grad Software Engineer roles. Let&apos;s talk.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <a
              href={`mailto:${profile.email}`}
              className="btn-glow rounded-md bg-accent px-6 py-3 text-small font-medium text-[var(--color-accent-ink)] hover:bg-[var(--color-accent-bright)]"
            >
              {profile.email}
            </a>
            <a
              href={profile.resumeUrl}
              className="border-b-2 border-line pb-0.5 text-small text-ink transition-colors hover:border-accent"
            >
              Download résumé
            </a>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
