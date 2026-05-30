"use client";

import { useState } from "react";
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

/**
 * Client shell: the loader gates the hero's anime.js intro so the choreography
 * starts only after the loader clears. Everything below the hero reveals on
 * scroll independently.
 */
export function Site() {
  const [ready, setReady] = useState(false);

  return (
    <>
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
    </>
  );
}
