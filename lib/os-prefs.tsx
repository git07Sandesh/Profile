"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export const COLOR_MODES = ["system", "light", "dark"] as const;
export const SKINS = ["workstation", "aqua", "redmond", "gnome"] as const;
export const FIELDS = ["off", "subtle", "bright"] as const;

export type ColorMode = (typeof COLOR_MODES)[number];
export type Skin = (typeof SKINS)[number];
export type Field = (typeof FIELDS)[number];

export type Prefs = { mode: ColorMode; skin: Skin; field: Field };

export const SKIN_LABELS: Record<Skin, string> = {
  workstation: "Workstation",
  aqua: "Aqua",
  redmond: "Redmond",
  gnome: "Gnome",
};

/** Multiplier applied to the wallpaper's edge alpha. */
export const FIELD_ALPHA: Record<Field, number> = {
  off: 0,
  subtle: 0.45,
  bright: 1,
};

const DEFAULTS: Prefs = { mode: "system", skin: "workstation", field: "bright" };
const KEY = "sb-os-prefs";

function load(): Prefs {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULTS;
    const p = JSON.parse(raw) as Partial<Prefs>;
    return {
      mode: COLOR_MODES.includes(p.mode as ColorMode) ? (p.mode as ColorMode) : DEFAULTS.mode,
      skin: SKINS.includes(p.skin as Skin) ? (p.skin as Skin) : DEFAULTS.skin,
      field: FIELDS.includes(p.field as Field) ? (p.field as Field) : DEFAULTS.field,
    };
  } catch {
    return DEFAULTS;
  }
}

type Ctx = Prefs & {
  /** Resolved light or dark, after applying the system preference. */
  theme: "light" | "dark";
  set: <K extends keyof Prefs>(key: K, value: Prefs[K]) => void;
};

const PrefsContext = createContext<Ctx | null>(null);

export function OsPrefsProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULTS);
  const [systemDark, setSystemDark] = useState(false);

  useEffect(() => setPrefs(load()), []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => setSystemDark(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const set = useCallback(<K extends keyof Prefs>(key: K, value: Prefs[K]) => {
    setPrefs((prev) => {
      const next = { ...prev, [key]: value };
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const theme: "light" | "dark" =
    prefs.mode === "system" ? (systemDark ? "dark" : "light") : prefs.mode;

  return (
    <PrefsContext.Provider value={{ ...prefs, theme, set }}>{children}</PrefsContext.Provider>
  );
}

export function useOsPrefs() {
  const ctx = useContext(PrefsContext);
  if (!ctx) throw new Error("useOsPrefs must be used inside OsPrefsProvider");
  return ctx;
}
