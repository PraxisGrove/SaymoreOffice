"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DownloadButton } from "@/components/download-button";
import { homeCopy, type Lang } from "@/data/home-copy";

export function SiteHeader({ lang = "zh" }: { lang?: Lang }) {
  const t = homeCopy[lang].header;
  const [pastHero, setPastHero] = useState(false);
  const [visible, setVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScroll = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      const beyondIntro = current > window.innerHeight * 0.68;
      const movingUp = current < lastScroll.current;
      setPastHero(beyondIntro);
      setVisible(beyondIntro && (movingUp || current < window.innerHeight * 0.9));
      if (!movingUp && current > lastScroll.current + 12) setMenuOpen(false);
      lastScroll.current = current;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-header ${pastHero ? "site-header--ready" : ""} ${visible ? "site-header--visible" : ""}`}>
      <div className="site-header__inner">
        <a className="brand-link" href="#top" aria-label={t.home}>
          {/* biome-ignore lint/performance/noImgElement: SVG wordmark (no-bar small version per usage.md) */}
          <img src="/brand/saymore-wordmark-small-light.svg" width={103} height={28} alt="Saymore" />
        </a>

        <nav className="desktop-nav" aria-label={t.nav}>
          {t.items.map((item) => (
            <a key={item.href} href={item.href} data-placement={item.pricing ? "nav" : undefined}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <DownloadButton compact lang={lang} placement="header" />
        </div>

        <button
          className="mobile-menu-button"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? t.close : t.open}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      {menuOpen && (
        <nav id="mobile-menu" className="mobile-nav" aria-label={t.mobileNav}>
          {t.items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              data-placement={item.pricing ? "mobile_nav" : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <DownloadButton lang={lang} placement="mobile_menu" />
        </nav>
      )}
    </header>
  );
}
