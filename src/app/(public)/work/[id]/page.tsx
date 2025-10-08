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

/** Next 15+ promised params */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params; // ✅ await the promise
  const project = await getProject(id);
  if (!project) return { title: "Project not found" };

  const p = project as Project;
  const titleBase = p?.general?.title ?? "Project";
  const year = p?.general?.year ? ` — ${p.general.year}` : "";
  const title = `${titleBase}${year}`;
  const description =
    p?.main?.brief ?? p?.main?.details?.tagline ?? "Project case study";
  const image = p?.general?.heroUrl;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProjectPage(
  { params }: { params: Promise<{ id: string }> } // ✅ promised params
) {
  const { id } = await params; // ✅ await it
  const project = await getProject(id);
  if (!project) notFound();
  return <ProjectViewer project={project} />;
}
