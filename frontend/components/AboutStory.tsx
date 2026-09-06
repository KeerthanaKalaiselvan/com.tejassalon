import Image from "next/image";
import Section from "./Section";
import Reveal from "./Reveal";
import Orb from "./Orb";
import { PULL_QUOTE } from "@/lib/site";

export default function AboutStory() {
  return (
    <Section id="about" eyebrow="About">
      <Orb speed={-0.2} className="h-[340px] w-[340px]" style={{ right: -70, top: "38%" }} />

      <Reveal delay={0.06}>
        <h2 className="section-heading">Tejas &mdash; a Sanskrit word for radiance.</h2>
      </Reveal>

      <div className="mt-8 grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,.85fr)] md:items-start">
        <div className="flex flex-col gap-6">
          <Reveal delay={0.12}>
            <p className="max-w-[62ch] text-[clamp(1.06rem,1rem+.38vw)] leading-relaxed text-cream-dim">
              Tejas Beauty Lounge &amp; Makeup Studio is a women-owned beauty salon on Udhaya Nagar
              Main Road, opposite Amala Annai Stores, in Sabari Nagar, Mugalivakkam.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="max-w-[62ch] text-muted">
              Threading and brow shaping, hair, hair spa, pedicure, skin care and makeup &mdash;
              taken one guest at a time, without hurry. Two things come up again and again in the
              reviews below: staff who are kind, and a room that stays calm.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <figure className="curved-card m-0 p-[clamp(24px,3.4vw,40px)]">
              <p className="font-serif text-[clamp(1.2rem,1rem+1.1vw,1.62rem)] leading-snug tracking-[0.008em] text-glow">
                {PULL_QUOTE}
              </p>
              <figcaption className="mt-4 font-sans text-[0.66rem] uppercase tracking-[0.26em] text-muted-dim">
                From a Google review
              </figcaption>
            </figure>
          </Reveal>
        </div>

        <Reveal delay={0.2}>
          <figure className="m-0 overflow-hidden rounded-card border border-gold/20 shadow-soft">
            {/* about-story.jpg, not team-group.jpg: the uniformed shot has the back
                row's heads clipped in the source file itself, so no CSS can recover
                them. This frame shows every face. Intrinsic 1400x1120 is declared so
                object-cover has nothing to crop. */}
            <Image
              src="/images/about-story.jpg"
              alt="The team at Tejas Beauty Lounge &amp; Makeup Studio"
              width={1400}
              height={1120}
              className="h-full w-full object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </figure>
        </Reveal>
      </div>
    </Section>
  );
}
