export default function AboutStory() {
  return (
    <section id="story" className="relative overflow-hidden bg-navy py-24 text-cream">
      <div className="pointer-events-none absolute inset-0 bg-gold-radial" />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-2 md:items-center md:px-8">
        <div className="overflow-hidden rounded-card border border-gold/20 shadow-glow">
          <picture>
            <source srcSet="/images/about-story.webp" type="image/webp" />
            <img
              src="/images/about-story.jpg"
              alt="The team at Tejas Salon"
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </picture>
        </div>

        <div>
          <p className="eyebrow text-glow">The Tejas Story</p>
          <h2 className="section-heading mt-3 text-cream">
            We Listen. We Understand. We Create the Perfect You.
          </h2>
          <p className="mt-5 text-cream/70">
            Tejas Salon began with a simple idea — that great hair and skin care should feel like
            a conversation, not a transaction. Every visit starts with a personalised consultation,
            uses products we'd recommend to our own family, and ends with results you can see and
            feel.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-6">
            <StoryStat label="Personalised Consultation" detail="Tailored just for you" />
            <StoryStat label="Premium Products" detail="Quality you can trust" />
            <StoryStat label="Expert Care" detail="For stunning results" />
            <StoryStat label="Your Satisfaction" detail="Because you deserve the best" />
          </div>
        </div>
      </div>
    </section>
  );
}

function StoryStat({ label, detail }: { label: string; detail: string }) {
  return (
    <div className="border-l-2 border-gold/50 pl-4">
      <p className="font-serif text-lg text-cream">{label}</p>
      <p className="mt-1 text-sm text-cream/55">{detail}</p>
    </div>
  );
}
