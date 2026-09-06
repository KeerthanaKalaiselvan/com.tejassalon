/**
 * One place that decides the site's canonical origin.
 *
 * NEXT_PUBLIC_SITE_URL currently points at localhost, which is fine in dev but
 * would publish localhost URLs into sitemap.xml, robots.txt, canonicals and
 * OpenGraph tags if it shipped that way — Google would drop every one of them.
 * In production we fall back to the real domain rather than emit localhost.
 */
const PROD_URL = "https://tejasbeautylounge.in"; // <-- set to the real domain when you have it

export function siteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  const isLocal = !configured || /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?$/i.test(configured);

  if (process.env.NODE_ENV === "production" && isLocal) return PROD_URL;
  return configured || "http://localhost:3070";
}

/** True when we're serving from a real public domain (not a dev/preview host). */
export function isPublicSite(): boolean {
  return !/localhost|127\.0\.0\.1|0\.0\.0\.0/i.test(siteUrl());
}
