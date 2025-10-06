// lib/data/projects.ts
import type { ProjectDoc } from "@/lib/types/project";

export const projects: ProjectDoc[] = [
  {
    id: "weewee-1",
    title: "WeeWee – Branding Case Study",
    slug: "weewee-branding",
    year: 2023,
    industry: "Logistics / Delivery",
    tags: ["Branding", "Strategy", "Visual Identity"],
    tagline: "Playful, scalable identity for a next-gen delivery brand.",
    brief:
      "Repositioning WeeWee with a bold visual system: custom logotype, mascot, modular shapes, and clear usage rules applied across packaging, app, fleet, and social.",
    heroUrl: "/images/projects/weewee/hero.jpg",
    gallery: [
      {
        type: "image",
        url: "/images/projects/weewee/Artboard 1.jpg",
        alt: "",
      },
      {
        type: "image",
        url: "/images/projects/weewee/Artboard 2.jpg",
        alt: "",
      },
      {
        type: "image",
        url: "/images/projects/weewee/Artboard 3.jpg",
        alt: "",
      },
      {
        type: "image",
        url: "/images/projects/weewee/Artboard 4.jpg",
        alt: "",
      },
      {
        type: "image",
        url: "/images/projects/weewee/Artboard 5.jpg",
        alt: "",
      },
      {
        type: "image",
        url: "/images/projects/weewee/Artboard 6.jpg",
        alt: "",
      },
      {
        type: "image",
        url: "/images/projects/weewee/Artboard 7.jpg",
        alt: "",
      },
      {
        type: "image",
        url: "/images/projects/weewee/Artboard 8.jpg",
        alt: "",
      },
      {
        type: "image",
        url: "/images/projects/weewee/Artboard 9.jpg",
        alt: "",
      },
      {
        type: "image",
        url: "/images/projects/weewee/Artboard 10.jpg",
        alt: "",
      },
      {
        type: "image",
        url: "/images/projects/weewee/Artboard 11.jpg",
        alt: "",
      },
      {
        type: "image",
        url: "/images/projects/weewee/Brand Archtype.jpg",
        alt: "",
      },
      {
        type: "image",
        url: "/images/projects/weewee/Brand Attributes.jpg",
        alt: "",
      },
      {
        type: "image",
        url: "/images/projects/weewee/Brand Tone.jpg",
        alt: "",
      },
      {
        type: "image",
        url: "/images/projects/weewee/Brand Voice.jpg",
        alt: "",
      },
    ],
    published: true,
    createdAt: new Date(2023, 2, 22).getTime(),
    updatedAt: new Date(2023, 5, 1).getTime(),
    quotes: [
      "Make it simple, make it scale.",
      "Systems that look good and behave well.",
    ],
    details: {
      client: "WeeWee",
      sector: "Logistics / Delivery",
      discipline: ["Branding", "Strategy", "Visual Identity"],
      tagline: "Playful, scalable identity for a next-gen delivery brand.",
      summary:
        "End-to-end brand system: strategy, identity, mascot, typography, color, and guidelines—rolled out to packaging, vehicles, app UI, and social templates.",
      team: [
        { name: "Aymen", role: "Creative Direction" },
        { name: "Designer", role: "Identity & Systems" },
        { name: "Strategist", role: "Brand Strategy" },
      ],
      services: [
        "Brand Strategy",
        "Logo",
        "Mascot",
        "Guidelines",
        "Art Direction",
      ],
      deliverables: [
        "Brandbook",
        "Logo suite",
        "Color & type system",
        "Social kit",
      ],
      links: {
        behance:
          "https://www.behance.net/gallery/221756111/WeeWee-branding-case-study",
      },
    },
  },
  {
    id: "neurogrid-1",
    title: "NeuroGrid – Adaptive AI Identity",
    slug: "neurogrid-ai",
    year: 2026,
    industry: "AI / Cloud Infrastructure",
    tags: ["Branding", "Systems", "Digital"],
    tagline: "A living identity for an adaptive AI cloud platform.",
    brief:
      "NeuroGrid’s identity evolves with its machine-learning core. The visual system mirrors neural pathways, scaling across UIs, AR, and data centers.",
    heroUrl: "/images/projects/neurogrid/hero.jpg",
    gallery: [
      {
        type: "image",
        url: "/images/projects/neurogrid/01.jpg",
        alt: "NeuroGrid — logo",
      },
      {
        type: "image",
        url: "/images/projects/neurogrid/02.jpg",
        alt: "NeuroGrid — system",
      },
      {
        type: "image",
        url: "/images/projects/neurogrid/03.jpg",
        alt: "NeuroGrid — dashboard",
      },
    ],
    published: true,
    createdAt: new Date(2026, 4, 15).getTime(),
    updatedAt: new Date(2026, 6, 1).getTime(),
    quotes: [
      "Design that adapts as fast as AI.",
      "Identity systems that learn.",
    ],
    details: {
      client: "NeuroGrid",
      sector: "AI / Cloud",
      discipline: ["Branding", "Motion", "UI Systems"],
      tagline: "A living identity for an adaptive AI cloud platform.",
      summary:
        "Generative visual grammar that scales across AR, web, and autonomous systems with motion rules.",
      team: [
        { name: "Aymen", role: "Creative Direction" },
        { name: "Lina", role: "Generative Designer" },
        { name: "Kai", role: "Tech Strategist" },
      ],
    },
  },
  {
    id: "aetherfoods-1",
    title: "AetherFoods – Future of Nutrition",
    slug: "aetherfoods-branding",
    year: 2025,
    industry: "Biotech / Food",
    tags: ["Identity", "Packaging", "Sustainability"],
    tagline: "Clean, futuristic branding for lab-grown nutrition.",
    brief:
      "AetherFoods pioneers sustainable, lab-grown meals. Branding reflects purity, science, and care through molecular visuals.",
    heroUrl: "/images/projects/aetherfoods/hero.jpg",
    gallery: [
      {
        type: "image",
        url: "/images/projects/aetherfoods/01.jpg",
        alt: "AetherFoods — packaging",
      },
      {
        type: "image",
        url: "/images/projects/aetherfoods/02.jpg",
        alt: "AetherFoods — pattern",
      },
      {
        type: "image",
        url: "/images/projects/aetherfoods/03.jpg",
        alt: "AetherFoods — retail",
      },
    ],
    published: true,
    createdAt: new Date(2025, 7, 10).getTime(),
    updatedAt: new Date(2025, 8, 5).getTime(),
    quotes: ["Food that feeds the planet.", "Sustainability is identity."],
    details: {
      client: "AetherFoods",
      sector: "Biotech / Food",
      discipline: ["Identity", "Packaging", "Sustainability"],
      tagline: "Clean, futuristic branding for lab-grown nutrition.",
      summary:
        "Identity, packaging, brand guidelines, and launch assets with sustainability KPIs.",
      team: [
        { name: "Aymen", role: "Creative Direction" },
        { name: "Sofia", role: "Packaging Designer" },
        { name: "Milo", role: "Sustainability Consultant" },
      ],
    },
  },
];

/**
 * getAllProjectsStatic – use this in lists.
 * Pass the minimum total you want to show in a grid; placeholders will fill the rest.
 */

interface GetProjectsOptions {
  page?: number;
  perPage?: number;
}

export function getProjects({
  page = 1,
  perPage = 12,
}: GetProjectsOptions = {}): ProjectDoc[] {
  const start = (page - 1) * perPage;
  const end = start + perPage;
  return projects.slice(start, end);
}


export function getProjectById(id: string): ProjectDoc | undefined {
  return projects.find((p) => p.id === id);
}
