"use client";

import { useEffect, useRef } from "react";

export function prefersReducedMotion() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* ------------------------------------------------------------------
   Parallax: one shared scroll listener + one rAF for every layer.
   Each layer translates relative to the centre of its host section,
   so the effect is symmetric and never jumps on load.
------------------------------------------------------------------ */
type Layer = { el: HTMLElement; speed: number; last: number };

const layers = new Set<Layer>();
let ticking = false;
let bound = false;

function frame() {
  ticking = false;
  const vh = window.innerHeight;
  const damp = window.innerWidth < 720 ? 0.6 : 1;
  layers.forEach((l) => {
    const host = (l.el.closest("[data-parallax-host]") as HTMLElement) || l.el.parentElement;
    if (!host) return;
    const r = host.getBoundingClientRect();
    if (r.bottom < -240 || r.top > vh + 240) return; // offscreen: skip
    const y = -((r.top + r.height / 2) - vh / 2) * l.speed * damp;
    if (Math.abs(y - l.last) > 0.08) {
      l.last = y;
      l.el.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
    }
  });
}

function onScroll() {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(frame);
  }
}

export function useParallax<T extends HTMLElement>(speed: number) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const layer: Layer = { el, speed, last: 1e9 };
    layers.add(layer);
    if (!bound) {
      bound = true;
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
    }
    onScroll();
    return () => {
      layers.delete(layer);
      el.style.transform = "";
    };
  }, [speed]);
  return ref;
}

/* ------------------------------------------------------------------
   Reveal: adds .is-in once, then stops observing.
------------------------------------------------------------------ */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
      el.classList.add("is-in");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -11% 0px", threshold: 0.06 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}
