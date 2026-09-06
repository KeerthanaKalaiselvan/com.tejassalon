import Link from "next/link";
import Mark from "./Mark";
import { SITE, telHref } from "@/lib/site";

export default function Footer() {
  return (
    <footer
      id="contact"
      className="border-t border-cream/[0.09] bg-gradient-to-b from-transparent to-gold/[0.045]"
    >
      <div className="mx-auto max-w-[1160px] px-[clamp(20px,5.2vw,72px)]">
        <div className="grid gap-[clamp(34px,5vw,56px)] py-[clamp(60px,8vw,92px)] md:grid-cols-2 md:items-start">
          <div>
            <Mark className="w-[52px]" id="foot-mark" />
            <div
              className="mt-5 font-serif text-[clamp(1.7rem,1.3rem+1.5vw,2.3rem)] tracking-[0.14em] text-cream"
              style={{ textIndent: "0.14em" }}
            >
              TEJAS
            </div>
            <div
              className="mt-2.5 font-sans text-[0.66rem] uppercase tracking-[0.3em] text-muted-dim"
              style={{ textIndent: "0.3em" }}
            >
              Beauty Lounge &amp; Makeup Studio
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <p className="eyebrow mb-2.5">Call the studio</p>
              <a
                href={telHref}
                className="inline-block font-serif text-[clamp(1.7rem,1.2rem+2vw,2.5rem)] tabular-nums text-gold-light no-underline transition-colors hover:text-white"
              >
                {SITE.phoneDisplay}
              </a>
            </div>

            <div>
              <p className="eyebrow mb-2.5">Find us</p>
              <address className="not-italic leading-relaxed text-cream-dim">
                <a
                  href={SITE.maps}
                  target="_blank"
                  rel="noopener"
                  className="border-b border-gold/25 text-cream-dim no-underline transition-colors hover:text-gold-light"
                >
                  {SITE.address.line1} {SITE.address.line2}
                  <br />
                  {SITE.address.line3} {SITE.address.line4}
                </a>
              </address>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/book" className="gold-button">
                Book an appointment
              </Link>
              <a href={SITE.maps} target="_blank" rel="noopener" className="outline-button">
                Directions
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-7 gap-y-3.5 border-t border-cream/[0.09] py-6 font-sans text-[0.68rem] uppercase tracking-[0.16em] text-muted-dim">
          <span>© {new Date().getFullYear()} {SITE.name}</span>
          <span>Beauty salon · Mugalivakkam, Chennai</span>
        </div>
      </div>
    </footer>
  );
}
