"use client";

import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import { releaseUrl } from "@/data/site";

export function DownloadButton({ inverse = false }: { inverse?: boolean }) {
  const [platform, setPlatform] = useState("最新版本");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const value = `${navigator.userAgent} ${navigator.platform}`.toLowerCase();
      if (value.includes("mac")) setPlatform("macOS");
      else if (value.includes("win")) setPlatform("Windows");
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <a
      className={inverse ? "button button--light" : "button button--primary"}
      href={releaseUrl}
      target="_blank"
      rel="noreferrer"
    >
      <Download size={17} aria-hidden="true" />
      下载 {platform}
    </a>
  );
}
