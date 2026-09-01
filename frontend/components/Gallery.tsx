const GALLERY_IMAGES = [
  { src: "gallery-1", alt: "Styling stations and guest sofa inside Tejas Salon" },
  { src: "gallery-2", alt: "Guest lounge at Tejas Salon" },
  { src: "gallery-3", alt: "Styling mirror and product shelves at Tejas Salon" },
];

export default function Gallery() {
  const looped = [...GALLERY_IMAGES, ...GALLERY_IMAGES];

  return (
    <section id="gallery" className="bg-cream py-24">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <p className="eyebrow">Gallery</p>
        <h2 className="section-heading mt-3">A Look Inside Tejas Salon</h2>
      </div>

      <div className="relative mt-12 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-cream to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-cream to-transparent" />
        <div className="marquee-track flex w-max gap-6 px-6">
          {looped.map((image, i) => (
            <div
              key={`${image.src}-${i}`}
              className="h-64 w-64 shrink-0 overflow-hidden rounded-card border border-gold/20 shadow-soft sm:h-72 sm:w-72"
            >
              <picture>
                <source srcSet={`/images/${image.src}.webp`} type="image/webp" />
                <img
                  src={`/images/${image.src}.jpg`}
                  alt={image.alt}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </picture>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
