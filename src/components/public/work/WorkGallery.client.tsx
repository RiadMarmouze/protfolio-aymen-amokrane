"use client";
import { useMemo, useState, memo } from "react";
import ProjectThumb from "@/components/ProjectThumb";
import { WorkFilterBar } from "./WorkFilterBar";
import { ResultsBadge } from "./ResultsBadge";
import { ProjectsGrid } from "./ProjectsGrid";
import { Container } from "@/components/public/layout/Container";
import type { ProjectDoc } from "@/lib/types/project";
import type { CollaborationDoc } from "@/lib/types/collaboration";
import { unique, sortDesc } from "@/lib/utils/array";

export type WorkGalleryProps = Readonly<{
  allProjects: ProjectDoc[];
  collabs: CollaborationDoc[];
  latest?: ProjectDoc;
}>;

export const WorkGallery = memo(function WorkGallery({
  allProjects,
  collabs,
  latest,
}: WorkGalleryProps) {
  const years = useMemo(
    () => sortDesc(unique(allProjects.map((p) => p.year))),
    [allProjects]
  );
  const cats = useMemo(
    () => unique(allProjects.flatMap((p) => p.tags)),
    [allProjects]
  );

  const [filterYear, setFilterYear] = useState<string>("All");
  const [filterCat, setFilterCat] = useState<string>("All");

  const filtered = useMemo(
    () =>
      allProjects.filter(
        (p) =>
          (filterYear === "All" || p.year === Number(filterYear)) &&
          (filterCat === "All" || p.tags.includes(filterCat))
      ),
    [allProjects, filterYear, filterCat]
  );

  return (
    <>
      <section>
        <Container className="pb-6">
          <WorkFilterBar
            years={years}
            cats={cats}
            filterYear={filterYear}
            filterCat={filterCat}
            onYearChange={setFilterYear}
            onCatChange={setFilterCat}
          >
            <ResultsBadge count={filtered.length} />
          </WorkFilterBar>
        </Container>
      </section>

      <section>
        <Container className="pb-16">
          {latest && (
            <div className="mb-6">
              <ProjectThumb p={latest} ratio="2x1" />
            </div>
          )}
          <ProjectsGrid projects={filtered} />
        </Container>
      </section>

      {collabs.length > 0 && (
        <section>
          <Container className="pb-16">
            <div className="mb-10">
              <h2 className="text-xl font-semibold mb-3">
                Collaboration Proposals
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {collabs.map((c) => (
                  <article
                    key={c.id ?? c.contact.email}
                    className="border rounded-xl p-3"
                  >
                    <h3 className="font-medium">{c.projectTitle}</h3>
                    <p className="text-sm opacity-80">{c.summary}</p>
                  </article>
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}
    </>
  );
});
