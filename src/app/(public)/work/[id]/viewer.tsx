"use client";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import Placeholder from "@/components/public/common/Placeholder";
import { Btn } from "@/components/public/common/ui";

import type { MediaItem } from "@/lib/types/common";
import { getProjectById, getProjects } from "@/lib/data/projects";
import Image from "next/image";

export default function ProjectViewer({ id }: { id: string }) {
  // Keep all projects in memory (for fallback/related, etc.)
  const allProjects = useMemo(() => getProjects(), []);
  const project = useMemo(
    () => getProjectById(id) ?? allProjects[0],
    [id, allProjects]
  );

  const [aboutOpen, setAboutOpen] = useState(false);

  // Prefer structured details with fallbacks
  const details = project.details ?? {
    client: project.title,
    sector: project.industry,
    discipline: project.tags,
    tagline: project.tagline,
    summary: project.brief,
    team: [
      { name: "Aymen", role: "Creative Direction" },
      { name: "Designer", role: "Identity & Systems" },
      { name: "Strategist", role: "Brand Strategy" },
    ],
    services: ["Brand Strategy", "Logo", "Guidelines", "Art Direction"],
    deliverables: [
      "Logo suite",
      "Color & type system",
      "Social kit",
      "Brandbook",
    ],
  };

  // Helper to render a gallery item (image/video)
  const RenderMedia = ({ item, i }: { item: MediaItem; i: number }) => {
    const heightClass =
      i % 3 === 0 ? "h-[80vh]" : i % 3 === 1 ? "h-[90vh]" : "h-[70vh]";

    if (item.type === "image") {
      return (
        <div className={`${heightClass} relative rounded-[2px] overflow-hidden`}>
          {/* <Image
            src={item.url}
            alt={item.alt ?? project.title}
            className="w-full h-full object-cover"
            loading={i <= 2 ? "eager" : "lazy"}
          /> */}

          <Image
            src={item.url}
            alt={item.alt ?? project.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="w-full h-full object-contain"
            loading={i <= 2 ? "eager" : "lazy"}
          />
        </div>
      );
    }
    // Fallback for videos if you ever add them
    return (
      <div className={`${heightClass} rounded-[2px] overflow-hidden`}>
        <video src={item.url} className="w-full h-full object-cover" controls />
      </div>
    );
  };

  // Build vertical flow: ALL gallery images, with optional quotes sprinkled in
  const q0 = project.quotes?.[0] ?? "Make it simple, make it scale.";
  const q1 = project.quotes?.[1] ?? "Systems that look good and behave well.";
  const gallery = project.gallery ?? [];

  const verticalFlow: Array<
    | { kind: "image"; item: MediaItem; i: number }
    | { kind: "text"; text: string }
  > = [];

  gallery.forEach((item, i) => {
    // insert a quote before/after some images for rhythm
    if (i === 0) verticalFlow.push({ kind: "text", text: q0 });
    verticalFlow.push({ kind: "image", item, i });
    if (i === 1) verticalFlow.push({ kind: "text", text: q1 });
  });

  // If no gallery, show placeholders so the layout doesn't break
  const hasGallery = gallery.length > 0;

  return (
    <main className="min-h-screen">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 pt-20 pb-8 flex items-center justify-between">
        <Link href="/work">
          <Btn className="px-3 py-1.5 text-sm">
            <ArrowLeft size={16} /> Back to work
          </Btn>
        </Link>
        <div className="text-xl md:text-3xl font-semibold tracking-tight">
          {project.title} <span className="opacity-60">- {project.year}</span>
        </div>
        <Btn
          onClick={() => setAboutOpen((v) => !v)}
          className="px-3 py-1.5 text-sm"
        >
          Project Notes
        </Btn>
      </div>

      {/* Content + Notes */}
      <div className="relative">
        <div className="flex gap-0">
          <motion.div
            initial={false}
            animate={{
              width: aboutOpen ? "50%" : "100%",
              scale: aboutOpen ? 0.94 : 1,
            }}
            transition={{ type: "spring", stiffness: 180, damping: 22 }}
            className="origin-right"
          >
            <div className="max-w-6xl mx-auto px-4">
              <div className="grid gap-8">
                {/* Stack ALL gallery images vertically (with optional quotes) */}
                {hasGallery ? (
                  verticalFlow.map((node, idx) =>
                    node.kind === "image" ? (
                      <RenderMedia
                        key={`img-${idx}`}
                        item={node.item}
                        i={node.i}
                      />
                    ) : (
                      <div key={`txt-${idx}`} className="py-12">
                        <div className="text-2xl md:text-4xl font-semibold leading-[1] tracking-tight">
                          {node.text}
                        </div>
                      </div>
                    )
                  )
                ) : (
                  // Placeholder if no images present
                  <>
                    <div className="h-[80vh] rounded-[2px] overflow-hidden">
                      <Placeholder className="w-full h-full" />
                    </div>
                    <div className="py-12">
                      <div className="text-2xl md:text-4xl font-semibold leading-[1] tracking-tight">
                        {q0}
                      </div>
                    </div>
                    <div className="h-[90vh] rounded-[2px] overflow-hidden">
                      <Placeholder className="w-full h-full" />
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>

          {/* Notes / Details */}
          <AnimatePresence>
            {aboutOpen && (
              <motion.aside
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "50%", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{
                  type: "tween",
                  duration: 0.45,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="border-l-2 border-black bg-white overflow-y-auto"
              >
                <div className="px-5 py-4 sticky top-[var(--nav-h,64px)] bg-white border-b-2 border-black flex items-center justify-between z-10">
                  <div className="font-medium">Project Notes</div>
                  <button
                    className="rounded-full border-2 p-1 hover:bg-black hover:text-white"
                    onClick={() => setAboutOpen(false)}
                    aria-label="Close notes"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="px-5 py-5 text-sm grid gap-5">
                  {/* Client */}
                  <div>
                    <div className="uppercase tracking-wider text-[10px] opacity-70">
                      Client
                    </div>
                    <div>{details.client}</div>
                  </div>

                  {/* Sector */}
                  <div>
                    <div className="uppercase tracking-wider text-[10px] opacity-70">
                      Sector
                    </div>
                    <div>{details.sector ?? project.industry}</div>
                  </div>

                  {/* Discipline */}
                  <div>
                    <div className="uppercase tracking-wider text-[10px] opacity-70">
                      Discipline
                    </div>
                    <div>
                      {(details.discipline ?? project.tags).join(" / ")}
                    </div>
                  </div>

                  {/* Tagline */}
                  <div>
                    <div className="uppercase tracking-wider text-[10px] opacity-70">
                      Tagline
                    </div>
                    <div>{details.tagline ?? project.tagline}</div>
                  </div>

                  {/* Summary */}
                  <div>
                    <div className="uppercase tracking-wider text-[10px] opacity-70">
                      Summary
                    </div>
                    <p>{details.summary ?? project.brief}</p>
                  </div>

                  {/* Services */}
                  {details.services?.length ? (
                    <div>
                      <div className="uppercase tracking-wider text-[10px] opacity-70">
                        Services
                      </div>
                      <ul className="list-disc pl-5 space-y-1">
                        {details.services.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {/* Deliverables */}
                  {details.deliverables?.length ? (
                    <div>
                      <div className="uppercase tracking-wider text-[10px] opacity-70">
                        Deliverables
                      </div>
                      <ul className="list-disc pl-5 space-y-1">
                        {details.deliverables.map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {/* Team */}
                  {details.team?.length ? (
                    <div>
                      <div className="uppercase tracking-wider text-[10px] opacity-70">
                        Team
                      </div>
                      <ul className="list-disc pl-5 space-y-1">
                        {details.team.map((m, i) => (
                          <li key={i}>
                            {m.name} — {m.role}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {/* Links */}
                  {details.links &&
                  (details.links.behance ||
                    details.links.caseStudy ||
                    details.links.liveSite ||
                    details.links.repo) ? (
                    <div>
                      <div className="uppercase tracking-wider text-[10px] opacity-70">
                        Links
                      </div>
                      <div className="flex flex-col gap-1">
                        {details.links.behance && (
                          <a
                            href={details.links.behance}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 underline"
                          >
                            Behance <ExternalLink size={14} />
                          </a>
                        )}
                        {details.links.caseStudy && (
                          <a
                            href={details.links.caseStudy}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 underline"
                          >
                            Case Study <ExternalLink size={14} />
                          </a>
                        )}
                        {details.links.liveSite && (
                          <a
                            href={details.links.liveSite}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 underline"
                          >
                            Live Site <ExternalLink size={14} />
                          </a>
                        )}
                        {details.links.repo && (
                          <a
                            href={details.links.repo}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 underline"
                          >
                            Repo <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>
              </motion.aside>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
