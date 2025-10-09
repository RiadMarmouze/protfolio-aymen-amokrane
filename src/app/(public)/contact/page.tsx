"use client";
import { useMemo, useState } from "react";
import SectionTitle from "@/components/SectionTitle";
import { Btn, Field, Input, Select } from "@/components/public/common/ui";
import { X } from "lucide-react";
import {
  PRIORITY,
  REQUIREMENTS,
  KEYWORDS,
  type PriorityKey,
} from "@/data/contact";

// ----------------------
// Styles
// ----------------------
const BORDER = "border-2 border-black";
const CARD = `${BORDER} rounded-2xl`;
const PILL = `${BORDER} rounded-full`;

// ----------------------
// Helpers
// ----------------------
async function postOffer(payload: any) {
  const res = await fetch("/api/public/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to submit");
  return res.json();
}

// ----------------------
// UI primitives
// ----------------------
function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className={`${CARD} p-3`}>
      <div className="uppercase text-[10px] opacity-70">{label}</div>
      <div className="mt-1 font-medium">{value}</div>
    </div>
  );
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4">
      <div className={`bg-white w-full max-w-2xl ${CARD} overflow-hidden`}>
        <div className="px-5 py-4 bg-black text-white flex items-center justify-between">
          <div className="font-medium">{title}</div>
          <button
            onClick={onClose}
            className={`${PILL} px-2 py-1 border-white`}
          >
            <X size={16} />
          </button>
        </div>
        <div className="px-5 py-5 text-sm grid gap-4">{children}</div>
      </div>
    </div>
  );
}

function CenteredSection({ children }: { children: React.ReactNode }) {
  return <section className="mx-auto max-w-6xl px-4">{children}</section>;
}

// ----------------------
// Priority UI
// ----------------------
function PillTab({
  label,
  keywords,
  onClick,
}: {
  label: string;
  keywords: string[];
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`${PILL} text-center transition hover:bg-black hover:text-white w-64 h-24 flex flex-col items-center justify-center`}
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

function PriorityTabs({ onOpen }: { onOpen: (k: PriorityKey) => void }) {
  return (
    <div className="flex flex-wrap justify-center gap-4 w-full max-w-[980px] mx-auto">
      {PRIORITY.map((p) => (
        <PillTab
          key={p.key}
          label={p.label}
          keywords={KEYWORDS[p.key]}
          onClick={() => onOpen(p.key)}
        />
      ))}
    </div>
  );
}

// ----------------------
// Collab modal (only name/email)
// ----------------------
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
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(
    null
  );

  const fieldInput = `${CARD} px-3 py-2 w-full`;

  if (!open || !data) return null;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);

    const formEl = e.currentTarget; // capture before await
    const form = new FormData(formEl);

    const name = String(form.get("name") || "");
    const email = String(form.get("email") || "");
    if (!name || !email || !open) {
      setMsg({ type: "err", text: "Please add your name and email." });
      return;
    }

    const projectName =
      PRIORITY.find((p) => p.key === open)?.label ?? "Priority Project";
    const req = REQUIREMENTS[open];

    const payload = {
      kind: "collab" as const,
      priorityKey: open,
      // same keys as job offer:
      name,
      email,
      projectName,
      industry: req.industryDefault,
      budget: req.budget,
      timeline: req.timeline,
      country: req.country,
      projectType: req.projectTypeDefault,
      brief: req.scope,
      // optional helpful context:
      requirementSnapshot: {
        timeline: req.timeline,
        budget: req.budget,
        country: req.country,
        scope: req.scope,
        industryDefault: req.industryDefault,
        projectTypeDefault: req.projectTypeDefault,
      },
    };

    try {
      setLoading(true);
      await postOffer(payload);
      setLoading(false);
      setMsg({
        type: "ok",
        text: "Thanks! Your collab request was submitted successfully.",
      });
      formEl.reset(); // safe: using captured element
    } catch {
      setLoading(false);
      setMsg({ type: "err", text: "Failed to submit. Please try again." });
    }
  }

  return (
    <Modal title={`${title} — Requirements`} onClose={onClose}>
      <div className="grid md:grid-cols-3 gap-4">
        <StatCard label="timeline" value={data.timeline} />
        <StatCard label="budget" value={data.budget} />
        <StatCard label="country" value={data.country} />
      </div>
      <div>
        <div className="uppercase text-[10px] opacity-70">Scope</div>
        <p className="mt-1">{data.scope}</p>
      </div>

      <form className="grid md:grid-cols-2 gap-3 mt-3" onSubmit={onSubmit}>
        <label className="grid gap-1">
          <span className="text-xs uppercase opacity-70">Name</span>
          <Input name="name" className={fieldInput} placeholder="Full name" />
        </label>
        <label className="grid gap-1">
          <span className="text-xs uppercase opacity-70">Email</span>
          <Input
            name="email"
            className={fieldInput}
            placeholder="name@email.com"
            type="email"
          />
        </label>

        {msg && (
          <div className="md:col-span-2">
            <div
              className={`${CARD} px-4 py-3 text-sm ${
                msg.type === "ok" ? "bg-green-50" : "bg-red-50"
              }`}
            >
              {msg.text}
            </div>
          </div>
        )}

        <div className="md:col-span-2 flex justify-end gap-2">
          <Btn
            type="button"
            onClick={onClose}
            className={`${PILL} px-4 py-2 text-sm`}
          >
            Close
          </Btn>
          <Btn
            type="submit"
            className={`${PILL} px-4 py-2 text-sm`}
            disabled={loading}
          >
            {loading ? "Sending..." : "Start this project"}
          </Btn>
        </div>
      </form>
    </Modal>
  );
}

// ----------------------
// Job Inquiry (same as before)
// ----------------------
function InquiryForm() {
  const fieldInput = `${CARD} px-3 py-2 w-full`;
  const fieldSelect = `${CARD} px-3 py-2 w-full bg-white`;
  const fieldTextArea = `${CARD} px-3 py-2 min-h-[140px] w-full`;

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(
    null
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    setMsg(null);
    const form = new FormData(formEl);

    const payload = {
      kind: "job",
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      projectName: String(form.get("projectName") || ""),
      industry: String(form.get("industry") || ""),
      budget: String(form.get("budget") || ""),
      timeline: String(form.get("timeline") || ""),
      country: String(form.get("country") || ""),
      projectType: String(form.get("projectType") || ""),
      brief: String(form.get("brief") || ""),
    };

    try {
      setLoading(true);
      await postOffer(payload);
      setLoading(false);
      setMsg({
        type: "ok",
        text: "Thanks! Your job offer was submitted successfully.",
      });
      formEl.reset();
    } catch {
      setLoading(false);
      setMsg({ type: "err", text: "Failed to submit. Please try again." });
    }
  }

  return (
    <form
      className="grid md:grid-cols-2 gap-4 w-full max-w-2xl"
      onSubmit={onSubmit}
    >
      <Field label="Your name">
        <Input
          className={fieldInput}
          placeholder="Full name"
          name="name"
          required
        />
      </Field>
      <Field label="Email">
        <Input
          className={fieldInput}
          placeholder="name@email.com"
          name="email"
          type="email"
          required
        />
      </Field>
      <Field className="md:col-span-2" label="Project name">
        <Input
          className={fieldInput}
          placeholder="e.g., Glowz"
          name="projectName"
          required
        />
      </Field>
      <Field label="Industry">
        <Input
          className={fieldInput}
          placeholder="e.g., Beauty / F&B"
          name="industry"
        />
      </Field>
      <Field label="Budget (USD)">
        <Select className={fieldSelect} name="budget">
          <option>5k-8k</option>
          <option>8k-12k</option>
          <option>12k-20k</option>
          <option>20k+</option>
        </Select>
      </Field>
      <Field label="Timeline">
        <Select className={fieldSelect} name="timeline">
          <option>4-6 weeks</option>
          <option>6-8 weeks</option>
          <option>8-12 weeks</option>
          <option>Flexible</option>
        </Select>
      </Field>
      <Field label="Country">
        <Input className={fieldInput} placeholder="e.g., UAE" name="country" />
      </Field>
      <Field className="md:col-span-2" label="Project type">
        <Select className={fieldSelect} name="projectType">
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
          name="brief"
        />
      </Field>

      {msg && (
        <div className="md:col-span-2">
          <div
            className={`${CARD} px-4 py-3 text-sm ${
              msg.type === "ok" ? "bg-green-50" : "bg-red-50"
            }`}
          >
            {msg.text}
          </div>
        </div>
      )}

      <div className="md:col-span-2 flex justify-center">
        <Btn
          type="submit"
          className={`${PILL} px-5 py-2 text-sm`}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send inquiry"}
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
    <main className="py-12">
      <CenteredSection>
        <SectionTitle>Priority Projects</SectionTitle>
        <p className="mt-4 mb-8 text-sm opacity-80 text-center">
          Pre-defined scope with clear timelines & budgets. Pick one to see
          requirements.
        </p>

        <div className="flex justify-center">
          <PriorityTabs onOpen={setOpen} />
        </div>
        <RequirementModal open={open} onClose={() => setOpen(null)} />

        <div className="my-12 mx-auto h-0 w-full max-w-6xl border-t-2 border-black" />

        <SectionTitle>Project Inquiry</SectionTitle>
        <div className="mt-4 flex justify-center">
          <InquiryForm />
        </div>
      </CenteredSection>
    </main>
  );
}
