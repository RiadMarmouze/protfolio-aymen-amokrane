"use client";
import { useMemo, useState } from "react";
import SectionTitle from "@/components/SectionTitle";
import { Btn, Field, Input, Select } from "@/components/ui";
import { X } from "lucide-react";

// ----------------------
// Types
// ----------------------
type PriorityKey = "cafe" | "esports" | "fintech" | "event" | "logistics";

interface Requirement {
  timeline: string;
  budget: string;
  country: string;
  scope: string;
}

// ----------------------
// Constants / Data
// ----------------------
const PRIORITY: { key: PriorityKey; label: string }[] = [
  { key: "cafe", label: "Cafe" },
  { key: "esports", label: "E-Sports Team" },
  { key: "fintech", label: "Fintech" },
  { key: "event", label: "Event" },
  { key: "logistics", label: "Logistics" },
];

const REQUIREMENTS: Record<PriorityKey, Requirement> = {
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

const KEYWORDS: Record<PriorityKey, string[]> = {
  cafe: ["Identity", "Menu", "Signage"],
  esports: ["Naming", "Brand", "Jerseys"],
  fintech: ["Strategy", "Identity", "Design System"],
  event: ["Event ID", "Screens", "Motion"],
  logistics: ["Livery", "Wayfinding", "Guidelines"],
};

// ----------------------
// Style Helpers (single source of truth)
// ----------------------
const BORDER = "border-2 border-black"; // consistent border everywhere
const CARD = `${BORDER} rounded-2xl`;
const PILL = `${BORDER} rounded-full`;

// ----------------------
// UI Primitives
// ----------------------
function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className={`${CARD} p-3`}>
      <div className="uppercase text-[10px] opacity-70">{label}</div>
      <div className="mt-1 font-medium">{value}</div>
    </div>
  );
}

function CenteredSection({ children }: { children: React.ReactNode }) {
  return <section className="mx-auto max-w-6xl px-4">{children}</section>;
}

function Modal({
  title,
  onClose,
  children,
  ariaLabel,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  ariaLabel: string;
}) {
  return (
    <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4">
      <div
        className={`bg-white w-full max-w-2xl ${CARD} overflow-hidden`}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
      >
        <div className="px-5 py-4 bg-black text-white flex items-center justify-between">
          <div className="font-medium">{title}</div>
          <button
            onClick={onClose}
            className={`${PILL} px-2 py-1 border-white`}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
        <div className="px-5 py-5 text-sm grid gap-4">{children}</div>
      </div>
    </div>
  );
}

function PillTab({
  label,
  keywords,
  onClick,
  className = "",
}: {
  label: string;
  keywords: string[];
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`${PILL} ${className} text-center transition hover:bg-black hover:text-white w-full h-full flex flex-col items-center justify-center`}
    >
      <div className="text-lg font-semibold uppercase tracking-[0.12em]">
        {label}
      </div>
      <div className="mt-2 text-xs opacity-80 text-balance">
        {keywords.join(" • ")}
      </div>
    </button>
  );
}

// ----------------------
// Feature Blocks
// ----------------------
function PriorityTabs({ onOpen }: { onOpen: (k: PriorityKey) => void }) {
  // Fixed item size ensures consistent width/height across rows
  const itemWrapper = "w-64 h-24"; // adjust once to tune layout
  return (
    <div className="flex flex-wrap justify-center gap-4 w-full max-w-[980px] mx-auto">
      {PRIORITY.map((p) => (
        <div key={p.key} className={`${itemWrapper} flex`}>
          <PillTab
            label={p.label}
            keywords={KEYWORDS[p.key]}
            onClick={() => onOpen(p.key)}
            className="px-6"
          />
        </div>
      ))}
    </div>
  );
}

function RequirementModal({
  open,
  onClose,
}: {
  open: PriorityKey | null;
  onClose: () => void;
}) {
  const data = useMemo(() => (open ? REQUIREMENTS[open] : null), [open]);
  const title = useMemo(
    () => PRIORITY.find((p) => p.key === open)?.label ?? "",
    [open]
  );

  if (!open || !data) return null;
  return (
    <Modal
      title={title}
      onClose={onClose}
      ariaLabel={`${title} - Requirements`}
    >
      <div className="grid md:grid-cols-3 gap-4">
        <StatCard label="timeline" value={data.timeline} />
        <StatCard label="budget" value={data.budget} />
        <StatCard label="country" value={data.country} />
      </div>
      <div>
        <div className="uppercase text-[10px] opacity-70">Scope</div>
        <p className="mt-1">{data.scope}</p>
      </div>
      <div>
        <a href="/contact" onClick={onClose} className="inline-block">
          <Btn className={`${PILL} px-4 py-2 text-sm`}>Start this project</Btn>
        </a>
      </div>
    </Modal>
  );
}

function InquiryForm() {
  // Shared field classNames to ensure consistent borders + rounding
  const fieldInput = `${CARD} px-3 py-2 w-full`;
  const fieldSelect = `${CARD} px-3 py-2 w-full bg-white`;
  const fieldTextArea = `${CARD} px-3 py-2 min-h-[140px] w-full`;

  return (
    <form
      className="grid md:grid-cols-2 gap-4 w-full max-w-2xl"
      onSubmit={(e) => e.preventDefault()}
    >
      <Field label="Your name">
        <Input className={fieldInput} placeholder="Full name" />
      </Field>
      <Field label="Email">
        <Input className={fieldInput} placeholder="name@email.com" />
      </Field>
      <Field className="md:col-span-2" label="Project name">
        <Input className={fieldInput} placeholder="e.g., Glowz" />
      </Field>
      <Field label="Industry">
        <Input
          className={fieldInput}
          placeholder="e.g., Beauty / F&B / Fintech"
        />
      </Field>
      <Field label="Budget (USD)">
        <Select className={fieldSelect}>
          <option>5k-8k</option>
          <option>8k-12k</option>
          <option>12k-20k</option>
          <option>20k+</option>
        </Select>
      </Field>
      <Field label="Timeline">
        <Select className={fieldSelect}>
          <option>4-6 weeks</option>
          <option>6-8 weeks</option>
          <option>8-12 weeks</option>
          <option>Flexible</option>
        </Select>
      </Field>
      <Field label="Country">
        <Input className={fieldInput} placeholder="e.g., UAE" />
      </Field>
      <Field className="md:col-span-2" label="Project type">
        <Select className={fieldSelect}>
          <option>Branding</option>
          <option>Strategy</option>
          <option>Illustration</option>
          <option>Systems</option>
          <option>Logos</option>
        </Select>
      </Field>
      <Field className="md:col-span-2" label="Brief">
        <textarea
          className={fieldTextArea}
          placeholder="Give me a quick brief."
        />
      </Field>
      <div className="md:col-span-2 flex justify-center">
        <Btn type="submit" className={`${PILL} px-5 py-2 text-sm`}>
          <span>Send inquiry</span>
        </Btn>
      </div>
    </form>
  );
}

// ----------------------
// Page
// ----------------------
export default function ContactPage() {
  const [open, setOpen] = useState<PriorityKey | null>(null);

  return (
    <>
      <main className="py-12">
        <CenteredSection>
          {/* Priority Projects */}
          <SectionTitle>Priority Projects</SectionTitle>
          <p className="mt-4 mb-8 text-sm opacity-80 text-center">
            Pre-defined scope with clear timelines & budgets. Pick one to see
            the exact requirements.
          </p>

          {/* Tabs (two rows, centered; consistent sizing) */}
          <div className="flex justify-center">
            <PriorityTabs onOpen={setOpen} />
          </div>

          <RequirementModal open={open} onClose={() => setOpen(null)} />

          {/* Divider */}
          <div className="my-12 mx-auto h-0 w-full max-w-6xl border-t-2 border-black" />

          {/* Project Inquiry */}
          <SectionTitle>Project Inquiry</SectionTitle>
          <div className="mt-4 flex justify-center">
            <InquiryForm />
          </div>
        </CenteredSection>
      </main>
    </>
  );
}
