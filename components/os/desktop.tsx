"use client";

import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { findNode, root, type FsNode } from "@/lib/filesystem";
import { profile } from "@/lib/content";
import { Window } from "./wm/window";
import { NodeIcon } from "./icons";
import { Screensaver } from "./screensaver";
import {
  TASKBAR_H,
  initialWm,
  wmReducer,
  type Bounds,
} from "./wm/reducer";

function titleFor(path: string) {
  return path === "/" ? "~" : `~${path}`;
}

export function Desktop({
  renderBody,
}: {
  renderBody: (path: string, navigate: (to: string) => void) => React.ReactNode;
}) {
  const [wm, dispatch] = useReducer(wmReducer, initialWm);
  const [bounds, setBounds] = useState<Bounds>({ w: 1440, h: 860 });

  useEffect(() => {
    const sync = () =>
      setBounds({ w: window.innerWidth, h: window.innerHeight - TASKBAR_H });
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  const open = useCallback(
    (path: string) => {
      const node = findNode(path);
      if (!node) return;
      dispatch({
        type: "OPEN",
        id: path,
        title: titleFor(path),
        path,
        bounds: { w: window.innerWidth, h: window.innerHeight - TASKBAR_H },
      });
    },
    [],
  );

  // A deep link wins outright; otherwise know-me is the only thing pre-opened.
  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get("path");
    open(wanted && findNode(wanted) ? wanted : "/know-me");
  }, [open]);

  const top = useMemo(
    () => wm.wins.reduce<null | string>((id, w) => {
      const cur = wm.wins.find((x) => x.id === id);
      return !cur || w.z > cur.z ? w.id : id;
    }, null),
    [wm.wins],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && top) dispatch({ type: "CLOSE", id: top });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [top]);

  const icons = root.children ?? [];

  return (
    <div className="os-root">
      {/* Full height, behind the taskbar too, so its glass has something to refract. */}
      <div className="os-wallpaper" aria-hidden />
      <Screensaver frozen={wm.wins.some((w) => w.maximized)} />

      <div
        className="absolute inset-x-0 top-0 overflow-hidden"
        style={{ height: bounds.h }}
      >
        <DesktopIcons nodes={icons} onOpen={open} />

        <AnimatePresence>
          {wm.wins.map((w) => (
            <Window
              key={w.id}
              win={w}
              bounds={bounds}
              focused={w.id === top}
              onFocus={() => dispatch({ type: "FOCUS", id: w.id })}
              onClose={() => dispatch({ type: "CLOSE", id: w.id })}
              onMaximize={() => dispatch({ type: "MAXIMIZE", id: w.id, bounds })}
              onGeometry={(rect) => dispatch({ type: "GEOMETRY", id: w.id, rect })}
            >
              {renderBody(w.path, (to) => {
                const node = findNode(to);
                if (node)
                  dispatch({
                    type: "NAVIGATE",
                    id: w.id,
                    path: to,
                    title: titleFor(to),
                  });
              })}
            </Window>
          ))}
        </AnimatePresence>
      </div>

      <Taskbar
        wins={wm.wins.map((w) => ({ id: w.id, title: w.title }))}
        activeId={top}
        onSelect={(id) => dispatch({ type: "FOCUS", id })}
        onOpen={open}
      />
    </div>
  );
}

function DesktopIcons({
  nodes,
  onOpen,
}: {
  nodes: FsNode[];
  onOpen: (path: string) => void;
}) {
  return (
    <ul className="absolute left-4 top-4 z-0 flex w-24 flex-col gap-1">
      {nodes.map((n) => (
        <li key={n.path}>
          <button
            type="button"
            onDoubleClick={() => onOpen(n.path)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onOpen(n.path);
            }}
            className="group flex w-full flex-col items-center gap-1 rounded-lg p-2 text-center transition-colors hover:bg-white/12"
          >
            <span className="size-9 drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]">
              <NodeIcon node={n} />
            </span>
            <span className="break-all font-mono text-[11px] leading-tight text-white/85 [text-shadow:0_1px_4px_rgba(0,0,0,0.7)]">
              {n.name}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

function Taskbar({
  wins,
  activeId,
  onSelect,
  onOpen,
}: {
  wins: { id: string; title: string }[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onOpen: (path: string) => void;
}) {
  const [clock, setClock] = useState("");

  useEffect(() => {
    const tick = () =>
      setClock(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer
      className="os-glass-bar absolute inset-x-0 bottom-0 flex items-center gap-2 px-2.5"
      style={{ height: TASKBAR_H }}
    >
      {/* Vintage nameplate kept deliberately on the modern bar. */}
      <span className="shrink-0 rounded-md border border-white/10 bg-black/40 px-2.5 py-1 font-mono text-[11px] tracking-wide text-os-amber">
        {profile.name.split(" ")[0].toUpperCase()}·WS
      </span>

      <ul className="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden">
        {wins.map((w) => (
          <li key={w.id} className="min-w-0">
            <button
              type="button"
              onClick={() => onSelect(w.id)}
              className={`max-w-44 truncate rounded-lg border px-2.5 py-1 font-mono text-[11px] transition-colors ${
                w.id === activeId
                  ? "border-white/30 bg-white/20 text-white"
                  : "border-white/12 bg-white/8 text-white/65 hover:bg-white/14 hover:text-white"
              }`}
            >
              {w.title}
            </button>
          </li>
        ))}
      </ul>

      {/* Always reachable: never buried in the tree. */}
      <button
        type="button"
        onClick={() => onOpen("/resume.pdf")}
        className="shrink-0 rounded-lg bg-os-amber px-2.5 py-1 font-mono text-[11px] text-os-ink hover:brightness-110"
      >
        résumé
      </button>
      <button
        type="button"
        onClick={() => onOpen("/contact.txt")}
        className="shrink-0 rounded-lg border border-white/15 bg-white/8 px-2.5 py-1 font-mono text-[11px] text-white/75 hover:bg-white/16 hover:text-white"
      >
        contact
      </button>
      {/* Recessed LCD: phosphor only reads against a dark surface. */}
      <span className="os-readout shrink-0 rounded-md border border-white/10 bg-black/35 px-2 py-0.5 text-[11px] tabular-nums">
        {clock}
      </span>
    </footer>
  );
}
