import Link from "next/link";
import { SALON_ADDRESS, SALON_DIRECTIONS_URL, SALON_PHONE_DISPLAY } from "@/components/ContactMap";

export default function Footer() {
  return (
    <footer className="bg-navy text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-4">
        <div>
          <p className="font-serif text-2xl text-cream">
            Tejas <span className="text-gold">Salon</span>
          </p>
          <p className="mt-4 text-sm leading-relaxed text-cream/60">
            A hair, skin and makeup studio built around unhurried, personal care — from
            everyday styling to bridal transformations.
          </p>
        </div>

        <div>
          <p className="font-sans text-sm font-semibold uppercase tracking-widest text-gold">
            Explore
          </p>
          <ul className="mt-4 flex flex-col gap-2 text-sm text-cream/70">
            <li><a href="/#craft" className="hover:text-gold">Our Craft</a></li>
            <li><a href="/#gallery" className="hover:text-gold">Gallery</a></li>
            <li><a href="/#team" className="hover:text-gold">Team</a></li>
            <li><Link href="/products" className="hover:text-gold">Products</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-sans text-sm font-semibold uppercase tracking-widest text-gold">
            Salon
          </p>
          <ul className="mt-4 flex flex-col gap-2 text-sm text-cream/70">
            <li><Link href="/book" className="hover:text-gold">Reserve Your Spot</Link></li>
            <li><a href="/#support" className="hover:text-gold">Enquiry &amp; Support</a></li>
            <li><a href="/#contact" className="hover:text-gold">Contact Us</a></li>
            <li><a href="/admin" className="hover:text-gold">Admin</a></li>
          </ul>
        </div>

        <div id="contact">
          <p className="font-sans text-sm font-semibold uppercase tracking-widest text-gold">
            Visit Us
          </p>
          <ul className="mt-4 flex flex-col gap-2 text-sm text-cream/70">
            <li>Mon–Fri 10 AM–9 PM · Sat–Sun 10 AM–10 PM</li>
            <li>{SALON_PHONE_DISPLAY}</li>
            <li>hello@tejassalon.example</li>
            <li>
              <a
                href={SALON_DIRECTIONS_URL}
                target="_blank"
                rel="noreferrer"
                className="hover:text-gold"
              >
                {SALON_ADDRESS}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10 py-6 text-center text-xs text-cream/40">
        © {new Date().getFullYear()} Tejas Salon. All rights reserved.
      </div>
    </footer>
  );
}
