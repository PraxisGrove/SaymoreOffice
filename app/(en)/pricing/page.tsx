import type { Metadata } from "next";
import { PricingPage } from "@/components/pricing-page";
import { og, pageSeo, twitter } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Dictation and your personal dictionary are free, no key needed. Pay once to unlock refinement, which runs on your own cloud API key.",
  // Placeholder prices: remove noindex once final prices are set.
  robots: { index: false, follow: true },
  alternates: pageSeo("en", "/pricing", "/zh/pricing").alternates,
  openGraph: og(
    "/pricing",
    "Pricing | Saymore",
    "Dictation and your personal dictionary are free, no key needed. Pay once to unlock refinement, which runs on your own cloud API key.",
    "en_US",
  ),
  twitter: twitter(
    "Pricing | Saymore",
    "Dictation and your personal dictionary are free, no key needed. Pay once to unlock refinement, which runs on your own cloud API key.",
  ),
};

export default function Page() {
  return <PricingPage lang="en" />;
}
