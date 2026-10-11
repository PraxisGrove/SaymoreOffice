import type { Metadata } from "next";
import { pricingCss } from "@/components/pricing-content";
import { RefinementComparison } from "@/components/refinement-comparison";
import { githubUrl, releaseUrl } from "@/data/site";
import { og, pageSeo, twitter } from "@/lib/seo";

const enLabels = { prev: "Previous example", next: "Next example", before: "What you said", after: "What gets typed" };
const enComparisons = [
  {
    title: "Drops the filler, keeps your tone",
    before: "So, um, I think we should maybe, like, push the release to Thursday? Not that we can't ship Wednesday.",
    after: "I think we should push the release to Thursday. Not that we can't ship Wednesday.",
    note: "Filler goes. Hedges you meant stay.",
  },
  {
    title: "Follows your corrections",
    before: "Let's meet at three, no wait, four thirty, and loop in the design team.",
    after: "Let's meet at 4:30 and loop in the design team.",
    note: "Keeps the correction, drops the mistake.",
  },
  {
    title: "Leaves code alone",
    before: "Store the API key in the keychain and then run cargo test dash dash workspace.",
    after: "Store the API key in the keychain, then run `cargo test --workspace`.",
    note: "Commands, paths and model names come through intact.",
  },
];

export const metadata: Metadata = {
  title: { absolute: "Saymore — Speak instead of type" },
  description:
    "Press a shortcut, talk, and Saymore types clean text at your cursor in any app on macOS and Windows. Bring your own API key.",
  alternates: pageSeo("en", "/", "/zh").alternates,
  openGraph: og(
    "/",
    "Saymore — Speak instead of type",
    "Press a shortcut, talk, and Saymore types clean text at your cursor in any app on macOS and Windows.",
    "en_US",
  ),
  twitter: twitter(
    "Saymore — Speak instead of type",
    "Press a shortcut, talk, and Saymore types clean text at your cursor in any app on macOS and Windows.",
  ),
};

const homeCss = `
.home .comparison-toolbar strong{text-wrap:balance}.home .comparison-toolbar span{white-space:nowrap}
.home .bar,.home footer{position:relative}
.home .bar::after,.home footer::before{content:"";position:absolute;left:40px;right:40px;border-top:1px solid var(--line)}
.home .bar::after{bottom:0}.home footer::before{top:0}.home footer{border-top:0}
.home .comparison-after{background:#E8F0FE}.home .comparison-after .comparison-label{color:#2563EB}
.home .comparison-note{color:#606060;font-size:13px}.home .comparison-note svg{display:none}
.home .h-hero .small{margin-top:12px;font-size:13px;color:var(--muted)}
.home .h-demo{padding:0 0 24px}
.home .h-hero{padding:96px 0 72px;max-width:820px}
.home .h-hero h1{font-size:64px;line-height:1.05;letter-spacing:-.035em;font-weight:640;margin:0 0 24px}
.home .h-hero p{font-size:20px;color:var(--text);margin:0 0 32px;max-width:640px}
.home .h-feats{display:grid;grid-template-columns:4fr 8fr;gap:64px;padding:80px 0;border-top:1px solid var(--line);margin-top:56px}
.home .h-feats h2{font-size:32px;font-weight:620;letter-spacing:-.02em;margin:0}
.home .fl{display:grid;grid-template-columns:1fr 1fr;gap:36px 48px}.home .fl h3{font-size:16px;font-weight:600;margin:0 0 6px}.home .fl p{margin:0;color:var(--text);font-size:15px}
.home .h-end{padding:72px 0 96px;border-top:1px solid var(--line);display:flex;justify-content:space-between;align-items:center;gap:32px;flex-wrap:wrap}
.home .h-end h2{font-size:32px;font-weight:620;letter-spacing:-.02em;margin:0}
@media(max-width:700px){.home .bar::after,.home footer::before{left:20px;right:20px}.home .h-hero{padding:48px 0 40px}.home .h-hero h1{font-size:40px}.home .h-hero p{font-size:17px}
.home .h-feats{grid-template-columns:1fr;gap:28px;padding:56px 0}.home .fl{grid-template-columns:1fr;gap:24px}.home .h-end{padding:48px 0 64px}.home .h-end h2{font-size:26px}}
`;

const features = [
  ["Works where you type", "Editors, browsers, chat apps and terminals. Text lands at your cursor."],
  ["Your provider, your bill", "Connect a speech API you already use. We add nothing on top."],
  ["Refinement", "Removes filler words and fixes punctuation, without rewriting what you meant."],
  ["Personal dictionary", "Import a CSV of names and jargon. It also learns from the edits you make."],
  ["Private by default", "History is encrypted on your machine. Raw audio is never stored."],
  ["Source-available", "Read and build the code under PolyForm Shield 1.0.0."],
];

export default function HomePage() {
  return (
    <div className="pricing-page home" lang="en">
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: in-repo design tokens */}
      <style dangerouslySetInnerHTML={{ __html: pricingCss + homeCss }} />
      <header className="bar">
        <a href="/" className="logo">
          {/* biome-ignore lint/performance/noImgElement: SVG wordmark, fixed size */}
          <img src="/brand/saymore-wordmark-small-light.svg" alt="Saymore" height={28} width={103} />
        </a>
        <nav>
          <a href="/api/download">Download</a>
          <a href="/pricing">Pricing</a>
          <a href={`${githubUrl}/releases`}>Changelog</a>
          <a href={githubUrl}>GitHub</a>
          <a href="/zh" lang="zh-CN">
            中文
          </a>
        </nav>
      </header>
      <main>
        <section className="h-hero">
          <h1>Speak instead of type.</h1>
          <p>
            Press a shortcut and talk. Saymore turns it into clean text at your cursor, in any app on macOS and Windows.
          </p>
          <div className="cta">
            <a className="btn primary" href={releaseUrl}>
              Download free
            </a>
            <a className="btn" href="/pricing">
              See pricing
            </a>
          </div>
          <p className="small">14-day full trial starts when you first open the app. No card needed.</p>
        </section>
        <section className="h-demo" aria-label="Dictation demo">
          <RefinementComparison comparisons={enComparisons} labels={enLabels} />
        </section>
        <section className="h-feats">
          <h2>What it does</h2>
          <div className="fl">
            {features.map(([t, d]) => (
              <div key={t}>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="h-end">
          <h2>Dictation is free. Refinement is a one-time purchase.</h2>
          <a className="btn primary" href="/pricing">
            See pricing
          </a>
        </section>
      </main>
      <footer>Saymore is source-available under PolyForm Shield 1.0.0. Made by PraxisGrove.</footer>
    </div>
  );
}
