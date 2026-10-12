"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DownloadButton } from "@/components/download-button";
import { homeCopy, type Lang } from "@/data/home-copy";

export function SiteHeader({ lang = "zh" }: { lang?: Lang }) {
  const t = homeCopy[lang].header;
  // SSR and first client render agree: header shown, not hidden (avoids a hydration flash).
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const HIDE_AFTER = 48; // px of continuous downward scroll before hiding
    const SHOW_AFTER = 8; // px of upward scroll before showing again
    let anchor = window.scrollY; // turning point of the current scroll direction
    let isHidden = false;
    let frame = 0;
    // Only a real downward gesture hides the header. #hash jumps, scroll restoration, scripted scrolls
    // and scroll-snap settling (which can move the page down right after the user scrolled up) don't.
    let lastInput = Number.NEGATIVE_INFINITY;
    let lastDir = 0; // 1 = user scrolled down, -1 = up, 0 = unknown (e.g. scrollbar drag)
    let touchY: number | null = null;
    const mark = (dir: number) => {
      lastInput = performance.now();
      lastDir = dir;
    };
    const onWheel = (e: WheelEvent) => mark(Math.sign(e.deltaY));
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", "End"].includes(e.key) || (e.key === " " && !e.shiftKey)) mark(1);
      else if (["ArrowUp", "PageUp", "Home"].includes(e.key) || (e.key === " " && e.shiftKey)) mark(-1);
    };
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0]?.clientY ?? null;
    };
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY;
      if (y === undefined || touchY === null) return;
      mark(Math.sign(touchY - y)); // finger moves up = page scrolls down
      touchY = y;
    };
    const onPointerDown = () => mark(0);
    const listeners = [
      ["wheel", onWheel],
      ["keydown", onKey],
      ["touchstart", onTouchStart],
      ["touchmove", onTouchMove],
      ["pointerdown", onPointerDown],
    ] as const;

    const update = () => {
      frame = 0;
      const y = Math.max(0, window.scrollY);
      const headerHeight = headerRef.current?.offsetHeight ?? 64;
      setScrolled(y > 0);
      let next = isHidden;
      if (y <= headerHeight) {
        next = false; // near the top: always visible
        anchor = y;
      } else if (isHidden) {
        if (y > anchor) anchor = y;
        else if (anchor - y > SHOW_AFTER) {
          // Upward movement shows it again, unless it's scroll-snap settling right after a downward gesture.
          if (!(performance.now() - lastInput < 1500 && lastDir > 0)) next = false;
          anchor = y;
        }
      } else if (y < anchor) {
        anchor = y;
      } else if (y - anchor > HIDE_AFTER) {
        if (performance.now() - lastInput < 1500 && lastDir >= 0) next = true;
        anchor = y;
      }
      if (next !== isHidden) {
        isHidden = next;
        setHidden(next);
      }
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    for (const [type, fn] of listeners)
      window.addEventListener(type, fn as EventListener, { passive: true, capture: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      for (const [type, fn] of listeners) window.removeEventListener(type, fn as EventListener, { capture: true });
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const visible = !hidden || menuOpen;

  return (
    <header
      ref={headerRef}
      className={`site-header ${scrolled ? "site-header--ready" : ""} ${visible ? "site-header--visible" : ""}`}
    >
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
