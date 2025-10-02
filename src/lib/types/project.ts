import { MediaItem } from "./common";

export type ProjectTeamMember = {
  name: string;
  role: string;
};

export type ProjectLinks = {
  behance?: string;
  caseStudy?: string;
  liveSite?: string;
  repo?: string;
};

export type ProjectDetails = {
  client: string;
  sector: string;
  discipline: string[];
  tagline?: string;
  summary: string;
  team?: ProjectTeamMember[];
  services?: string[];
  deliverables?: string[];
  timeline?: { start: string; end?: string } | string;
  location?: string;
  links?: ProjectLinks;
};

export type ProjectDoc = {
  id: string;
  title: string;
  slug: string;
  year: number;
  tags: string[];
  industry: string;
  tagline: string;
  brief: string;
  heroUrl: string;
  gallery: MediaItem[];
  published: boolean;
  createdAt: number;
  updatedAt: number;

  quotes?: string[];
  details?: ProjectDetails;
};

