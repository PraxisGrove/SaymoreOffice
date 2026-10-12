"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect } from "react";
import { currentChannel, referrerDomain } from "@/lib/channel";

// Umami Cloud. Nothing loads unless NEXT_PUBLIC_UMAMI_WEBSITE_ID is set.
// Auto-tracking is off: page_view / pricing_view / download_click are sent by us via umami.track.
// Events fired before the script has loaded are dropped (not queued); onLoad replays the page events.
export const UMAMI_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID || "";
// Same-origin proxy via vercel.json rewrites: /stats/script.js and /stats/api/send -> cloud.umami.is
const UMAMI_SRC = "/stats/script.js";

type Props = Record<string, string>;
declare global {
  interface Window {
    umami?: { track: (event: string, data?: Record<string, string>) => void };
  }
}

function track(event: string, props: Props) {
  if (!UMAMI_ID || !window.umami) return;
  window.umami.track(event, props);
}

const isDownload = (url: URL) =>
  url.pathname === "/api/download" || /github\.com\/PraxisGrove\/Saymore\/releases\/latest/.test(url.href);
const isCheckout = (a: HTMLAnchorElement) => a.hasAttribute("data-checkout");

const isPricing = (url: URL) => url.origin === location.origin && /^\/(zh\/)?pricing\/?$/.test(url.pathname);

// channel = where the visitor came from (fixed for the session); placement = which entry on the page.
function decorate(a: HTMLAnchorElement, channel: string) {
  const raw = a.getAttribute("href") ?? "";
  if (!raw || raw.startsWith("#")) return; // checkout URL not set yet
  let url: URL;
  try {
    url = new URL(raw, location.href);
  } catch {
    return;
  }
  if (!(isDownload(url) || isPricing(url) || isCheckout(a))) return;
  url.searchParams.set("channel", channel);
  const placement = a.dataset.placement;
  if (placement) url.searchParams.set("placement", placement);
  const next = url.origin === location.origin ? url.pathname + url.search + url.hash : url.href;
  if (next !== raw) a.setAttribute("href", next); // guard: the MutationObserver below must not loop
}

function decorateLinks(channel: string) {
  for (const a of document.querySelectorAll<HTMLAnchorElement>("a[href]")) decorate(a, channel);
}

function detectOs() {
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("windows")) return "windows";
  if (ua.includes("mac os")) return "macos";
  return "other";
}

function pageEvents(pathname: string) {
  const channel = currentChannel();
  const utm: Props = {};
  for (const [k, v] of new URLSearchParams(location.search)) if (k.startsWith("utm_")) utm[k] = v.slice(0, 80);
  track("page_view", { page: pathname, channel, referrer_domain: referrerDomain(), ...utm });
  if (pathname === "/pricing" || pathname === "/zh/pricing")
    track("pricing_view", { channel, placement: new URLSearchParams(location.search).get("placement") || "none" });
}

export function SiteAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    const channel = currentChannel();
    decorateLinks(channel);
    pageEvents(pathname);
    // Links rendered or re-rendered later (download button after platform detection, mobile menu)
    const observer = new MutationObserver(() => decorateLinks(channel));
    observer.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["href"] });
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      decorate(a, currentChannel()); // href may have changed after hydration (platform detection)
      const url = new URL(a.href);
      if (!isDownload(url)) return;
      const platform = url.searchParams.get("platform");
      track("download_click", {
        os: platform ?? detectOs(),
        arch: platform === "windows" ? "x64" : platform === "macos" ? "universal" : "unknown",
        version: "latest",
        channel: currentChannel(),
        placement: a.dataset.placement || "none",
      });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  if (!UMAMI_ID) return null;
  return (
    <Script
      src={UMAMI_SRC}
      data-website-id={UMAMI_ID}
      data-host-url="/stats"
      data-auto-track="false"
      strategy="afterInteractive"
      onLoad={() => pageEvents(location.pathname)}
    />
  );
}
