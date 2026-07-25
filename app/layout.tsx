import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://saymore-office.vercel.app"),
  title: {
    default: "Saymore - 用说话代替打字",
    template: "%s | Saymore",
  },
  description: "Saymore 是面向 macOS 与 Windows 的本地优先语音输入工具，在任意输入框中完成识别、保守润色与文字投递。",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Saymore - 用说话代替打字",
    description: "本地优先、模型可替换、能在任何应用中工作的源码可用语音输入工具。",
    type: "website",
    locale: "zh_CN",
    url: "/",
    siteName: "Saymore",
  },
  twitter: {
    card: "summary_large_image",
    title: "Saymore - 用说话代替打字",
    description: "本地优先、模型可替换、能在任何应用中工作的源码可用语音输入工具。",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
