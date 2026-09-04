// Generates on-brand SVG placeholder imagery so the site renders fully
// before real salon photography is dropped into public/images.
// Run: node scripts/generate-placeholders.mjs
//
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public", "images");
mkdirSync(outDir, { recursive: true });

const PALETTE = {
  gold: "#C9A24B",
  goldGlow: "#F0C869",
  cream: "#FBF3E3",
  black: "#14110F",
  navy: "#0F1D36",
};

function escapeXml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function hashSeed(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

function darkPlaceholder({ id, width, height, label, sublabel = "", bare = false }) {
  const seed = hashSeed(id);
  const lines = Array.from({ length: 6 }).map((_, i) => {
    const y = ((seed >> (i * 3)) % height) + i * (height / 6);
    return `<line x1="0" y1="${y % height}" x2="${width}" y2="${(y + 120) % height}" stroke="${PALETTE.gold}" stroke-opacity="0.08" stroke-width="1.5" />`;
  }).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="g-${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${PALETTE.navy}" />
      <stop offset="100%" stop-color="${PALETTE.black}" />
    </linearGradient>
    <radialGradient id="glow-${id}" cx="50%" cy="30%" r="70%">
      <stop offset="0%" stop-color="${PALETTE.gold}" stop-opacity="0.16" />
      <stop offset="100%" stop-color="${PALETTE.gold}" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#g-${id})" />
  <rect width="${width}" height="${height}" fill="url(#glow-${id})" />
  ${lines}
  <rect x="0" y="0" width="${width}" height="${height}" fill="none" stroke="${PALETTE.gold}" stroke-opacity="0.25" stroke-width="1" />
  ${bare ? "" : `<text x="50%" y="${height / 2 - 6}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="${Math.max(20, width / 22)}" fill="${PALETTE.goldGlow}" letter-spacing="1">${escapeXml(label)}</text>`}
  ${!bare && sublabel ? `<text x="50%" y="${height / 2 + 24}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="${Math.max(11, width / 60)}" fill="${PALETTE.cream}" fill-opacity="0.55" letter-spacing="3">${escapeXml(sublabel.toUpperCase())}</text>` : ""}
</svg>`;
}

function lightPlaceholder({ id, width, height, label, sublabel = "" }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="g-${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${PALETTE.cream}" />
      <stop offset="100%" stop-color="#F1E3C6" />
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#g-${id})" />
  <circle cx="${width * 0.85}" cy="${height * 0.15}" r="${width * 0.22}" fill="${PALETTE.gold}" fill-opacity="0.12" />
  <circle cx="${width * 0.1}" cy="${height * 0.9}" r="${width * 0.18}" fill="${PALETTE.navy}" fill-opacity="0.06" />
  <rect x="0" y="0" width="${width}" height="${height}" fill="none" stroke="${PALETTE.gold}" stroke-opacity="0.35" stroke-width="1" />
  <text x="50%" y="${height / 2 - 4}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="${Math.max(18, width / 16)}" fill="${PALETTE.navy}" letter-spacing="1">${escapeXml(label)}</text>
  ${sublabel ? `<text x="50%" y="${height / 2 + 22}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="${Math.max(10, width / 40)}" fill="${PALETTE.gold}" letter-spacing="2">${escapeXml(sublabel.toUpperCase())}</text>` : ""}
</svg>`;
}

const assets = [
  { file: "hero-banner", w: 1920, h: 1080, label: "Tejas Salon", sub: "Hair . Skin . Makeup", style: "dark", bare: true },
  { file: "about-story", w: 1200, h: 1400, label: "The Tejas Story", style: "dark", bare: true },
  { file: "login-gate", w: 1600, h: 900, label: "Reserve Your Spot", style: "dark", bare: true },
  { file: "offer-banner", w: 1600, h: 500, label: "Festive Glow Offer", sub: "Limited period", style: "dark", bare: true },

  { file: "service-haircut", w: 900, h: 1100, label: "Hair Cut & Styling", style: "dark" },
  { file: "service-color", w: 900, h: 1100, label: "Hair Color & Highlights", style: "dark" },
  { file: "service-spa", w: 900, h: 1100, label: "Hair Spa & Treatments", style: "dark" },
  { file: "service-keratin", w: 900, h: 1100, label: "Keratin & Smoothening", style: "dark" },
  { file: "service-skin", w: 900, h: 1100, label: "Skin & Facial Care", style: "dark" },
  { file: "service-makeup", w: 900, h: 1100, label: "Bridal & Party Makeup", style: "dark" },
  { file: "service-nails", w: 900, h: 1100, label: "Nail Art & Care", style: "dark" },
  { file: "service-threading", w: 900, h: 1100, label: "Threading & Waxing", style: "dark" },
  { file: "service-extensions", w: 900, h: 1100, label: "Hair Extensions", style: "dark" },
  { file: "service-headmassage", w: 900, h: 1100, label: "Head Massage & Champi", style: "dark" },
  { file: "service-detan", w: 900, h: 1100, label: "De-Tan & Skin Polishing", style: "dark" },
  { file: "service-partymakeup", w: 900, h: 1100, label: "Party Makeup", style: "dark" },

  { file: "gallery-1", w: 900, h: 900, label: "Salon Interior", style: "dark" },
  { file: "gallery-2", w: 900, h: 900, label: "Styling Chairs", style: "dark" },
  { file: "gallery-3", w: 900, h: 900, label: "Color Bar", style: "dark" },
  { file: "gallery-4", w: 900, h: 900, label: "Wash Lounge", style: "dark" },
  { file: "gallery-5", w: 900, h: 900, label: "Product Wall", style: "dark" },
  { file: "gallery-6", w: 900, h: 900, label: "Nail Studio", style: "dark" },
  { file: "gallery-7", w: 900, h: 900, label: "Storefront", style: "dark" },
  { file: "gallery-8", w: 900, h: 900, label: "Guest Lounge", style: "dark" },

  { file: "team-1", w: 700, h: 900, label: "Senior Stylist", style: "dark" },
  { file: "team-2", w: 700, h: 900, label: "Colour Specialist", style: "dark" },
  { file: "team-3", w: 700, h: 900, label: "Skin Expert", style: "dark" },
  { file: "team-4", w: 700, h: 900, label: "Bridal Artist", style: "dark" },
  { file: "team-5", w: 700, h: 900, label: "Nail Specialist", style: "dark" },
  { file: "team-6", w: 700, h: 900, label: "Salon Manager", style: "dark" },

  { file: "product-shampoo", w: 700, h: 900, label: "Nourish Shampoo", style: "light" },
  { file: "product-conditioner", w: 700, h: 900, label: "Repair Conditioner", style: "light" },
  { file: "product-serum", w: 700, h: 900, label: "Argan Hair Serum", style: "light" },
  { file: "product-mask", w: 700, h: 900, label: "Deep Repair Mask", style: "light" },
  { file: "product-cream", w: 700, h: 900, label: "Keratin Styling Cream", style: "light" },
  { file: "product-oil", w: 700, h: 900, label: "Cold-Pressed Hair Oil", style: "light" },
  { file: "product-hairwash", w: 700, h: 900, label: "Daily Hair Wash Shampoo", style: "light" },
  { file: "product-smoothcond", w: 700, h: 900, label: "Smoothing Conditioner", style: "light" },
  { file: "product-antidandruff", w: 700, h: 900, label: "Anti-Dandruff Shampoo", style: "light" },
  { file: "product-heatprotect", w: 700, h: 900, label: "Heat Protectant Spray", style: "light" },
];

for (const a of assets) {
  const svg = (a.style === "light" ? lightPlaceholder : darkPlaceholder)({
    id: a.file,
    width: a.w,
    height: a.h,
    label: a.label,
    sublabel: a.sub,
    bare: a.bare,
  });
  writeFileSync(join(outDir, `${a.file}.svg`), svg, "utf8");
}

console.log(`Generated ${assets.length} placeholder images in ${outDir}`);
