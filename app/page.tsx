import type { Metadata } from "next";
import { pricingCss } from "@/components/pricing-content";
import { githubUrl, releaseUrl } from "@/data/site";

export const metadata: Metadata = {
  title: { absolute: "Saymore — Speak instead of type" },
  description:
    "Press a shortcut, talk, and Saymore types clean text at your cursor in any app on macOS and Windows. Bring your own API key.",
  alternates: { canonical: "/", languages: { "zh-CN": "/zh" } },
};

const homeCss = `
.home .h-hero{padding:96px 0 72px;max-width:820px}
.home .h-hero h1{font-size:64px;line-height:1.05;letter-spacing:-.035em;font-weight:640;margin:0 0 24px}
.home .h-hero p{font-size:20px;color:var(--text);margin:0 0 32px;max-width:640px}
.home .h-steps{display:grid;grid-template-columns:repeat(3,1fr);gap:0;border-top:1px solid var(--ink);margin:0;padding:0;list-style:none}
.home .h-steps li{padding:20px 32px 40px 0}.home .h-steps b{display:block;font-size:13px;color:var(--muted);font-weight:600;margin-bottom:8px}
.home .h-steps h3{font-size:20px;font-weight:620;margin:0 0 6px;letter-spacing:-.01em}.home .h-steps p{margin:0;color:var(--text);font-size:15px}
.home .h-feats{display:grid;grid-template-columns:4fr 8fr;gap:64px;padding:80px 0;border-top:1px solid var(--line);margin-top:56px}
.home .h-feats h2{font-size:32px;font-weight:620;letter-spacing:-.02em;margin:0}
.home .fl{display:grid;grid-template-columns:1fr 1fr;gap:36px 48px}.home .fl h3{font-size:16px;font-weight:600;margin:0 0 6px}.home .fl p{margin:0;color:var(--text);font-size:15px}
.home .h-end{padding:72px 0 96px;border-top:1px solid var(--line);display:flex;justify-content:space-between;align-items:center;gap:32px;flex-wrap:wrap}
.home .h-end h2{font-size:32px;font-weight:620;letter-spacing:-.02em;margin:0}
@media(max-width:700px){.home .h-hero{padding:48px 0 40px}.home .h-hero h1{font-size:40px}.home .h-hero p{font-size:17px}
.home .h-steps{grid-template-columns:1fr}.home .h-steps li{padding:16px 0 24px;border-bottom:1px solid var(--line)}
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
          <img src="/brand/saymore-wordmark-light.svg" alt="Saymore" height={28} width={103} />
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
            Press a shortcut and talk. Saymore turns it into clean text at your cursor, in any app on macOS and
            Windows.
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
        <ol className="h-steps">
          <li>
            <b>01</b>
            <h3>Hold the shortcut</h3>
            <p>Anywhere you can type.</p>
          </li>
          <li>
            <b>02</b>
            <h3>Say it naturally</h3>
            <p>Ums and restarts included.</p>
          </li>
          <li>
            <b>03</b>
            <h3>Clean text appears</h3>
            <p>Right at your cursor.</p>
          </li>
        </ol>
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
