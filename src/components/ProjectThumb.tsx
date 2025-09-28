"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { ProjectDoc } from "@/lib/types";

export default function ProjectThumb({
  p,
  ratio = "square",
}: {
  p: ProjectDoc;
  ratio?: "square" | "1x1" | "2x1" | "3x1";
}) {
  const [imgError, setImgError] = useState(false);

  const ratioClass =
    ratio === "3x1"
      ? "aspect-[3/1]"
      : ratio === "2x1"
      ? "aspect-[2/1]"
      : "aspect-square";

  return (
    <Link
      href={`/work/${p.id}`}
      className="group relative block overflow-hidden rounded-[2px]"
      aria-label={p.title}
    >
      <div className={cn("relative w-full", ratioClass)}>
        {/* If heroUrl loads fine, show it, else fallback gray block */}
        {!imgError && p.heroUrl ? (
          <Image
            src={p.heroUrl}
            alt={p.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-105"
            onError={() => setImgError(true)}
            priority={false}
          />
        ) : (
          <div className="w-full h-full bg-gray-200" />
        )}

        {/* Gradient overlay for readability */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/80 via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Tags (top-left) */}
        <div className="absolute top-2 left-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {p.tags.map((t, ix) => (
            <span
              key={ix}
              className="rounded-full border-2 border-black/10 px-2 py-0.5 text-xs bg-white/90 backdrop-blur"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Title + tagline (bottom) */}
        <div className="absolute inset-0 flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-black">
          <div className="max-w-[90%]">
            <div className="text-xl md:text-2xl font-extrabold tracking-tight line-clamp-2">
              {p.title}
            </div>
            <div className="text-xs md:text-sm opacity-80 mt-1 line-clamp-2">
              {p.tagline}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
