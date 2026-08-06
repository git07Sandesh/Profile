"use client";

import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { usePointerGesture } from "../use-pointer-gesture";
import { useOsPrefs } from "@/lib/os-prefs";
import {
  MIN_H,
  MIN_W,
  snapFor,
  type Bounds,
  type Rect,
  type Win,
} from "./reducer";

type Edge = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

const HANDLES: { edge: Edge; cls: string }[] = [
  { edge: "n", cls: "top-0 left-2 right-2 h-1.5 cursor-ns-resize" },
  { edge: "s", cls: "bottom-0 left-2 right-2 h-1.5 cursor-ns-resize" },
  { edge: "w", cls: "left-0 top-2 bottom-2 w-1.5 cursor-ew-resize" },
  { edge: "e", cls: "right-0 top-2 bottom-2 w-1.5 cursor-ew-resize" },
  { edge: "nw", cls: "top-0 left-0 size-3 cursor-nwse-resize" },
  { edge: "ne", cls: "top-0 right-0 size-3 cursor-nesw-resize" },
  { edge: "sw", cls: "bottom-0 left-0 size-3 cursor-nesw-resize" },
  { edge: "se", cls: "bottom-0 right-0 size-3 cursor-nwse-resize" },
];

function resized(start: Rect, edge: Edge, dx: number, dy: number, b: Bounds): Rect {
  let { x, y, w, h } = start;

  if (edge.includes("e")) w = start.w + dx;
  if (edge.includes("s")) h = start.h + dy;
  if (edge.includes("w")) {
    const d = Math.max(-start.x, Math.min(dx, start.w - MIN_W));
    x = start.x + d;
    w = start.w - d;
  }
  if (edge.includes("n")) {
    const d = Math.max(-start.y, Math.min(dy, start.h - MIN_H));
    y = start.y + d;
    h = start.h - d;
  }

  return {
    x,
    y,
    w: Math.max(MIN_W, Math.min(w, b.w - x)),
    h: Math.max(MIN_H, Math.min(h, b.h - y)),
  };
}

export function Window({
  win,
  bounds,
  focused,
  children,
  onFocus,
  onClose,
  onMaximize,
  onGeometry,
}: {
  win: Win;
  bounds: Bounds;
  focused: boolean;
  children: ReactNode;
  onFocus: () => void;
  onClose: () => void;
  onMaximize: () => void;
  onGeometry: (rect: Rect) => void;
}) {
  const gesture = usePointerGesture();
  const { skin } = useOsPrefs();
  const [live, setLive] = useState<Rect | null>(null);
  const [snapHint, setSnapHint] = useState<Rect | null>(null);
  const rect = live ?? win;

  // Aqua puts its controls left of the title; the rest keep them on the right.
  const controlsFirst = skin === "aqua";
  const btn =
    "os-winbtn grid size-5 place-items-center font-mono text-[10px] text-os-ink " +
    (skin === "workstation" ? "bevel-out bg-os-chassis" : "");

  const controls = (
    <div className="flex items-center gap-1.5">
      {/* Gnome header bars carry a close affordance only. */}
      {skin === "gnome" ? null : (
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={onMaximize}
          aria-label={win.maximized ? "Restore window" : "Maximize window"}
          className={`${btn} ${skin === "aqua" ? "bg-[#f5bd4f]" : "hover:bg-os-chassis-hi"}`}
        >
          {win.maximized ? "❐" : "□"}
        </button>
      )}
      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={onClose}
        aria-label="Close window"
        className={`${btn} ${skin === "aqua" ? "bg-[#ec6a5f]" : "hover:bg-os-amber"}`}
      >
        ✕
      </button>
    </div>
  );

  const startMove = (e: React.PointerEvent) => {
    onFocus();
    const start = { x: win.x, y: win.y, w: win.w, h: win.h };
    gesture(
      e,
      (dx, dy, px, py) => {
        setLive({
          ...start,
          x: Math.max(0, Math.min(start.x + dx, bounds.w - start.w)),
          y: Math.max(0, Math.min(start.y + dy, bounds.h - start.h)),
        });
        setSnapHint(snapFor(px, py, bounds));
      },
      (px, py) => {
        const snap = snapFor(px, py, bounds);
        setLive((cur) => {
          onGeometry(snap ?? cur ?? start);
          return null;
        });
        setSnapHint(null);
      },
    );
  };

  const startResize = (e: React.PointerEvent, edge: Edge) => {
    onFocus();
    const start = { x: win.x, y: win.y, w: win.w, h: win.h };
    gesture(
      e,
      (dx, dy) => setLive(resized(start, edge, dx, dy, bounds)),
      () => setLive((cur) => {
        onGeometry(cur ?? start);
        return null;
      }),
    );
  };

  return (
    <>
      {snapHint ? (
        <div
          aria-hidden
          className="pointer-events-none absolute z-[999] border-2 border-os-amber bg-os-amber/10"
          style={{
            left: snapHint.x,
            top: snapHint.y,
            width: snapHint.w,
            height: snapHint.h,
          }}
        />
      ) : null}

      <motion.section
        role="dialog"
        aria-label={win.title}
        initial={{ opacity: 0, scale: 0.985 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.985 }}
        transition={{ duration: 0.14, ease: "easeOut" }}
        onPointerDownCapture={onFocus}
        className={`os-window absolute flex flex-col bg-os-chassis ${
          skin === "workstation" ? "bevel-out" : ""
        } ${focused ? "shadow-[0_18px_50px_rgba(0,0,0,0.55)]" : "shadow-none"}`}
        style={{
          left: rect.x,
          top: rect.y,
          width: rect.w,
          height: rect.h,
          zIndex: win.z,
        }}
      >
        <header
          onPointerDown={startMove}
          onDoubleClick={onMaximize}
          className={`os-titlebar flex shrink-0 select-none items-center gap-2 px-2 py-1.5 ${
            skin === "workstation" && focused ? "os-hatch" : ""
          } ${skin === "workstation" && !focused ? "bg-os-slate-lo" : ""}`}
          style={{ cursor: "grab" }}
        >
          {controlsFirst ? controls : null}

          {skin === "workstation" ? (
            <span
              aria-hidden
              className={`size-2.5 shrink-0 ${focused ? "bg-os-amber" : "bg-os-chassis-lo"}`}
            />
          ) : null}

          <h2
            className={`truncate font-mono text-xs tracking-wide ${
              skin === "workstation" || skin === "redmond"
                ? "text-os-chassis-hi"
                : "text-os-ink"
            } ${skin === "gnome" ? "text-center" : ""} ${controlsFirst ? "flex-1" : ""}`}
          >
            {win.title}
          </h2>

          {controlsFirst ? null : <div className="ml-auto flex items-center gap-1">{controls}</div>}
        </header>

        <div className="min-h-0 flex-1 overflow-hidden">{children}</div>

        {!win.maximized &&
          HANDLES.map((h) => (
            <div
              key={h.edge}
              onPointerDown={(e) => startResize(e, h.edge)}
              className={`absolute ${h.cls}`}
            />
          ))}
      </motion.section>
    </>
  );
}
