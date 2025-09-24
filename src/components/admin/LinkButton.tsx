"use client";

import * as React from "react";
import Link from "next/link";

type Variant = "solid" | "outline";

export interface LinkButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: Variant;
}

/**
 * A link styled as a button.
 */
export function LinkButton({
  href,
  children,
  className,
  variant = "solid",
}: LinkButtonProps) {
  const base =
    "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black disabled:opacity-50";
  const variants: Record<Variant, string> = {
    solid: "bg-black text-white hover:opacity-90",
    outline: "border border-black text-black hover:bg-black hover:text-white",
  };

  return (
    <Link
      href={href}
      className={`${base} ${variants[variant]} ${className ?? ""}`}
    >
      {children}
    </Link>
  );
}
