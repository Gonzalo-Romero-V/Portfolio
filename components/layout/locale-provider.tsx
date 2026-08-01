"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { flushSync } from "react-dom";
import type { ReactNode } from "react";
import { dictionary, type Dictionary, type Locale } from "@/lib/i18n";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (next: Locale) => void;
  t: Dictionary;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

/** Starts at "es" on both server and client so there's nothing to
    hydration-mismatch on; a stored "en" preference is applied right after
    mount, which is a genuine (not derived) state change React reconciles
    normally — same fix as the emblem's primary-color flash, minus the
    var()-reference trick, since text content has no CSS-level escape hatch. */
export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("es");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("locale");
      if (stored === "en" || stored === "es") {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from localStorage on mount, not derived from props/state
        setLocaleState(stored);
      }
    } catch {
      // Storage disabled/full — stays on the "es" default for this visit.
    }
  }, []);

  function setLocale(next: Locale) {
    function apply() {
      // flushSync forces the re-render to commit synchronously inside this
      // callback — startViewTransition needs the DOM already updated by the
      // time the callback returns to capture correct before/after snapshots
      // (a plain setState here would batch and land a frame too late).
      flushSync(() => {
        setLocaleState(next);
      });
      try {
        localStorage.setItem("locale", next);
      } catch {
        // Storage disabled/full — the switch still works for this visit.
      }
    }
    // Same crossfade mechanism as the theme toggle (globals.css owns the
    // ::view-transition-old/new(root) timing); falls back to an instant
    // swap on browsers without the API.
    if (typeof document.startViewTransition === "function") {
      document.startViewTransition(apply);
    } else {
      apply();
    }
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t: dictionary[locale] }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
