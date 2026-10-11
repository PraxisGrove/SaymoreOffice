import { pricing_en, pricing_zh, pricingCss } from "@/components/pricing-content";

/** Approved hifi pricing page (hifi/gen.py output), rendered verbatim. Static, trusted markup. */
export function PricingPage({ lang }: { lang: "en" | "zh" }) {
  return (
    <div className="pricing-page" lang={lang === "zh" ? "zh-CN" : "en"}>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: generated from in-repo design file */}
      <style dangerouslySetInnerHTML={{ __html: pricingCss }} />
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: generated from in-repo design file */}
      <div dangerouslySetInnerHTML={{ __html: lang === "zh" ? pricing_zh : pricing_en }} />
    </div>
  );
}
