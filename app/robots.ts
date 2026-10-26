import type { MetadataRoute } from "next";

// Next.js turns this into /robots.txt. Search results and the API are endless URLs, so crawlers skip them.
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/air/search"] } };
}
