import SectionTitle from "@/components/SectionTitle";
import ScrollProgress from "@/components/ScrollProgress";
import { Container } from "@/components/public/layout/Container";
import { WorkGallery } from "@/components/public/work";
import type { ProjectDoc } from "@/lib/types/project";
import type { CollaborationDoc } from "@/lib/types/collaboration";

export const revalidate = 60;

function getBaseUrl() {
  if (typeof window !== "undefined") return "";
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}


async function getPublishedProjects(limit = 24): Promise<ProjectDoc[]> {
  const res = await fetch(`${getBaseUrl()}/api/public/projects?limit=${limit}`, {
    next: { revalidate },
  });
  if (!res.ok) {
    console.error("Projects fetch failed:", res.statusText);
    return [];
  }
  const data = (await res.json()) as { items: ProjectDoc[] };
  console.log("✅ Projects:", data.items);
  return data.items ?? [];
}

async function getApprovedCollaborations(limit = 6): Promise<CollaborationDoc[]> {
  const res = await fetch(`${getBaseUrl()}/api/public/collaborations?limit=${limit}`, {
    next: { revalidate },
  });
  if (!res.ok) {
    console.error("Collaborations fetch failed:", res.statusText);
    return [];
  }
  const data = (await res.json()) as { items: CollaborationDoc[] };
  console.log("✅ Collaborations:", data.items);
  return data.items ?? [];
}

export default async function WorkPage() {
  const [allProjects, collabs] = await Promise.all([
    getPublishedProjects(24),
    getApprovedCollaborations(6),
  ]);

  const latest = allProjects[0];

  return (
    <main>
      <ScrollProgress />
      <section>
        <Container className="pt-8 pb-10">
          <SectionTitle>Latest project</SectionTitle>
        </Container>
      </section>
      <WorkGallery allProjects={allProjects} collabs={collabs} latest={latest} />
    </main>
  );
}
