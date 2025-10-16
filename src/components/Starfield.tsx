"use client";
import * as React from "react";
import { useReducedMotion } from "framer-motion";

type Props = { density?: number };
export default function Starfield({ density = 0.0006 }: Props) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const rafRef = React.useRef<number | null>(null);
  const reduceMotion = useReducedMotion();

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const sizeCanvas = () => {
      const w = Math.floor(window.innerWidth * dpr);
      const h = Math.floor(window.innerHeight * dpr);
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    sizeCanvas();
    const onResize = () => sizeCanvas();
    window.addEventListener("resize", onResize);

    type Star = {
      x: number;
      y: number;
      r: number;
      vx: number;
      vy: number;
      a: number;
      tw: number;
      shape: 0 | 1;
    };
    const targetCount = Math.max(
      40,
      Math.floor(window.innerWidth * window.innerHeight * density * 0.15)
    );
    const stars: Star[] = Array.from({ length: targetCount }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.4 + 0.3,
      vx: (Math.random() - 0.5) * 0.05,
      vy: (Math.random() - 0.5) * 0.05,
      a: Math.random() * Math.PI * 2,
      tw: 0.008 + Math.random() * 0.01,
      shape: Math.random() < 0.2 ? 1 : 0,
    }));

    const step = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (const s of stars) {
        s.a += s.tw;
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < -10) s.x = window.innerWidth + 10;
        if (s.x > window.innerWidth + 10) s.x = -10;
        if (s.y < -10) s.y = window.innerHeight + 10;
        if (s.y > window.innerHeight + 10) s.y = -10;
        const alpha = reduceMotion ? 0.5 : 0.4 + 0.6 * Math.abs(Math.sin(s.a));
        ctx.globalAlpha = alpha;
        if (s.shape === 0) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fillStyle = "white";
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.moveTo(s.x, s.y - s.r);
          ctx.lineTo(s.x + s.r, s.y);
          ctx.lineTo(s.x, s.y + s.r);
          ctx.lineTo(s.x - s.r, s.y);
          ctx.closePath();
          ctx.fillStyle = "white";
          ctx.fill();
        }
      }
      ctx.restore();
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      window.removeEventListener("resize", onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [density, reduceMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}
