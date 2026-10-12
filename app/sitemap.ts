import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

// Pricing pages stay out until final prices replace the placeholders (they are noindex).
export default function sitemap(): MetadataRoute.Sitemap {
  const languages = { en: `${siteUrl}/`, zh: `${siteUrl}/zh`, "x-default": `${siteUrl}/` };
  return [
    { url: `${siteUrl}/`, alternates: { languages } },
    { url: `${siteUrl}/zh`, alternates: { languages } },
  ];
}
