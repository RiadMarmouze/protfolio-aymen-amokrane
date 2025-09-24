export type MediaItem = { type: "image" | "video"; url: string; alt?: string };
export type ProjectDoc = {
  id?: string;
  title: string;
  slug: string;
  year: number;
  tags: string[];
  industry: string;
  tagline: string;
  brief: string;
  heroUrl?: string;
  gallery?: MediaItem[];
  quotes?: string[];
  published: boolean;
  createdAt?: number;
  updatedAt?: number;
};
export type ArticleDoc = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  coverUrl?: string;
  media?: MediaItem[];
  published: boolean;
  createdAt?: number;
  updatedAt?: number;
};
export type OfferDoc = {
  id?: string;
  type: "work" | "collaboration";
  name: string;
  email: string;
  message: string;
  projectId?: string;
  createdAt?: number;
  status: "new" | "responded" | "archived";
  responseHistory?: Array<{
    at: number;
    to: string;
    subject: string;
    body: string;
  }>;
};
export type CollaborationDoc = {
  id?: string;
  projectTitle: string;
  summary: string;
  contact: { name: string; email: string };
  status: "pending" | "approved" | "rejected";
  published: boolean;
  createdAt?: number;
  updatedAt?: number;
};
