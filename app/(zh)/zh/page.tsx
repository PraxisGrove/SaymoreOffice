import type { Metadata } from "next";
import { HomePage } from "@/components/home-page";
import { og, pageSeo, twitter } from "@/lib/seo";

export const metadata: Metadata = {
  alternates: pageSeo("zh", "/", "/zh").alternates,
  openGraph: og(
    "/zh",
    "Saymore - 用说话代替打字",
    "本地优先、模型可替换，面向常见桌面输入场景的源码可用语音输入工具。",
    "zh_CN",
  ),
  twitter: twitter("Saymore - 用说话代替打字", "本地优先、模型可替换，面向常见桌面输入场景的源码可用语音输入工具。"),
};

export default function Page() {
  return <HomePage lang="zh" />;
}
