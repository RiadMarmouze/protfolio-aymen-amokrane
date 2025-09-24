"use client";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
const EditorOverlay = dynamic(() => import("./Overlay"), { ssr: false });
export default function MaybeEditorOverlay() {
  const sp = useSearchParams();
  const enabled = sp.get("edit") === "1";
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    if (!enabled) return;
    (async () => {
      try {
        const r = await fetch("/api/admin/status", { cache: "no-store" });
        const { isAdmin } = await r.json();
        setAllowed(!!isAdmin);
      } catch {
        setAllowed(false);
      }
    })();
  }, [enabled]);
  if (!enabled || !allowed) return null;
  return <EditorOverlay />;
}
