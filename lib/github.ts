import type { Lang } from "@/data/home-copy";
import { githubUrl } from "@/data/site";

export type ReleaseSummary = {
  name: string;
  date: string;
  href: string;
  /** Markdown excerpt (first paragraph that isn't a heading). Render with <ReleaseSummary />. */
  summary: string;
};

type GitHubRelease = {
  name: string | null;
  tag_name: string;
  published_at: string | null;
  html_url: string;
  body: string | null;
  draft: boolean;
};

const text = {
  en: {
    latest: "See the latest release",
    ongoing: "Ongoing",
    fallback: "Saymore is under active development. macOS and Windows installers are published on GitHub Releases.",
    noDate: "Date to be announced",
    noBody: "Installers, checksums and release notes.",
  },
  zh: {
    latest: "查看最新版本",
    ongoing: "持续更新",
    fallback: "Saymore 正在积极开发中，macOS 与 Windows 安装包通过 GitHub Releases 发布。",
    noDate: "发布日期待定",
    noBody: "查看本次发布的安装包、校验和与变更说明。",
  },
};

/** First Markdown block that is real prose (skips headings, rules, blank lines). */
export function firstParagraph(body: string | null): string {
  if (!body) return "";
  const blocks = body.replace(/\r\n/g, "\n").split(/\n\s*\n/);
  for (const block of blocks) {
    const b = block.trim();
    if (!b || /^#{1,6}\s/.test(b) || /^([-*_]\s*){3,}$/.test(b) || /^<!--/.test(b)) continue;
    return b.length > 400 ? `${b.slice(0, 400).replace(/\s+\S*$/, "")}…` : b;
  }
  return "";
}

export async function getRecentReleases(lang: Lang = "zh"): Promise<ReleaseSummary[]> {
  const t = text[lang];
  const fallback = [{ name: t.latest, date: t.ongoing, href: `${githubUrl}/releases`, summary: t.fallback }];
  try {
    const response = await fetch("https://api.github.com/repos/PraxisGrove/Saymore/releases?per_page=3", {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 3600 },
    });
    if (!response.ok) return fallback;

    const releases = (await response.json()) as GitHubRelease[];
    const published = releases.filter((release) => !release.draft).slice(0, 3);
    if (published.length === 0) return fallback;

    const fmt = new Intl.DateTimeFormat(lang === "en" ? "en-US" : "zh-CN", { dateStyle: "medium", timeZone: "UTC" });
    return published.map((release) => ({
      name: release.name || release.tag_name,
      date: release.published_at ? fmt.format(new Date(release.published_at)) : t.noDate,
      href: release.html_url,
      summary: firstParagraph(release.body) || t.noBody,
    }));
  } catch {
    return fallback;
  }
}
