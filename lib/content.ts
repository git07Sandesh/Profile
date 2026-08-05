/**
 * Single source of truth for site content (from Phase 0 inventory).
 * Featured projects get the Phase 3 showstopper; the rest are the compact list.
 */

export const profile = {
  name: "Sandesh Bhattarai",
  title: "Full-stack Software Engineer",
  location: "Hattiesburg, MS",
  timezone: "America/Chicago",
  blurb:
    "Full-stack software engineer who ships end-to-end: production work across React, Next.js, Python, and Flutter, plus award-winning privacy-preserving ML research.",
  email: "sandesh1122bhattarai@gmail.com",
  resumeUrl: "/Sandesh_Bhattarai_Resume.pdf",
  socials: [
    { label: "GitHub", href: "https://github.com/git07Sandesh" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/sandeshbhattarai07" },
    { label: "Email", href: "mailto:sandesh1122bhattarai@gmail.com" },
  ],
};

export const about = {
  lead:
    "I build software end-to-end, from blank repo to production under deadline, and I like the parts most people avoid: the data layer, the edge cases, the performance budget.",
  body: [
    "I'm a CS Honors graduate of the University of Southern Mississippi (4.00 GPA, May 2026), currently a founding engineer at Suga and a team lead at Arroyodev shipping the Illumibot ecosystem to 10,000+ users.",
    "My research on robust, encrypted federated learning took 1st place at the USM Undergraduate Research Symposium. Whether it's a real-time inbox, a cross-platform Flutter app, or homomorphic encryption, I care about the same thing: software that works, owned end-to-end.",
  ],
};

/** Facts already stated in about/experience/awards, structured for the bio readout strip. */
export const highlights = [
  { value: "4.00", label: "GPA · CS Honors" },
  { value: "10,000+", label: "users shipped to" },
  { value: "1st", label: "USM Research Symposium" },
  { value: "2nd", label: "USM-VOXO Hackathon" },
];

export type Project = {
  id: string;
  index: string;
  name: string;
  tagline: string;
  role: string;
  year: string;
  stack: string[];
  problem: string;
  approach: string;
  outcome: string;
  metrics: { value: string; label: string }[];
  links: { label: string; href: string }[];
  featured: boolean;
};

export const projects: Project[] = [
  {
    id: "transworld",
    index: "01",
    name: "Transworld Floor Plan",
    tagline: "A static PDF, reborn as a live interactive exhibit map.",
    role: "Solo, blank repo to production under hard deadline (Arroyodev)",
    year: "2026",
    stack: ["Next.js", "TypeScript", "Firebase", "Vercel"],
    problem:
      "A major trade show's exhibit floor plan was a static PDF. Attendees couldn't navigate it, and it generated no sponsorship surface.",
    approach:
      "Built a live, searchable, interactive exhibit map from scratch (booth search, sponsor placements, responsive), replacing the PDF entirely.",
    outcome:
      "Launched with zero downtime under a hard deadline and turned a flat document into a revenue-generating, navigable experience.",
    metrics: [
      { value: "1M+", label: "network requests at launch" },
      { value: "500+", label: "positive customer reports" },
      { value: "~$30k", label: "new client revenue" },
    ],
    links: [{ label: "Live", href: "https://transworldfloorplan.com/" }],
    featured: true,
  },
  {
    id: "suga",
    index: "02",
    name: "Suga",
    tagline: "Record a support agent once. AI turns it into a running workflow.",
    role: "Founding Engineer",
    year: "2025",
    stack: ["Next.js", "Fastify", "Supabase", "Gemini", "Socket.IO", "Stripe"],
    problem:
      "Support automation traditionally needs a knowledge base, a rules engine, and developers: brittle and high-config.",
    approach:
      "Record an agent solving a ticket once → Gemini synthesizes an executable workflow → a human approves (versioned, with rollback) → it runs across 8 third-party integrations and 10 support channels. Chrome-extension capture, Next.js builder, Fastify + Supabase engine, realtime voice/chat/email.",
    outcome:
      "A zero-config workflow OS with human-in-the-loop approval that eliminates AI-hallucination risk.",
    metrics: [
      { value: "8 / 10", label: "integrations / channels" },
      { value: "2nd / 30+", label: "USM-VOXO Hackathon" },
      { value: "0-config", label: "no rules engine" },
    ],
    links: [{ label: "Live", href: "https://www.suga.cx/" }],
    featured: true,
  },
  {
    id: "clusterpath",
    index: "03",
    name: "ClusterPath",
    tagline: "Upload a résumé. Get an ML-clustered skills graph and a career roadmap.",
    role: "Solo, full-stack",
    year: "2025",
    stack: ["React", "FastAPI", "Supabase pgvector", "Gemini", "KeyBERT", "React Flow"],
    problem:
      "Career direction is opaque. Which skills to learn? Which roles actually fit your résumé?",
    approach:
      "Parse the résumé (PyMuPDF), embed sections (Gemini) and extract keywords (KeyBERT), match jobs via Supabase pgvector, cluster with k-means, then render an AI roadmap and an interactive skills/job graph.",
    outcome:
      "A full-stack AI product owned end-to-end; refactored to a utility-first design system that cut the bundle 60% and page load from 3.2s to 1.8s.",
    metrics: [
      { value: "−60%", label: "bundle size" },
      { value: "3.2s → 1.8s", label: "page load" },
      { value: "full-stack", label: "FE + FastAPI + ML" },
    ],
    links: [
      { label: "Live", href: "https://clusterpath.vercel.app/" },
      { label: "Code", href: "https://github.com/git07Sandesh/clusterpath-api" },
    ],
    featured: true,
  },
  // ---- compact list (no showstopper) ----
  {
    id: "msbon",
    index: "04",
    name: "MSBON Transcript Verification",
    tagline: "AI-assisted nursing-transcript fraud detection, a capstone for a real board.",
    role: "Engineering Lead (Team Nexus)",
    year: "2026",
    stack: ["FastAPI", "Gemini", "Tesseract", "Supabase", "React"],
    problem: "",
    approach: "",
    outcome: "",
    metrics: [],
    links: [
      { label: "Live", href: "https://msbon-verification.vercel.app/" },
      { label: "Code", href: "https://github.com/git07Sandesh/MSBON_Transcript_Verification" },
    ],
    featured: false,
  },
  {
    id: "fhe",
    index: "05",
    name: "Robust & Encrypted Federated Learning",
    tagline: "Byzantine-robust FL over CKKS homomorphically-encrypted model updates.",
    role: "Solo researcher, 1st place at the USM Symposium",
    year: "2025",
    stack: ["PyTorch", "Flower", "TenSEAL (CKKS)", "W&B"],
    problem: "",
    approach: "",
    outcome: "",
    metrics: [],
    links: [{ label: "Code", href: "https://github.com/git07Sandesh/FHE-RobustAgg_FL" }],
    featured: false,
  },
  {
    id: "tara",
    index: "06",
    name: "Tara's Restro",
    tagline: "MERN ordering site shipped for a real Kathmandu restaurant.",
    role: "Solo, full-stack",
    year: "2025",
    stack: ["React", "Node", "MongoDB", "Google OAuth"],
    problem: "",
    approach: "",
    outcome: "",
    metrics: [],
    links: [{ label: "Live", href: "https://tara-s-restro.vercel.app/" }],
    featured: false,
  },
];

export const skills = [
  { group: "Languages", items: ["TypeScript", "JavaScript", "Python", "SQL", "Dart", "C / C++", "C#"] },
  { group: "Frontend & Mobile", items: ["React", "Next.js", "Tailwind CSS", "TanStack Query", "Flutter", "Chrome Extensions"] },
  { group: "Backend", items: ["Node.js", "Express", "Fastify", "REST", "WebSocket / Socket.IO"] },
  { group: "Data & AI", items: ["PostgreSQL", "Redis", "Supabase", "Firebase", "PyTorch", "Flower (FL)", "CKKS HE", "Gemini API"] },
  { group: "Cloud & Tools", items: ["Docker", "Vercel", "GitHub Actions", "Stripe", "LiveKit / Twilio", "Sentry"] },
];

export const experience = [
  {
    role: "Software Development Associate & Team Lead",
    org: "Arroyodev LLC",
    href: "https://arroyodev.com/",
    period: "Since Aug 2025",
    summary:
      "Full-stack engineering for Illumibot.ai (10,000+ users) across a multi-repo microservices architecture. Joint co-lead on the core app; shipped the flagship Transworld Floor Plan solo.",
  },
  {
    role: "Founding Engineer",
    org: "Suga",
    href: "https://www.suga.cx/",
    period: "Since Oct 2025",
    summary:
      "Building a zero-config, AI-powered workflow OS for customer support: session-to-workflow synthesis with human-in-the-loop approval across 11 integrations. 2nd of 30+ at the USM-VOXO Hackathon.",
  },
];

export const awards = [
  "1st Place, USM Undergraduate Research Symposium (Cybersecurity, 1st of 50+)",
  "Full-Tuition & Housing Scholarship (~$60k)",
  "Honors Keystone Award ($2k)",
  "Eagle SPUR Research Grant ($1.5k)",
  "USM-VOXO Hackathon, 2nd Place ($2.5k)",
];
