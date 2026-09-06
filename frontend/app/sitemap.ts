import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

/**
 * Only publicly useful, indexable pages belong here. Account pages (cart,
 * history, login, admin) are excluded — they are either private or thin, and
 * listing them in a sitemap while robots.txt disallows them sends Google a
 * contradictory signal.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const now = new Date();

  const routes: Array<{
    path: string;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  }> = [
    { path: "", priority: 1.0, changeFrequency: "weekly" },     // home carries every section
    { path: "/book", priority: 0.9, changeFrequency: "monthly" }, // the conversion page
    { path: "/services", priority: 0.8, changeFrequency: "monthly" },
    { path: "/products", priority: 0.6, changeFrequency: "weekly" },
  ];

  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
