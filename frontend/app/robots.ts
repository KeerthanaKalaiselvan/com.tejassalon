import type { MetadataRoute } from "next";
import { siteUrl, isPublicSite } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();

  // Never let a staging/preview host get indexed.
  if (!isPublicSite()) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Private or thin pages. Nothing here is useful in search results.
        disallow: ["/admin", "/admin/", "/cart", "/history", "/login"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
