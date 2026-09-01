// The stylist names that used to sit here were placeholders. Rather than print
// invented names under real faces, the team runs as one photo. Swap back to
// individual cards once we have the real names and proper solo portraits.
const DISCIPLINES = [
  { name: "Hair Styling", description: "Cuts and styles tailored to you." },
  { name: "Colour", description: "Global colour, highlights and balayage." },
  { name: "Skin & Facial", description: "Glow-focused facials and skin care." },
  { name: "Bridal Makeup", description: "HD looks that last all day." },
  { name: "Nail Art", description: "Manicures, pedicures and nail art." },
  { name: "Salon Management", description: "Here to make every visit easy." },
];

export default function Team() {
  return (
    <section id="team" className="bg-navy py-24 text-cream">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <p className="eyebrow text-glow">Our Team</p>
        <h2 className="section-heading mt-3 text-cream">The Hands Behind Every Transformation</h2>

        <div className="mt-10 grid gap-8 md:grid-cols-5 md:items-start">
          <div className="overflow-hidden rounded-card border border-gold/20 shadow-glow md:col-span-2">
            <picture>
              <source srcSet="/images/team-group.webp" type="image/webp" />
              <img
                src="/images/team-group.jpg"
                alt="The stylists and therapists of Tejas Salon"
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover object-top"
              />
            </picture>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:col-span-3">
            {DISCIPLINES.map((discipline) => (
              <div
                key={discipline.name}
                className="rounded-2xl border border-gold/20 bg-navy-light/50 p-5 transition-all duration-300 hover:border-gold/60 hover:shadow-glow"
              >
                <p className="font-serif text-lg text-cream">{discipline.name}</p>
                <p className="mt-1 text-sm leading-snug text-cream/60">{discipline.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
