// import type { Metadata } from "next"; // ✅ add
// import { notFound } from "next/navigation";
// import { getBaseUrl } from "@/lib/getBaseUrl";
// import type { Project } from "@/lib/types/project";
import ProjectViewer from "./ProjectViewer.client";

// export const revalidate = 60; // same cache policy as multi-project page
// export const dynamicParams = true; // ✅ allow fallback for new ids

// async function getProject(id: string) {
//   const base = await getBaseUrl();
//   const res = await fetch(`${base}/api/public/work/${id}`, {
//     next: { revalidate },
//   });

//   if (res.status === 404) return null;
//   if (!res.ok) throw new Error("Failed to fetch project");

//   const data = (await res.json()) as { item: Project };
//   return data.item;
// }


// /** ✅ Prebuild known ids (SSG/ISR) while still allowing runtime fallback */
// export async function generateStaticParams() {
//   const base = await getBaseUrl();
//   const res = await fetch(`${base}/api/public/work?select=id`, {
//     next: { revalidate },
//   });
//   if (!res.ok) return [];
//   const data = (await res.json()) as { items: Array<{ id: string }> };
//   return (data.items ?? []).map(({ id }) => ({ id }));
// }

/** ✅ Per-project SEO */
// export async function generateMetadata(
//   { params }: { params: Promise<{ id: string }> } // 👈 Promise
// ): Promise<Metadata> {
//   const { id } = await params;
//   const project = await getProject(id);
//   if (!project) {
//     return { title: "Project not found" };
//   }

//   // Adjust these to your Project shape if different
//   const titleBase = (project as any)?.general?.title ?? "Project";
//   const year = (project as any)?.general?.year
//     ? ` — ${(project as any).general.year}`
//     : "";
//   const title = `${titleBase}${year}`;

//   const description =
//     (project as any)?.general?.brief ??
//     (project as any)?.general?.tagline ??
//     "Project case study";

//   const image =
//     (project as any)?.general?.cover ??
//     (project as any)?.cover ??
//     (project as any)?.gallery?.[0]?.url;

//   return {
//     title,
//     description,
//     openGraph: {
//       title,
//       description,
//       images: image ? [{ url: image }] : undefined,
//     },
//     twitter: {
//       card: "summary_large_image",
//       title,
//       description,
//       images: image ? [image] : undefined,
//     },
//   };
// }

export default async function ProjectPage() {
  // const { id } = await params;
  // const project = await getProject(id);

  // if (!project) notFound();
  return <ProjectViewer />;
}
