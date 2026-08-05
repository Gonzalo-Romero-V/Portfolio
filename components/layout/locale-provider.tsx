"use client";

import { createContext, useContext } from "react";
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
