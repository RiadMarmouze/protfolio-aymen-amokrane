// app/login/page.tsx
"use client";

import { useEffect, useState } from "react";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase/client";

function getParam(name: string) {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get(name);
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const reason = getParam("reason");
    if (reason === "auth") setMessage("Please sign in to continue.");
    else if (reason === "expired")
      setMessage("Your session expired. Please sign in again.");
    else if (reason === "forbidden")
      setMessage("This account doesn’t have admin access.");
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) return;
      try {
        setLoading(true);
        const idToken = await u.getIdToken(true);
        const res = await fetch("/api/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        });

        if (!res.ok) {
          await signOut(auth); // break loops if server rejects
          setLoading(false);
          setMessage("Sign-in failed. Please try again.");
          return;
        }

        // ✅ Prefer the local ?next param, fall back to server or /admin
        const localNext = getParam("next");
        let redirectTo = localNext || "/admin";
        try {
          const json = await res.json();
          redirectTo = localNext || json.redirectTo || "/admin";
        } catch {}
        window.location.assign(redirectTo);
      } catch (e) {
        console.error(e);
        setLoading(false);
        setMessage("Something went wrong. Please try again.");
      }
    });
    return () => unsub();
  }, []);

  const doGoogle = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      console.error(e);
      setLoading(false);
      setMessage("Popup blocked or sign-in cancelled.");
    }
  };

  return (
    <main className="min-h-[100vh] grid place-items-center px-4">
      <div className="max-w-sm w-full border-2 border-black rounded-xl p-6">
        <div className="text-xl font-semibold">Sign in</div>
        <p className="text-sm opacity-80 mt-1">
          Use your Google account. Admins are redirected to the dashboard.
        </p>

        {message && (
          <p className="mt-3 text-sm p-2 border rounded bg-neutral-50">
            {message}
          </p>
        )}

        <div className="mt-6">
          <button
            onClick={doGoogle}
            disabled={loading}
            className="rounded-full border-2 border-black px-4 py-2 w-full disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in with Google"}
          </button>
        </div>
      </div>
    </main>
  );
}
