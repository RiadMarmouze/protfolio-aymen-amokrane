// components/admin/SeedProjectsButton.tsx
"use client";

import { useState } from "react";
import { firestore } from "@/lib/firebase/client";
import { writeBatch, doc, collection } from "firebase/firestore";
import type { ProjectDoc } from "@/lib/types/project";
import { projects } from "@/lib/data/projects";

export default function SeedProjectsButton() {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function seed() {
    setPending(true);
    setResult(null);

    try {
      const batch = writeBatch(firestore);

      // De-dupe by id just in case
      const seen = new Set<string>();
      const list: ProjectDoc[] = [];
      for (const p of projects) {
        if (!p.id || seen.has(p.id)) continue;
        seen.add(p.id);
        list.push(p);
      }

      for (const p of list) {
        const ref = doc(collection(firestore, "projects"), p.id);

        // Keep your provided timestamps if present; otherwise use now
        const createdAt =
          typeof p.createdAt === "number" ? p.createdAt : Date.now();
        const updatedAt =
          typeof p.updatedAt === "number" ? p.updatedAt : Date.now();

        batch.set(
          ref,
          {
            ...p,
            createdAt,
            updatedAt,
            published: p.published ?? true, // keep your sample default
          },
          { merge: true }
        );
      }

      await batch.commit();
      setResult(`Seeded ${list.length} project(s) successfully.`);
    } catch (err: any) {
      console.error("[SeedProjects] error:", err);
      setResult(err?.message ?? "Failed to seed projects.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={seed}
        disabled={pending}
        className="rounded-lg px-4 py-2 border hover:bg-muted disabled:opacity-50"
      >
        {pending ? "Seeding…" : "Seed projects → Firestore"}
      </button>
      {result && (
        <span className="text-sm text-muted-foreground">{result}</span>
      )}
    </div>
  );
}
