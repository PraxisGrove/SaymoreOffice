import type { Metadata } from "next";
import { HomePage } from "@/components/home-page";
import { og, pageSeo, twitter } from "@/lib/seo";

export const metadata: Metadata = {
  title: { absolute: "Saymore — Speak instead of type" },
  description:
    "Press a shortcut and talk. Saymore turns your speech into clean text at your cursor, in the app you’re already using, on macOS and Windows. Dictation is free, no key needed.",
  alternates: pageSeo("en", "/", "/zh").alternates,
  openGraph: og(
    "/",
    "Saymore — Speak instead of type",
    "Press a shortcut and talk. Saymore turns your speech into clean text at your cursor, in the app you’re already using, on macOS and Windows. Dictation is free, no key needed.",
    "en_US",
  ),
  twitter: twitter(
    "Saymore — Speak instead of type",
    "Press a shortcut and talk. Saymore turns your speech into clean text at your cursor, in the app you’re already using, on macOS and Windows. Dictation is free, no key needed.",
  ),
};

// Not to ship until the hero demo and refinement examples use real English material (see TODOs in components/home-page.tsx).
export default function Page() {
  return <HomePage lang="en" />;
}
