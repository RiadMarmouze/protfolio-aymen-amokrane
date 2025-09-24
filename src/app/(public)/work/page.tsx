"use client";
import SectionTitle from "@/components/SectionTitle";
import Footer from "@/components/Footer";
import ProjectThumb from "@/components/ProjectThumb";
import FilterPill from "@/components/FilterPill";
import ScrollProgress from "@/components/ScrollProgress";
import { useMemo, useState, useEffect } from "react";
import { getProjects } from "@/lib/data";
import { fetchApprovedCollaborations } from "@/lib/content";
import type { ProjectDoc, CollaborationDoc } from "@/lib/types";

export default function WorkPage() {
  // If getProjects is already typed to return ProjectDoc[], this annotation is redundant—but it’s safe.
  const allProjects: ProjectDoc[] = useMemo(() => getProjects(), []);
  const years = useMemo(
    () =>
      Array.from(new Set(allProjects.map((p) => p.year))).sort((a, b) => b - a),
    [allProjects]
  );
  const cats = useMemo(
    () => Array.from(new Set(allProjects.flatMap((p) => p.tags))),
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

  const latest = allProjects[0];

  const [collabs, setCollabs] = useState<CollaborationDoc[]>([]);
  useEffect(() => {
    fetchApprovedCollaborations(6).then((res: CollaborationDoc[]) =>
      setCollabs(res)
    );
  }, []);

  // Type guard for filtering out undefined items during row construction
  const isProject = (x: ProjectDoc | undefined): x is ProjectDoc => Boolean(x);

  return (
    <main>
      <ScrollProgress />

      <section className="max-w-6xl mx-auto px-4 pt-8 pb-10">
        <SectionTitle>Latest project</SectionTitle>
        {latest && <ProjectThumb p={latest} ratio="2x1" />}
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-6">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="uppercase tracking-[0.2em] text-[12px]">Year</span>
          <div className="flex flex-wrap gap-2">
            <FilterPill
              active={filterYear === "All"}
              onClick={() => setFilterYear("All")}
            >
              All
            </FilterPill>
            {years.map((y) => (
              <FilterPill
                key={y}
                active={filterYear === String(y)}
                onClick={() => setFilterYear(String(y))}
              >
                {y}
              </FilterPill>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm mt-3">
          <span className="uppercase tracking-[0.2em] text-[12px]">
            Category
          </span>
          <div className="flex flex-wrap gap-2">
            <FilterPill
              active={filterCat === "All"}
              onClick={() => setFilterCat("All")}
            >
              All
            </FilterPill>
            {cats.map((c) => (
              <FilterPill
                key={c}
                active={filterCat === c}
                onClick={() => setFilterCat(c)}
              >
                {c}
              </FilterPill>
            ))}
          </div>
          <div className="ml-auto text-xs opacity-70">
            {filtered.length} results
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-16">
        {(() => {
          const rows: { type: "A" | "B" | "C"; items: ProjectDoc[] }[] = [];
          let i = 0;
          let t = 0;
          const types: Array<"A" | "B" | "C"> = ["A", "B", "C"];

          while (i < filtered.length) {
            const type = types[t % types.length];
            if (type === "A") {
              rows.push({ type, items: [filtered[i]] });
              i += 1;
            } else {
              // Both "B" and "C" take two items with a layout difference; filter out undefined safely
              rows.push({
                type,
                items: [filtered[i], filtered[i + 1]].filter(isProject),
              });
              i += 2;
            }
            t++;
          }

          return rows.map((row, idx) => (
            <div key={idx} className="mb-6">
              {row.type === "A" && (
                <div className="grid gap-6">
                  <ProjectThumb p={row.items[0]} ratio="3x1" />
                </div>
              )}

              {row.type === "B" && (
                <div className="grid md:grid-cols-2 gap-6">
                  {row.items.map((p) => (
                    <ProjectThumb key={p.id ?? p.slug} p={p} ratio="1x1" />
                  ))}
                </div>
              )}

              {row.type === "C" && (
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <ProjectThumb p={row.items[0]} ratio="2x1" />
                  </div>
                  {row.items[1] && (
                    <ProjectThumb
                      key={row.items[1].id ?? row.items[1].slug}
                      p={row.items[1]}
                      ratio="1x1"
                    />
                  )}
                </div>
              )}
            </div>
          ));
        })()}
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-16">
        {collabs.length > 0 && (
          <div className="mb-10">
            <div className="text-xl font-semibold mb-3">
              Collaboration Proposals
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {collabs.map((c) => (
                <div
                  key={c.id ?? c.contact.email}
                  className="border rounded-xl p-3"
                >
                  <div className="font-medium">{c.projectTitle}</div>
                  <p className="text-sm opacity-80">{c.summary}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
