"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect } from "react";
import { CookieConsent } from "@/components/cookie-consent";
import { currentChannel, referrerDomain } from "@/lib/channel";

// Google Analytics 4. Nothing loads unless NEXT_PUBLIC_GA_ID is set.
// Consent Mode v2: everything denied by default until the user accepts (see cookie-consent.tsx).
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";

type Props = Record<string, string>;
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function track(event: string, props: Props) {
  if (!GA_ID || !window.gtag) return;
  window.gtag("event", event, props);
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

// Runs before gtag.js: queue + Consent Mode v2 defaults (all denied) + config without auto page_view.
const bootstrap = (id: string) => `
window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});
try{if(localStorage.getItem('saymore_consent')==='granted'){gtag('consent','update',{analytics_storage:'granted'});}}catch(e){}
gtag('js',new Date());gtag('config',${JSON.stringify(id)},{send_page_view:false});
`;

export function SiteAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    const channel = currentChannel();
    decorateLinks(channel);
    const utm: Props = {};
    for (const [k, v] of new URLSearchParams(location.search)) if (k.startsWith("utm_")) utm[k] = v.slice(0, 80);
    track("page_view", { page: pathname, channel, referrer_domain: referrerDomain(), ...utm });
    if (pathname === "/pricing" || pathname === "/zh/pricing")
      track("pricing_view", { channel, placement: new URLSearchParams(location.search).get("placement") || "none" });
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

  if (!GA_ID) return null;
  return (
    <>
      <Script id="ga-consent-default" strategy="afterInteractive">
        {bootstrap(GA_ID)}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`}
        strategy="afterInteractive"
      />
      <CookieConsent />
    </>
  );
}
