"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Mark from "./Mark";
import Motes from "./Motes";
import { useParallax, prefersReducedMotion } from "@/lib/motion";

const PHONE = "+919003009080";
const PHONE_DISPLAY = "+91 90030 09080";
const DIRECTIONS = "https://maps.app.goo.gl/NL2qqdzwNhRThxXy7";

function Phone({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.2.4 2.4.6 3.7.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.7.1.3 0 .7-.2 1l-2.3 2.1Z" />
    </svg>
  );
}
function Pin({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Zm0 9.6A2.6 2.6 0 1 1 12 6.4a2.6 2.6 0 0 1 0 5.2Z" />
    </svg>
  );
}

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRef = useParallax<HTMLDivElement>(0.38);
  // Starts true: autoplay can be blocked, and the control must never claim
  // "Pause" for a video that isn't actually running.
  const [paused, setPaused] = useState(true);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const rm = prefersReducedMotion();
    setReduced(rm);
    const v = videoRef.current;
    if (v) {
      if (rm) {
        v.pause(); // reduced motion: the poster frame stands in for the loop
      }
      setPaused(v.paused);
    }
  }, []);

  function toggle() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) void v.play()?.catch(() => {});
    else v.pause();
  }

  // CSS-driven, not state-driven: requestAnimationFrame is throttled in
  // background tabs, so a JS-gated entrance can leave the hero invisible.
  const seq = "opacity-0 animate-fade-up";

  return (
    <header
      id="top"
      data-parallax-host
      className="relative -mt-[76px] grid min-h-[100svh] place-items-center overflow-hidden bg-ink pt-[76px] isolate"
    >
      <div ref={mediaRef} className="absolute -inset-y-[14%] inset-x-0 z-0 will-change-transform">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/images/hero-poster.webp"
          onPlay={() => setPaused(false)}
          onPause={() => setPaused(true)}
          aria-hidden="true"
          tabIndex={-1}
          className="h-full w-full object-cover bg-ink"
        >
          <source src="/videos/tejas-hero.mp4" type="video/mp4" />
        </video>
      </div>

      <Motes className="absolute inset-0 z-[1]" />

      <div
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          background:
            "radial-gradient(120% 78% at 50% 46%, rgba(21,14,19,.10) 0%, rgba(21,14,19,.62) 62%, rgba(21,14,19,.90) 100%), linear-gradient(180deg, rgba(21,14,19,.72) 0%, transparent 26%, transparent 56%, rgba(21,14,19,.96) 100%)",
        }}
      />

      <div className="relative z-[3] w-full px-6 py-24 text-center md:px-8">
        <Mark className={`mx-auto w-12 md:w-16 ${seq}`} id="hero-mark" />

        <p className={`eyebrow mt-6 text-gold-light/90 ${seq} [animation-delay:110ms]`}>
          Mugalivakkam · Chennai
        </p>

        <h1
          aria-label="Tejas"
          className="mt-2 font-serif text-[clamp(3.9rem,17vw,10.5rem)] leading-[0.92] tracking-wordmark text-[#FBF5EC]"
          style={{ textIndent: "0.10em" }}
        >
          {"TEJAS".split("").map((c, i) => (
            <span
              key={i}
              className={`inline-block ${seq}`}
              style={{ animationDelay: `${210 + i * 60}ms` }}
            >
              {c}
            </span>
          ))}
        </h1>

        <hr
          className="mx-auto mt-6 w-[min(320px,56vw)] origin-center border-0 opacity-0 animate-draw-x [animation-delay:620ms]"
          style={{
            height: 1,
            background:
              "linear-gradient(90deg,transparent,rgba(201,155,76,.30) 12%,rgba(232,206,155,.72) 50%,rgba(201,155,76,.30) 88%,transparent)",
          }}
        />

        <p
          className={`mt-6 font-sans text-[clamp(.68rem,.62rem+.3vw,.82rem)] uppercase tracking-[0.42em] text-gold-light ${seq} [animation-delay:720ms]`}
          style={{ textIndent: "0.42em" }}
        >
          Beauty Lounge &amp; Makeup Studio
        </p>

        <p
          className={`mx-auto mt-6 max-w-[33ch] text-[clamp(1rem,.95rem+.3vw,1.14rem)] leading-relaxed text-cream-dim ${seq} [animation-delay:820ms]`}
        >
          A quiet room in Mugalivakkam for threading, hair, skin and makeup.
        </p>

        <p
          className={`mt-6 inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.2em] text-muted ${seq} [animation-delay:900ms]`}
        >
          <span className="inline-flex gap-[2px]" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((i) => (
              <svg key={i} viewBox="0 0 24 24" className="h-3 w-3 fill-gold">
                <path d="M12 2.6l2.7 6.1 6.6.6-5 4.4 1.5 6.5L12 16.8 6.2 20.2l1.5-6.5-5-4.4 6.6-.6z" />
              </svg>
            ))}
          </span>
          <b className="font-normal tracking-[0.1em] text-gold-light">4.7</b>
          <span>· 38 reviews on Google</span>
        </p>

        <div
          className={`mt-9 flex flex-wrap items-center justify-center gap-3 ${seq} [animation-delay:980ms]`}
        >
          <Link href="/book" className="gold-button">
            Book an appointment
          </Link>
          <a href={`tel:${PHONE}`} className="outline-button">
            <Phone className="h-4 w-4" />
            {PHONE_DISPLAY}
          </a>
          <a href={DIRECTIONS} target="_blank" rel="noopener" className="outline-button">
            <Pin className="h-4 w-4" />
            Directions
          </a>
        </div>
      </div>

      {/* WCAG 2.2.2 - auto-starting motion over 5s needs a pause control. */}
      {!reduced && (
        <button
          type="button"
          onClick={toggle}
          className="absolute bottom-5 right-5 z-[4] rounded-pill border border-cream/20 px-3.5 py-1.5 font-sans text-[0.62rem] uppercase tracking-[0.18em] text-cream/70 transition-colors hover:border-gold hover:text-gold"
        >
          {paused ? "Play" : "Pause"}
        </button>
      )}

      <div
        className="pointer-events-none absolute bottom-5 left-1/2 z-[4] grid -translate-x-1/2 justify-items-center gap-2 font-sans text-[0.6rem] uppercase tracking-[0.3em] text-muted-dim"
        aria-hidden="true"
      >
        <i className="block h-10 w-px bg-gradient-to-b from-gold/40 to-transparent" />
        Scroll
      </div>
    </header>
  );
}
