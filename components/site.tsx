"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Loader } from "@/components/loader";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import {
  About,
  SelectedWorks,
  Skills,
  Experience,
  Contact,
} from "@/components/sections";
import { Footer } from "@/components/footer";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

// Kept out of the initial bundle so phones never download the window manager.
const WorkstationOS = dynamic(
  () => import("@/components/os").then((m) => m.WorkstationOS),
  { ssr: false, loading: () => null },
);

/**
 * Owns the OS-vs-editorial decision after mount. The inline probe in
 * app/layout.tsx sets the same attribute before first paint; this keeps it
 * correct across resizes and clears it if the OS becomes ineligible.
 */
function useOsEligible() {
  const reduced = usePrefersReducedMotion();
  const [wide, setWide] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const on = wide && !reduced;

  useEffect(() => {
    if (on) document.documentElement.dataset.os = "on";
    else delete document.documentElement.dataset.os;
  }, [on]);

  return on;
}

/**
 * The editorial site is always server-rendered: it is the document crawlers
 * and phones get. The workstation OS mounts over it as an enhancement on wide
 * viewports when motion is welcome.
 */
export function Site() {
  const [ready, setReady] = useState(false);
  const os = useOsEligible();

  return (
    <>
      <div className="editorial-root">
        <Loader onDone={() => setReady(true)} />
        <Navbar />
        <main>
          <Hero start={ready} />
          <SelectedWorks />
          <About />
          <Skills />
          <Experience />
          <Contact />
        </main>
        <Footer />
      </div>
      {os ? <WorkstationOS /> : null}
    </>
  );
}
