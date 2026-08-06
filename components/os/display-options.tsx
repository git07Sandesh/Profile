"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  COLOR_MODES,
  FIELDS,
  SKINS,
  SKIN_LABELS,
  useOsPrefs,
  type ColorMode,
  type Field,
  type Skin,
} from "@/lib/os-prefs";

const MODE_LABELS: Record<ColorMode, string> = {
  system: "System",
  light: "Light",
  dark: "Dark",
};

const FIELD_LABELS: Record<Field, string> = {
  off: "Off",
  subtle: "Subtle",
  bright: "Bright",
};

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <span className="font-mono text-[11px] uppercase tracking-wider text-white/55">
        {label}
      </span>
      <div className="flex items-center gap-1">{children}</div>
    </div>
  );
}

function Choice({
  active,
  onClick,
  children,
  title,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      title={title}
      className={`rounded-lg border px-2.5 py-1 font-mono text-[11px] transition-colors ${
        active
          ? "border-white/35 bg-white/22 text-white"
          : "border-white/12 bg-white/8 text-white/65 hover:bg-white/16 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

/** Tiny title-bar caricature so each skin is picked by silhouette, not name alone. */
function SkinPreview({ skin }: { skin: Skin }) {
  const dot = "inline-block size-[5px] rounded-full bg-white/70";
  const sq = "inline-block h-[5px] w-[7px] bg-white/70";
  return (
    <span className="flex h-3 w-12 items-center gap-[3px] rounded-[3px] bg-white/15 px-1">
      {skin === "aqua" ? (
        <>
          <span className={dot} />
          <span className={dot} />
        </>
      ) : null}
      {skin === "gnome" ? (
        <>
          <span className="flex-1" />
          <span className="h-[4px] w-3 rounded-full bg-white/45" />
          <span className="flex-1" />
          <span className={dot} />
        </>
      ) : (
        <>
          <span className="h-[4px] flex-1 rounded-full bg-white/35" />
          {skin === "workstation" ? <span className={sq} /> : null}
          {skin === "redmond" ? (
            <>
              <span className={sq} />
              <span className={sq} />
            </>
          ) : null}
        </>
      )}
    </span>
  );
}

export function DisplayOptions({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { mode, skin, field, set } = useOsPrefs();

  return (
    <AnimatePresence>
      {open ? (
        <motion.section
          aria-label="Display options"
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.98 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="os-glass absolute bottom-14 right-3 z-[160] w-[330px] rounded-2xl p-4 text-white/90"
        >
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-[13px] font-medium text-white">Display options</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close display options"
              className="grid size-6 place-items-center rounded-full border border-white/15 bg-white/10 text-white/70 hover:bg-white/25 hover:text-white"
            >
              <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <div className="divide-y divide-white/10">
            <Row label="Color mode">
              {COLOR_MODES.map((m) => (
                <Choice key={m} active={mode === m} onClick={() => set("mode", m)}>
                  {MODE_LABELS[m]}
                </Choice>
              ))}
            </Row>

            <div className="py-2.5">
              <span className="font-mono text-[11px] uppercase tracking-wider text-white/55">
                Chrome
              </span>
              <div className="mt-2 grid grid-cols-2 gap-1.5">
                {SKINS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => set("skin", s)}
                    aria-pressed={skin === s}
                    className={`flex items-center gap-2 rounded-lg border px-2 py-1.5 font-mono text-[11px] transition-colors ${
                      skin === s
                        ? "border-white/35 bg-white/22 text-white"
                        : "border-white/12 bg-white/8 text-white/65 hover:bg-white/16 hover:text-white"
                    }`}
                  >
                    <SkinPreview skin={s} />
                    {SKIN_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>

            <Row label="Field">
              {FIELDS.map((f) => (
                <Choice key={f} active={field === f} onClick={() => set("field", f)}>
                  {FIELD_LABELS[f]}
                </Choice>
              ))}
            </Row>
          </div>

          <p className="mt-3 font-mono text-[10px] leading-relaxed text-white/40">
            Saved in this browser. Chrome styles the window frames; field is the
            wallpaper constellation.
          </p>
        </motion.section>
      ) : null}
    </AnimatePresence>
  );
}
