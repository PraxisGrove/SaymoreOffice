import {
  ArrowRight,
  BookOpen,
  BotOff,
  Check,
  Code2,
  Globe2,
  KeyRound,
  Languages,
  LockKeyhole,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { DownloadButton } from "@/components/download-button";
import { HeroDemo } from "@/components/hero-demo";
import { RefinementComparison } from "@/components/refinement-comparison";
import { ReleaseSummary } from "@/components/release-summary";
import { SiteHeader } from "@/components/site-header";
import { homeCopy, type Lang } from "@/data/home-copy";
import { githubUrl, licenseUrl, pricingPlans, releaseUrl } from "@/data/site";
import { getRecentReleases } from "@/lib/github";

const flowIcons = [LockKeyhole, KeyRound, ShieldCheck];
const platformIcons = [Code2, Globe2, MessageSquareText, TerminalSquare];

/** One homepage for both languages; only the copy (data/home-copy.ts) differs. */
export async function HomePage({ lang }: { lang: Lang }) {
  const t = homeCopy[lang];
  const releases = await getRecentReleases(lang);

  return (
    <main id="top">
      <SiteHeader lang={lang} />

      <section className="hero" aria-labelledby="hero-title">
        <h1 id="hero-title" className="sr-only">
          {t.heroTitle}
        </h1>
        <div className="page-width hero-demo-wrap">
          {/* TODO(YaCo): the EN page still shows the Chinese hero demo (UI labels, chat text, zh audio).
              Replace with YaCo's English screen recording + English voice-over before /  goes live. */}
          <HeroDemo />
        </div>
      </section>

      <section id="overview" className="overview-band">
        <div className="page-width overview-grid">
          <p>{t.overview.kicker}</p>
          <h2>{t.overview.title}</h2>
          <div className="overview-meta">
            {t.overview.meta.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
          <div className="overview-actions">
            <DownloadButton inverse lang={lang} placement="overview" />
            {t.overview.secondary.placement ? (
              <a href={t.overview.secondary.href} data-placement={t.overview.secondary.placement}>
                {t.overview.secondary.label}
                <ArrowRight size={15} />
              </a>
            ) : (
              <a href={t.overview.secondary.href} target="_blank" rel="noreferrer">
                {t.overview.secondary.label}
                <ArrowRight size={15} />
              </a>
            )}
          </div>
        </div>
      </section>

      <section id="features" className="section section--white">
        <div className="page-width">
          <div className="section-heading split-heading">
            <h2>{t.speed.title}</h2>
            <p>{t.speed.text}</p>
          </div>
          <div className="speed-board">
            <div className="speed-live">
              <Zap size={22} />
              <span>{t.speed.liveLabel}</span>
              <strong>{t.speed.liveTitle}</strong>
              <p>{t.speed.liveText}</p>
            </div>
            <section className="benchmark-table" aria-label={t.speed.tableLabel}>
              {t.speed.rows.map(([k, v]) => (
                <div key={k}>
                  <span>{k}</span>
                  <strong>{v}</strong>
                </div>
              ))}
              <p>{t.speed.tableNote}</p>
            </section>
          </div>
        </div>
      </section>

      <section className="section section--subtle refinement-section">
        <div className="page-width refinement-layout">
          <div className="section-heading refinement-copy">
            <div className="feature-icon">
              <Sparkles size={21} />
            </div>
            <span className="paid-tag paid-tag--block">{t.refinement.paid}</span>
            <h2>{t.refinement.title}</h2>
            <p>{t.refinement.text}</p>
            <ul className="check-list">
              {t.refinement.checks.map((c) => (
                <li key={c}>
                  <Check size={16} />
                  {c}
                </li>
              ))}
            </ul>
          </div>
          {/* TODO(YaCo): EN comparisons are placeholders from the design, not real app output. */}
          <RefinementComparison comparisons={t.refinement.comparisons} labels={t.refinement.labels} />
        </div>
      </section>

      <section className="section section--ink trust-section">
        <div className="page-width">
          <div className="section-heading split-heading">
            <h2>{t.trust.title}</h2>
            <p>{t.trust.text}</p>
          </div>
          <div className="trust-flow">
            {t.trust.flow.map((f, i) => {
              const Icon = flowIcons[i];
              return [
                i > 0 && <ArrowRight key={`a${f.title}`} aria-hidden="true" />,
                <div key={f.title}>
                  <Icon />
                  <strong>{f.title}</strong>
                  <span>{f.text}</span>
                </div>,
              ];
            })}
          </div>
          <div className="scope-note">
            <BotOff size={20} />
            <p>
              <strong>{t.trust.scopeLead}</strong>
              {t.trust.scope}
            </p>
          </div>
        </div>
      </section>

      <section className="section section--white dictionary-section">
        <div className="page-width dictionary-layout">
          <section className="dictionary-demo" aria-label={t.dictionary.label}>
            <div className="dictionary-toolbar">
              <BookOpen size={18} />
              <strong>{t.dictionary.name}</strong>
              <span>{t.dictionary.count}</span>
            </div>
            {[
              ["say more", "Saymore"],
              ["api key", "API Key"],
              ["qwen three asr", "Qwen3-ASR"],
            ].map(([from, to], i) => (
              <div className="dictionary-row" key={to}>
                <span>{from}</span>
                <ArrowRight size={15} />
                <strong>{to}</strong>
                <i>{t.dictionary.tags[i]}</i>
              </div>
            ))}
          </section>
          <div className="section-heading">
            <div className="feature-icon">
              <Languages size={21} />
            </div>
            <h2>{t.dictionary.title}</h2>
            <p>{t.dictionary.text}</p>
          </div>
        </div>
      </section>

      <section id="pricing" className="section section--subtle pricing-section">
        <div className="page-width">
          <div className="section-heading split-heading">
            <h2>{t.pricing.title}</h2>
            <p>{t.pricing.text}</p>
          </div>
          {t.pricing.rows ? (
            <>
              <dl className="plan-rows">
                {t.pricing.rows.map(([name, state, note]) => (
                  <div key={name}>
                    <dt>{name}</dt>
                    <dd className={state === "Free" ? undefined : "plan-paid"}>{state}</dd>
                    <dd className="plan-note">{note}</dd>
                  </div>
                ))}
              </dl>
              <a className="text-link plan-link" href={t.pricing.link.href} data-placement="home_pricing">
                {t.pricing.link.label}
                <ArrowRight size={15} />
              </a>
            </>
          ) : (
            <div className="pricing-grid">
              {pricingPlans.map((plan) => (
                <article key={plan.name} className="pricing-card">
                  <div className="pricing-card__head">
                    <h3>{plan.name}</h3>
                    <span>{plan.state}</span>
                  </div>
                  <strong className="pricing-status">价格待发布</strong>
                  <p>{plan.description}</p>
                  <ul>
                    {plan.features.map((feature) => (
                      <li key={feature}>
                        <Check size={15} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <a href={plan.href} target="_blank" rel="noreferrer">
                    {plan.action}
                    <ArrowRight size={15} />
                  </a>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section section--white platform-section">
        <div className="page-width">
          <div className="section-heading platform-heading">
            <h2>{t.platform.title}</h2>
            <p>{t.platform.text}</p>
          </div>
          <div className="platform-list">
            {t.platform.items.map((p, i) => {
              const Icon = platformIcons[i];
              return (
                <div key={p.title}>
                  <Icon />
                  <strong>{p.title}</strong>
                  <span>{p.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="changelog" className="section changelog-section">
        <div className="page-width changelog-layout">
          <div className="section-heading">
            <h2>{t.changelog.title}</h2>
            <p>{t.changelog.text}</p>
            <a className="text-link" href={`${githubUrl}/releases`} target="_blank" rel="noreferrer">
              {t.changelog.all}
              <ArrowRight size={15} />
            </a>
          </div>
          <div className="release-list">
            {releases.map((release) => (
              <article className="release-item" key={`${release.name}-${release.date}`}>
                <time>{release.date}</time>
                <strong>
                  <a className="release-link" href={release.href} target="_blank" rel="noopener noreferrer">
                    {release.name}
                  </a>
                </strong>
                <ReleaseSummary markdown={release.summary} />
                <ArrowRight size={17} aria-hidden="true" />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="download" className={`download-section${lang === "en" ? " download-section--en" : ""}`}>
        <div className="page-width download-layout">
          <div>
            <Image src="/brand/saymore-icon.png" width={64} height={64} alt="" />
            <h2>{t.download.title}</h2>
            <p>{t.download.text}</p>
          </div>
          <div className="download-actions">
            <DownloadButton inverse lang={lang} placement="download_section" />
            {t.download.pricing && (
              <a className="dl-pricing" href={t.download.pricing.href} data-placement="download_section">
                {t.download.pricing.label}
                <ArrowRight size={15} />
              </a>
            )}
            <a href={releaseUrl} target="_blank" rel="noreferrer">
              {t.download.checksums}
              <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="page-width footer-grid">
          <div className="footer-brand">
            <a href="#top">
              <Image src="/brand/saymore-icon.png" width={42} height={42} alt="" />
              <strong>Saymore</strong>
            </a>
            <p>{t.footer.tagline}</p>
            <span>© 2026 PraxisGrove</span>
          </div>
          <div>
            <strong>{t.footer.product}</strong>
            {t.footer.productLinks.map((l) => (
              <a key={l.href} href={l.href} data-placement={"pricing" in l && l.pricing ? "footer" : undefined}>
                {l.label}
              </a>
            ))}
          </div>
          <div>
            <strong>{t.footer.resources}</strong>
            {t.footer.resourceLinks.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noreferrer">
                {l.label}
              </a>
            ))}
          </div>
          <div>
            <strong>{t.footer.trust}</strong>
            <a href={licenseUrl} target="_blank" rel="noreferrer">
              {t.footer.license}
            </a>
            <a href={t.footer.privacy.href} target="_blank" rel="noreferrer">
              {t.footer.privacy.label}
            </a>
            <a href={`${githubUrl}/actions`} target="_blank" rel="noreferrer">
              {t.footer.build}
            </a>
            <a href={releaseUrl} target="_blank" rel="noreferrer">
              {t.footer.release}
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
