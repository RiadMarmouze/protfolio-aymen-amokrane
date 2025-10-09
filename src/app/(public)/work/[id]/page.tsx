import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBaseUrl } from "@/lib/getBaseUrl";
import type { Project } from "@/lib/types/project";
import ProjectViewer from "./ProjectViewer.client";

export const revalidate = 60;
export const dynamicParams = true;

async function getProject(id: string) {
  const base = await getBaseUrl();
  const res = await fetch(`${base}/api/public/work/${id}`, {
    next: { revalidate },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch project");
  const data = (await res.json()) as { item: Project };
  return data.item;
}

export async function generateStaticParams() {
  const base = await getBaseUrl();
  const res = await fetch(`${base}/api/public/work?select=id`, {
    next: { revalidate },
  });
  if (!res.ok) return [];
  const data = (await res.json()) as { items: Array<{ id: string }> };
  return (data.items ?? []).map(({ id }) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  // Resolve params + base in parallel
  const [{ id }, base] = await Promise.all([params, getBaseUrl()]);
  const origin = base.replace(/\/+$/, "");
  const metadataBase = new URL(origin);

  const project = await getProject(id);
  if (!project) {
    return {
      metadataBase,
      title: "Project not found",
    };
  }

  const p = project as Project;
  const titleBase = p?.general?.title ?? "Project";
  const year = p?.general?.year ? ` — ${p.general.year}` : "";
  const title = `${titleBase}${year}`;
  const description =
    p?.main?.brief ?? p?.main?.details?.tagline ?? "Project case study";

  // Make hero URL absolute if needed
  const rawImage = p?.general?.heroUrl;
  const ogImage =
    rawImage && /^https?:\/\//i.test(rawImage)
      ? rawImage
      : rawImage
      ? `${origin}${rawImage.startsWith("/") ? "" : "/"}${rawImage}`
      : undefined;

  return {
    metadataBase,
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
