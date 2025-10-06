import SectionTitle from "@/components/SectionTitle";
import ScrollProgress from "@/components/ScrollProgress";
import { Container } from "@/components/public/layout/Container";
import { WorkGallery } from "@/components/public/work";
import type { ProjectDoc } from "@/lib/types/project";
import type { CollaborationDoc } from "@/lib/types/collaboration";


import { getBaseUrl } from '@/lib/getBaseUrl';

export const revalidate = 60;

async function getPublishedProjects(limit = 24) {
  const base = await getBaseUrl();
  const res = await fetch(`${base}/api/public/projects?limit=${limit}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return [];
  const data = (await res.json()) as { items: ProjectDoc[] };
  return data.items ?? [];
}

async function getApprovedCollaborations(limit = 6) {
  const base = await getBaseUrl();
  const res = await fetch(`${base}/api/public/collaborations?limit=${limit}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return [];
  const data = (await res.json()) as { items: CollaborationDoc[] };
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
