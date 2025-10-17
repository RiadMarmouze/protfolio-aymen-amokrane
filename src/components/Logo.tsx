"use client";

import {
  motion,
  Variants,
  useReducedMotion,
  useMotionValue,
  useTransform,
  useSpring,
  type MotionValue,
} from "framer-motion";
import Image from "next/image";
import { useRef, useEffect } from "react";

// === CONFIG (EASY TO TWEAK) ===
// Default responsive settings
const CONFIG = {
  image: {
    width: { base: 220, md: 320, lg: 420 },
    height: { base: 80, md: 120, lg: 160 },
  },
  margin: { base: 6, md: 8, lg: 12 },
  borderWidth: { base: 1.5, md: 2, lg: 3 },
};

// === MOTION VARIANTS ===
const levitateIdle = { y: [0, -3, 0, 3, 0] };
const borderVariants: Variants = { idle: { rotate: 0 } };
const shadowVariants: Variants = {
  idle: { opacity: 0.22, scaleX: 0.9, filter: "blur(6px)" },
};
const shineKeyframes = { x: ["-150%", "150%"] };
const glowIdle = { scale: [1, 1.05, 1], opacity: [0.18, 0.32, 0.18] };

// === COMPONENT ===
export default function Logo({
  imageConfig = CONFIG.image,
  marginConfig = CONFIG.margin,
  borderConfig = CONFIG.borderWidth,
}: {
  imageConfig?: typeof CONFIG.image;
  marginConfig?: typeof CONFIG.margin;
  borderConfig?: typeof CONFIG.borderWidth;
}) {
  const reduceMotion = useReducedMotion();
  const areaRef = useRef<HTMLDivElement>(null);

  // Motion values
  const mvX = useMotionValue<number>(0);
  const mvY = useMotionValue<number>(0);

  // Motion springs
  const MAX_OFFSET = 16;
  const TILT = 10;
  const groupTx = useSpring(
    useTransform(mvX, [-0.5, 0.5], [-MAX_OFFSET, MAX_OFFSET]),
    {
      stiffness: 160,
      damping: 20,
      mass: 0.4,
    }
  );
  const groupTy = useSpring(
    useTransform(mvY, [-0.5, 0.5], [-MAX_OFFSET, MAX_OFFSET]),
    {
      stiffness: 160,
      damping: 20,
      mass: 0.4,
    }
  );
  const rotX = useSpring(useTransform(mvY, [-0.5, 0.5], [-TILT, TILT]), {
    stiffness: 220,
    damping: 20,
    mass: 0.3,
  });
  const rotY = useSpring(useTransform(mvX, [-0.5, 0.5], [TILT, -TILT]), {
    stiffness: 220,
    damping: 20,
    mass: 0.3,
  });
  const dist: MotionValue<number> = useTransform([mvX, mvY], (v: number[]) => {
    const x = v[0] ?? 0;
    const y = v[1] ?? 0;
    return Math.min(Math.hypot(x, y), Math.SQRT1_2);
  });
  const translateZ = useSpring(
    useTransform(dist, [0, Math.SQRT1_2], [0, -40]),
    {
      stiffness: 200,
      damping: 22,
    }
  );

  // Pointer handling
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!areaRef.current) return;
    const rect = areaRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const nx = Math.max(-0.5, Math.min(px - 0.5, 0.5));
    const ny = Math.max(-0.5, Math.min(py - 0.5, 0.5));
    mvX.set(nx);
    mvY.set(ny);
  };
  const handlePointerLeave = () => {
    mvX.set(0);
    mvY.set(0);
  };

  // === Set CSS Variables for Responsiveness ===
  useEffect(() => {
    const root = document.documentElement;
    const setVar = (name: string, values: Record<string, number>) => {
      root.style.setProperty(`--${name}-base`, `${values.base}px`);
      root.style.setProperty(`--${name}-md`, `${values.md}px`);
      root.style.setProperty(`--${name}-lg`, `${values.lg}px`);
    };
    setVar("image-width", imageConfig.width);
    setVar("image-height", imageConfig.height);
    setVar("image-margin", marginConfig);
    setVar("border-width", borderConfig);
  }, [imageConfig, marginConfig, borderConfig]);

  return (
    <div
      ref={areaRef}
      className="relative inline-block select-none"
      style={{
        perspective: 900,
        transformStyle: "preserve-3d",
        touchAction: "none",
      }}
      onPointerMove={reduceMotion ? undefined : handlePointerMove}
      onPointerLeave={reduceMotion ? undefined : handlePointerLeave}
    >
      <motion.div
        className="relative will-change-transform"
        animate={reduceMotion ? undefined : levitateIdle}
        transition={
          reduceMotion
            ? undefined
            : { duration: 3.2, ease: "easeInOut", repeat: Infinity }
        }
        style={
          reduceMotion
            ? undefined
            : {
                translateX: groupTx,
                translateY: groupTy,
                rotateX: rotX,
                rotateY: rotY,
                translateZ: translateZ,
                transformStyle: "preserve-3d",
              }
        }
        whileHover={reduceMotion ? undefined : { scale: 1.02 }}
      >
        {/* GLOW */}
        <motion.div
          aria-hidden
          className="absolute -inset-16 md:-inset-24 -z-10 blur-2xl"
          style={{
            background:
              "radial-gradient(65% 65% at 50% 50%, rgba(255,255,255,0.22) 0%, rgba(180,180,180,0.12) 40%, rgba(0,0,0,0) 70%)",
          }}
          animate={reduceMotion ? undefined : glowIdle}
          transition={
            reduceMotion
              ? undefined
              : { duration: 3.0, ease: "easeInOut", repeat: Infinity }
          }
        />

        {/* BORDER */}
        <motion.div
          aria-hidden
          variants={borderVariants}
          animate="idle"
          className="absolute inset-0"
          style={{
            padding: "var(--border-width-base)",
            background:
              "conic-gradient(from 0deg, #000 0%, #999 25%, #fff 50%, #999 75%, #000 100%)",
            WebkitMask:
              "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />

        {/* CARD */}
        <div
          className="relative bg-gradient-to-b from-neutral-900 to-neutral-800"
          style={{
            padding: "var(--image-margin-base)",
            boxShadow:
              "inset 0 0 0 1px rgba(255,255,255,0.08), 0 6px 18px rgba(0,0,0,0.35)",
            transformStyle: "preserve-3d",
          }}
        >
          {/* IMAGE */}
          <div
            className="relative overflow-hidden bg-neutral-900 ring-1 ring-white/10"
            style={{ transform: "translateZ(1px)" }}
          >
            <div className="absolute inset-0 mix-blend-luminosity pointer-events-none" />
            <Image
              src="/images/common/logo.jpg"
              alt="Logo"
              width={imageConfig.width.base}
              height={imageConfig.height.base}
              className="block h-auto grayscale contrast-125"
              priority
            />

            {!reduceMotion && (
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(105deg, rgba(255,255,255,0) 15%, rgba(255,255,255,0.12) 35%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0.12) 65%, rgba(255,255,255,0) 85%)",
                  transform: "skewX(-10deg)",
                }}
                animate={{ ...shineKeyframes }}
                transition={{
                  duration: 2.8,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatDelay: 2.2,
                }}
              />
            )}
          </div>

          {/* SHADOW */}
          <motion.div
            variants={shadowVariants}
            animate="idle"
            className="absolute left-1/2 -translate-x-1/2 -bottom-2 h-2 rounded-full bg-white/25 blur-md"
            style={{ width: "60%" }}
            aria-hidden
          />
        </div>

        {/* GLASS + OUTLINE */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0.22), rgba(255,255,255,0) 30%)",
            mixBlendMode: "screen",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 ring-1 ring-white/10"
        />
      </motion.div>

      {/* RESPONSIVE OVERRIDES */}
      <style jsx>{`
        @media (min-width: 768px) {
          div[style*="--image-width"] {
            --image-width-base: var(--image-width-md);
            --image-height-base: var(--image-height-md);
            --image-margin-base: var(--image-margin-md);
            --border-width-base: var(--border-width-md);
          }
        }
        @media (min-width: 1024px) {
          div[style*="--image-width"] {
            --image-width-base: var(--image-width-lg);
            --image-height-base: var(--image-height-lg);
            --image-margin-base: var(--image-margin-lg);
            --border-width-base: var(--border-width-lg);
          }
        }
      `}</style>
    </div>
  );
}
