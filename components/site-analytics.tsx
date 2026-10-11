"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect } from "react";
import { currentChannel, referrerDomain } from "@/lib/channel";

// Plausible (hosted) via same-origin Vercel rewrites in vercel.json.
// Off unless NEXT_PUBLIC_PLAUSIBLE_ENABLED=1 (account not registered yet).
const ENABLED = process.env.NEXT_PUBLIC_PLAUSIBLE_ENABLED === "1";
const DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || "saymore.praxisgrove.org";

type Props = Record<string, string>;
type PlausibleFn = ((event: string, options?: { props?: Props; u?: string }) => void) & { q?: unknown[] };
declare global {
  interface Window {
    plausible?: PlausibleFn;
  }
}

function track(event: string, props: Props) {
  if (!ENABLED) return;
  if (!window.plausible) {
    const queue: unknown[] = [];
    const stub = ((...args: unknown[]) => {
      queue.push(args);
    }) as PlausibleFn;
    stub.q = queue;
    window.plausible = stub;
  }
  window.plausible(event, { props });
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

  if (!ENABLED) return null;
  return (
    <Script
      src="/stats/js/script.manual.js"
      data-domain={DOMAIN}
      data-api="/stats/api/event"
      strategy="afterInteractive"
    />
  );
}
