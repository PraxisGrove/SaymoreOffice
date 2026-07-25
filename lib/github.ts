import { githubUrl } from "@/data/site";

export type ReleaseSummary = {
  name: string;
  date: string;
  href: string;
  description: string;
};

type GitHubRelease = {
  name: string | null;
  tag_name: string;
  published_at: string | null;
  html_url: string;
  body: string | null;
  draft: boolean;
};

const fallback: ReleaseSummary[] = [
  {
    name: "查看最新版本",
    date: "持续更新",
    href: `${githubUrl}/releases`,
    description: "Saymore 正在积极开发中，macOS 与 Windows 安装包通过 GitHub Releases 发布。",
  },
];

export async function getRecentReleases(): Promise<ReleaseSummary[]> {
  try {
    const response = await fetch("https://api.github.com/repos/PraxisGrove/Saymore/releases?per_page=3", {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 3600 },
    });

    if (!response.ok) return fallback;

    const releases = (await response.json()) as GitHubRelease[];
    const published = releases.filter((release) => !release.draft).slice(0, 3);

    if (published.length === 0) return fallback;

    return published.map((release) => ({
      name: release.name || release.tag_name,
      date: release.published_at
        ? new Intl.DateTimeFormat("zh-CN", { dateStyle: "medium" }).format(new Date(release.published_at))
        : "发布日期待定",
      href: release.html_url,
      description:
        release.body
          ?.split("\n")
          .find((line) => line.trim().length > 0)
          ?.slice(0, 120) || "查看本次发布的安装包、校验和与变更说明。",
    }));
  } catch {
    return fallback;
  }
}
