"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/primitives";
import { profile } from "@/lib/content";

const links = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

/** Minimal sticky navbar: gains a hairline + paper backdrop after scroll. */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "border-b border-line bg-paper/85 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <Container className="flex items-center justify-between py-4">
        <a href="#top" className="font-display text-h3 leading-none">
          {profile.name}
        </a>
        <nav className="hidden items-center gap-8 text-small text-ink-soft sm:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-ink">
              {l.label}
            </a>
          ))}
          <a
            href={profile.resumeUrl}
            className="border-b-2 border-accent pb-0.5 text-ink transition-colors hover:text-accent"
          >
            Résumé
          </a>
        </nav>
        <a
          href="#contact"
          className="text-small text-ink underline decoration-accent underline-offset-4 sm:hidden"
        >
          Contact
        </a>
      </Container>
    </header>
  );
}
