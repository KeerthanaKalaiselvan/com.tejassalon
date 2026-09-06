import Section from "./Section";
import Reveal from "./Reveal";
import Orb from "./Orb";
import { REVIEWS, SITE } from "@/lib/site";

export default function Reviews() {
  return (
    <Section id="reviews" eyebrow="Reviews">
      <Orb speed={0.3} className="h-[420px] w-[420px]" style={{ left: -160, top: "12%" }} />

      <Reveal delay={0.06}>
        <h2 className="section-heading">In their own words.</h2>
      </Reveal>

      <Reveal delay={0.12}>
        <div className="mt-8 flex flex-wrap items-baseline gap-x-3">
          <span className="font-serif text-[clamp(2.6rem,2rem+2.4vw,4rem)] leading-none text-gold-light">
            {SITE.rating.score}
          </span>
          <span className="font-sans text-xs uppercase tracking-[0.24em] text-muted">
            out of 5 · {SITE.rating.count} reviews on Google
          </span>
        </div>
      </Reveal>

      <div className="mt-[clamp(34px,4.6vw,56px)] flex flex-col gap-[clamp(46px,6.4vw,86px)]">
        {REVIEWS.map((r, i) => (
          <Reveal
            key={r.author}
            as="blockquote"
            className={`m-0 max-w-[600px] ${
              i === 1 ? "md:ml-auto md:text-right" : i === 2 ? "md:mx-auto" : ""
            }`}
          >
            <q className="block font-serif text-[clamp(1.3rem,1rem+1.5vw,2.05rem)] leading-snug text-[#EFE3D3] [quotes:none] before:text-gold before:content-['\201C'] after:text-gold after:content-['\201D']">
              {r.quote}
            </q>
            <footer
              className={`mt-4 flex flex-col gap-0.5 font-sans text-[0.68rem] uppercase tracking-[0.24em] ${
                i === 1 ? "md:items-end" : ""
              }`}
            >
              <b className="font-normal text-gold-light">{r.author}</b>
              <span className="tracking-[0.18em] text-muted-dim">Google review</span>
            </footer>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <p className="mt-6 text-sm text-muted-dim">Quoted from the studio&rsquo;s Google listing.</p>
      </Reveal>
    </Section>
  );
}
