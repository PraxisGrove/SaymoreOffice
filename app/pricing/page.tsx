import type { Metadata } from "next";
import { PricingPage } from "@/components/pricing-page";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Dictation is free. Refinement is a one-time purchase. Bring your own API key.",
  alternates: { canonical: "/pricing", languages: { "zh-CN": "/zh/pricing" } },
};

export default function Page() {
  return <PricingPage lang="en" />;
}
