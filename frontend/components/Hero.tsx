"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  // Starts true (shows "Play") until confirmed otherwise — autoplay can be silently
  // blocked, and this must never claim "Pause" for a video that isn't really playing.
  const [isPaused, setIsPaused] = useState(true);

  useEffect(() => {
    // The very first autoplay-triggered `play` event can fire before this
    // component finishes attaching its listeners, so the initial state has to be
    // reconciled explicitly — onPlay/onPause below handle every change after this.
    const video = videoRef.current;
    if (video) setIsPaused(video.paused);
  }, []);

  function toggleVideo() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }

  return (
    <section className="relative -mt-[76px] flex min-h-[92vh] items-end overflow-hidden bg-navy pt-[76px]">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        poster="/videos/hero-reel-poster.jpg"
        onPlay={() => setIsPaused(false)}
        onPause={() => setIsPaused(true)}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/videos/hero-reel.mp4" type="video/mp4" />
      </video>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy/70 via-transparent to-transparent" />

      <button
        type="button"
        onClick={toggleVideo}
        aria-label={isPaused ? "Play background video" : "Pause background video"}
        className="absolute inset-0 cursor-pointer"
      />

      <button
        type="button"
        onClick={toggleVideo}
        className="absolute bottom-6 right-6 z-10 rounded-pill border border-cream/30 px-4 py-1.5 font-sans text-xs tracking-wide text-cream/80 transition-colors hover:border-gold hover:text-gold"
      >
        {isPaused ? "Play" : "Pause"}
      </button>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-20 md:px-8 md:pb-28">
        <p className="eyebrow text-glow animate-fade-up">Hair · Skin · Bridal Makeup</p>
        <h1 className="section-heading mt-3 max-w-2xl text-cream md:text-6xl animate-fade-up [animation-delay:120ms] opacity-0">
          Beauty That Shines With Confidence That Stays
        </h1>
        <p className="mt-5 max-w-xl text-base text-cream/75 md:text-lg animate-fade-up [animation-delay:240ms] opacity-0">
          Personalised consultations, premium products and expert hands — for every day you want
          to feel like your best self.
        </p>
        <div className="mt-8 flex flex-wrap gap-4 animate-fade-up [animation-delay:360ms] opacity-0">
          <Link href="/book" className="gold-button">
            Reserve Your Spot
          </Link>
          <a href="#craft" className="outline-button">
            Explore Our Craft
          </a>
        </div>
      </div>
    </section>
  );
}
