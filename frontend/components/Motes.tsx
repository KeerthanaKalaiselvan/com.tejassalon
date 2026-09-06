"use client";

import { useEffect, useRef } from "react";
import { useParallax, prefersReducedMotion } from "@/lib/motion";

/** Ambient gold motes drifting through the hero. Pauses when offscreen. */
export default function Motes({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const parallaxRef = useParallax<HTMLCanvasElement>(0.16);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c || prefersReducedMotion()) return;
    const x = c.getContext("2d");
    if (!x) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0,
      h = 0,
      run = false,
      t = 0,
      raf = 0;

    // one pre-rendered sprite beats a radial gradient per particle per frame
    const S = 64;
    const sprite = document.createElement("canvas");
    sprite.width = sprite.height = S;
    const sx = sprite.getContext("2d")!;
    const g = sx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
    g.addColorStop(0, "rgba(246,236,214,1)");
    g.addColorStop(0.4, "rgba(201,155,76,0.42)");
    g.addColorStop(1, "rgba(201,155,76,0)");
    sx.fillStyle = g;
    sx.fillRect(0, 0, S, S);

    type P = { x: number; y: number; r: number; a: number; vy: number; vx: number; ph: number; f: number };
    let ps: P[] = [];

    function size() {
      w = c!.clientWidth;
      h = c!.clientHeight;
      c!.width = Math.max(1, w * dpr);
      c!.height = Math.max(1, h * dpr);
      x!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function seed() {
      const N = window.innerWidth < 720 ? 14 : 28;
      ps = Array.from({ length: N }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 3 + Math.pow(Math.random(), 2.3) * 15,
        a: 0.06 + Math.random() * 0.2,
        vy: -(0.05 + Math.random() * 0.18),
        vx: (Math.random() - 0.5) * 0.08,
        ph: Math.random() * 6.283,
        f: 0.25 + Math.random() * 0.55,
      }));
    }
    function tick() {
      if (!run) return;
      t += 0.016;
      x!.clearRect(0, 0, w, h);
      for (const p of ps) {
        p.y += p.vy;
        p.x += p.vx + Math.sin(t * p.f + p.ph) * 0.1;
        if (p.y < -p.r * 2) {
          p.y = h + p.r * 2;
          p.x = Math.random() * w;
        }
        if (p.x < -p.r * 2) p.x = w + p.r * 2;
        else if (p.x > w + p.r * 2) p.x = -p.r * 2;
        x!.globalAlpha = p.a * (0.55 + 0.45 * Math.sin(t * p.f * 1.7 + p.ph));
        x!.drawImage(sprite, p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
      }
      x!.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    }

    size();
    seed();
    const onResize = () => {
      size();
      seed();
    };
    window.addEventListener("resize", onResize, { passive: true });

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !run) {
          run = true;
          raf = requestAnimationFrame(tick);
        } else if (!e.isIntersecting) {
          run = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 }
    );
    io.observe(c);

    return () => {
      run = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={(el) => {
        canvasRef.current = el;
        parallaxRef.current = el;
      }}
      className={`pointer-events-none will-change-transform ${className}`}
      aria-hidden="true"
    />
  );
}
