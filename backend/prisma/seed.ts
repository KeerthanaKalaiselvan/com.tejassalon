import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

async function main() {
  const services = [
    {
      slug: "hair-cut-styling",
      name: "Hair Cut & Styling",
      category: "Hair",
      description:
        "Precision haircuts and finishing styles tailored to your face shape, texture and lifestyle.",
      priceFrom: 499,
      durationMin: 45,
      image: "/images/service-haircut.svg",
      keywords: "hair cut salon, hair styling, haircut near me, hairdresser",
      featured: true,
      sortOrder: 1,
    },
    {
      slug: "hair-color-highlights",
      name: "Hair Color & Highlights",
      category: "Hair",
      description:
        "Global color, balayage and highlights using ammonia-friendly formulas for long-lasting shine.",
      priceFrom: 1499,
      durationMin: 90,
      image: "/images/service-color.svg",
      keywords: "hair color salon, highlights, balayage, hair coloring near me",
      featured: true,
      sortOrder: 2,
    },
    {
      slug: "hair-spa-treatments",
      name: "Hair Spa & Treatments",
      category: "Hair",
      description:
        "Deep-conditioning hair spa rituals that repair damage and restore softness from root to tip.",
      priceFrom: 999,
      durationMin: 60,
      image: "/images/service-spa.svg",
      keywords: "hair spa, hair treatment, deep conditioning, hair care salon",
      featured: true,
      sortOrder: 3,
    },
    {
      slug: "keratin-smoothening",
      name: "Keratin & Smoothening",
      category: "Hair",
      description:
        "Keratin and smoothening treatments that tame frizz and leave hair silky for months.",
      priceFrom: 2999,
      durationMin: 150,
      image: "/images/service-keratin.svg",
      keywords: "keratin treatment, hair smoothening, frizz free hair salon",
      featured: false,
      sortOrder: 4,
    },
    {
      slug: "skin-facial-care",
      name: "Skin & Facial Care",
      category: "Skin",
      description:
        "Dermat-inspired facials and skin treatments for a healthy, visible glow.",
      priceFrom: 899,
      durationMin: 60,
      image: "/images/service-skin.svg",
      keywords: "facial salon, skin care treatment, glow facial, skin specialist",
      featured: true,
      sortOrder: 5,
    },
    {
      slug: "bridal-party-makeup",
      name: "Bridal & Party Makeup",
      category: "Makeup",
      description:
        "HD bridal, engagement and party makeup by artists who work with your skin, not against it.",
      priceFrom: 3999,
      durationMin: 120,
      image: "/images/service-makeup.svg",
      keywords: "bridal makeup artist, party makeup, makeup salon near me",
      featured: true,
      sortOrder: 6,
    },
    {
      slug: "nail-art-care",
      name: "Nail Art & Care",
      category: "Nails",
      description:
        "Manicures, pedicures and hand-painted nail art finished with long-lasting gel polish.",
      priceFrom: 599,
      durationMin: 45,
      image: "/images/service-nails.svg",
      keywords: "nail art salon, manicure pedicure, gel nails near me",
      featured: false,
      sortOrder: 7,
    },
    {
      slug: "threading-waxing",
      name: "Threading & Waxing",
      category: "Skin",
      description:
        "Precise threading and gentle waxing for smooth, salon-fresh skin.",
      priceFrom: 149,
      durationMin: 20,
      image: "/images/service-threading.svg",
      keywords: "threading salon, waxing near me, eyebrow threading",
      featured: false,
      sortOrder: 8,
    },
    {
      slug: "hair-extensions",
      name: "Hair Extensions",
      category: "Hair",
      description:
        "Clip-in and fusion extensions for instant length, volume and thickness.",
      priceFrom: 2499,
      durationMin: 90,
      image: "/images/service-extensions.svg",
      keywords: "hair extensions salon, clip in extensions, hair extensions near me",
      featured: false,
      sortOrder: 9,
    },
    {
      slug: "head-massage-champi",
      name: "Head Massage & Champi",
      category: "Hair",
      description:
        "Traditional oil head massage that relaxes the mind and nourishes the scalp.",
      priceFrom: 349,
      durationMin: 30,
      image: "/images/service-headmassage.svg",
      keywords: "head massage salon, champi, oil massage, scalp massage near me",
      featured: false,
      sortOrder: 10,
    },
    {
      slug: "detan-skin-polishing",
      name: "De-Tan & Skin Polishing",
      category: "Skin",
      description: "Remove sun tan and buff away dullness for brighter, smoother skin.",
      priceFrom: 699,
      durationMin: 45,
      image: "/images/service-detan.svg",
      keywords: "de-tan treatment, skin polishing salon, tan removal near me",
      featured: false,
      sortOrder: 11,
    },
    {
      slug: "party-makeup",
      name: "Party Makeup",
      category: "Makeup",
      description: "Glam, long-wear makeup for parties, engagements and photoshoots.",
      priceFrom: 1999,
      durationMin: 60,
      image: "/images/service-partymakeup.svg",
      keywords: "party makeup artist, engagement makeup, makeup near me",
      featured: false,
      sortOrder: 12,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: service,
    });
  }

  const products = [
    {
      slug: "nourish-shampoo",
      name: "Nourish Shampoo",
      description: "Sulfate-light shampoo that cleanses without stripping natural oils.",
      price: 549,
      image: "/images/product-shampoo.jpg",
      stock: 40,
      category: "Hair Care",
    },
    {
      slug: "repair-conditioner",
      name: "Repair Conditioner",
      description: "Deep-repair conditioner for chemically treated and damaged hair.",
      price: 599,
      image: "/images/product-conditioner.jpg",
      stock: 35,
      category: "Hair Care",
    },
    {
      slug: "argan-hair-serum",
      name: "Argan Hair Serum",
      description: "Lightweight serum that smooths frizz and adds a natural shine.",
      price: 799,
      image: "/images/product-serum.jpg",
      stock: 25,
      category: "Hair Care",
    },
    {
      slug: "deep-repair-mask",
      name: "Deep Repair Hair Mask",
      description: "Weekly intensive mask that rebuilds strength from within the strand.",
      price: 899,
      image: "/images/product-mask.jpg",
      stock: 20,
      category: "Hair Care",
    },
    {
      slug: "keratin-styling-cream",
      name: "Keratin Styling Cream",
      description: "Heat-protecting styling cream that locks in keratin treatment results.",
      price: 699,
      image: "/images/product-cream.jpg",
      stock: 30,
      category: "Styling",
    },
    {
      slug: "cold-pressed-hair-oil",
      name: "Cold-Pressed Hair Oil",
      description: "A blend of cold-pressed oils to strengthen roots and add natural gloss.",
      price: 449,
      image: "/images/product-oil.jpg",
      stock: 45,
      category: "Hair Care",
    },
    {
      slug: "daily-hairwash-shampoo",
      name: "Daily Hair Wash Shampoo",
      description: "Gentle everyday shampoo for all hair types, safe for frequent use.",
      price: 399,
      image: "/images/product-hairwash.jpg",
      stock: 50,
      category: "Hair Care",
    },
    {
      slug: "smoothing-conditioner",
      name: "Smoothing Conditioner",
      description: "Lightweight everyday conditioner that detangles and smooths hair.",
      price: 449,
      image: "/images/product-smoothcond.jpg",
      stock: 40,
      category: "Hair Care",
    },
    {
      slug: "anti-dandruff-shampoo",
      name: "Anti-Dandruff Shampoo",
      description: "Clinically-formulated shampoo that controls flakes and soothes the scalp.",
      price: 499,
      image: "/images/product-antidandruff.jpg",
      stock: 35,
      category: "Hair Care",
    },
    {
      slug: "heat-protectant-spray",
      name: "Heat Protectant Spray",
      description: "Lightweight spray that shields hair from heat styling damage.",
      price: 599,
      image: "/images/product-heatprotect.jpg",
      stock: 30,
      category: "Styling",
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }

  const adminMobile = "9999999999";
  const existingAdmin = await prisma.user.findUnique({ where: { mobile: adminMobile } });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash("ChangeMe123!", 10);
    await prisma.user.create({
      data: {
        mobile: adminMobile,
        passwordHash,
        name: "Admin",
        isAdmin: true,
        onboarded: true,
      },
    });
    console.log(`Seeded default admin -> mobile: ${adminMobile}, password: ChangeMe123! (change this immediately)`);
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
