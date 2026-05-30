import { ReactNode } from "react";

/** Max-width editorial container with fluid gutters. */
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[1280px] px-6 sm:px-10 lg:px-16 ${className}`}>
      {children}
    </div>
  );
}

/** Section wrapper with consistent vertical rhythm + optional alt background. */
export function Section({
  children,
  id,
  alt = false,
  className = "",
}: {
  children: ReactNode;
  id?: string;
  alt?: boolean;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`relative z-[2] py-24 sm:py-32 lg:py-40 ${
        alt ? "bg-paper-dim" : "bg-paper"
      } ${className}`}
    >
      {children}
    </section>
  );
}

/** Numbered editorial section label, e.g. (01) Selected Works. */
export function SectionLabel({
  n,
  children,
}: {
  n: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-10 flex items-center gap-3 text-label uppercase tracking-[0.18em] text-ink-soft">
      <span className="text-accent tabular-nums">({n})</span>
      <span className="h-px w-8 bg-line" aria-hidden />
      <span>{children}</span>
    </div>
  );
}
