"use client";

import { useState } from "react";

import type { FsNode } from "@/lib/filesystem";
import { about, awards, experience, highlights, profile } from "@/lib/content";
import { architectureDocs } from "@/lib/architecture.generated";
import { NodeIcon, PdfIcon } from "../icons";
import { ExternalIcon, MailIcon, iconForLabel } from "../brand-icons";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-os-ink-soft">
      {children}
    </p>
  );
}

export function Content({
  node,
  onOpen,
}: {
  node: FsNode;
  onOpen: (path: string) => void;
}) {
  const v = node.view;

  // The viewer owns its whole pane, so it opts out of the padded text layout.
  if (v.kind === "pdf") return <PdfView label={v.label} href={v.href} />;

  return (
    <div className="h-full overflow-auto bg-os-chassis-hi px-7 py-6 text-os-ink">
      {v.kind === "folder" ? (
        <FolderView node={node} onOpen={onOpen} />
      ) : v.kind === "about" ? (
        <AboutView />
      ) : v.kind === "architecture" ? (
        <ArchitectureView project={v.project} />
      ) : v.kind === "project" ? (
        <>
          <Eyebrow>
            {v.project.role} · {v.project.year}
          </Eyebrow>
          <h1 className="text-2xl font-medium tracking-tight">{v.project.name}</h1>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-os-ink-soft">
            {v.project.tagline}
          </p>

          {v.project.problem ? (
            <div className="mt-7 grid max-w-3xl gap-5 sm:grid-cols-3">
              {(
                [
                  ["Problem", v.project.problem],
                  ["Approach", v.project.approach],
                  ["Outcome", v.project.outcome],
                ] as const
              ).map(([label, text]) => (
                <section key={label}>
                  <Eyebrow>{label}</Eyebrow>
                  <p className="text-[13px] leading-relaxed">{text}</p>
                </section>
              ))}
            </div>
          ) : null}

          <div className="mt-8">
            <Eyebrow>Stack</Eyebrow>
            <ul className="flex flex-wrap gap-1.5">
              {v.project.stack.map((s) => (
                <li
                  key={s}
                  className="bevel-out bg-os-chassis px-2 py-0.5 font-mono text-[11px]"
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {node.children?.length ? (
            <div className="mt-8">
              <Eyebrow>Contents</Eyebrow>
              <Grid nodes={node.children} onOpen={onOpen} />
            </div>
          ) : null}
        </>
      ) : v.kind === "prose" ? (
        <>
          <h1 className="max-w-3xl text-xl font-medium leading-snug tracking-tight">
            {v.title}
          </h1>
          <div className="mt-5 max-w-2xl space-y-4">
            {v.paragraphs.map((p, i) => (
              <p key={i} className="text-[14px] leading-relaxed text-os-ink">
                {p}
              </p>
            ))}
          </div>
        </>
      ) : v.kind === "list" ? (
        <>
          <h1 className="text-xl font-medium tracking-tight">{v.title}</h1>
          <ul className="mt-5 flex max-w-2xl flex-wrap gap-1.5">
            {v.items.map((it) => (
              <li
                key={it}
                className="bevel-out bg-os-chassis px-2.5 py-1 font-mono text-[12px]"
              >
                {it}
              </li>
            ))}
          </ul>
        </>
      ) : v.kind === "gallery" ? (
        <>
          <h1 className="text-xl font-medium tracking-tight">{v.title}</h1>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {v.images.map((img) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={img.src}
                src={img.src}
                alt={img.alt}
                className="bevel-in w-full bg-os-chassis"
              />
            ))}
          </div>
        </>
      ) : v.kind === "link" ? (
        <>
          <Eyebrow>Web location</Eyebrow>
          <h1 className="text-xl font-medium tracking-tight">{v.label}</h1>
          <p className="mt-2 break-all font-mono text-[12px] text-os-ink-soft">
            {v.href}
          </p>
          <a
            href={v.href}
            target="_blank"
            rel="noopener noreferrer"
            className="bevel-out mt-5 inline-block bg-os-amber px-3 py-1.5 font-mono text-[12px] text-os-ink"
          >
            Open in new tab ↗
          </a>
        </>
      ) : (
        <>
          <Eyebrow>Contact</Eyebrow>
          <h1 className="text-xl font-medium tracking-tight">
            Open to Software Engineer roles.
          </h1>
          <a
            href={`mailto:${v.email}`}
            className="bevel-out mt-5 inline-flex items-center gap-2 bg-os-amber px-3 py-1.5 font-mono text-[12px] text-os-ink"
          >
            <span className="size-3.5">
              <MailIcon />
            </span>
            {v.email}
          </a>
          <ul className="mt-5 flex flex-wrap gap-2">
            {v.socials.map((s) => {
              const Icon = iconForLabel(s.label);
              return (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bevel-out inline-flex items-center gap-2 bg-os-chassis px-2.5 py-1 font-mono text-[12px] hover:bg-os-chassis-hi"
                  >
                    <span className="size-3.5">
                      <Icon />
                    </span>
                    {s.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}

/** Drop a file here and it appears; until then the monogram stands in. */
const PORTRAIT = "/portrait.jpg";

function AboutView() {
  const [portraitOk, setPortraitOk] = useState(true);
  const initials = profile.name
    .split(" ")
    .map((p) => p[0])
    .join("");

  return (
    <>
      <header className="flex flex-wrap items-center gap-4">
        <div className="bevel-out grid size-14 shrink-0 place-items-center overflow-hidden bg-os-chassis font-mono text-sm tracking-wider">
          {portraitOk ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={PORTRAIT}
              alt={profile.name}
              onError={() => setPortraitOk(false)}
              className="size-full object-cover"
            />
          ) : (
            initials
          )}
        </div>
        <div className="min-w-0">
          <h1 className="text-xl font-medium tracking-tight">{profile.name}</h1>
          <p className="text-[13px] text-os-ink-soft">{profile.title}</p>
          <p className="mt-0.5 font-mono text-[11px] text-os-ink-soft">
            {profile.location} · {profile.timezone}
          </p>
        </div>

        <ul className="ml-auto flex items-center gap-1.5">
          {profile.socials.map((s) => {
            const Icon = iconForLabel(s.label);
            return (
              <li key={s.href}>
                <a
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  title={s.label}
                  className="bevel-out grid size-9 place-items-center bg-os-chassis text-os-ink hover:bg-os-amber"
                >
                  <span className="size-4">
                    <Icon />
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </header>

      <p className="mt-7 max-w-3xl text-[17px] font-medium leading-snug tracking-tight">
        {about.lead}
      </p>

      <ul className="mt-7 grid gap-2 grid-cols-[repeat(auto-fit,minmax(132px,1fr))]">
        {highlights.map((h) => (
          <li key={h.label} className="bevel-in bg-os-inset px-3 py-2.5">
            <p className="os-readout text-lg leading-none">{h.value}</p>
            <p className="mt-1.5 font-mono text-[10px] uppercase leading-tight tracking-wider text-os-inset-ink-soft">
              {h.label}
            </p>
          </li>
        ))}
      </ul>

      <section className="mt-8">
        <Eyebrow>Currently</Eyebrow>
        <ul className="grid gap-2 grid-cols-[repeat(auto-fit,minmax(232px,1fr))]">
          {experience.map((e) => (
            <li key={e.org}>
              <a
                href={e.href}
                target="_blank"
                rel="noopener noreferrer"
                className="bevel-out flex h-full flex-col bg-os-chassis p-3 hover:bg-os-chassis-hi"
              >
                <span className="flex items-center gap-1.5 text-[13px] font-medium">
                  {e.org}
                  <span className="size-3 text-os-ink-soft">
                    <ExternalIcon />
                  </span>
                </span>
                <span className="mt-0.5 text-[12px] text-os-ink-soft">{e.role}</span>
                <span className="mt-auto pt-2 font-mono text-[10px] uppercase tracking-wider text-os-ink-soft">
                  {e.period}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-8 max-w-2xl space-y-4">
        {about.body.map((p, i) => (
          <p key={i} className="text-[14px] leading-relaxed">
            {p}
          </p>
        ))}
      </div>

      <section className="mt-8">
        <Eyebrow>Awards</Eyebrow>
        <ul className="max-w-2xl space-y-1.5">
          {awards.map((a) => (
            <li key={a} className="flex gap-2.5 text-[13px] leading-snug">
              <span aria-hidden className="text-os-amber">
                ·
              </span>
              {a}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

/** Body is pre-rendered at build time from docs/architecture/*.md, so it is our own trusted markup. */
function ArchitectureView({ project }: { project: string }) {
  const html = architectureDocs[project];
  if (!html) {
    return <p className="font-mono text-[12px] text-os-ink-soft">No architecture doc yet.</p>;
  }
  return <div className="os-doc max-w-3xl" dangerouslySetInnerHTML={{ __html: html }} />;
}

function PdfView({ label, href }: { label: string; href: string }) {
  return (
    <div className="flex h-full flex-col bg-os-chassis-hi">
      <div className="bevel-out flex shrink-0 items-center gap-2 bg-os-chassis px-3 py-1.5">
        <span className="size-4 shrink-0">
          <PdfIcon />
        </span>
        <span className="truncate font-mono text-[11px]">{href.split("/").pop()}</span>
        <div className="ml-auto flex items-center gap-1.5">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="bevel-out inline-flex items-center gap-1.5 bg-os-chassis px-2 py-1 font-mono text-[11px] hover:bg-os-chassis-hi"
          >
            <span className="size-3">
              <ExternalIcon />
            </span>
            Open
          </a>
          <a
            href={href}
            download
            className="bevel-out bg-os-amber px-2 py-1 font-mono text-[11px] text-os-ink"
          >
            Download
          </a>
        </div>
      </div>

      {/* Native browser PDF rendering: no viewer library needed. */}
      <object data={href} type="application/pdf" className="min-h-0 flex-1 bg-os-slate-lo">
        <div className="grid h-full place-items-center p-6 text-center">
          <div>
            <p className="text-[13px]">
              Your browser can&apos;t display PDFs inline.
            </p>
            <a
              href={href}
              className="bevel-out mt-3 inline-block bg-os-chassis px-3 py-1.5 font-mono text-[12px]"
            >
              Download {label}
            </a>
          </div>
        </div>
      </object>
    </div>
  );
}

function FolderView({
  node,
  onOpen,
}: {
  node: FsNode;
  onOpen: (path: string) => void;
}) {
  const children = node.children ?? [];
  return (
    <>
      <Eyebrow>{node.path === "/" ? "Home" : node.name}</Eyebrow>
      {children.length ? (
        <Grid nodes={children} onOpen={onOpen} />
      ) : (
        <p className="font-mono text-[12px] text-os-ink-soft">This folder is empty.</p>
      )}
    </>
  );
}

function Grid({
  nodes,
  onOpen,
}: {
  nodes: FsNode[];
  onOpen: (path: string) => void;
}) {
  return (
    <ul className="grid grid-cols-[repeat(auto-fill,minmax(92px,1fr))] gap-1">
      {nodes.map((n) => (
        <li key={n.path}>
          <button
            type="button"
            onClick={() => onOpen(n.path)}
            className="flex w-full flex-col items-center gap-1.5 p-2.5 text-center hover:bg-os-amber/25"
          >
            <span className="size-8">
              <NodeIcon node={n} />
            </span>
            <span className="break-all font-mono text-[11px] leading-tight">
              {n.name}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
