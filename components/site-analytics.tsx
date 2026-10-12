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

function withChannel(href: string, channel: string) {
  if (!href || href.startsWith("#")) return null; // checkout URL not set yet
  const url = new URL(href, location.href);
  url.searchParams.set("channel", channel);
  return url.origin === location.origin ? url.pathname + url.search + url.hash : url.href;
}

function decorateLinks(channel: string) {
  for (const a of document.querySelectorAll<HTMLAnchorElement>("a[href]")) {
    const raw = a.getAttribute("href") ?? "";
    let url: URL;
    try {
      url = new URL(raw, location.href);
    } catch {
      continue;
    }
    if (isDownload(url) || isCheckout(a)) {
      const next = withChannel(raw, channel);
      if (next) a.setAttribute("href", next);
    }
  }
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
    if (pathname === "/pricing" || pathname === "/zh/pricing") track("pricing_view", { channel });
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      const url = new URL(a.href);
      if (!isDownload(url)) return;
      const platform = url.searchParams.get("platform");
      track("download_click", {
        os: platform ?? detectOs(),
        arch: platform === "windows" ? "x64" : platform === "macos" ? "universal" : "unknown",
        version: "latest",
        channel: currentChannel(),
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
