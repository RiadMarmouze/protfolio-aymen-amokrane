// data/projects.ts
// central source for all project-related static data

export type PriorityKey = "cafe" | "esports" | "fintech" | "event" | "logistics";

export interface Requirement {
  timeline: string;
  budget: string;
  country: string;
  scope: string;
  // NEW: defaults to mirror job-offer payload keys
  industryDefault: string;
  projectTypeDefault: string;
}

export const PRIORITY: { key: PriorityKey; label: string }[] = [
  { key: "cafe", label: "Cafe" },
  { key: "esports", label: "E-Sports Team" },
  { key: "fintech", label: "Fintech" },
  { key: "event", label: "Event" },
  { key: "logistics", label: "Logistics" },
];

// easily editable requirement info
export const REQUIREMENTS: Record<PriorityKey, Requirement> = {
  cafe: {
    timeline: "6-8 weeks",
    budget: "Starting from $12k",
    country: "UAE or KSA preferred (open globally)",
    scope: "Full brand identity + menu system + signage guidance",
    industryDefault: "F&B / Cafe",
    projectTypeDefault: "Branding",
  },
  esports: {
    timeline: "8-10 weeks",
    budget: "Starting from $18k",
    country: "GCC / MENA",
    scope: "Naming support, brand system, jersey kit, stream overlays",
    industryDefault: "E-Sports",
    projectTypeDefault: "Brand & Kits",
  },
  fintech: {
    timeline: "10-12 weeks",
    budget: "Starting from $25k",
    country: "Any (compliance-ready)",
    scope: "Strategy, visual identity, design system, product UI direction",
    industryDefault: "Fintech",
    projectTypeDefault: "Brand + Design System",
  },
  event: {
    timeline: "4-6 weeks",
    budget: "Starting from $8k",
    country: "UAE",
    scope: "Event identity, stage screen kit, motion templates",
    industryDefault: "Events",
    projectTypeDefault: "Event Identity",
  },
  logistics: {
    timeline: "6-8 weeks",
    budget: "Starting from $14k",
    country: "GCC / North Africa",
    scope: "Brand identity, fleet livery, signage and wayfinding starter",
    industryDefault: "Logistics",
    projectTypeDefault: "Brand + Livery",
  },
};
// keywords that appear under each tab
export const KEYWORDS: Record<PriorityKey, string[]> = {
  cafe: ["Identity", "Menu", "Signage"],
  esports: ["Naming", "Brand", "Jerseys"],
  fintech: ["Strategy", "Identity", "Design System"],
  event: ["Event ID", "Screens", "Motion"],
  logistics: ["Livery", "Wayfinding", "Guidelines"],
};
