import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

/**
 * Seed = VERIFIED FACTS ONLY.
 *
 * The previous seed carried 12 generic salon services with invented rupee prices
 * (Hair Cut ₹499, Keratin ₹2999, Bridal Makeup ₹3999...) and 10 invented retail
 * products. None of it came from the studio. Publishing an invented price is the
 * most harmful kind of placeholder — a customer can act on it.
 *
 * Every service below is evidenced:
 *   - eyebrow threading .... named in reviews + the owner's own reply
 *   - hair spa ............. named in a review
 *   - pedicure ............. named in a review
 *   - facials / skin ....... a review describes a skin treatment result
 *   - makeup ............... the business name + the storefront sign
 *   - hair ................. the storefront sign reads "TEJAS HAIR & MAKEUP STUDIO"
 *
 * priceFrom = 0 and durationMin = 0 mean "not published" — the UI renders
 * "shared on enquiry" rather than a number. Replace with real values once the
 * studio confirms them.
 */
async function main() {
  const services = [
    {
      slug: "eyebrow-threading",
      name: "Eyebrow Threading",
      category: "Threading",
      description: "Brow shaping and threading, done with a light hand.",
      priceFrom: 0,
      durationMin: 0,
      image: "/images/gallery-3.jpg",
      keywords: "eyebrow threading Mugalivakkam, threading salon Chennai",
      featured: true,
      sortOrder: 1,
    },
    {
      slug: "hair-care",
      name: "Hair Care",
      category: "Hair",
      description: "Hair services at the studio — ask for the current list.",
      priceFrom: 0,
      durationMin: 0,
      image: "/images/hero-banner.jpg",
      keywords: "hair salon Mugalivakkam, hair studio Chennai",
      featured: true,
      sortOrder: 2,
    },
    {
      slug: "hair-spa",
      name: "Hair Spa",
      category: "Hair",
      description: "Scalp and hair treatment, unhurried and quiet.",
      priceFrom: 0,
      durationMin: 0,
      image: "/images/gallery-1.jpg",
      keywords: "hair spa Mugalivakkam, hair spa Chennai",
      featured: true,
      sortOrder: 3,
    },
    {
      slug: "pedicure",
      name: "Pedicure & Foot Care",
      category: "Hands & Feet",
      description: "Pedicure and foot care, in a seat you can settle into.",
      priceFrom: 0,
      durationMin: 0,
      image: "/images/gallery-2.jpg",
      keywords: "pedicure Mugalivakkam, pedicure salon Chennai",
      featured: true,
      sortOrder: 4,
    },
    {
      slug: "facials-skin",
      name: "Facials & Skin Care",
      category: "Skin",
      description: "Facial and skin treatments for a fresh, rested finish.",
      priceFrom: 0,
      durationMin: 0,
      image: "/images/gallery-3.jpg",
      keywords: "facial Mugalivakkam, skin care salon Chennai",
      featured: true,
      sortOrder: 5,
    },
    {
      slug: "makeup",
      name: "Makeup Studio",
      category: "Makeup",
      description: "Makeup applied at the studio — please call ahead to book a slot.",
      priceFrom: 0,
      durationMin: 0,
      image: "/images/gallery-5.jpg",
      keywords: "makeup studio Mugalivakkam, makeup artist Chennai",
      featured: true,
      sortOrder: 6,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: service,
    });
  }
  console.log(`Seeded ${services.length} verified services (no prices — none are confirmed).`);

  /**
   * No products. The studio's shelves are stocked in the photos, but the retail
   * list and its prices are unknown. Add them here once confirmed.
   */
  console.log("Products: none seeded (no verified retail list or pricing).");

  /**
   * Admin: created ONLY from env. The old seed hardcoded mobile 9999999999 with
   * password "ChangeMe123!", which ships a known credential to production if the
   * reminder to change it is ever missed.
   */
  const adminMobile = process.env.ADMIN_MOBILE;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminMobile || !adminPassword) {
    console.log(
      "Admin: skipped. Set ADMIN_MOBILE and ADMIN_PASSWORD to create one, e.g.\n" +
        "  ADMIN_MOBILE=90030xxxxx ADMIN_PASSWORD='<a strong password>' npm run prisma:seed"
    );
  } else if (adminPassword.length < 12) {
    throw new Error("ADMIN_PASSWORD must be at least 12 characters.");
  } else {
    const existing = await prisma.user.findUnique({ where: { mobile: adminMobile } });
    if (existing) {
      console.log(`Admin ${adminMobile} already exists — left untouched.`);
    } else {
      await prisma.user.create({
        data: {
          mobile: adminMobile,
          passwordHash: await bcrypt.hash(adminPassword, 10),
          name: "Admin",
          isAdmin: true,
          onboarded: true,
        },
      });
      console.log(`Created admin ${adminMobile}.`);
    }
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
