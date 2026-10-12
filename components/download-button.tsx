"use client";

import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import type { Lang } from "@/data/home-copy";
import { releaseUrl } from "@/data/site";

type Platform = "macos" | "windows" | null;

function detectPlatform(): Platform {
  const userAgent = navigator.userAgent.toLowerCase();
  const platform = navigator.platform.toLowerCase();
  const isMobile =
    /android|iphone|ipad|ipod/.test(userAgent) || (platform === "macintel" && navigator.maxTouchPoints > 1);

  if (isMobile) return null;
  if (userAgent.includes("windows") || platform.startsWith("win")) return "windows";
  if (userAgent.includes("mac os") || platform.startsWith("mac")) return "macos";
  return null;
}

export function DownloadButton({
  inverse = false,
  compact = false,
  lang = "zh",
  placement,
}: {
  inverse?: boolean;
  compact?: boolean;
  lang?: Lang;
  /** Analytics entry point; SiteAnalytics adds ?channel=&placement= and sends download_click. */
  placement: string;
}) {
  const en = lang === "en";
  const [platform, setPlatform] = useState<Platform>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setPlatform(detectPlatform());
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const platformName = platform === "macos" ? "macOS" : platform === "windows" ? "Windows" : null;
  const href = platform ? `/api/download?platform=${platform}` : releaseUrl;
  const label = en
    ? platformName
      ? `Download for ${platformName}`
      : "Download Saymore"
    : platformName
      ? `下载 ${platformName} 最新版`
      : "选择最新版本";

  return (
    <a
      className={`button ${inverse ? "button--light" : "button--primary"} ${compact ? "button--compact" : ""}`}
      href={href}
      data-placement={placement}
      aria-label={
        en
          ? platformName
            ? `Download the latest Saymore for ${platformName}`
            : "Choose a Saymore installer"
          : platformName
            ? `直接下载最新版 ${platformName} 安装包`
            : "选择 Saymore 最新版本安装包"
      }
    >
      <Download size={17} aria-hidden="true" />
      {label}
    </a>
  );
}
