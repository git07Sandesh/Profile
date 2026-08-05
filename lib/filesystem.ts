import {
  awards,
  experience,
  highlights,
  profile,
  projects,
  skills,
  type Project,
} from "@/lib/content";

export type LinkRef = { label: string; href: string };
export type Row = { label: string; value: string };
export type Readout = { value: string; label: string };

export type View =
  | { kind: "folder" }
  | { kind: "about" }
  | { kind: "prose"; title: string; paragraphs: string[] }
  | { kind: "list"; title: string; items: string[] }
  | { kind: "project"; project: Project }
  | { kind: "gallery"; title: string; images: { src: string; alt: string }[] }
  | { kind: "link"; label: string; href: string }
  | { kind: "pdf"; label: string; href: string }
  | { kind: "contact"; email: string; socials: LinkRef[] };

/** Shape the properties pane renders. Sourced from content.ts now; a GitHub fetch can fill the same shape later. */
export type Meta = {
  kind: string;
  rows: Row[];
  readouts?: Readout[];
  links?: LinkRef[];
};

export type FsNode = {
  name: string;
  path: string;
  type: "dir" | "file";
  view: View;
  meta: Meta;
  children?: FsNode[];
  icon?:
    | "know-me"
    | "projects"
    | "skills"
    | "experience"
    | "resume"
    | "contact"
    | "project"
    | "markdown"
    | "text"
    | "link";
};

/** Add a project id here once real images land in /public: the folder appears on its own. */
const SCREENSHOTS: Record<string, { src: string; alt: string }[]> = {};

function slugLink(label: string) {
  return `${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.link`;
}

function projectNode(p: Project): FsNode {
  const base = `/projects/${p.id}`;
  const hasWriteup = Boolean(p.problem && p.approach && p.outcome);
  const shots = SCREENSHOTS[p.id] ?? [];

  const children: FsNode[] = [];

  if (hasWriteup) {
    children.push({
      name: "readme.md",
      path: `${base}/readme.md`,
      type: "file",
      view: {
        kind: "prose",
        title: p.name,
        paragraphs: [p.problem, p.approach, p.outcome],
      },
      meta: {
        kind: "Markdown document",
        rows: [
          { label: "Project", value: p.name },
          { label: "Sections", value: "Problem · Approach · Outcome" },
        ],
      },
    });
  }

  for (const l of p.links) {
    children.push({
      name: slugLink(l.label),
      path: `${base}/${slugLink(l.label)}`,
      type: "file",
      view: { kind: "link", label: l.label, href: l.href },
      meta: {
        kind: "Web location",
        rows: [
          { label: "Opens", value: new URL(l.href).hostname },
          { label: "Target", value: "New tab" },
        ],
        links: [l],
      },
    });
  }

  if (shots.length) {
    children.push({
      name: "screenshots",
      path: `${base}/screenshots`,
      type: "dir",
      view: { kind: "gallery", title: `${p.name} screenshots`, images: shots },
      meta: {
        kind: "Folder",
        rows: [{ label: "Items", value: `${shots.length}` }],
      },
    });
  }

  return {
    name: p.id,
    path: base,
    type: "dir",
    icon: "project",
    view: { kind: "project", project: p },
    meta: projectMeta(p),
    children,
  };
}

function projectMeta(p: Project): Meta {
  const live = p.links.find((l) => l.label.toLowerCase() === "live");
  return {
    kind: `${p.stack[0]} project`,
    rows: [
      { label: "Year", value: p.year },
      { label: "Role", value: p.role },
      { label: "Stack", value: p.stack.join(" · ") },
      { label: "Status", value: live ? "Live" : "Source only" },
    ],
    readouts: p.metrics,
    links: p.links,
  };
}

function folder(
  name: string,
  path: string,
  children: FsNode[],
  kindNote?: string,
  icon?: FsNode["icon"],
): FsNode {
  return {
    name,
    path,
    type: "dir",
    icon,
    view: { kind: "folder" },
    meta: {
      kind: "Folder",
      rows: [
        { label: "Items", value: `${children.length}` },
        ...(kindNote ? [{ label: "Contains", value: kindNote }] : []),
      ],
    },
    children,
  };
}

function buildTree(): FsNode {
  const projectNodes = projects.map(projectNode);

  // Opens as an ordinary window like everything else; the desktop just
  // pre-opens it. A file rather than a folder so there is no empty expander.
  const knowMe: FsNode = {
    name: "know-me",
    path: "/know-me",
    type: "file",
    icon: "know-me",
    view: { kind: "about" },
    meta: {
      kind: "Profile",
      rows: [
        { label: "Name", value: profile.name },
        { label: "Title", value: profile.title },
        { label: "Location", value: profile.location },
        { label: "Status", value: "Open to SWE roles" },
        { label: "Timezone", value: profile.timezone },
      ],
      links: profile.socials,
    },
  };

  const skillsDir = folder(
    "skills",
    "/skills",
    skills.map((s) => {
      const name = `${s.group.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.txt`;
      return {
        name,
        path: `/skills/${name}`,
        type: "file" as const,
        view: { kind: "list" as const, title: s.group, items: s.items },
        meta: {
          kind: "Plain text",
          rows: [
            { label: "Group", value: s.group },
            { label: "Items", value: `${s.items.length}` },
          ],
        },
      };
    }),
    "Skill groups",
    "skills",
  );

  const experienceDir = folder(
    "experience",
    "/experience",
    [
      ...experience.map((e) => {
        const name = `${e.org.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.txt`;
        return {
          name,
          path: `/experience/${name}`,
          type: "file" as const,
          view: {
            kind: "prose" as const,
            title: `${e.role} at ${e.org}`,
            paragraphs: [e.summary],
          },
          meta: {
            kind: "Position",
            rows: [
              { label: "Org", value: e.org },
              { label: "Role", value: e.role },
              { label: "Period", value: e.period },
            ],
            links: [{ label: e.org, href: e.href }],
          },
        };
      }),
      {
        name: "awards.txt",
        path: "/experience/awards.txt",
        type: "file",
        view: { kind: "list", title: "Awards & Honors", items: awards },
        meta: {
          kind: "Plain text",
          rows: [{ label: "Items", value: `${awards.length}` }],
        },
      },
    ],
    "Positions & awards",
    "experience",
  );

  return folder(
    "~",
    "/",
    [
      knowMe,
      folder("projects", "/projects", projectNodes, "Case studies", "projects"),
      skillsDir,
      experienceDir,
      {
        name: "resume.pdf",
        path: "/resume.pdf",
        type: "file",
        icon: "resume",
        view: { kind: "pdf", label: "Résumé", href: profile.resumeUrl },
        meta: {
          kind: "PDF document",
          rows: [
            { label: "Name", value: profile.name },
            { label: "Title", value: profile.title },
          ],
          links: [{ label: "Download", href: profile.resumeUrl }],
        },
      },
      {
        name: "contact.txt",
        path: "/contact.txt",
        type: "file",
        icon: "contact",
        view: {
          kind: "contact",
          email: profile.email,
          socials: profile.socials,
        },
        meta: {
          kind: "Contact card",
          rows: [
            { label: "Email", value: profile.email },
            { label: "Location", value: profile.location },
            { label: "Timezone", value: profile.timezone },
          ],
          links: profile.socials,
        },
      },
    ],
    "Home",
  );
}

export const root: FsNode = buildTree();

export function findNode(path: string, from: FsNode = root): FsNode | null {
  if (from.path === path) return from;
  for (const c of from.children ?? []) {
    const hit = findNode(path, c);
    if (hit) return hit;
  }
  return null;
}

export function parentPath(path: string): string {
  const cut = path.lastIndexOf("/");
  return cut <= 0 ? "/" : path.slice(0, cut);
}

export function assertTreeIntegrity(node: FsNode = root) {
  const paths = new Set<string>();
  const seenProjects = new Set<string>();

  const walk = (n: FsNode) => {
    if (paths.has(n.path)) throw new Error(`filesystem: duplicate path ${n.path}`);
    paths.add(n.path);

    if (n.view.kind === "project") seenProjects.add(n.view.project.id);
    if (n.view.kind === "link" && !n.view.href) {
      throw new Error(`filesystem: empty href at ${n.path}`);
    }
    if (n.type === "file" && n.children?.length) {
      throw new Error(`filesystem: file with children at ${n.path}`);
    }
    n.children?.forEach(walk);
  };
  walk(node);

  for (const p of projects) {
    if (!seenProjects.has(p.id)) {
      throw new Error(`filesystem: project ${p.id} missing from tree`);
    }
  }
}

if (process.env.NODE_ENV === "development") assertTreeIntegrity();
