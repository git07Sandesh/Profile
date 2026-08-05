"use client";

import { useRef, useState } from "react";
import { findNode, root } from "@/lib/filesystem";
import { usePointerGesture } from "../use-pointer-gesture";
import { Tree } from "./tree";
import { Content } from "./content";
import { Properties } from "./properties";

const MIN_SIDE = 150;
const MIN_CENTER = 260;

export function FileBrowser({
  path,
  onNavigate,
}: {
  path: string;
  onNavigate: (path: string) => void;
}) {
  const shell = useRef<HTMLDivElement>(null);
  const gesture = usePointerGesture();
  const [treeW, setTreeW] = useState(196);
  const [propsW, setPropsW] = useState(248);

  const node = findNode(path) ?? root;

  const total = () => shell.current?.clientWidth ?? 1000;

  const dragTree = (e: React.PointerEvent) => {
    const start = treeW;
    gesture(e, (dx) => {
      const max = total() - propsW - MIN_CENTER - 8;
      setTreeW(Math.max(MIN_SIDE, Math.min(start + dx, max)));
    });
  };

  const dragProps = (e: React.PointerEvent) => {
    const start = propsW;
    gesture(e, (dx) => {
      const max = total() - treeW - MIN_CENTER - 8;
      setPropsW(Math.max(MIN_SIDE, Math.min(start - dx, max)));
    });
  };

  return (
    <div
      ref={shell}
      className="grid h-full w-full"
      style={{ gridTemplateColumns: `${treeW}px 4px 1fr 4px ${propsW}px` }}
    >
      <Tree root={root} selected={node.path} onSelect={onNavigate} />

      <Divider
        label="Resize file tree"
        onPointerDown={dragTree}
        onNudge={(d) => setTreeW((w) => Math.max(MIN_SIDE, w + d))}
      />

      <Content node={node} onOpen={onNavigate} />

      <Divider
        label="Resize properties"
        onPointerDown={dragProps}
        onNudge={(d) => setPropsW((w) => Math.max(MIN_SIDE, w - d))}
      />

      <Properties node={node} />
    </div>
  );
}

function Divider({
  label,
  onPointerDown,
  onNudge,
}: {
  label: string;
  onPointerDown: (e: React.PointerEvent) => void;
  onNudge: (delta: number) => void;
}) {
  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label={label}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") onNudge(-16);
        if (e.key === "ArrowRight") onNudge(16);
      }}
      className="cursor-col-resize bg-os-chassis-lo hover:bg-os-amber"
    />
  );
}
