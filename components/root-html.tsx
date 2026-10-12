import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { SiteAnalytics } from "@/components/site-analytics";
import { siteUrl } from "@/lib/seo";
import "@/app/globals.css";

export const baseMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Saymore - 用说话代替打字",
    template: "%s | Saymore",
  },
  description:
    "Saymore 是面向 macOS 与 Windows 的本地优先语音输入工具，可在兼容的文本输入场景中完成识别、保守润色与文字投递。",
  openGraph: {
    title: "Saymore - 用说话代替打字",
    description: "本地优先、模型可替换，面向常见桌面输入场景的源码可用语音输入工具。",
    type: "website",
    locale: "zh_CN",
    url: "/",
    siteName: "Saymore",
  },
  twitter: {
    card: "summary_large_image",
    title: "Saymore - 用说话代替打字",
    description: "本地优先、模型可替换，面向常见桌面输入场景的源码可用语音输入工具。",
  },
};

export function RootHtml({ lang, children }: Readonly<{ lang: string; children: React.ReactNode }>) {
  return (
    <html lang={lang} className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        {children}
        <SiteAnalytics />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
