const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_SALON_WHATSAPP_NUMBER || "919999999999";

export const SALON_ADDRESS =
  "Udhaya Nagar Main Rd, opp. to Amala Annai Stores, Sabari Nagar, Mugalivakkam, Chennai, Tamil Nadu 600116";
export const SALON_PHONE_DISPLAY = "+91 90030 09080";
export const SALON_DIRECTIONS_URL = "https://maps.app.goo.gl/NL2qqdzwNhRThxXy7";
const SALON_MAP_QUERY = "Tejas Beauty Lounge & Makeup Studio, Udhaya Nagar Main Rd, Mugalivakkam, Chennai";

export default function ContactMap() {
  return (
    <section className="bg-cream pb-24">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 md:grid-cols-2 md:px-8">
        <div className="overflow-hidden rounded-card border border-gold/25 shadow-soft">
          <iframe
            title="Tejas Salon location"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(SALON_MAP_QUERY)}&z=16&output=embed`}
            className="h-80 w-full md:h-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="curved-card flex flex-col justify-center gap-5 p-8">
          <div>
            <p className="eyebrow">Visit The Salon</p>
            <h2 className="section-heading mt-2 text-3xl">Find Us</h2>
          </div>
          <p className="text-ink/70">{SALON_ADDRESS}</p>
          <div className="grid grid-cols-2 gap-4 text-sm text-ink/70">
            <div>
              <p className="font-semibold text-navy">Hours</p>
              <p>Mon–Fri, 10 AM – 9 PM</p>
              <p>Sat–Sun, 10 AM – 10 PM</p>
            </div>
            <div>
              <p className="font-semibold text-navy">Phone</p>
              <p>{SALON_PHONE_DISPLAY}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-fit items-center justify-center rounded-pill border border-navy/30 px-7 py-3 font-sans text-sm font-semibold tracking-wide text-navy transition-colors duration-300 hover:bg-navy hover:text-cream"
            >
              Message Us on WhatsApp
            </a>
            <a
              href={SALON_DIRECTIONS_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-fit items-center justify-center rounded-pill bg-navy px-7 py-3 font-sans text-sm font-semibold tracking-wide text-cream transition-colors duration-300 hover:bg-navy/85"
            >
              Get Directions
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
