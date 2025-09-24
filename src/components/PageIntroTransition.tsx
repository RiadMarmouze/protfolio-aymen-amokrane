"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";

type Props = {
  children: React.ReactNode;
  bgColor?: string;                       // overlay background color
  rectColor?: string;                     // rectangle fill
  rectSize?: { w: number; h: number };   // starting rectangle size
  duration?: number;                      // total ms until overlay hides
  shakeIntensity?: number;                // 0..8
  streakColor?: string;                   // override sweep color; auto if omitted
  streakAngleDeg?: number;                // sweep angle, default 135°
  streakWidthPct?: number;                // width of bright band (% of background size), default 18
};

function contrastStreak(rectColor: string) {
  const hex = rectColor.replace("#", "");
  const parse = (s: string) => parseInt(s, 16);
  let r = 255, g = 255, b = 255;
  if (hex.length === 3) {
    r = parse(hex[0] + hex[0]); g = parse(hex[1] + hex[1]); b = parse(hex[2] + hex[2]);
  } else if (hex.length === 6) {
    r = parse(hex.slice(0, 2)); g = parse(hex.slice(2, 4)); b = parse(hex.slice(4, 6));
  }
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.5 ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.55)";
}

export default function PageIntroTransition({
  children,
  bgColor = "#000000",
  rectColor = "#ffffff",
  rectSize = { w: 280, h: 170 },
  duration = 1900,
  shakeIntensity = 3,
  streakColor,
  streakAngleDeg = 135,  // smooth diagonal
  streakWidthPct = 18,   // band thickness
}: Props) {
  const [show, setShow] = useState(true);
  const box = useAnimation();
  const jitter = useAnimation();
  const content = useAnimation();
  const sweep = useAnimation();

  const streak = useMemo(
    () => streakColor ?? contrastStreak(rectColor),
    [rectColor, streakColor]
  );

  const clampShake = Math.max(0, Math.min(shakeIntensity, 8));
  const px = clampShake * 0.8;
  const deg = clampShake * 0.25;

  // Build a crisp, anti-aliased diagonal gradient.
  // We animate background-position from 150% -> -50% for the sweep.
  const gradientCSS = useMemo(() => {
    const band = streakWidthPct; // percent of the bg-size taken by the bright band
    const fade = Math.max(8, Math.floor(band * 0.9)); // soft shoulders around the band
    // Example stops: ...  ((50% - fade) transparent) -> (50% streak) -> ((50% + fade) transparent)
    return `linear-gradient(${streakAngleDeg}deg,
      rgba(0,0,0,0) 0%,
      rgba(0,0,0,0) ${50 - band - fade}%,
      ${streak} ${50 - band/2}%,
      ${streak} ${50 + band/2}%,
      rgba(0,0,0,0) ${50 + band + fade}%,
      rgba(0,0,0,0) 100%
    )`;
  }, [streak, streakAngleDeg, streakWidthPct]);

  useEffect(() => {
    (async () => {
      // 1) small & rounded
      await box.start({ scale: 1, borderRadius: 24, transition: { duration: 0.001 } });

      // 2) jitter
      if (clampShake > 0) {
        jitter.start({
          x: [0, -px, px, -px * 0.6, px * 0.6, 0],
          y: [0, px * 0.6, -px * 0.6, px * 0.4, -px * 0.4, 0],
          rotate: [0, -deg, deg, -deg * 0.6, deg * 0.6, 0],
          transition: { repeat: Infinity, duration: 0.44, ease: "easeInOut" },
        });
      }

      // 3) background-position sweep (GPU friendly)
      sweep.start({
        backgroundPositionX: ["150%", "-50%"],
        transition: { repeat: Infinity, duration: 0.9, ease: "easeInOut" },
      });

      // 4) expand + reveal halfway through
      const expandAt = duration * 0.5;
      const t1 = setTimeout(() => {
        jitter.start({ x: 0, y: 0, rotate: 0, transition: { duration: 0.18, ease: "easeOut" } });
        box.start({
          scale: 16,
          borderRadius: 0,
          transition: { type: "spring", stiffness: 180, damping: 18, mass: 0.9 },
        });
        content.start({ opacity: [0, 1], transition: { duration: 0.9, ease: "easeOut" } });
      }, expandAt);

      // 5) finish
      const t2 = setTimeout(() => setShow(false), duration);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    })();
  }, [box, jitter, content, sweep, duration, clampShake, px, deg]);

  return (
    <div className="relative min-h-screen">
      <AnimatePresence>
        {show && (
          <motion.div
            key="intro"
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            style={{ backgroundColor: bgColor }}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <motion.div animate={jitter} style={{ willChange: "transform" }}>
              {/* Rectangle with smooth diagonal sweep as background */}
              <motion.div
                animate={box}
                initial={{ scale: 0.95, borderRadius: 24 }}
                className="relative"
                style={{
                  width: rectSize.w,
                  height: rectSize.h,
                  background: rectColor,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
                  overflow: "hidden",
                  willChange: "transform,border-radius",
                }}
              >
                {/* The sweep layer uses gradient bg + background-position animation */}
                <motion.div
                  animate={sweep}
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    // Bigger background so the sweep has room to travel
                    backgroundImage: gradientCSS,
                    backgroundSize: "220% 220%",
                    backgroundRepeat: "no-repeat",
                    backgroundPositionX: "150%",
                    backgroundPositionY: "50%",
                    // Small blur helps anti-alias the band without muddying edges
                    filter: "blur(2px)",
                    // GPU hint
                    transform: "translateZ(0)",
                    willChange: "background-position",
                  }}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page content fades in during expansion */}
      <motion.div animate={content} initial={{ opacity: 0 }} className="relative z-10">
        {children}
      </motion.div>
    </div>
  );
}
