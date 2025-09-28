// lib/project-factory.ts
import type { MediaItem, ProjectDetails, ProjectDoc } from "@/lib/types";

/** deterministic pseudo-random helpers (no external deps) */
const LCG =
  (seed = 1) =>
  () =>
    (seed = (seed * 48271) % 0x7fffffff) / 0x7fffffff;
const pick = <T>(arr: T[], rnd: () => number) =>
  arr[Math.floor(rnd() * arr.length)];
const pad = (n: number, w = 3) => String(n).padStart(w, "0");

/** vocab pools for placeholders */
const INDUSTRIES = [
  "AI / Cloud",
  "Biotech / Food",
  "Fintech",
  "Mobility",
  "Green Energy",
  "Space Tech",
  "Smart Cities",
  "Healthtech",
  "EdTech",
  "Robotics",
];
const TAGS_A = ["Branding", "Identity", "Systems", "Strategy"];
const TAGS_B = ["Motion", "Packaging", "Illustration", "Digital", "Guidelines"];
const QUOTES = [
  "Make it simple, make it scale.",
  "Systems that look good and behave well.",
  "Clarity over novelty.",
  "Design once, scale everywhere.",
];

const TAGLINES = [
  "A modular identity for a next-gen platform.",
  "Playful, scalable system across touchpoints.",
  "Human, fast, and unmistakably bold.",
  "Future-proof identity for an adaptive product.",
];

const TITLE_PREFIX = [
  "Nova",
  "Aether",
  "Neuro",
  "Flux",
  "Orion",
  "Pulse",
  "Helix",
  "Vertex",
  "Lumen",
  "Atlas",
];

const TITLE_SUFFIX = [
  "OS",
  "Labs",
  "Grid",
  "One",
  "Works",
  "Core",
  "X",
  "Sync",
  "Flow",
  "Hub",
];

/** Media stubs (use your own asset pipeline/paths) */
const galleryFor = (slug: string): MediaItem[] => [
  {
    type: "image",
    url: `/images/projects/${slug}/01.jpg`,
    alt: `${slug} — 01`,
  },
  {
    type: "image",
    url: `/images/projects/${slug}/02.jpg`,
    alt: `${slug} — 02`,
  },
  {
    type: "image",
    url: `/images/projects/${slug}/03.jpg`,
    alt: `${slug} — 03`,
  },
];

/** Build static details for any project shape (safe defaults) */
export function buildStaticDetailsDummy(p: {
  title: string;
  industry?: string;
  tags?: string[];
  tagline?: string;
  brief?: string;
  sectorOverride?: string;
  teamNames?: Array<{ name: string; role: string }>;
  links?: ProjectDetails["links"];
}): ProjectDetails {
  return {
    client: p.title.replace(/ –.*$/, ""), // strip suffix if present
    sector: p.sectorOverride ?? p.industry ?? "Tech",
    discipline: p.tags?.length ? p.tags : ["Branding", "Systems"],
    tagline: p.tagline ?? "A modular identity for a next-gen platform.",
    summary:
      p.brief ??
      "End-to-end system: strategy, identity, typography, color, motion, and guidelines across product, marketing, and ops.",
    team: p.teamNames ?? [
      { name: "Aymen", role: "Creative Direction" },
      { name: "Designer", role: "Identity & Systems" },
      { name: "Strategist", role: "Brand Strategy" },
    ],
    services: ["Brand Strategy", "Logo", "Guidelines", "Art Direction"],
    deliverables: [
      "Logo suite",
      "Color & type system",
      "Social kit",
      "Brandbook",
    ],
    links: p.links,
  };
}

/** Generate a single placeholder project (deterministic by index+seed) */
export function generateDummyProject(index: number, seed = 7): ProjectDoc {
  const rnd = LCG(index * 1000 + seed);
  const year = 2022 + Math.floor(rnd() * 5); // 2022–2026
  const title = `${pick(TITLE_PREFIX, rnd)}${rnd() > 0.5 ? "-" : " "}${pick(
    TITLE_SUFFIX,
    rnd
  )}`;
  const slug = title.toLowerCase().replace(/\s+/g, "-");
  const industry = pick(INDUSTRIES, rnd);
  const tags = [pick(TAGS_A, rnd), pick(TAGS_B, rnd)];
  const tagline = pick(TAGLINES, rnd);
  const brief =
    `A ${industry} identity built around a scalable, rules-driven system covering ${tags.join(
      " / "
    )}. ` + `Designed for multi-platform consistency with motion extensions.`;

  const createdAt = new Date(year, 0, 15).getTime();
  const updatedAt = createdAt + (index + 1) * 10 * 24 * 60 * 60 * 1000;

  return {
    id: `dummy-${pad(index + 1)}`,
    title,
    slug,
    year,
    industry,
    tags,
    tagline,
    brief,
    heroUrl: `/images/projects/${slug}/hero.jpg`,
    gallery: galleryFor(slug),
    published: true,
    createdAt,
    updatedAt,
    quotes: [pick(QUOTES, rnd), pick(QUOTES, rnd)],
    details: buildStaticDetailsDummy({
      title,
      industry,
      tags,
      tagline,
      brief,
    }),
  };
}

/** Generate N placeholder projects */
export function generateDummyProjects(count: number, seed = 7): ProjectDoc[] {
  return Array.from({ length: count }, (_, i) => generateDummyProject(i, seed));
}

/**
 * Merge real projects with placeholders until reaching `minTotal`.
 * Keeps order: real first, then placeholders.
 */
export function fillWithPlaceholders(
  real: ProjectDoc[],
  minTotal: number,
  seed = 7
): ProjectDoc[] {
  const need = Math.max(0, minTotal - real.length);
  if (need === 0) return real;
  const dummies = generateDummyProjects(need, seed);
  return [...real, ...dummies];
}

/** In case you only need the details stub for an existing project */
export function getStaticDetailsDummy(project: ProjectDoc): ProjectDetails {
  return buildStaticDetailsDummy({
    title: project.title,
    industry: project.industry,
    tags: project.tags,
    tagline: project.tagline,
    brief: project.brief,
    links: project.details?.links,
    teamNames: project.details?.team,
  });
}
