import type { Metadata } from "next";
import { PricingPage } from "@/components/pricing-page";

export const metadata: Metadata = {
  title: "定价",
  description: "听写免费，润色一次买断。使用你自己的 API key。",
  // Placeholder prices: remove noindex once final prices are set.
  robots: { index: false, follow: true },
  alternates: { canonical: "/zh/pricing", languages: { en: "/pricing" } },
};

export default function Page() {
  return <PricingPage lang="zh" />;
}
