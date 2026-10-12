import type { Metadata } from "next";
import { PricingPage } from "@/components/pricing-page";
import { og, pageSeo, twitter } from "@/lib/seo";

export const metadata: Metadata = {
  title: "定价",
  description: "听写和个人词典免费，不需要 key。付一次钱，解锁润色（要接你自己的云端 API key）。",
  // Placeholder prices: remove noindex once final prices are set.
  robots: { index: false, follow: true },
  alternates: pageSeo("zh", "/pricing", "/zh/pricing").alternates,
  openGraph: og(
    "/zh/pricing",
    "定价 | Saymore",
    "听写和个人词典免费，不需要 key。付一次钱，解锁润色（要接你自己的云端 API key）。",
    "zh_CN",
  ),
  twitter: twitter(
    "定价 | Saymore",
    "听写和个人词典免费，不需要 key。付一次钱，解锁润色（要接你自己的云端 API key）。",
  ),
};

export default function Page() {
  return <PricingPage lang="zh" />;
}
