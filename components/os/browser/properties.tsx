"use client";

import type { FsNode } from "@/lib/filesystem";
import { iconForLabel } from "../brand-icons";

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-os-inset-ink-soft">
      {children}
    </p>
  );
}

export function Properties({ node }: { node: FsNode }) {
  const { meta } = node;

  return (
    <aside
      aria-label="Properties"
      className="h-full overflow-auto bg-os-inset p-4 text-os-inset-ink"
    >
      <Label>Properties</Label>

      <p className="font-mono text-sm text-os-inset-ink">{node.name}</p>
      <p className="mt-0.5 font-mono text-[11px] text-os-inset-ink-soft">{meta.kind}</p>

      <dl className="mt-5 space-y-2 border-t border-os-slate pt-4">
        {meta.rows.map((r) => (
          <div key={r.label} className="grid grid-cols-[64px_1fr] gap-2">
            <dt className="font-mono text-[10px] uppercase tracking-wider text-os-inset-ink-soft">
              {r.label}
            </dt>
            <dd className="break-words text-[12px] leading-snug text-os-inset-ink">
              {r.value}
            </dd>
          </div>
        ))}
      </dl>

      {meta.readouts?.length ? (
        <div className="mt-6 border-t border-os-slate pt-4">
          <Label>Readout</Label>
          <ul className="space-y-2">
            {meta.readouts.map((r) => (
              <li
                key={r.label}
                className="bevel-in border-os-slate bg-os-slate-lo px-3 py-2"
              >
                <p className="os-readout text-lg leading-none">{r.value}</p>
                <p className="mt-1.5 font-mono text-[10px] uppercase tracking-wider text-os-inset-ink-soft">
                  {r.label}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {meta.links?.length ? (
        <div className="mt-6 border-t border-os-slate pt-4">
          <Label>Open</Label>
          <ul className="flex flex-wrap gap-2">
            {meta.links.map((l) => {
              const Icon = iconForLabel(l.label);
              return (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target={l.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="bevel-out inline-flex items-center gap-1.5 bg-os-chassis px-2 py-1 font-mono text-[11px] text-os-ink hover:bg-os-amber"
                  >
                    <span className="size-3.5">
                      <Icon />
                    </span>
                    {l.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </aside>
  );
}
