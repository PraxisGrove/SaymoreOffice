// Channel classification, per /workspace/growth/saymore.md「渠道归类」.
const AI = [
  "chatgpt.com",
  "chat.openai.com",
  "perplexity.ai",
  "gemini.google.com",
  "copilot.microsoft.com",
  "claude.ai",
];
const SEARCH = ["google.", "bing.com", "duckduckgo.com", "search.yahoo.", "yandex.", "baidu.com", "ecosia.org"];
const SOCIAL = [
  "x.com",
  "twitter.com",
  "t.co",
  "reddit.com",
  "news.ycombinator.com",
  "linkedin.com",
  "facebook.com",
  "youtube.com",
  "weibo.com",
  "v2ex.com",
];

const hostMatches = (host: string, list: string[]) =>
  list.some((d) => (d.endsWith(".") ? host.includes(d) : host === d || host.endsWith(`.${d}`)));

export function classifyChannel(referrer: string, search: string, ownHost: string): string {
  const utm = new URLSearchParams(search).get("utm_source");
  if (utm) return `campaign:${utm.toLowerCase().slice(0, 40)}`;
  let host = "";
  try {
    host = referrer ? new URL(referrer).hostname.replace(/^www\./, "") : "";
  } catch {}
  if (!host || host === ownHost) return "direct";
  if (hostMatches(host, AI)) return "ai_search";
  if (hostMatches(host, SEARCH)) return "organic_search";
  if (hostMatches(host, SOCIAL)) return "social";
  return "referral";
}

/** First-touch channel for this tab session (sessionStorage only, no cookies). */
export function currentChannel(): string {
  const key = "saymore_channel";
  try {
    const saved = sessionStorage.getItem(key);
    if (saved) return saved;
    const ch = classifyChannel(document.referrer, location.search, location.hostname.replace(/^www\./, ""));
    sessionStorage.setItem(key, ch);
    return ch;
  } catch {
    return classifyChannel(document.referrer, location.search, location.hostname);
  }
}

export function referrerDomain(): string {
  try {
    return document.referrer ? new URL(document.referrer).hostname.replace(/^www\./, "") : "";
  } catch {
    return "";
  }
}
