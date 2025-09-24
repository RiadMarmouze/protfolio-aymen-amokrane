// lib/data.ts
import type { ProjectDoc, MediaItem } from "@/lib/types";

export const SECTIONS = ["home", "about", "work", "blog"] as const;

export const ROTATE_WORDS = [
  "THINKING",
  "BRANDING",
  "STRATEGY",
  "SYSTEMS",
  "LOGOS",
  "STUFF",
] as const;

export function getProjects(): ProjectDoc[] {
  const baseQuotes = [
    "Make it simple, make it scale.",
    "Systems that look good and behave well.",
  ];

  return Array.from({ length: 12 }, (_, i) => {
    const id = String(i + 1);
    const title = `Project ${i + 1}`;
    const slug = `project-${i + 1}`;
    const year = 2020 + ((i + 3) % 6);

    const industry = i % 2 === 0 ? "Tech" : "F&B";
    const tags = [
      i % 2 === 0 ? "Branding" : "Illustration",
      i % 3 === 0 ? "Strategy" : "Logos",
    ];

    const tagline =
      i % 2 === 0
        ? "Brand system for a next-gen tech product"
        : "Visual identity for a growing F&B label";

    // Merge the old `quotes` content into the brief so we don't lose it.
    const briefLines = [
      `A modular identity and design system for a ${industry} client covering ${tags.join(
        " / "
      )}.`,
      ...baseQuotes.map((q) => `“${q}”`),
    ];
    const brief = briefLines.join(" ");

    const createdAt = new Date(year, 0, 15).getTime(); // Jan 15 of project year
    const updatedAt = createdAt + (i + 1) * 7 * 24 * 60 * 60 * 1000; // staggered updates

    const heroUrl = `/images/projects/${slug}/hero.jpg`;

    const gallery: MediaItem[] = [
      {
        type: "image",
        url: `/images/projects/${slug}/01.jpg`,
        alt: `${title} — 01`,
      },
      {
        type: "image",
        url: `/images/projects/${slug}/02.jpg`,
        alt: `${title} — 02`,
      },
      {
        type: "image",
        url: `/images/projects/${slug}/03.jpg`,
        alt: `${title} — 03`,
      },
    ];

    const project: ProjectDoc = {
      id,
      title,
      slug,
      year,
      tags,
      industry,
      tagline,
      brief,
      heroUrl,
      gallery,
      published: true,
      createdAt,
      updatedAt,
    };

    return project;
  });
}
