"use client";

import { createContext, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import { dictionary, type Dictionary, type Locale } from "@/lib/i18n";

interface LocaleContextValue {
  locale: Locale;
  t: Dictionary;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

/** Locale is decided server-side by the [locale] route segment (see
    app/[locale]/layout.tsx), not client state — this just makes it and the
    matching dictionary available to client components below it in the
    tree. Switching language is a real navigation to the other locale's URL
    (see Header's LocaleSwitch), not an in-place state flip. */
export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  // Dark/light lives as a `.dark` class the pre-hydration script in
  // app/[locale]/layout.tsx applies outside of React's own className prop
  // (see that file's comment). On some mobile browsers, navigating between
  // /es and /en — which re-renders <html> from the root layout — was
  // observed to drop that class, silently resetting dark to light. This
  // re-asserts it from localStorage every time `locale` changes, i.e.
  // exactly when that navigation happens.
  useEffect(() => {
    try {
      const stored = localStorage.getItem("theme");
      document.documentElement.classList.toggle("dark", stored !== "light");
    } catch {
      // Storage disabled/full — leave whatever is already on <html>.
    }
  }, [locale]);

  return (
    <LocaleContext.Provider value={{ locale, t: dictionary[locale] }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
