// Text-only project probe — minimal, fast, best-practice (RSC-friendly)
// Now includes gallery *metadata* (no images) to validate data load & shapes.
// No client directives, no animations, semantic HTML.

// ---------- Lightweight types (replace with your own if desired) ----------
type LinkSet = Partial<{
  behance: string;
  caseStudy: string;
  liveSite: string;
  repo: string;
}>;

type Timeline =
  | { label: string }
  | { start: string; end?: string };

type TeamMember = { name: string; role: string };

type MediaItemBase = {
  type: 'image' | 'video';
  url: string;
  alt?: string;
};

type MediaItemWithDims = MediaItemBase & {
  dimensions?: { w: number; h: number };
  span2?: boolean; // hint from your original grid logic
};

type Details = {
  client?: string;
  sector?: string;
  discipline?: string[];
  tagline?: string;
  summary?: string;
  services?: string[];
  deliverables?: string[];
  team?: TeamMember[];
  timeline?: Timeline;
  location?: string;
  links?: LinkSet;
};

type Project = {
  general: {
    title: string;
    year: string | number;
    quotes?: string[];
  };
  main: {
    brief?: string;
    details: Details;
    gallery?: MediaItemWithDims[]; // <-- included now
  };
  extra?: {
    blocks?: Array<{ type?: string; text?: string }>;
  };
};

// ---------------------------- Utility helpers -----------------------------
const nonEmpty = (v: unknown) =>
  Array.isArray(v) ? v.length > 0 : v !== undefined && v !== null && String(v).trim() !== '';

function safeJoin(list?: string[], sep = ' / ') {
  return Array.isArray(list) && list.length ? list.join(sep) : undefined;
}

function timelineToText(t?: Timeline): string | undefined {
  if (!t) return undefined;
  if ('label' in t) return t.label;
  return `${t.start}${t.end ? ` → ${t.end}` : ''}`;
}

function fileNameFromUrl(url: string) {
  try {
    const u = new URL(url);
    const last = u.pathname.split('/').filter(Boolean).pop();
    return last ?? url;
  } catch {
    const parts = url.split('?')[0].split('#')[0].split('/');
    return parts.pop() || url;
  }
}

function inferAspect(item: MediaItemWithDims): { kind: 'square' | 'wide'; ratio?: number } {
  const w = item.dimensions?.w;
  const h = item.dimensions?.h;
  if (w && h) {
    const ratio = w / h;
    if (Math.abs(ratio - 1) < 0.1) return { kind: 'square', ratio };
    return { kind: ratio >= 1.8 ? 'wide' : 'square', ratio };
  }
  return { kind: item.type === 'video' ? 'wide' : 'square' };
}

// ----------------------------- Page component -----------------------------
export default function ProjectTextProbe({ project }: { project: Project }) {
  const q0 = project.general.quotes?.[0] ?? 'Make it simple, make it scale.';
  const q1 = project.general.quotes?.[1] ?? 'Systems that look good and behave well.';

  const d = (project.main.details ?? {}) as Details;
  const gallery = Array.isArray(project.main.gallery) ? project.main.gallery : [];

  const sections: Array<{
    id: string;
    label: string;
    content: React.ReactNode;
  }> = [
    {
      id: 'overview',
      label: 'Overview',
      content: (
        <div className="space-y-3">
          {nonEmpty(d.client) && <Detail label="Client" value={d.client!} />}
          {nonEmpty(d.sector) && <Detail label="Sector" value={d.sector!} />}
          {nonEmpty(d.discipline) && (
            <Detail label="Discipline" value={safeJoin(d.discipline)!} />
          )}
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
      id: 'scope',
      label: 'Scope',
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
                  <li key={`${m.name}-${m.role}`} className="text-sm">
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
      id: 'meta',
      label: 'Meta',
      content: (
        <div className="space-y-3">
          {nonEmpty(d.timeline) && (
            <Detail label="Timeline" value={timelineToText(d.timeline)!} />
          )}
          {nonEmpty(d.location) && <Detail label="Location" value={d.location!} />}
          {d.links && Object.values(d.links).some(Boolean) && (
            <div>
              <SectionLabel>Links</SectionLabel>
              <ul className="list-disc pl-5 space-y-1">
                {d.links.behance && (
                  <li>
                    <ExtLink href={d.links.behance} label="Behance" />
                  </li>
                )}
                {d.links.caseStudy && (
                  <li>
                    <ExtLink href={d.links.caseStudy} label="Case Study" />
                  </li>
                )}
                {d.links.liveSite && (
                  <li>
                    <ExtLink href={d.links.liveSite} label="Live Site" />
                  </li>
                )}
                {d.links.repo && (
                  <li>
                    <ExtLink href={d.links.repo} label="Repo" />
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'story',
      label: 'Story',
      content: (
        <div className="space-y-2">
          {project.extra?.blocks?.length ? (
            project.extra.blocks.map((b, i) => (
              <p key={i} className="leading-relaxed">
                {b.text ?? ''}
              </p>
            ))
          ) : (
            <div className="opacity-60">No story provided.</div>
          )}
        </div>
      ),
    },
    {
      id: 'gallery-meta',
      label: 'Gallery (metadata only)',
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
                    <Th>Inferred</Th>
                    <Th>span2</Th>
                    <Th>URL</Th>
                  </tr>
                </thead>
                <tbody>
                  {gallery.map((item, idx) => {
                    const aspect = inferAspect(item);
                    const dims = item.dimensions
                      ? `${item.dimensions.w}×${item.dimensions.h}`
                      : '—';
                    const ratioTxt =
                      aspect.ratio !== undefined ? aspect.ratio.toFixed(3) : '—';
                    return (
                      <tr key={`${item.url}-${idx}`} className="border-b align-top">
                        <Td>{idx + 1}</Td>
                        <Td>{aspect.kind}</Td>
                        <Td>{item.type}</Td>
                        <Td className="font-medium break-all">{fileNameFromUrl(item.url)}</Td>
                        <Td className="break-all max-w-[16rem]">{item.alt ?? '—'}</Td>
                        <Td>{dims}</Td>
                        <Td>{ratioTxt}</Td>
                        <Td>{aspect.kind}</Td>
                        <Td>{item.span2 ? 'true' : 'false'}</Td>
                        <Td className="break-all max-w-[24rem]">
                          <a href={item.url} className="underline" target="_blank" rel="noreferrer noopener">
                            {item.url}
                          </a>
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
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
          {project.general.title} <span className="opacity-60">— {project.general.year}</span>
        </h1>
        {nonEmpty(project.main.brief) && (
          <p className="mt-3 text-base leading-relaxed">{project.main.brief}</p>
        )}
      </header>

      {/* Quotes */}
      <section aria-label="Quotes" className="space-y-6 mb-10">
        <Quote text={q0} />
        <Quote text={q1} />
      </section>

      {/* Notes (flattened) */}
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

      {/* Footer meta */}
      <footer className="mt-12 pt-6 border-t text-sm opacity-70">
        Text-only probe view. No images/videos rendered — metadata only. Use this to validate data shape & load time.
      </footer>
    </main>
  );
}

// ----------------------------- Atoms (text) -------------------------------
function Quote({ text }: { text: string }) {
  if (!nonEmpty(text)) return null;
  return (
    <blockquote className="text-xl md:text-2xl font-medium leading-tight border-l-2 pl-3">
      {text}
    </blockquote>
  );
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
      <ul className="list-disc pl-5 space-y-1 text-sm">
        {items.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
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

function Th({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th className={`py-2 pr-3 text-xs font-medium opacity-70 ${className}`}>
      {children}
    </th>
  );
}

function Td({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`py-2 pr-3 ${className}`}>{children}</td>;
}

// ----------------------------- Example usage ------------------------------
// Quick dev page without wiring data fetching yet:
/*
import ProjectTextProbe from './ProjectTextProbe';

const mock: Project = {
  general: { title: 'Acme Platform Revamp', year: 2025, quotes: [
    'Make it simple, make it scale.',
    'Systems that look good and behave well.',
  ] },
  main: {
    brief: 'A modular redesign of the Acme platform with an emphasis on velocity & UX.',
    details: {
      client: 'Acme Co.',
      sector: 'B2B SaaS',
      discipline: ['Design', 'Frontend'],
      tagline: 'From monolith to modules.',
      summary: 'We refactored the UI layer and shipped a scalable design system.',
      services: ['UX', 'UI', 'Frontend'],
      deliverables: ['Design System', 'Docs', 'Component Library'],
      team: [
        { name: 'Jane Doe', role: 'Design' },
        { name: 'John Smith', role: 'FE' },
      ],
      timeline: { start: 'Jan 2025', end: 'Apr 2025' },
      location: 'Remote',
      links: { liveSite: 'https://example.com' },
    },
    gallery: [
      { type: 'image', url: 'https://cdn.example.com/hero-1400x700.jpg', alt: 'Hero', dimensions: { w: 1400, h: 700 } },
      { type: 'image', url: 'https://cdn.example.com/square-700.jpg', alt: 'Square', dimensions: { w: 700, h: 700 }, span2: true },
      { type: 'video', url: 'https://cdn.example.com/demo.mp4', alt: 'Demo video' },
    ],
  },
  extra: { blocks: [{ text: 'We started with research and audits.' }, { text: 'Then we iterated.' }] },
};

export default function Page() {
  return <ProjectTextProbe project={mock} />;
}
*/
