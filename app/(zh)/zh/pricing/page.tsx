import type { Metadata } from "next";
import { PricingPage } from "@/components/pricing-page";
import { og, pageSeo, twitter } from "@/lib/seo";

export const metadata: Metadata = {
  title: "定价",
  description: "听写免费，润色一次买断。使用你自己的 API key。",
  // Placeholder prices: remove noindex once final prices are set.
  robots: { index: false, follow: true },
  alternates: pageSeo("zh", "/pricing", "/zh/pricing").alternates,
  openGraph: og("/zh/pricing", "定价 | Saymore", "听写免费，润色一次买断。使用你自己的 API key。", "zh_CN"),
  twitter: twitter("定价 | Saymore", "听写免费，润色一次买断。使用你自己的 API key。"),
};

export default function Page() {
  return <PricingPage lang="zh" />;
}
