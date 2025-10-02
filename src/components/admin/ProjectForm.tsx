"use client";
import { useMemo, useState } from "react";
import { useForm, type DeepPartial } from "react-hook-form";
import Upload from "./Upload";
import type { ProjectDoc } from "@/lib/types/project";
import type {  MediaItem } from "@/lib/types/common";
import { firestore } from "@/lib/firebase/client";
import { doc, setDoc } from "firebase/firestore";

type Props = {
  id?: string;
  initial?: Partial<ProjectDoc>;
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\- ]+/g, "") // remove non-word chars except space/hyphen
    .replace(/\s+/g, "-");
}

export default function ProjectForm({ id, initial }: Props) {
  const defaultValues = useMemo<DeepPartial<ProjectDoc>>(
    () => ({
      title: "",
      slug: "",
      year: new Date().getFullYear(),
      tags: [],
      industry: "",
      tagline: "",
      brief: "",
      heroUrl: "",
      gallery: [],
      published: false,
      ...(initial ?? {}),
    }),
    [initial]
  );

  const { register, handleSubmit, setValue, watch } = useForm<ProjectDoc>({
    defaultValues,
  });

  const [saving, setSaving] = useState(false);

  const gallery: MediaItem[] = watch("gallery") ?? [];
  const tagsFromInitial = (initial?.tags ?? []).join(", ");

  const onSubmit = async (data: ProjectDoc) => {
    setSaving(true);
    const _id = id || data.slug || slugify(data.title);

    const payload: ProjectDoc = {
      ...data,
      createdAt: initial?.createdAt ?? Date.now(),
      updatedAt: Date.now(),
    };

    await setDoc(doc(firestore, "projects", _id), payload, { merge: true });
    setSaving(false);
    alert("Saved");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
      <div className="grid md:grid-cols-3 gap-3">
        <div className="grid gap-1">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            className="border rounded px-2 py-1"
            {...register("title", { required: true })}
          />
        </div>
        <div className="grid gap-1">
          <label htmlFor="slug">Slug</label>
          <input
            id="slug"
            className="border rounded px-2 py-1"
            {...register("slug", { required: true })}
          />
        </div>
        <div className="grid gap-1">
          <label htmlFor="year">Year</label>
          <input
            id="year"
            type="number"
            className="border rounded px-2 py-1"
            {...register("year", { valueAsNumber: true })}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        <div className="grid gap-1">
          <label htmlFor="industry">Industry</label>
          <input
            id="industry"
            className="border rounded px-2 py-1"
            {...register("industry")}
          />
        </div>
        <div className="grid gap-1">
          <label htmlFor="tags">Tags (comma)</label>
          <input
            id="tags"
            className="border rounded px-2 py-1"
            onChange={(e) => {
              const parsed = e.currentTarget.value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);
              setValue("tags", parsed);
            }}
            defaultValue={tagsFromInitial}
          />
        </div>
        <div className="grid gap-1">
          <label htmlFor="published" className="flex items-center gap-2">
            <input id="published" type="checkbox" {...register("published")} />
            <span>Published</span>
          </label>
        </div>
      </div>

      <div className="grid gap-1">
        <label htmlFor="tagline">Tagline</label>
        <input
          id="tagline"
          className="border rounded px-2 py-1"
          {...register("tagline")}
        />
      </div>

      <div className="grid gap-1">
        <label htmlFor="brief">Brief</label>
        <textarea
          id="brief"
          className="border rounded px-2 py-1 min-h-[100px]"
          {...register("brief")}
        />
      </div>

      <div className="grid gap-1">
        <label htmlFor="heroUrl">Hero</label>
        <div className="flex items-center gap-3">
          <input
            id="heroUrl"
            className="border rounded px-2 py-1 flex-1"
            {...register("heroUrl")}
          />
          <Upload onUploaded={(url) => setValue("heroUrl", url)} />
        </div>
      </div>

      <div className="grid gap-2">
        <label>Gallery</label>
        <div className="grid gap-2">
          {gallery.map((m, i) => (
            <div key={i} className="flex items-center gap-2">
              <select
                aria-label={`Gallery item ${i + 1} type`}
                value={m.type}
                onChange={(e) => {
                  const g: MediaItem[] = [...gallery];
                  g[i] = {
                    ...g[i],
                    type: e.currentTarget.value as MediaItem["type"],
                  };
                  setValue("gallery", g);
                }}
                className="border rounded px-2 py-1"
              >
                <option value="image">image</option>
                <option value="video">video</option>
              </select>
              <input
                aria-label={`Gallery item ${i + 1} URL`}
                value={m.url}
                onChange={(e) => {
                  const g: MediaItem[] = [...gallery];
                  g[i] = { ...g[i], url: e.currentTarget.value };
                  setValue("gallery", g);
                }}
                placeholder={
                  m.type === "video" ? "https://…" : "/path/or/https://…"
                }
                className="border rounded px-2 py-1 flex-1"
              />
              <input
                aria-label={`Gallery item ${i + 1} alt text`}
                value={m.alt ?? ""}
                onChange={(e) => {
                  const g: MediaItem[] = [...gallery];
                  g[i] = { ...g[i], alt: e.currentTarget.value || undefined };
                  setValue("gallery", g);
                }}
                placeholder="Alt (optional)"
                className="border rounded px-2 py-1 w-56"
              />
              <button
                type="button"
                onClick={() => {
                  const g: MediaItem[] = gallery.filter((_, ix) => ix !== i);
                  setValue("gallery", g);
                }}
                className="text-sm underline"
              >
                remove
              </button>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="border rounded px-2 py-1"
              onClick={() =>
                setValue("gallery", [
                  ...gallery,
                  { type: "image", url: "" } as MediaItem,
                ])
              }
            >
              + Add
            </button>
            <Upload
              onUploaded={(url) =>
                setValue("gallery", [
                  ...gallery,
                  { type: "image", url } as MediaItem,
                ])
              }
            />
          </div>
        </div>
      </div>

      <div>
        <button
          className="rounded-full border-2 border-black px-4 py-2"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
