"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { DownloadButton } from "@/components/download-button";
import { navItems } from "@/data/site";

export function SiteHeader() {
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
        <a className="brand-link" href="#top" aria-label="返回 Saymore 首页">
          <Image src="/brand/saymore-icon.png" width={30} height={30} alt="" priority />
          <span>Saymore</span>
        </a>

        <nav className="desktop-nav" aria-label="主要导航">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <DownloadButton compact />
        </div>

        <button
          className="mobile-menu-button"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "关闭导航" : "打开导航"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      {menuOpen && (
        <nav id="mobile-menu" className="mobile-nav" aria-label="移动端导航">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
              {item.label}
            </a>
          ))}
          <DownloadButton />
        </nav>
      )}
    </header>
  );
}
