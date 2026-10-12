import type { Metadata } from "next";
import { HomePage } from "@/components/home-page";
import { og, pageSeo, twitter } from "@/lib/seo";

export const metadata: Metadata = {
  title: { absolute: "Saymore — Speak instead of type" },
  description:
    "Press a shortcut, talk, and Saymore types clean text at your cursor in any app on macOS and Windows. Bring your own API key.",
  alternates: pageSeo("en", "/", "/zh").alternates,
  openGraph: og(
    "/",
    "Saymore — Speak instead of type",
    "Press a shortcut, talk, and Saymore types clean text at your cursor in any app on macOS and Windows.",
    "en_US",
  ),
  twitter: twitter(
    "Saymore — Speak instead of type",
    "Press a shortcut, talk, and Saymore types clean text at your cursor in any app on macOS and Windows.",
  ),
};

// Not to ship until the hero demo and refinement examples use real English material (see TODOs in components/home-page.tsx).
export default function Page() {
  return <HomePage lang="en" />;
}
