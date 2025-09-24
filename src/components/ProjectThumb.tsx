"use client";
import Link from "next/link";
import Placeholder from "./Placeholder";
import { cn } from "@/lib/utils";
import { ProjectDoc } from "@/lib/types";
export default function ProjectThumb({
  p,
  ratio = "square",
}: {
  p: ProjectDoc;
  ratio?: "square" | "1x1" | "2x1" | "3x1";
}) {
  const ratioClass =
    ratio === "3x1"
      ? "aspect-[3/1]"
      : ratio === "2x1"
      ? "aspect-[2/1]"
      : "aspect-square";
  return (
    <Link
      href={"/project/" + p.id}
      className="group relative rounded-[2px] overflow-hidden block"
    >
      <div className={cn("w-full", ratioClass)}>
        <Placeholder className="w-full h-full" />
      </div>
      <div className="absolute top-2 left-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
        {p.tags.map((t, ix) => (
          <span
            key={ix}
            className="rounded-full border-2 px-2 py-0.5 text-xs bg-white/90"
          >
            {t}
          </span>
        ))}
      </div>
      <div className="absolute inset-0 flex items-end p-3 opacity-0 group-hover:opacity-100 transition text-black">
        <div>
          <div className="text-xl md:text-2xl font-extrabold tracking-tight">
            {p.title}
          </div>
          <div className="text-xs md:text-sm opacity-80 mt-1">{p.tagline}</div>
        </div>
      </div>
    </Link>
  );
}
