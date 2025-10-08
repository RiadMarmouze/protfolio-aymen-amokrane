import type { Metadata } from "next"; // ✅ add
import { notFound } from "next/navigation";
import { getBaseUrl } from "@/lib/getBaseUrl";
import type { Project } from "@/lib/types/project";
import ProjectViewer from "./ProjectViewer.client";

export const revalidate = 60; // same cache policy as multi-project page
export const dynamicParams = true; // ✅ allow fallback for new ids

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

async function getRelatedProjects(id: string, limit = 6) {
  const base = await getBaseUrl();
  const res = await fetch(
    `${base}/api/public/work?relatedTo=${id}&limit=${limit}`,
    { next: { revalidate } }
  );
  if (!res.ok) return [] as Project[];
  const data = (await res.json()) as { items: Project[] };
  return data.items ?? [];
}

/** ✅ Prebuild known ids (SSG/ISR) while still allowing runtime fallback */
export async function generateStaticParams() {
  const base = await getBaseUrl();
  const res = await fetch(`${base}/api/public/work?select=id`, {
    next: { revalidate },
  });
  if (!res.ok) return [];
  const data = (await res.json()) as { items: Array<{ id: string }> };
  return (data.items ?? []).map(({ id }) => ({ id }));
}

/** ✅ Per-project SEO */
export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> } // 👈 Promise
): Promise<Metadata> {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    return { title: "Project not found" };
  }

  const p = project as unknown as Project;

  // Adjust these to your Project shape if different
  const titleBase = p?.general?.title ?? "Project";
  const year = p?.general?.year
    ? ` — ${p.general.year}`
    : "";
  const title = `${titleBase}${year}`;

  const description =
    p?.main?.brief ??
    p?.main?.details?.tagline ??
    "Project case study";

  const image =
    p?.general?.heroUrl
    //  ??
    // p?.cover ??
    // p?.gallery?.[0]?.url;

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

export default async function ProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params; // 👈 await it
  const [project, related] = await Promise.all([
    getProject(id),
    getRelatedProjects(id, 6),
  ]);
  console.log(id);
  if (!project) notFound();

  return <ProjectViewer project={project} related={related}/>;
}
