"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ExternalLink, X } from "lucide-react";
import { firestore } from "@/lib/firebase/client";
import { doc, getDoc } from "firebase/firestore";
import type { CollaborationDoc } from "@/lib/types/collaboration";

type Props = { id: string };

export default function CollaborationViewer({ id }: Props) {
  const [collab, setCollab] = useState<CollaborationDoc | null>(null);
  const [aboutOpen, setAboutOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const snap = await getDoc(doc(firestore, "collaborations", id));
        if (!mounted) return;
        if (snap.exists()) setCollab({ id: snap.id, ...(snap.data() as any) });
      } catch (e) {
        console.error("[CollaborationViewer] load error", e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (!collab) {
    return (
      <main className="min-h-screen">
        <div className="max-w-6xl mx-auto px-4 pt-20 pb-8">
          <div className="h-6 w-40 animate-pulse rounded bg-muted" />
        </div>
      </main>
    );
  }

  const q0 =
    collab.tagline ??
    "Let’s collaborate: design that moves, systems that scale.";

  const gallery = collab.gallery ?? [];
  const hasGallery = gallery.length > 0;

  return (
    <main className="min-h-screen">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 pt-20 pb-8 flex items-center justify-between">
        <Link href="/work">
          <button className="rounded-lg border px-3 py-1.5 text-sm inline-flex items-center gap-1">
            <ArrowLeft size={16} /> Back to work
          </button>
        </Link>
        <div className="text-xl md:text-3xl font-semibold tracking-tight">
          {collab.projectTitle}{" "}
          <span className="opacity-60">
            — {collab.roleWanted ?? collab.status}
          </span>
        </div>
        <button
          onClick={() => setAboutOpen((v) => !v)}
          className="rounded-lg border px-3 py-1.5 text-sm"
        >
          Proposal Notes
        </button>
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
                {hasGallery ? (
                  <>
                    <div className="py-12">
                      <div className="text-2xl md:text-4xl font-semibold leading-[1] tracking-tight">
                        {q0}
                      </div>
                    </div>
                    {gallery.map((g, i) =>
                      g.type === "image" ? (
                        <div
                          key={i}
                          className="h-[70vh] relative rounded-[2px] overflow-hidden"
                        >
                          <Image
                            src={g.url}
                            alt={g.alt ?? collab.projectTitle}
                            fill
                            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                            className="object-contain"
                            loading={i <= 1 ? "eager" : "lazy"}
                          />
                        </div>
                      ) : (
                        <div
                          key={i}
                          className="h-[70vh] rounded-[2px] overflow-hidden"
                        >
                          <video
                            src={g.url}
                            className="w-full h-full object-cover"
                            controls
                          />
                        </div>
                      )
                    )}
                  </>
                ) : (
                  <div className="py-12">
                    <div className="text-2xl md:text-4xl font-semibold leading-[1] tracking-tight">
                      {q0}
                    </div>
                    <p className="mt-3 opacity-80">{collab.summary}</p>
                  </div>
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
                  <div className="font-medium">Proposal Notes</div>
                  <button
                    className="rounded-full border-2 p-1 hover:bg-black hover:text-white"
                    onClick={() => setAboutOpen(false)}
                    aria-label="Close notes"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="px-5 py-5 text-sm grid gap-5">
                  <div>
                    <div className="uppercase tracking-wider text-[10px] opacity-70">
                      Contact
                    </div>
                    <div>
                      {collab.contact.name} —{" "}
                      <a
                        className="underline"
                        href={`mailto:${collab.contact.email}`}
                      >
                        {collab.contact.email}
                      </a>
                    </div>
                  </div>

                  {collab.org && (
                    <div>
                      <div className="uppercase tracking-wider text-[10px] opacity-70">
                        Org
                      </div>
                      <div>{collab.org}</div>
                    </div>
                  )}

                  {collab.roleWanted && (
                    <div>
                      <div className="uppercase tracking-wider text-[10px] opacity-70">
                        Role
                      </div>
                      <div>{collab.roleWanted}</div>
                    </div>
                  )}

                  {collab.skills?.length ? (
                    <div>
                      <div className="uppercase tracking-wider text-[10px] opacity-70">
                        Skills
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {collab.skills.map((s, i) => (
                          <span
                            key={i}
                            className="text-xs rounded-full border px-2 py-0.5"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  <div>
                    <div className="uppercase tracking-wider text-[10px] opacity-70">
                      Summary
                    </div>
                    <p>{collab.summary}</p>
                  </div>

                  {(collab.budget || collab.timeline || collab.location) && (
                    <div className="grid grid-cols-3 gap-4">
                      {collab.budget && (
                        <div>
                          <div className="uppercase tracking-wider text-[10px] opacity-70">
                            Budget
                          </div>
                          <div>{collab.budget}</div>
                        </div>
                      )}
                      {collab.timeline && (
                        <div>
                          <div className="uppercase tracking-wider text-[10px] opacity-70">
                            Timeline
                          </div>
                          <div>{collab.timeline}</div>
                        </div>
                      )}
                      {collab.location && (
                        <div>
                          <div className="uppercase tracking-wider text-[10px] opacity-70">
                            Location
                          </div>
                          <div>{collab.location}</div>
                        </div>
                      )}
                    </div>
                  )}

                  {collab.tags?.length ? (
                    <div>
                      <div className="uppercase tracking-wider text-[10px] opacity-70">
                        Tags
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {collab.tags.map((t) => (
                          <span
                            key={t}
                            className="text-xs rounded-full border px-2 py-0.5"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {collab.links &&
                  (collab.links.behance ||
                    collab.links.brief ||
                    collab.links.deck ||
                    collab.links.live ||
                    collab.links.repo) ? (
                    <div>
                      <div className="uppercase tracking-wider text-[10px] opacity-70">
                        Links
                      </div>
                      <div className="flex flex-col gap-1">
                        {collab.links.brief && (
                          <a
                            href={collab.links.brief}
                            className="underline inline-flex items-center gap-1"
                            target="_blank"
                            rel="noreferrer"
                          >
                            Brief <ExternalLink size={14} />
                          </a>
                        )}
                        {collab.links.deck && (
                          <a
                            href={collab.links.deck}
                            className="underline inline-flex items-center gap-1"
                            target="_blank"
                            rel="noreferrer"
                          >
                            Deck <ExternalLink size={14} />
                          </a>
                        )}
                        {collab.links.behance && (
                          <a
                            href={collab.links.behance}
                            className="underline inline-flex items-center gap-1"
                            target="_blank"
                            rel="noreferrer"
                          >
                            Behance <ExternalLink size={14} />
                          </a>
                        )}
                        {collab.links.live && (
                          <a
                            href={collab.links.live}
                            className="underline inline-flex items-center gap-1"
                            target="_blank"
                            rel="noreferrer"
                          >
                            Live <ExternalLink size={14} />
                          </a>
                        )}
                        {collab.links.repo && (
                          <a
                            href={collab.links.repo}
                            className="underline inline-flex items-center gap-1"
                            target="_blank"
                            rel="noreferrer"
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
