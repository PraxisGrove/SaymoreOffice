import { type NextRequest, NextResponse } from "next/server";
import { githubUrl, releaseUrl } from "@/data/site";

function latestReleasePage(request: NextRequest) {
  return NextResponse.redirect(new URL(releaseUrl, request.url), 307);
}

type ReleaseAsset = {
  browser_download_url: string;
  name: string;
};

async function resolveLatestAsset(platform: "macos" | "windows") {
  const response = await fetch("https://api.github.com/repos/PraxisGrove/Saymore/releases/latest", {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "SaymoreOffice-download",
    },
    next: { revalidate: 300 },
  });
  if (!response.ok) return null;

  const release = (await response.json()) as { assets?: ReleaseAsset[] };
  const pattern = platform === "windows" ? /^Saymore-Setup\.exe$/ : /^Saymore_\d+\.\d+\.\d+_universal\.dmg$/;
  const asset = release.assets?.find(({ name }) => pattern.test(name));
  if (!asset) return null;

  const downloadUrl = new URL(asset.browser_download_url);
  return downloadUrl.origin === new URL(githubUrl).origin ? downloadUrl : null;
}

export async function GET(request: NextRequest) {
  const platform = request.nextUrl.searchParams.get("platform");
  if (platform !== "macos" && platform !== "windows") return latestReleasePage(request);

  try {
    const downloadUrl = await resolveLatestAsset(platform);
    if (!downloadUrl) return latestReleasePage(request);

    const redirect = NextResponse.redirect(downloadUrl, 307);
    redirect.headers.set("Cache-Control", "public, max-age=300, stale-while-revalidate=3600");
    return redirect;
  } catch {
    return latestReleasePage(request);
  }
}
