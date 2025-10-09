// src/app/work/probe/page.tsx
"use client";

import React from "react";

// ---------------------------- Types -----------------------------
type MediaItem = {
  type?: string;
  url?: string;
  alt?: string;
  dimensions?: { w?: number; h?: number };
  width?: number;
  height?: number;
};

type ProjectTimeline =
  | { start: string; end?: string }
  | { label: string };

type HeadingBlock = { id: string; type: "heading"; level?: number; text: string };
type ParagraphBlock = { id: string; type: "paragraph"; text: string };
type ListBlock = { id: string; type: "list"; items: string[] };
type QuoteBlock = { id: string; type: "quote"; text: string };

type Project = {
  general: {
    id: string;
    title: string;
    slug: string;
    year: number;
    tags?: string[];
    industry?: string;
    heroUrl?: string;
    quotes?: string[];
    published?: boolean;
    createdAt: number;
    updatedAt: number;
  };
  main: {
    brief?: string;
    gallery?: MediaItem[];
    details: {
      client?: string;
      sector?: string;
      discipline?: string[];
      tagline?: string;
      summary?: string;
      team?: Array<{ name: string; role?: string }>;
      services?: string[];
      deliverables?: string[];
      timeline?: ProjectTimeline;
      location?: string;
      links?: {
        behance?: string;
        caseStudy?: string;
        liveSite?: string;
        repo?: string;
      };
    };
  };
  extra?: {
    blocks?: Array<HeadingBlock | ParagraphBlock | ListBlock | QuoteBlock>;
  };
};

// ---------------------------- Utility helpers -----------------------------
const nonEmpty = (v: unknown) =>
  Array.isArray(v) ? v.length > 0 : v !== undefined && v !== null && String(v).trim() !== "";

function safeJoin(list?: string[], sep = " / ") {
  return Array.isArray(list) && list.length ? list.join(sep) : undefined;
}

function timelineToText(t?: ProjectTimeline): string | undefined {
  if (!t) return undefined;
  if ("label" in t) return t.label;
  return `${t.start}${t.end ? ` → ${t.end}` : ""}`;
}

function fileNameFromUrl(url: string) {
  try {
    const u = new URL(url);
    const last = u.pathname.split("/").filter(Boolean).pop();
    return last ?? url;
  } catch {
    const parts = url.split("?")[0].split("#")[0].split("/").filter(Boolean);
    return parts.pop() ?? url;
  }
}

type MaybeDims = { dimensions?: { w?: number; h?: number }; width?: number; height?: number };
type MaybeTyped = { type?: string };
type MaybeAltUrl = { alt?: string; url?: string };

function getDims(item: MediaItem): { w?: number; h?: number } | undefined {
  const i = item as unknown as MaybeDims;
  if (i?.dimensions && typeof i.dimensions.w === "number" && typeof i.dimensions.h === "number") {
    return { w: i.dimensions.w, h: i.dimensions.h };
  }
  if (typeof i?.width === "number" && typeof i?.height === "number") {
    return { w: i.width, h: i.height };
  }
  return undefined;
}

function inferAspect(item: MediaItem): { kind: "square" | "wide"; ratio?: number } {
  const dims = getDims(item);
  if (dims?.w && dims?.h) {
    const ratio = dims.w / dims.h;
    if (Math.abs(ratio - 1) < 0.1) return { kind: "square", ratio };
    return { kind: ratio >= 1.8 ? "wide" : "square", ratio };
  }
  const t = (item as unknown as MaybeTyped).type;
  return { kind: t === "video" ? "wide" : "square" };
}

// ----------------------------- Main Component -----------------------------
function ProjectTextProbe({ project }: { project: Project }) {
  const q0 = project.general.quotes?.[0] ?? "Make it simple, make it scale.";
  const q1 = project.general.quotes?.[1] ?? "Systems that look good and behave well.";

  const d = project.main.details;
  const gallery = Array.isArray(project.main.gallery) ? project.main.gallery : [];

  const sections: Array<{ id: string; label: string; content: React.ReactNode }> = [
    {
      id: "overview",
      label: "Overview",
      content: (
        <div className="space-y-3">
          {nonEmpty(d.client) && <Detail label="Client" value={d.client!} />}
          {nonEmpty(d.sector) && <Detail label="Sector" value={d.sector!} />}
          {nonEmpty(d.discipline) && <Detail label="Discipline" value={safeJoin(d.discipline)!} />}
          {nonEmpty(d.tagline) && <Detail label="Tagline" value={d.tagline!} />}
          {nonEmpty(d.summary) && (
            <div>
              <SectionLabel>Summary</SectionLabel>
              <p className="leading-relaxed">{d.summary}</p>
            </div>
          )}
        </div>
      ),
    },
    {
      id: "scope",
      label: "Scope",
      content: (
        <div className="space-y-3">
          {Array.isArray(d.services) && d.services.length > 0 && (
            <List label="Services" items={d.services} />
          )}
          {Array.isArray(d.deliverables) && d.deliverables.length > 0 && (
            <List label="Deliverables" items={d.deliverables} />
          )}
          {Array.isArray(d.team) && d.team.length > 0 && (
            <div>
              <SectionLabel>Team</SectionLabel>
              <ul className="list-disc pl-5 space-y-1">
                {d.team.map((m) => (
                  <li key={`${m.name}-${m.role ?? "member"}`} className="text-sm">
                    <span className="font-medium">{m.name}</span>
                    {m.role ? <span> — {m.role}</span> : null}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ),
    },
    {
      id: "meta",
      label: "Meta",
      content: (
        <div className="space-y-3">
          {nonEmpty(d.timeline) && <Detail label="Timeline" value={timelineToText(d.timeline)!} />}
          {nonEmpty(d.location) && <Detail label="Location" value={d.location!} />}
          {d.links && Object.values(d.links).some(Boolean) && (
            <div>
              <SectionLabel>Links</SectionLabel>
              <ul className="list-disc pl-5 space-y-1">
                {d.links.behance && <li><ExtLink href={d.links.behance} label="Behance" /></li>}
                {d.links.caseStudy && <li><ExtLink href={d.links.caseStudy} label="Case Study" /></li>}
                {d.links.liveSite && <li><ExtLink href={d.links.liveSite} label="Live Site" /></li>}
                {d.links.repo && <li><ExtLink href={d.links.repo} label="Repo" /></li>}
              </ul>
            </div>
          )}
        </div>
      ),
    },
    {
      id: "story",
      label: "Story",
      content: (
        <div className="space-y-3">
          {project.extra?.blocks?.length ? (
            project.extra.blocks.map((b) => {
              switch (b.type) {
                case "heading":
                  return (
                    <p key={b.id} className="font-semibold">{b.text}</p>
                  );
                case "quote":
                  return (
                    <blockquote key={b.id} className="border-l-2 pl-3 italic opacity-90">
                      {b.text}
                    </blockquote>
                  );
                case "list":
                  return (
                    <ul key={b.id} className="list-disc pl-5 space-y-1">
                      {b.items.map((it, i) => <li key={`${b.id}-${i}`}>{it}</li>)}
                    </ul>
                  );
                case "paragraph":
                  return (
                    <p key={b.id} className="leading-relaxed">{b.text}</p>
                  );
                default:
                  return (
                    <></>
                    // <p key={b.id} className="text-sm opacity-70">
                    //   [Media block: {b.type}]
                    // </p>
                  );
              }
            })
          ) : (
            <div className="opacity-60">No story provided.</div>
          )}
        </div>
      ),
    },
    {
      id: "gallery-meta",
      label: "Gallery (metadata only)",
      content: (
        <div className="space-y-4">
          <Detail label="Items" value={`${gallery.length}`} />
          {gallery.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="text-left border-b">
                    <Th>#</Th>
                    <Th>Kind</Th>
                    <Th>Type</Th>
                    <Th>File</Th>
                    <Th>Alt</Th>
                    <Th>Dimensions</Th>
                    <Th>Ratio</Th>
                    <Th>URL</Th>
                  </tr>
                </thead>
                <tbody>
                  {gallery.map((item, idx) => {
                    const aspect = inferAspect(item);
                    const dims = getDims(item);
                    const dimsTxt = dims?.w && dims?.h ? `${dims.w}×${dims.h}` : "—";
                    const ratioTxt = aspect.ratio !== undefined ? aspect.ratio.toFixed(3) : "—";
                    const kind = aspect.kind;
                    const typed = item as unknown as MaybeTyped & MaybeAltUrl;
                    const type = typed.type ?? "image";
                    const alt = typed.alt ?? "—";
                    const url = typed.url ?? "";
                    return (
                      <tr key={`${url || "item"}-${idx}`} className="border-b align-top">
                        <Td>{idx + 1}</Td>
                        <Td>{kind}</Td>
                        <Td>{type}</Td>
                        <Td className="font-medium break-all">{url ? fileNameFromUrl(url) : "—"}</Td>
                        <Td className="break-all max-w-[16rem]">{alt}</Td>
                        <Td>{dimsTxt}</Td>
                        <Td>{ratioTxt}</Td>
                        <Td className="break-all max-w-[24rem]">
                          {url ? <a href={url} className="underline" target="_blank" rel="noreferrer noopener">{url}</a> : "—"}
                        </Td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="opacity-60">No gallery items found.</div>
          )}
        </div>
      ),
    },
  ];

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
          {project.general.id} 
          {project.general.title} <span className="opacity-60">— {project.general.year}</span>
        </h1>
        {nonEmpty(project.main.brief) && <p className="mt-3 text-base leading-relaxed">{project.main.brief}</p>}
      </header>

      <section aria-label="Quotes" className="space-y-6 mb-10">
        <Quote text={q0} />
        <Quote text={q1} />
      </section>

      <section aria-label="Project notes" className="space-y-8">
        {sections.map((s) => (
          <article key={s.id} aria-labelledby={s.id}>
            <h2 id={s.id} className="uppercase tracking-wider text-[11px] opacity-70 mb-2">
              {s.label}
            </h2>
            {s.content}
          </article>
        ))}
      </section>

      <footer className="mt-12 pt-6 border-t text-sm opacity-70">
        Text-only probe view. No images/videos rendered — metadata only. Use this to validate data shape &amp; load time.
      </footer>
    </main>
  );
}

// ----------------------------- Atoms -----------------------------
function Quote({ text }: { text: string }) {
  if (!nonEmpty(text)) return null;
  return <blockquote className="text-xl md:text-2xl font-medium leading-tight border-l-2 pl-3">{text}</blockquote>;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="uppercase tracking-wider text-[11px] opacity-70">{children}</div>;
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <dl className="grid grid-cols-[120px_1fr] gap-x-4 text-sm">
      <dt className="opacity-70">{label}</dt>
      <dd>{value}</dd>
    </dl>
  );
}

function List({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <SectionLabel>{label}</SectionLabel>
      <ul className="list-disc pl-5 space-y-1 text-sm">{items.map((s) => <li key={s}>{s}</li>)}</ul>
    </div>
  );
}

function ExtLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer noopener" className="underline hover:opacity-80">
      {label}
    </a>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`py-2 pr-3 text-xs font-medium opacity-70 ${className}`}>{children}</th>;
}

function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`py-2 pr-3 ${className}`}>{children}</td>;
}

// --------------------------- Example Page ---------------------------
export default function Page({
  id,
}: {
  id: string;
}) {
  const mock: Project = {
    general: {
      id: id,
      title: "Acme Platform Revamp",
      slug: "acme-platform-revamp",
      year: 2025,
      tags: ["design", "frontend"],
      industry: "B2B SaaS",
      heroUrl: "https://cdn.example.com/hero.jpg",
      quotes: ["Make it simple, make it scale.", "Systems that look good and behave well."],
      published: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    main: {
      brief: "A modular redesign with an emphasis on velocity & UX.",
      gallery: [
        { type: "image", url: "https://cdn.example.com/1400x700.jpg", alt: "Hero", dimensions: { w: 1400, h: 700 } },
        { type: "image", url: "https://cdn.example.com/700x700.jpg", alt: "Square", dimensions: { w: 700, h: 700 } },
        { type: "video", url: "https://cdn.example.com/demo.mp4", alt: "Demo" },
      ],
      details: {
        client: "Acme Co.",
        sector: "B2B SaaS",
        discipline: ["Design", "Frontend"],
        tagline: "From monolith to modules.",
        summary: "We refactored the UI layer and shipped a scalable design system.",
        team: [
          { name: "Jane Doe", role: "Design" },
          { name: "John Smith", role: "FE" },
        ],
        services: ["UX", "UI", "Frontend"],
        deliverables: ["Design System", "Docs", "Component Library"],
        timeline: { start: "Jan 2025", end: "Apr 2025" },
        location: "Remote",
        links: { liveSite: "https://example.com" },
      },
    },
    extra: {
      blocks: [
        { id: "b1", type: "heading", level: 2, text: "Approach" },
        { id: "b2", type: "paragraph", text: "We started with research and audits." },
        { id: "b3", type: "list", items: ["Audit", "Design system", "Implementation"] },
      ],
    },
  };

  return <ProjectTextProbe project={mock} />;
}
