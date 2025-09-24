// app/components/PageTransition.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200); // how long to show
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative min-h-screen">
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loader"
            initial={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.8, ease: [0.77, 0, 0.18, 1] }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black text-white"
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="text-2xl font-semibold tracking-wide"
            >
              Loading…
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
