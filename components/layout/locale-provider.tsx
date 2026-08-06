"use client";

import { createContext, useContext, useLayoutEffect } from "react";
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
  // (see that file's comment). That script only runs on a real (hard) page
  // load, because the browser executes inline scripts as it parses raw
  // HTML — a <script> React re-creates client-side (which is what happens
  // to it when a locale switch re-renders RootLayout) never executes, full
  // stop, that's a DOM rule. So on every locale switch the class was
  // silently left unfixed by that script. useLayoutEffect (not useEffect)
  // re-asserts it from localStorage synchronously before the browser paints
  // the new frame, so there's no flash of the wrong theme in between.
  useLayoutEffect(() => {
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
