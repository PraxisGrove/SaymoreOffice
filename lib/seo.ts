import type { Metadata } from "next";

export const siteUrl = "https://saymore.praxisgrove.org";

/** canonical (self) + reciprocal hreflang en / zh / x-default + og:url for a page pair. */
export function pageSeo(self: "en" | "zh", en: string, zh: string): Pick<Metadata, "alternates"> & { ogUrl: string } {
  const path = self === "en" ? en : zh;
  return {
    alternates: { canonical: path, languages: { en, zh, "x-default": en } },
    ogUrl: path,
  };
}

export function og(url: string, title: string, description: string, locale: "en_US" | "zh_CN"): Metadata["openGraph"] {
  return { title, description, url, type: "website", locale, siteName: "Saymore" };
}
