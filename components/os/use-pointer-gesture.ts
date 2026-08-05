"use client";

import { useCallback, useRef } from "react";

/** Shared pointer-capture drag: window moves, the eight resize handles, and pane dividers. */
export function usePointerGesture() {
  const origin = useRef({ px: 0, py: 0 });

  return useCallback(
    (
      e: React.PointerEvent,
      onMove: (dx: number, dy: number, px: number, py: number) => void,
      onEnd?: (px: number, py: number) => void,
    ) => {
      e.preventDefault();
      e.stopPropagation();
      origin.current = { px: e.clientX, py: e.clientY };
      let last = { px: e.clientX, py: e.clientY };

      const move = (ev: PointerEvent) => {
        last = { px: ev.clientX, py: ev.clientY };
        onMove(
          ev.clientX - origin.current.px,
          ev.clientY - origin.current.py,
          ev.clientX,
          ev.clientY,
        );
      };
      const up = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
        document.body.style.userSelect = "";
        onEnd?.(last.px, last.py);
      };

      document.body.style.userSelect = "none";
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
    },
    [],
  );
}
