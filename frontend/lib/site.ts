/**
 * Verified facts about the studio. Single source of truth.
 *
 * EVERYTHING HERE IS EVIDENCED - from the Google Business listing, the owner's
 * reply on a Google review, or photographs of the premises. Nothing is inferred.
 * If you add to this file, add the evidence with it.
 */

export const SITE = {
  name: "Tejas Beauty Lounge & Makeup Studio",
  shortName: "Tejas",
  phone: "+919003009080",
  phoneDisplay: "+91 90030 09080",
  address: {
    line1: "Udhaya Nagar Main Rd,",
    line2: "opposite Amala Annai Stores,",
    line3: "Sabari Nagar, Mugalivakkam,",
    line4: "Chennai, Tamil Nadu 600116",
    oneLine:
      "Udhaya Nagar Main Rd, opposite Amala Annai Stores, Sabari Nagar, Mugalivakkam, Chennai, Tamil Nadu 600116",
  },
  plusCode: "25GC+V3 Chennai",
  geo: { lat: 13.0271627, lng: 80.1702193 },
  maps: "https://maps.app.goo.gl/NL2qqdzwNhRThxXy7",
  rating: { score: "4.7", count: 38 },
  womenOwned: true, // Google lists "Identifies as women-owned"
  /**
   * Google shows only a closing time. Full weekly hours are NOT published and
   * are NOT known - do not invent them. v1 carried two contradictory sets
   * (JSON-LD said 10:00-21:00, the booking calendar offered 9AM-11PM).
   */
  hours: { closes: "9:00 pm", weeklyKnown: false },
} as const;

/** Verbatim Google reviews. Quoted exactly - do not paraphrase or tidy. */
export const REVIEWS = [
  {
    quote:
      "The service was sooooper cool and calming. Must visit and underrated . Completely secured and calming. Results were amazing and long lasting",
    author: "Nikhita Varsha",
  },
  {
    quote:
      "I like all the services at Tejas! Mounika done my Eyebrows. Like it very much.. staffs are kind and good",
    author: "Dee Pika",
  },
  {
    quote:
      "I did hair spa, pedicure and threading. Painless threading after a long time.. the time I spent on hair spa and pedicure was so relaxing and peaceful. Thank you tejas team.",
    author: "Karishma SM",
  },
] as const;

/** From Google's own review summary. */
export const PULL_QUOTE =
  "Great service, warm and attentive staff and everything felt genuinely welcoming.";

/**
 * Fallback service list, used when the API is unreachable so the page never
 * renders empty. Mirrors the seed. No prices - none are verified.
 */
export const FALLBACK_SERVICES = [
  { slug: "eyebrow-threading", name: "Eyebrow Threading", description: "Brow shaping and threading, done with a light hand." },
  { slug: "hair-care", name: "Hair Care", description: "Hair services at the studio — ask for the current list." },
  { slug: "hair-spa", name: "Hair Spa", description: "Scalp and hair treatment, unhurried and quiet." },
  { slug: "pedicure", name: "Pedicure & Foot Care", description: "Pedicure and foot care, in a seat you can settle into." },
  { slug: "facials-skin", name: "Facials & Skin Care", description: "Facial and skin treatments for a fresh, rested finish." },
  { slug: "makeup", name: "Makeup Studio", description: "Makeup applied at the studio — please call ahead to book a slot." },
] as const;

export const telHref = `tel:${SITE.phone}`;
