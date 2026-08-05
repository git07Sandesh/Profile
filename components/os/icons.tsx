import type { FsNode } from "@/lib/filesystem";

const chassis = "var(--color-os-chassis)";
const chassisHi = "var(--color-os-chassis-hi)";
const ink = "var(--color-os-ink)";
const amber = "var(--color-os-amber)";
const slate = "var(--color-os-slate)";

const svg = "size-full";

export function FolderIcon({ open = false }: { open?: boolean }) {
  return (
    <svg viewBox="0 0 24 20" className={svg} aria-hidden>
      <path
        d="M1 3.5A1.5 1.5 0 0 1 2.5 2h6l2 2.5h11A1.5 1.5 0 0 1 23 6v11.5a1.5 1.5 0 0 1-1.5 1.5h-19A1.5 1.5 0 0 1 1 17.5z"
        fill={open ? amber : chassis}
        stroke={ink}
        strokeWidth="1"
      />
    </svg>
  );
}

export function FileIcon() {
  return (
    <svg viewBox="0 0 20 24" className={svg} aria-hidden>
      <path d="M2 1.5h11L18 6.5v16H2z" fill={chassisHi} stroke={ink} strokeWidth="1" />
      <path d="M13 1.5V6.5H18" fill="none" stroke={ink} strokeWidth="1" />
    </svg>
  );
}

/** know-me: an ID badge. */
export function KnowMeIcon() {
  return (
    <svg viewBox="0 0 24 24" className={svg} aria-hidden>
      <rect x="1.5" y="3.5" width="21" height="17" rx="2.5" fill={chassisHi} stroke={ink} strokeWidth="1" />
      <circle cx="8" cy="10.5" r="2.6" fill={amber} stroke={ink} strokeWidth="1" />
      <path
        d="M3.8 17.2c.6-2.1 2.2-3.2 4.2-3.2s3.6 1.1 4.2 3.2"
        fill="none"
        stroke={ink}
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path d="M14.5 9h5.5M14.5 12h5.5M14.5 15h3.5" stroke={ink} strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

/** projects: stacked sheets, a body of work rather than one thing. */
export function CrateIcon() {
  return (
    <svg viewBox="0 0 24 24" className={svg} aria-hidden>
      <rect x="3" y="2.5" width="15" height="18" rx="1.5" fill={chassisHi} stroke={ink} strokeWidth="1.2" />
      <rect x="6" y="4.5" width="15" height="18" rx="1.5" fill={chassis} stroke={ink} strokeWidth="1.2" />
      <path d="M9 10h9M9 13.5h9M9 17h5.5" stroke={ink} strokeWidth="1.3" strokeLinecap="round" />
      <rect x="6" y="4.5" width="15" height="3" rx="1.5" fill={amber} stroke={ink} strokeWidth="1.2" />
    </svg>
  );
}

/** skills: an IC package. */
export function ChipIcon() {
  return (
    <svg viewBox="0 0 24 24" className={svg} aria-hidden>
      <path
        d="M8.5 1.5v3.5M15.5 1.5v3.5M8.5 19v3.5M15.5 19v3.5M1.5 8.5h3.5M1.5 15.5h3.5M19 8.5h3.5M19 15.5h3.5"
        stroke={ink}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <rect x="4" y="4" width="16" height="16" rx="1.5" fill={slate} stroke={ink} strokeWidth="1.2" />
      <rect x="8.5" y="8.5" width="7" height="7" rx="0.5" fill={amber} />
    </svg>
  );
}

/** experience: a briefcase. */
export function BriefcaseIcon() {
  return (
    <svg viewBox="0 0 24 24" className={svg} aria-hidden>
      <path
        d="M8 7V5.5A2.5 2.5 0 0 1 10.5 3h3A2.5 2.5 0 0 1 16 5.5V7"
        fill="none"
        stroke={ink}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <rect x="1.5" y="7" width="21" height="14" rx="2" fill={chassis} stroke={ink} strokeWidth="1.2" />
      <rect x="9.5" y="12" width="5" height="4" rx="0.6" fill={amber} stroke={ink} strokeWidth="1.2" />
      <path d="M1.5 12h8M14.5 12h8" stroke={ink} strokeWidth="1.2" />
    </svg>
  );
}

/** resume.pdf: a sheet wearing a PDF tag. */
export function PdfIcon() {
  return (
    <svg viewBox="0 0 24 24" className={svg} aria-hidden>
      <path d="M3.5 1.5h11L20 7v15.5h-16.5z" fill={chassisHi} stroke={ink} strokeWidth="1" />
      <path d="M14.5 1.5V7H20" fill="none" stroke={ink} strokeWidth="1" />
      <path d="M6.5 9.5h7" stroke={ink} strokeWidth="1.2" strokeLinecap="round" />
      <rect x="5.5" y="12" width="13" height="8" rx="1" fill={amber} stroke={ink} strokeWidth="1.2" />
      <path
        d="M8 18v-4.2h1.4a1.3 1.3 0 0 1 0 2.6H8M12.4 18v-4.2h1.1a2.1 2.1 0 0 1 0 4.2zM16.6 18v-4.2h2"
        fill="none"
        stroke={ink}
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** contact.txt: an envelope. */
export function EnvelopeIcon() {
  return (
    <svg viewBox="0 0 24 24" className={svg} aria-hidden>
      <rect x="2" y="4.5" width="20" height="15" rx="1.5" fill={chassisHi} stroke={ink} strokeWidth="1" />
      <path d="M2.4 5.6L12 13.2 21.6 5.6" fill={amber} stroke={ink} strokeWidth="1" strokeLinejoin="round" />
    </svg>
  );
}

/** a project folder, labelled so it reads apart from a plain directory. */
export function ProjectFolderIcon() {
  return (
    <svg viewBox="0 0 24 20" className={svg} aria-hidden>
      <path
        d="M1 3.5A1.5 1.5 0 0 1 2.5 2h6l2 2.5h11A1.5 1.5 0 0 1 23 6v11.5a1.5 1.5 0 0 1-1.5 1.5h-19A1.5 1.5 0 0 1 1 17.5z"
        fill={chassis}
        stroke={ink}
        strokeWidth="1.1"
      />
      <rect x="4.5" y="10" width="15" height="5" rx="0.8" fill={amber} stroke={ink} strokeWidth="1.1" />
    </svg>
  );
}

/** .md, carrying the markdown mark. */
export function MarkdownIcon() {
  return (
    <svg viewBox="0 0 24 24" className={svg} aria-hidden>
      <path d="M3.5 1.5h11L20 7v15.5h-16.5z" fill={chassisHi} stroke={ink} strokeWidth="1.2" />
      <path d="M14.5 1.5V7H20" fill="none" stroke={ink} strokeWidth="1.2" />
      <rect x="5.5" y="12" width="13" height="8" rx="1" fill={amber} stroke={ink} strokeWidth="1.2" />
      <path
        d="M7.6 18.2v-4.4l2 2.2 2-2.2v4.4M14.4 13.8v3.1M14.4 17.6l1.5-1.7M14.4 17.6l-1.5-1.7"
        fill="none"
        stroke={ink}
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** .txt, a plain sheet with a highlighted first line. */
export function TextIcon() {
  return (
    <svg viewBox="0 0 24 24" className={svg} aria-hidden>
      <path d="M3.5 1.5h11L20 7v15.5h-16.5z" fill={chassisHi} stroke={ink} strokeWidth="1.2" />
      <path d="M14.5 1.5V7H20" fill="none" stroke={ink} strokeWidth="1.2" />
      <path d="M6.5 11h8" stroke={amber} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M6.5 14.5h11M6.5 18h7" stroke={ink} strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

/** .link, a globe: this one leaves the site. */
export function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" className={svg} aria-hidden>
      <circle cx="12" cy="12" r="9.2" fill={amber} stroke={ink} strokeWidth="1.2" />
      <ellipse cx="12" cy="12" rx="4" ry="9.2" fill="none" stroke={ink} strokeWidth="1.1" />
      <path d="M3.2 9h17.6M3.2 15h17.6" stroke={ink} strokeWidth="1.1" />
    </svg>
  );
}

const BY_KEY = {
  "know-me": KnowMeIcon,
  projects: CrateIcon,
  skills: ChipIcon,
  experience: BriefcaseIcon,
  resume: PdfIcon,
  contact: EnvelopeIcon,
  project: ProjectFolderIcon,
  markdown: MarkdownIcon,
  text: TextIcon,
  link: GlobeIcon,
} as const;

/** Extension decides the file mark, so new nodes need no tagging. */
function byExtension(name: string) {
  if (name.endsWith(".md")) return MarkdownIcon;
  if (name.endsWith(".link")) return GlobeIcon;
  if (name.endsWith(".txt")) return TextIcon;
  if (name.endsWith(".pdf")) return PdfIcon;
  return null;
}

/** Declared mark first, then extension, then the generic folder/file glyph. */
export function NodeIcon({ node, open = false }: { node: FsNode; open?: boolean }) {
  const Declared = node.icon ? BY_KEY[node.icon] : null;
  if (Declared) return <Declared />;

  const ByExt = byExtension(node.name);
  if (ByExt) return <ByExt />;

  return node.type === "dir" ? <FolderIcon open={open} /> : <FileIcon />;
}
