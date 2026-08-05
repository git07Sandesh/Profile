export function FolderIcon({ open = false }: { open?: boolean }) {
  return (
    <svg viewBox="0 0 24 20" className="size-full" aria-hidden>
      <path
        d="M1 3.5A1.5 1.5 0 0 1 2.5 2h6l2 2.5h11A1.5 1.5 0 0 1 23 6v11.5a1.5 1.5 0 0 1-1.5 1.5h-19A1.5 1.5 0 0 1 1 17.5z"
        fill={open ? "var(--color-os-amber)" : "var(--color-os-chassis)"}
        stroke="var(--color-os-ink)"
        strokeWidth="1"
      />
    </svg>
  );
}

export function KnowMeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-full" aria-hidden>
      <rect
        x="1.5"
        y="3.5"
        width="21"
        height="17"
        rx="2.5"
        fill="var(--color-os-chassis-hi)"
        stroke="var(--color-os-ink)"
        strokeWidth="1"
      />
      <circle cx="8" cy="10.5" r="2.6" fill="var(--color-os-amber)" stroke="var(--color-os-ink)" strokeWidth="1" />
      <path
        d="M3.8 17.2c.6-2.1 2.2-3.2 4.2-3.2s3.6 1.1 4.2 3.2"
        fill="none"
        stroke="var(--color-os-ink)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path d="M14.5 9h5.5M14.5 12h5.5M14.5 15h3.5" stroke="var(--color-os-ink)" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

export function FileIcon() {
  return (
    <svg viewBox="0 0 20 24" className="size-full" aria-hidden>
      <path
        d="M2 1.5h11L18 6.5v16H2z"
        fill="var(--color-os-chassis-hi)"
        stroke="var(--color-os-ink)"
        strokeWidth="1"
      />
      <path
        d="M13 1.5V6.5H18"
        fill="none"
        stroke="var(--color-os-ink)"
        strokeWidth="1"
      />
    </svg>
  );
}
