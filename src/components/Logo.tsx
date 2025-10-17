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
import { useRef, PointerEvent as ReactPointerEvent } from "react";

// Idle levitation for a touch of life
const levitateIdle = { y: [0, -3, 0, 3, 0] };

const borderVariants: Variants = { idle: { rotate: 0 } };
const shadowVariants: Variants = {
  idle: { opacity: 0.22, scaleX: 0.9, filter: "blur(6px)" },
};

const shineKeyframes = { x: ["-150%", "150%"] };
const glowIdle = { scale: [1, 1.05, 1], opacity: [0.18, 0.32, 0.18] };

export default function Logo() {
  const reduceMotion = useReducedMotion();

  // Pointer area
  const areaRef = useRef<HTMLDivElement>(null);

  // Normalized pointer position in range [-0.5, 0.5]
  const mvX = useMotionValue<number>(0);
  const mvY = useMotionValue<number>(0);

  // Group glide (whole block follows the mouse)
  const MAX_OFFSET = 16;
  const groupTx = useSpring(useTransform(mvX, [-0.5, 0.5], [-MAX_OFFSET, MAX_OFFSET]), {
    stiffness: 160,
    damping: 20,
    mass: 0.4,
  });
  const groupTy = useSpring(useTransform(mvY, [-0.5, 0.5], [-MAX_OFFSET, MAX_OFFSET]), {
    stiffness: 160,
    damping: 20,
    mass: 0.4,
  });

  // Pressed-from-behind tilt (applied to the whole group)
  const TILT = 10;
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

  // Distance from center → slight push back (Z)
  const dist: MotionValue<number> = useTransform(
    [mvX, mvY] as MotionValue<number>[],
    (v: number[]) => {
      const x = v[0] ?? 0;
      const y = v[1] ?? 0;
      return Math.min(Math.hypot(x, y), Math.SQRT1_2); // cap for stability
    }
  );
  const translateZ = useSpring(useTransform(dist, [0, Math.SQRT1_2], [0, -40]), {
    stiffness: 200,
    damping: 22,
  });

  // Pointer mapping for the area
  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!areaRef.current) return;
    const rect = areaRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0..1
    const py = (e.clientY - rect.top) / rect.height; // 0..1
    const nx = Math.max(-0.5, Math.min(px - 0.5, 0.5));
    const ny = Math.max(-0.5, Math.min(py - 0.5, 0.5));
    mvX.set(nx);
    mvY.set(ny);
  };
  const handlePointerLeave = () => {
    mvX.set(0);
    mvY.set(0);
  };

  return (
    // Pointer area (sets perspective so 3D reads on the whole group)
    <div
      ref={areaRef}
      className="relative inline-block select-none"
      style={{ perspective: 900, transformStyle: "preserve-3d", touchAction: "none" }}
      onPointerMove={reduceMotion ? undefined : handlePointerMove}
      onPointerLeave={reduceMotion ? undefined : handlePointerLeave}
      onPointerDown={(e) => (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)}
      onPointerUp={(e) => (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId)}
    >
      {/* === EVERYTHING MOVES IN COORDINATION INSIDE THIS GROUP === */}
      <motion.div
        className="relative will-change-transform"
        animate={reduceMotion ? undefined : levitateIdle}
        transition={
          reduceMotion ? undefined : { duration: 3.2, ease: "easeInOut", repeat: Infinity }
        }
        style={
          reduceMotion
            ? undefined
            : {
                // group glide
                translateX: groupTx,
                translateY: groupTy,
                // pressed tilt + z push
                rotateX: rotX,
                rotateY: rotY,
                translateZ: translateZ,
                transformStyle: "preserve-3d",
              }
        }
        whileHover={reduceMotion ? undefined : { scale: 1.02 }}
      >
        {/* BACKGROUND GLOW (moves with group) */}
        <motion.div
          aria-hidden
          className="absolute -inset-16 md:-inset-24 -z-10 blur-2xl"
          style={{
            background:
              "radial-gradient(65% 65% at 50% 50%, rgba(255,255,255,0.22) 0%, rgba(180,180,180,0.12) 40%, rgba(0,0,0,0) 70%)",
          }}
          animate={reduceMotion ? undefined : glowIdle}
          transition={
            reduceMotion ? undefined : { duration: 3.0, ease: "easeInOut", repeat: Infinity }
          }
        />

        {/* BORDER (moves with group) */}
        <motion.div
          aria-hidden
          variants={borderVariants}
          animate="idle"
          className="absolute -inset-[2px]"
          style={{
            background:
              "conic-gradient(from 0deg, #000 0%, #999 25%, #fff 50%, #999 75%, #000 100%)",
            WebkitMask:
              "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            padding: 2,
          }}
        />

        {/* CARD (content lives here, but no separate tilt — group handles it) */}
        <div
          className="relative bg-gradient-to-b from-neutral-900 to-neutral-800 p-3 md:p-4"
          style={{
            boxShadow:
              "inset 0 0 0 1px rgba(255,255,255,0.08), 0 6px 18px rgba(0,0,0,0.35)",
            transformStyle: "preserve-3d",
          }}
        >
          {/* LOGO IMAGE */}
          <div
            className="relative overflow-hidden  bg-neutral-900 ring-1 ring-white/10"
            style={{ transform: "translateZ(1px)" }} // tiny parallax forward (optional)
          >
            <div className="absolute inset-0 mix-blend-luminosity pointer-events-none" />
            <Image
              src="/images/common/logo.jpg"
              alt="Stuff by Aymen — Logo"
              width={884}
              height={343}
              className="block w-40 md:w-56 h-auto grayscale contrast-125"
              priority
            />

            {/* SHINE SWEEP */}
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

        {/* GLASS OVERLAY + OUTER RING (move with group) */}
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
    </div>
  );
}
