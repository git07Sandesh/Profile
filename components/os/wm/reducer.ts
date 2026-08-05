export type Rect = { x: number; y: number; w: number; h: number };
export type Bounds = { w: number; h: number };

export type Win = Rect & {
  id: string;
  title: string;
  path: string;
  z: number;
  maximized: boolean;
  restore?: Rect;
};

export type WmState = { wins: Win[]; nextZ: number };

export type WmAction =
  | { type: "OPEN"; id: string; title: string; path: string; bounds: Bounds }
  | { type: "CLOSE"; id: string }
  | { type: "FOCUS"; id: string }
  | { type: "GEOMETRY"; id: string; rect: Rect }
  | { type: "MAXIMIZE"; id: string; bounds: Bounds }
  | { type: "NAVIGATE"; id: string; path: string; title: string };

export const MIN_W = 560;
export const MIN_H = 340;
export const TASKBAR_H = 40;
const CASCADE = 28;

export const initialWm: WmState = { wins: [], nextZ: 1 };

function clampRect(r: Rect, b: Bounds): Rect {
  const w = Math.max(MIN_W, Math.min(r.w, b.w));
  const h = Math.max(MIN_H, Math.min(r.h, b.h));
  return {
    w,
    h,
    x: Math.max(0, Math.min(r.x, b.w - w)),
    y: Math.max(0, Math.min(r.y, b.h - h)),
  };
}

function defaultRect(index: number, b: Bounds): Rect {
  const w = Math.min(1180, Math.max(MIN_W, b.w - 140));
  const h = Math.min(740, Math.max(MIN_H, b.h - 96));
  const off = (index % 5) * CASCADE;
  return clampRect(
    { x: (b.w - w) / 2 + off, y: (b.h - h) / 2 + off - 16, w, h },
    b,
  );
}

/** Left/right half or top-edge maximize, or null when the pointer is not near an edge. */
export function snapFor(x: number, y: number, b: Bounds): Rect | null {
  const EDGE = 12;
  if (y <= EDGE) return { x: 0, y: 0, w: b.w, h: b.h };
  if (x <= EDGE) return { x: 0, y: 0, w: Math.round(b.w / 2), h: b.h };
  if (x >= b.w - EDGE)
    return { x: Math.round(b.w / 2), y: 0, w: Math.round(b.w / 2), h: b.h };
  return null;
}

export function wmReducer(state: WmState, action: WmAction): WmState {
  switch (action.type) {
    case "OPEN": {
      const existing = state.wins.find((w) => w.id === action.id);
      if (existing) return wmReducer(state, { type: "FOCUS", id: action.id });
      const win: Win = {
        id: action.id,
        title: action.title,
        path: action.path,
        z: state.nextZ,
        maximized: false,
        ...defaultRect(state.wins.length, action.bounds),
      };
      return { wins: [...state.wins, win], nextZ: state.nextZ + 1 };
    }

    case "CLOSE":
      return { ...state, wins: state.wins.filter((w) => w.id !== action.id) };

    case "FOCUS": {
      const win = state.wins.find((w) => w.id === action.id);
      if (!win || win.z === state.nextZ - 1) return state;
      return {
        wins: state.wins.map((w) =>
          w.id === action.id ? { ...w, z: state.nextZ } : w,
        ),
        nextZ: state.nextZ + 1,
      };
    }

    case "GEOMETRY":
      return {
        ...state,
        wins: state.wins.map((w) =>
          w.id === action.id
            ? { ...w, ...action.rect, maximized: false, restore: undefined }
            : w,
        ),
      };

    case "MAXIMIZE":
      return {
        ...state,
        wins: state.wins.map((w) => {
          if (w.id !== action.id) return w;
          if (w.maximized && w.restore) {
            return { ...w, ...w.restore, maximized: false, restore: undefined };
          }
          return {
            ...w,
            restore: { x: w.x, y: w.y, w: w.w, h: w.h },
            x: 0,
            y: 0,
            w: action.bounds.w,
            h: action.bounds.h,
            maximized: true,
          };
        }),
      };

    case "NAVIGATE":
      return {
        ...state,
        wins: state.wins.map((w) =>
          w.id === action.id
            ? { ...w, path: action.path, title: action.title }
            : w,
        ),
      };
  }
}

export function assertWm() {
  const b: Bounds = { w: 1440, h: 860 };
  let s = initialWm;

  s = wmReducer(s, { type: "OPEN", id: "a", title: "A", path: "/", bounds: b });
  s = wmReducer(s, { type: "OPEN", id: "b", title: "B", path: "/", bounds: b });
  if (s.wins.length !== 2) throw new Error("wm: expected 2 windows");

  s = wmReducer(s, { type: "OPEN", id: "a", title: "A", path: "/", bounds: b });
  if (s.wins.length !== 2) throw new Error("wm: re-open must focus, not duplicate");
  if (s.wins[0].z <= s.wins[1].z) throw new Error("wm: re-open must raise z");

  s = wmReducer(s, { type: "MAXIMIZE", id: "a", bounds: b });
  const max = s.wins.find((w) => w.id === "a")!;
  if (!max.maximized || max.w !== b.w || max.h !== b.h) {
    throw new Error("wm: maximize must fill bounds");
  }

  s = wmReducer(s, { type: "MAXIMIZE", id: "a", bounds: b });
  const restored = s.wins.find((w) => w.id === "a")!;
  if (restored.maximized || restored.w === b.w) {
    throw new Error("wm: second maximize must restore");
  }

  const tiny = clampRect({ x: -500, y: -500, w: 10, h: 10 }, b);
  if (tiny.w < MIN_W || tiny.h < MIN_H || tiny.x < 0 || tiny.y < 0) {
    throw new Error("wm: clamp must enforce minimums and stay on screen");
  }

  if (snapFor(600, 400, b) !== null) throw new Error("wm: centre must not snap");
  if (snapFor(2, 400, b)?.w !== b.w / 2) throw new Error("wm: left edge must half-snap");
  if (snapFor(600, 2, b)?.h !== b.h) throw new Error("wm: top edge must maximize");

  s = wmReducer(s, { type: "CLOSE", id: "a" });
  s = wmReducer(s, { type: "CLOSE", id: "b" });
  if (s.wins.length !== 0) throw new Error("wm: close must remove windows");
}

if (process.env.NODE_ENV === "development") assertWm();
