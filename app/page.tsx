import { Container, Section, SectionLabel } from "@/components/primitives";

export default function Home() {
  return (
    <main>
      {/* ---- top bar ---- */}
      <header className="relative z-[2]">
        <Container className="flex items-center justify-between py-6">
          <span className="font-display text-h3">Sandesh Bhattarai</span>
          <nav className="hidden gap-8 text-small text-ink-soft sm:flex">
            <a href="#work" className="hover:text-ink">Work</a>
            <a href="#about" className="hover:text-ink">About</a>
            <a href="#contact" className="hover:text-ink">Contact</a>
          </nav>
        </Container>
      </header>

      {/* ---- hero (editorial, no 3D) ---- */}
      <section className="relative z-[2]">
        <Container className="flex min-h-[78vh] flex-col justify-center py-20">
          <p className="mb-8 flex items-center gap-3 text-label uppercase tracking-[0.18em] text-ink-soft">
            <span className="text-accent">(00)</span>
            <span className="h-px w-8 bg-line" aria-hidden />
            Hattiesburg, MS · Full-stack Software Engineer
          </p>
          <h1 className="font-display text-display-xl tracking-[-0.01em]">
            Sandesh
            <br />
            Bhattarai.
          </h1>
          <p className="mt-8 max-w-xl text-body-l text-ink-soft">
            Full-stack software engineer who ships end-to-end — production work
            across React, Next.js, Python, and Flutter, plus award-winning
            privacy-preserving ML research.
          </p>
          <div className="mt-12">
            <a
              href="#work"
              className="group inline-flex items-center gap-2 border-b-2 border-accent pb-1 text-body-l text-ink transition-colors hover:text-accent"
            >
              See the work
              <span
                className="transition-transform group-hover:translate-x-1"
                aria-hidden
              >
                →
              </span>
            </a>
          </div>
        </Container>
      </section>

      {/* ====================================================================
          STYLE & LAYOUT REFERENCE (Review Gate 1 artifact — removed in Phase 2)
          ==================================================================== */}
      <Section id="work" alt>
        <Container>
          <SectionLabel n="01">Style Reference</SectionLabel>

          <div className="grid gap-12 lg:grid-cols-2">
            {/* type scale */}
            <div>
              <p className="mb-6 text-small uppercase tracking-widest text-ink-soft">
                Type — Instrument Serif (display) + Geist (text)
              </p>
              <p className="font-display text-display-l">Display L</p>
              <p className="font-display text-h2">Heading 2 — editorial serif</p>
              <p className="mt-4 text-body-l">
                Body L (Geist) — the quiet, trustworthy text face that carries
                long-form reading.
              </p>
              <p className="mt-2 text-body text-ink-soft">
                Body (17px) — comfortable measure for case-study copy and
                descriptions across the site.
              </p>
              <p className="mt-2 text-small text-ink-soft">
                Small — captions, metadata, footer.
              </p>
            </div>

            {/* palette + components */}
            <div>
              <p className="mb-6 text-small uppercase tracking-widest text-ink-soft">
                Palette — warm paper · ink · one accent
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  ["Paper", "bg-paper border border-line"],
                  ["Paper dim", "bg-paper-dim border border-line"],
                  ["Ink", "bg-ink"],
                  ["Ink soft", "bg-ink-soft"],
                  ["Line", "bg-line"],
                  ["Accent", "bg-accent"],
                ].map(([label, cls]) => (
                  <div key={label}>
                    <div className={`h-16 w-full rounded-sm ${cls}`} />
                    <p className="mt-2 text-small text-ink-soft">{label}</p>
                  </div>
                ))}
              </div>

              <p className="mb-4 mt-10 text-small uppercase tracking-widest text-ink-soft">
                Components
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <button className="rounded-sm bg-accent px-5 py-2.5 text-small font-medium text-[var(--color-accent-ink)]">
                  Primary
                </button>
                <button className="rounded-sm border border-ink px-5 py-2.5 text-small font-medium text-ink transition-colors hover:bg-ink hover:text-paper">
                  Secondary
                </button>
                <a href="#" className="border-b-2 border-accent pb-0.5 text-small text-ink">
                  Text link →
                </a>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <footer className="relative z-[2] border-t border-line">
        <Container className="flex flex-col gap-2 py-10 text-small text-ink-soft sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Sandesh Bhattarai</span>
          <span>Phase 1 foundation · editorial system v0</span>
        </Container>
      </footer>
    </main>
  );
}
