"use client";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { getSiteSettings, saveSiteSettings } from "@/lib/site-client";
import { firestore } from "@/lib/firebase/client";
import { collection, getDocs } from "firebase/firestore";
import { Save, Eye } from "lucide-react";
type Panel = "home" | "about" | "work";
export default function EditorOverlay() {
  const pathname = usePathname();
  const panel: Panel = useMemo(() => {
    if (pathname.startsWith("/work")) return "work";
    if (pathname.startsWith("/about")) return "about";
    return "home";
  }, [pathname]);
  const [open, setOpen] = useState(true);
  const [settings, setSettings] = useState<any>(null);
  const [projects, setProjects] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    getSiteSettings().then(setSettings);
    (async () => {
      try {
        const snap = await getDocs(collection(firestore, "projects"));
        setProjects(snap.docs.map((d) => d.id));
      } catch {}
    })();
  }, []);
  async function save() {
    setSaving(true);
    await saveSiteSettings(settings);
    setSaving(false);
  }
  if (!settings) return null;
  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      <div className="absolute right-4 top-[calc(var(--nav-h,64px)+16px)] pointer-events-auto w-[340px] bg-white border-2 border-black rounded-xl shadow-lg overflow-hidden">
        <div className="px-3 py-2 bg-black text-white flex items-center justify-between">
          <div className="font-medium">Page Editor</div>
          <button
            onClick={() => setOpen((o) => !o)}
            className="rounded-full border-2 border-white/40 px-2 py-1 text-xs"
          >
            {open ? "Hide" : "Show"}
          </button>
        </div>
        {open && (
          <div className="p-3 grid gap-4 max-h-[70vh] overflow-auto">
            {panel === "home" && (
              <div className="grid gap-2">
                <div className="text-sm font-semibold">Hero</div>
                <label className="text-xs">Headline</label>
                <input
                  className="border rounded px-2 py-1"
                  value={settings.home?.heroHeadline || ""}
                  onChange={(e) =>
                    setSettings((s: any) => ({
                      ...s,
                      home: { ...(s.home || {}), heroHeadline: e.target.value },
                    }))
                  }
                />
                <label className="text-xs">Subline</label>
                <input
                  className="border rounded px-2 py-1"
                  value={settings.home?.heroSubline || ""}
                  onChange={(e) =>
                    setSettings((s: any) => ({
                      ...s,
                      home: { ...(s.home || {}), heroSubline: e.target.value },
                    }))
                  }
                />
                <label className="text-xs">CTA Label</label>
                <input
                  className="border rounded px-2 py-1"
                  value={settings.home?.heroCta?.label || ""}
                  onChange={(e) =>
                    setSettings((s: any) => ({
                      ...s,
                      home: {
                        ...(s.home || {}),
                        heroCta: {
                          ...(s.home?.heroCta || {}),
                          label: e.target.value,
                        },
                      },
                    }))
                  }
                />
                <label className="text-xs">CTA Href</label>
                <input
                  className="border rounded px-2 py-1"
                  value={settings.home?.heroCta?.href || ""}
                  onChange={(e) =>
                    setSettings((s: any) => ({
                      ...s,
                      home: {
                        ...(s.home || {}),
                        heroCta: {
                          ...(s.home?.heroCta || {}),
                          href: e.target.value,
                        },
                      },
                    }))
                  }
                />
                <div className="h-[1px] bg-black/10 my-2" />
                <div className="text-sm font-semibold">Featured Project</div>
                <select
                  className="border rounded px-2 py-1"
                  value={settings.featuredProjectId || ""}
                  onChange={(e) =>
                    setSettings((s: any) => ({
                      ...s,
                      featuredProjectId: e.target.value,
                    }))
                  }
                >
                  <option value="">(none)</option>
                  {projects.map((id) => (
                    <option key={id} value={id}>
                      {id}
                    </option>
                  ))}
                </select>
                <label className="text-xs">Featured Tagline</label>
                <input
                  className="border rounded px-2 py-1"
                  value={settings.home?.featuredTagline || ""}
                  onChange={(e) =>
                    setSettings((s: any) => ({
                      ...s,
                      home: {
                        ...(s.home || {}),
                        featuredTagline: e.target.value,
                      },
                    }))
                  }
                />
                <label className="text-xs">Clients (comma)</label>
                <input
                  className="border rounded px-2 py-1"
                  value={(settings.home?.clients || []).join(", ")}
                  onChange={(e) =>
                    setSettings((s: any) => ({
                      ...s,
                      home: {
                        ...(s.home || {}),
                        clients: e.target.value
                          .split(",")
                          .map((x: string) => x.trim())
                          .filter(Boolean),
                      },
                    }))
                  }
                />
              </div>
            )}
            {panel === "about" && (
              <div className="grid gap-2">
                <div className="text-sm font-semibold">About</div>
                <label className="text-xs">Bio</label>
                <textarea
                  className="border rounded px-2 py-1 min-h-[120px]"
                  value={settings.about?.bio || ""}
                  onChange={(e) =>
                    setSettings((s: any) => ({
                      ...s,
                      about: { ...(s.about || {}), bio: e.target.value },
                    }))
                  }
                />
              </div>
            )}
            {panel === "work" && (
              <div className="grid gap-2">
                <div className="text-sm font-semibold">Categories</div>
                <input
                  className="border rounded px-2 py-1"
                  value={(settings.categories || []).join(", ")}
                  onChange={(e) =>
                    setSettings((s: any) => ({
                      ...s,
                      categories: e.target.value
                        .split(",")
                        .map((x: string) => x.trim())
                        .filter(Boolean),
                    }))
                  }
                />
              </div>
            )}
            <div className="flex items-center justify-between gap-2">
              <a
                href={
                  typeof window !== "undefined" ? window.location.pathname : "/"
                }
                className="text-sm underline inline-flex items-center gap-2"
              >
                <Eye size={14} />
                Refresh
              </a>
              <button
                onClick={save}
                disabled={saving}
                className="rounded-full border-2 border-black px-3 py-1.5 text-sm inline-flex items-center gap-2"
              >
                <Save size={14} />
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="absolute inset-0 border-2 border-dashed border-black/20 pointer-events-none" />
    </div>
  );
}
