"use client";
import { useState } from "react";
import SectionTitle from "@/components/SectionTitle";
import Footer from "@/components/Footer";
import { Btn, Field, Input, Select } from "@/components/ui";
import { X } from "lucide-react";

export default function ContactPage() {
  // Define valid project keys
  type PriorityKey = "cafe" | "esports" | "fintech" | "event" | "logistics";

  // Requirement type
  interface Requirement {
    timeline: string;
    budget: string;
    country: string;
    scope: string;
  }

  const PRIORITY: { key: PriorityKey; label: string }[] = [
    { key: "cafe", label: "Cafe" },
    { key: "esports", label: "E-Sports Team" },
    { key: "fintech", label: "Fintech" },
    { key: "event", label: "Event" },
    { key: "logistics", label: "Logistics" },
  ];

  const priorityRequirements: Record<PriorityKey, Requirement> = {
    cafe: {
      timeline: "6-8 weeks",
      budget: "Starting from $12k",
      country: "UAE or KSA preferred (open globally)",
      scope: "Full brand identity + menu system + signage guidance",
    },
    esports: {
      timeline: "8-10 weeks",
      budget: "Starting from $18k",
      country: "GCC / MENA",
      scope: "Naming support, brand system, jersey kit, stream overlays",
    },
    fintech: {
      timeline: "10-12 weeks",
      budget: "Starting from $25k",
      country: "Any (compliance-ready)",
      scope: "Strategy, visual identity, design system, product UI direction",
    },
    event: {
      timeline: "4-6 weeks",
      budget: "Starting from $8k",
      country: "UAE",
      scope: "Event identity, stage screen kit, motion templates",
    },
    logistics: {
      timeline: "6-8 weeks",
      budget: "Starting from $14k",
      country: "GCC / North Africa",
      scope: "Brand identity, fleet livery, signage and wayfinding starter",
    },
  };

  const priorityKeywords: Record<PriorityKey, string[]> = {
    cafe: ["Identity", "Menu", "Signage"],
    esports: ["Naming", "Brand", "Jerseys"],
    fintech: ["Strategy", "Identity", "Design System"],
    event: ["Event ID", "Screens", "Motion"],
    logistics: ["Livery", "Wayfinding", "Guidelines"],
  };

  function Tab({
    p,
    onOpen,
  }: {
    p: { key: PriorityKey; label: string };
    onOpen: (k: PriorityKey) => void;
  }) {
    return (
      <button
        key={p.key}
        onClick={() => onOpen(p.key)}
        className="rounded-3xl border-2 border-black p-6 text-center transition hover:bg-black hover:text-white"
      >
        <div className="text-lg font-semibold uppercase tracking-[0.12em]">
          {p.label}
        </div>
        <div className="mt-2 text-xs opacity-80">
          {priorityKeywords[p.key].join(" • ")}
        </div>
      </button>
    );
  }

  const [open, setOpen] = useState<PriorityKey | null>(null);

  return (
    <>
      <main className="max-w-6xl mx-auto px-4 py-12">
        <SectionTitle>Priority Projects</SectionTitle>
        <p className="-mt-4 mb-6 text-sm opacity-80">
          Pre-defined scope with clear timelines & budgets. Pick one to see the
          exact requirements.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PRIORITY.slice(0, 3).map((p) => (
            <Tab key={p.key} p={p} onOpen={setOpen} />
          ))}
        </div>
        <div className="grid sm:grid-cols-2 gap-4 mt-4 max-w-3xl">
          {PRIORITY.slice(3).map((p) => (
            <Tab key={p.key} p={p} onOpen={setOpen} />
          ))}
        </div>

        {open && (
          <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4">
            <div
              className="bg-white max-w-2xl w-full rounded-2xl border-2 border-black overflow-hidden"
              role="dialog"
              aria-modal="true"
              aria-label={`${
                PRIORITY.find((p) => p.key === open)?.label
              } - Requirements`}
            >
              <div className="px-5 py-4 bg-black text-white flex items-center justify-between">
                <div className="font-medium">
                  {PRIORITY.find((p) => p.key === open)?.label}
                </div>
                <button
                  onClick={() => setOpen(null)}
                  className="rounded-full border-2 border-white px-2 py-1"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="px-5 py-5 text-sm grid gap-4">
                <div className="grid md:grid-cols-3 gap-4">
                  {(["timeline", "budget", "country"] as const).map((k) => (
                    <div
                      key={k}
                      className="border-2 border-black rounded-xl p-3"
                    >
                      <div className="uppercase text-[10px] opacity-70">{k}</div>
                      <div className="mt-1 font-medium">
                        {priorityRequirements[open][k]}
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="uppercase text-[10px] opacity-70">Scope</div>
                  <p className="mt-1">{priorityRequirements[open].scope}</p>
                </div>

                <div>
                  <a
                    href="/contact"
                    onClick={() => setOpen(null)}
                    className="inline-block"
                  >
                    <Btn className="px-4 py-2 text-sm">Start this project</Btn>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="my-10 border-t-2 border-black" />
        <SectionTitle>Project Inquiry</SectionTitle>

        <form
          className="grid md:grid-cols-2 gap-4 max-w-3xl"
          onSubmit={(e) => e.preventDefault()}
        >
          <Field label="Your name">
            <Input placeholder="Full name" />
          </Field>
          <Field label="Email">
            <Input placeholder="name@email.com" />
          </Field>
          <Field className="md:col-span-2" label="Project name">
            <Input placeholder="e.g., Glowz" />
          </Field>
          <Field label="Industry">
            <Input placeholder="e.g., Beauty / F&B / Fintech" />
          </Field>
          <Field label="Budget (USD)">
            <Select>
              <option>5k-8k</option>
              <option>8k-12k</option>
              <option>12k-20k</option>
              <option>20k+</option>
            </Select>
          </Field>
          <Field label="Timeline">
            <Select>
              <option>4-6 weeks</option>
              <option>6-8 weeks</option>
              <option>8-12 weeks</option>
              <option>Flexible</option>
            </Select>
          </Field>
          <Field label="Country">
            <Input placeholder="e.g., UAE" />
          </Field>
          <Field className="md:col-span-2" label="Project type">
            <Select>
              <option>Branding</option>
              <option>Strategy</option>
              <option>Illustration</option>
              <option>Systems</option>
              <option>Logos</option>
            </Select>
          </Field>
          <Field className="md:col-span-2" label="Brief">
            <textarea
              className="border rounded-xl px-3 py-2 min-h-[120px]"
              placeholder="Give me a quick brief."
            />
          </Field>
          <div className="md:col-span-2">
            <Btn type="submit" className="px-5 py-2 text-sm">
              <span>Send inquiry</span>
            </Btn>
          </div>
        </form>
      </main>
      <Footer />
    </>
  );
}
