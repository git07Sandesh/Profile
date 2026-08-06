"use client";

import { useEffect, useState } from "react";
import type { FsNode } from "@/lib/filesystem";
import { NodeIcon } from "../icons";

function ancestorsOf(path: string): string[] {
  const parts = path.split("/").filter(Boolean);
  return parts.map((_, i) => "/" + parts.slice(0, i + 1).join("/"));
}

export function Tree({
  root,
  selected,
  onSelect,
}: {
  root: FsNode;
  selected: string;
  onSelect: (path: string) => void;
}) {
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(["/", "/projects", ...ancestorsOf(selected)]),
  );

  useEffect(() => {
    setExpanded((prev) => {
      const next = new Set(prev);
      ancestorsOf(selected).forEach((p) => next.add(p));
      return next;
    });
  }, [selected]);

  return (
    <nav aria-label="Files" className="h-full overflow-auto bg-os-chassis py-2">
      <Row
        node={root}
        depth={0}
        expanded={expanded}
        setExpanded={setExpanded}
        selected={selected}
        onSelect={onSelect}
      />
    </nav>
  );
}

function Row({
  node,
  depth,
  expanded,
  setExpanded,
  selected,
  onSelect,
}: {
  node: FsNode;
  depth: number;
  expanded: Set<string>;
  setExpanded: (fn: (prev: Set<string>) => Set<string>) => void;
  selected: string;
  onSelect: (path: string) => void;
}) {
  const isDir = node.type === "dir";
  const isOpen = expanded.has(node.path);
  const isSelected = selected === node.path;

  const activate = () => {
    onSelect(node.path);
    if (isDir) {
      setExpanded((prev) => {
        const next = new Set(prev);
        if (next.has(node.path)) next.delete(node.path);
        else next.add(node.path);
        return next;
      });
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={activate}
        aria-expanded={isDir ? isOpen : undefined}
        aria-current={isSelected ? "true" : undefined}
        className={`flex w-full items-center gap-1.5 py-[3px] pr-2 text-left font-mono text-xs ${
          isSelected
            ? "bg-os-amber text-os-accent-ink"
            : "text-os-ink hover:bg-os-chassis-hi"
        }`}
        style={{ paddingLeft: 8 + depth * 12 }}
      >
        <span className="w-2 shrink-0 text-[9px] leading-none opacity-70">
          {isDir ? (isOpen ? "▾" : "▸") : ""}
        </span>
        <span className="size-4 shrink-0">
          <NodeIcon node={node} open={isOpen && !isSelected} />
        </span>
        <span className="truncate">{node.name}</span>
      </button>

      {isDir && isOpen
        ? node.children?.map((c) => (
            <Row
              key={c.path}
              node={c}
              depth={depth + 1}
              expanded={expanded}
              setExpanded={setExpanded}
              selected={selected}
              onSelect={onSelect}
            />
          ))
        : null}
    </>
  );
}
