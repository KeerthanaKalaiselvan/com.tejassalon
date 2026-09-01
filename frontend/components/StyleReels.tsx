const REELS = [
  { src: "reel-placeholder", label: "Placeholder — team upload pending" },
  { src: "reel-placeholder", label: "Placeholder — team upload pending" },
  { src: "reel-placeholder", label: "Placeholder — team upload pending" },
  { src: "reel-placeholder", label: "Placeholder — team upload pending" },
];

export default function StyleReels() {
  const looped = [...REELS, ...REELS];

  return (
    <section className="bg-navy py-24 text-cream">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <p className="eyebrow text-glow">Style Reels</p>
        <h2 className="section-heading mt-3 text-cream">See The Work In Motion</h2>
        <p className="mt-4 max-w-2xl text-cream/70">
          Short clips from real transformations at Tejas Salon — placeholders for now, our team
          will be uploading reels and shorts here soon.
        </p>
      </div>

      <div className="relative mt-12 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-navy to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-navy to-transparent" />
        <div className="marquee-track flex w-max gap-6 px-6">
          {looped.map((reel, i) => (
            <div
              key={`${reel.src}-${i}`}
              className="h-96 w-56 shrink-0 overflow-hidden rounded-card border border-gold/20 shadow-soft"
            >
              <video
                muted
                loop
                playsInline
                autoPlay
                poster={`/videos/${reel.src}-poster.jpg`}
                aria-label={reel.label}
                className="h-full w-full object-cover"
              >
                <source src={`/videos/${reel.src}.mp4`} type="video/mp4" />
              </video>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
