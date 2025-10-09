// app/(public)/work/[id]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBaseUrl } from "@/lib/getBaseUrl";
import type { Project } from "@/lib/types/project";
import ProjectViewer from "./ProjectViewer.client";

export const revalidate = 60;
export const dynamicParams = true;

async function safeGetBase(): Promise<string | null> {
  try {
    const base = await getBaseUrl();
    if (/^https?:\/\//i.test(base)) return base.replace(/\/+$/, "");
    return null;
  } catch {
    return null;
  }
}

async function getProject(id: string): Promise<Project | null> {
  const base = await safeGetBase();
  const url = base ? `${base}/api/public/work/${id}` : `/api/public/work/${id}`;

  try {
    const res = await fetch(url, { next: { revalidate } });
    if (res.status === 404) return null;
    if (!res.ok) return null;
    const data = (await res.json()) as { item: Project | null };
    return data?.item ?? null;
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  const base = await safeGetBase();
  const url = base ? `${base}/api/public/work?select=id` : `/api/public/work?select=id`;

  try {
    const res = await fetch(url, { next: { revalidate } });
    if (!res.ok) return [];
    const data = (await res.json()) as { items: Array<{ id: string }> };
    return (data.items ?? []).map(({ id }) => ({ id }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  // Your setup expects a Promise here:
  const { id } = await params;

  const [base, project] = await Promise.all([safeGetBase(), getProject(id)]);
  const metadataBase = base ? new URL(base) : undefined;

  if (!project) {
    return {
      ...(metadataBase ? { metadataBase } : {}),
      title: "Project not found",
      description: "This project could not be found.",
      alternates: { canonical: `/work/${id}` },
    };
  }

  const p = project;
  const titleBase = p?.general?.title ?? "Project";
  const year = p?.general?.year ? ` — ${p.general.year}` : "";
  const title = `${titleBase}${year}`;
  const description = p?.main?.brief ?? p?.main?.details?.tagline ?? "Project case study";

  const rawImage = p?.general?.heroUrl;
  const ogImage =
    rawImage && /^https?:\/\//i.test(rawImage)
      ? rawImage
      : rawImage && base
      ? `${base}${rawImage.startsWith("/") ? "" : "/"}${rawImage}`
      : undefined;

  return {
    ...(metadataBase ? { metadataBase } : {}),
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/work/${id}`,
      images: ogImage ? [{ url: ogImage }] : undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
    alternates: {
      canonical: `/work/${id}`,
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();
  return <ProjectViewer project={project} />;
}
