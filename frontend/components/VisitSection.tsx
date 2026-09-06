import Image from "next/image";
import Section from "./Section";
import Reveal from "./Reveal";
import Orb from "./Orb";
import { SITE, telHref } from "@/lib/site";

export default function VisitSection() {
  return (
    <Section id="visit" eyebrow="Visit">
      <Orb speed={-0.26} className="h-[300px] w-[300px]" style={{ right: -90, bottom: "6%" }} />

      <Reveal delay={0.06}>
        <h2 className="section-heading">Hours &amp; location.</h2>
      </Reveal>

      <div className="mt-[clamp(30px,4vw,46px)] grid gap-5 md:grid-cols-[1fr_1.16fr]">
        <Reveal delay={0.12}>
          <div className="curved-card flex h-full flex-col gap-4 p-[clamp(26px,3.2vw,40px)]">
            <h3 className="font-serif text-xl text-cream">Hours</h3>
            <p className="font-serif text-[clamp(1.9rem,1.4rem+2vw,2.8rem)] leading-none text-gold-light">
              Closes 9:00&nbsp;pm
            </p>
            <p className="text-[0.97rem] text-muted">
              Full weekly opening hours aren&rsquo;t published online. Call the studio and
              they&rsquo;ll confirm timings and hold a slot for you.
            </p>
            <a href={telHref} className="gold-button mt-auto self-start">
              Call the studio
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.18}>
          <div className="curved-card flex h-full flex-col gap-4 p-[clamp(26px,3.2vw,40px)]">
            <h3 className="font-serif text-xl text-cream">Location</h3>
            {/* The address is landmark-based ("opposite Amala Annai Stores"), which is
                how people here actually navigate — so show them the shopfront. */}
            <a
              href={SITE.maps}
              target="_blank"
              rel="noopener"
              className="group -mx-1 block overflow-hidden rounded-card border border-gold/15"
              aria-label="Open Tejas in Google Maps"
            >
              <Image
                src="/images/gallery-5.jpg"
                alt="The Tejas shopfront — look for the glass frontage and the potted plants"
                width={1280}
                height={720}
                sizes="(max-width: 820px) 100vw, 45vw"
                className="h-40 w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(.22,.61,.36,1)] group-hover:scale-[1.04]"
              />
            </a>
            <address className="max-w-[34ch] not-italic leading-relaxed text-cream-dim">
              <a
                href={SITE.maps}
                target="_blank"
                rel="noopener"
                className="border-b border-gold/25 pb-px text-gold-light no-underline transition-colors hover:border-gold hover:text-white"
              >
                {SITE.address.line1}
                <br />
                {SITE.address.line2}
                <br />
                {SITE.address.line3}
                <br />
                {SITE.address.line4}
              </a>
            </address>
            <p className="font-sans text-xs uppercase tracking-[0.2em] tabular-nums text-muted-dim">
              Plus code {SITE.plusCode}
            </p>
            <a href={SITE.maps} target="_blank" rel="noopener" className="outline-button self-start">
              Directions in Google Maps
            </a>
            {SITE.womenOwned && (
              <span className="inline-flex items-center gap-2 self-start rounded-pill border border-gold/25 px-3 py-1.5 font-sans text-[0.64rem] uppercase tracking-[0.22em] text-gold-light">
                <svg viewBox="0 0 24 24" className="h-3 w-3 fill-gold" aria-hidden="true">
                  <path d="M12 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 12c-4.4 0-8 2.2-8 5v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1c0-2.8-3.6-5-8-5Z" />
                </svg>
                Women-owned
              </span>
            )}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
