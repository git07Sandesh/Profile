"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/primitives";
import { profile } from "@/lib/content";

/** Live local time: the small human footer detail (like the reference sites). */
function LocalTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () =>
      setTime(
        new Intl.DateTimeFormat("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: profile.timezone,
          hour12: true,
        }).format(new Date()),
      );
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  // render nothing until mounted to avoid hydration mismatch
  return (
    <span className="tabular-nums">
      {time ? `${time} · Hattiesburg, MS` : "Hattiesburg, MS"}
    </span>
  );
}

export function Footer() {
  return (
    <footer className="relative z-[2] border-t border-line">
      <Container className="flex flex-col gap-6 py-12 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-h2">Let&apos;s build something.</p>
          <p className="mt-2 text-small text-ink-soft">
            <LocalTime />
          </p>
        </div>
        <div className="flex flex-col gap-3 text-small sm:items-end">
          <nav className="flex gap-5">
            {profile.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-soft transition-colors hover:text-ink"
              >
                {s.label}
              </a>
            ))}
          </nav>
          <span className="text-ink-soft">© 2026 {profile.name}</span>
        </div>
      </Container>
    </footer>
  );
}
