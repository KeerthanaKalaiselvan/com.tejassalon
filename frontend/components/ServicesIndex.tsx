import Link from "next/link";
import Section from "./Section";
import Reveal from "./Reveal";
import { FALLBACK_SERVICES, SITE, telHref } from "@/lib/site";
import type { Service } from "@/lib/types";

/**
 * A ruled typographic index, not a card grid.
 * `priceFrom === 0` means "shared on enquiry" - we never print an unverified price.
 */
export default function ServicesIndex({ services }: { services: Service[] }) {
  const rows =
    services.length > 0
      ? services.map((s) => ({
          slug: s.slug,
          name: s.name,
          description: s.description,
          priceFrom: s.priceFrom,
        }))
      : FALLBACK_SERVICES.map((s) => ({ ...s, priceFrom: 0 }));

  return (
    <Section id="services" eyebrow="Services">
      <Reveal delay={0.06}>
        <h2 className="section-heading">What the studio offers.</h2>
      </Reveal>

      <ul className="mt-[clamp(30px,4vw,46px)] list-none border-t border-cream/[0.09] p-0">
        {rows.map((s, i) => (
          <Reveal as="li" key={s.slug} delay={0.1 + i * 0.05} className="border-b border-cream/[0.09]">
            <div className="group grid items-baseline gap-x-10 gap-y-1.5 px-1 py-[clamp(20px,2.6vw,30px)] transition-colors duration-500 hover:bg-gradient-to-r hover:from-gold/[0.055] hover:to-transparent md:grid-cols-[minmax(0,1.16fr)_minmax(0,.84fr)]">
              <span className="font-serif text-[clamp(1.45rem,1.05rem+1.45vw,2.15rem)] leading-tight text-cream transition-all duration-500 group-hover:translate-x-2 group-hover:text-gold-light [text-wrap:balance]">
                {s.name}
              </span>
              <span className="text-[0.97rem] leading-relaxed text-muted">
                {s.description}
                {s.priceFrom > 0 && (
                  <em className="ml-2 not-italic text-gold-light">from ₹{s.priceFrom}</em>
                )}
              </span>
            </div>
          </Reveal>
        ))}

        <Reveal as="li" delay={0.4} className="border-b border-cream/[0.09]">
          <a
            href={telHref}
            className="group grid items-baseline gap-x-10 gap-y-1.5 px-1 py-[clamp(20px,2.6vw,30px)] no-underline transition-colors duration-500 hover:bg-gradient-to-r hover:from-gold/[0.055] hover:to-transparent md:grid-cols-[minmax(0,1.16fr)_minmax(0,.84fr)]"
          >
            <span className="font-serif text-[clamp(1.45rem,1.05rem+1.45vw,2.15rem)] leading-tight text-gold transition-transform duration-500 group-hover:translate-x-2">
              Ask about anything else
            </span>
            <span className="text-[0.97rem] leading-relaxed text-muted">
              The full treatment list and pricing are shared on enquiry. Call{" "}
              <span className="whitespace-nowrap">{SITE.phoneDisplay}</span>.
            </span>
          </a>
        </Reveal>
      </ul>

      <Reveal delay={0.45}>
        <p className="mt-6 text-sm text-muted-dim">
          Book online, or call the studio &mdash; whichever suits you.{" "}
          <Link href="/book" className="text-gold-light underline-offset-4 hover:text-white">
            Book an appointment
          </Link>
        </p>
      </Reveal>
    </Section>
  );
}
