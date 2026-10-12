"use client";

import { useEffect, useState } from "react";

// Placeholder consent bar (unstyled). Final design comes from the brand designer.
// Public API: acceptAnalytics() / declineAnalytics(); the choice is kept in localStorage.
const KEY = "saymore_consent";
export const CONSENT_EVENT = "saymore:consent";

export function hasConsent() {
  try {
    return localStorage.getItem(KEY) === "granted";
  } catch {
    return false;
  }
}

function update(state: "granted" | "denied") {
  try {
    localStorage.setItem(KEY, state);
  } catch {}
  if (state === "denied") window.gtag?.("consent", "update", { analytics_storage: "denied" });
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

export function acceptAnalytics() {
  update("granted");
}

export function declineAnalytics() {
  update("denied");
}

export function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      setOpen(!localStorage.getItem(KEY));
    } catch {
      setOpen(true);
    }
  }, []);

  if (!open) return null;
  return (
    <div role="dialog" aria-label="Cookie consent" data-cookie-consent>
      <span>We use cookies for anonymous analytics.</span>
      <button
        type="button"
        onClick={() => {
          acceptAnalytics();
          setOpen(false);
        }}
      >
        Accept
      </button>
      <button
        type="button"
        onClick={() => {
          declineAnalytics();
          setOpen(false);
        }}
      >
        Decline
      </button>
    </div>
  );
}
