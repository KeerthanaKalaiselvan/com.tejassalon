import Image from "next/image";
import Section from "./Section";
import Reveal from "./Reveal";

/**
 * Real photographs of the studio.
 *
 * Deliberately four, not more: the remaining interior shots are the same small
 * room from slightly different angles, and repetition reads as padding — it
 * signals "not much to show" rather than the opposite. The second storefront
 * photo now lives in the Visit section, next to the address, where it helps
 * someone actually find the door.
 */
const SHOTS = [
  {
    src: "/images/gallery-4.jpg",
    alt: "The lit Tejas shopfront on Udhaya Nagar Main Road at dusk",
    span: "col-span-2 row-span-2",
  },
  { src: "/images/gallery-3.jpg", alt: "A makeup and styling station at the studio", span: "" },
  { src: "/images/hero-banner.jpg", alt: "Styling chairs and product shelves inside the studio", span: "" },
  { src: "/images/gallery-2.jpg", alt: "The waiting area inside the studio", span: "" },
];

export default function Gallery() {
  return (
    <Section id="gallery" eyebrow="The Studio">
      <Reveal delay={0.06}>
        <h2 className="section-heading">Come and have a look.</h2>
      </Reveal>

      <div className="mt-[clamp(30px,4vw,46px)] grid auto-rows-[150px] grid-cols-2 gap-3 md:auto-rows-[188px] md:grid-cols-4">
        {SHOTS.map((s, i) => (
          <Reveal
            key={s.src}
            delay={0.08 + i * 0.07}
            className={`group overflow-hidden rounded-card border border-gold/15 ${s.span}`}
          >
            <Image
              src={s.src}
              alt={s.alt}
              width={1280}
              height={960}
              sizes="(max-width: 768px) 50vw, 25vw"
              className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(.22,.61,.36,1)] group-hover:scale-[1.04]"
            />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
