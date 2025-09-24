"use client";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getProjects } from "@/lib/data";
import Placeholder from "@/components/Placeholder";
import { Btn } from "@/components/ui";

export default function ProjectViewer({ id }: { id: string }) {
  const projects = useMemo(() => getProjects(), []);
  const project = useMemo(
    () =>
      projects.find((p) => String(p.id ?? "") === id) ??
      projects[0],
    [id, projects]
  );
  const [aboutOpen, setAboutOpen] = useState(false);

  const slides = useMemo(
    () => [
      { type: "image", h: "h-[80vh]" },
      { type: "text", text: project.quotes?.[0] || "Make it simple, make it scale." },
      { type: "image", h: "h-[90vh]" },
      { type: "text", text: project.quotes?.[1] || "Systems that look good and behave well." },
      { type: "image", h: "h-[70vh]" },
    ],
    [project]
  );

  return (
    <main className="min-h-screen">
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
                {slides.map((s, i) =>
                  s.type === "image" ? (
                    <div
                      key={i}
                      className={`${s.h} rounded-[2px] overflow-hidden`}
                    >
                      <Placeholder className="w-full h-full" />
                    </div>
                  ) : (
                    <div key={i} className="py-12">
                      <div className="text-2xl md:text-4xl font-semibold leading-[1] tracking-tight">
                        {s.text}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </motion.div>
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
                <div className="px-5 py-5 text-sm grid gap-4">
                  <div>
                    <div className="uppercase tracking-wider text-[10px] opacity-70">
                      Client
                    </div>
                    <div>{project.title} Inc.</div>
                  </div>
                  <div>
                    <div className="uppercase tracking-wider text-[10px] opacity-70">
                      Sector
                    </div>
                    <div>{project.industry}</div>
                  </div>
                  <div>
                    <div className="uppercase tracking-wider text-[10px] opacity-70">
                      Discipline
                    </div>
                    <div>{project.tags.join(" / ")}</div>
                  </div>
                  <div>
                    <div className="uppercase tracking-wider text-[10px] opacity-70">
                      Tagline
                    </div>
                    <div>{project.tagline}</div>
                  </div>
                  <div>
                    <div className="uppercase tracking-wider text-[10px] opacity-70">
                      Summary
                    </div>
                    <p>{project.brief}</p>
                  </div>
                  <div>
                    <div className="uppercase tracking-wider text-[10px] opacity-70">
                      Team
                    </div>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Aymen - Creative Direction</li>
                      <li>Designer - Identity and Systems</li>
                      <li>Strategist - Positioning</li>
                    </ul>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
