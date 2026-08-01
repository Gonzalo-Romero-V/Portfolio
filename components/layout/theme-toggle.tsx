"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

function subscribeMounted() {
  return () => {};
}
function isMountedClient() {
  return true;
}
function isMountedServer() {
  return false;
}

function subscribeDarkClass(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}
function isDark() {
  return document.documentElement.classList.contains("dark");
}
function isDarkServerFallback() {
  return false;
}

/** Day → shows a moon (click to go dark/night). Night → shows a sun (click
    to go light/day). Reads/writes the same `.dark` class + localStorage
    key the pre-hydration script in layout.tsx already uses, so this is
    just a UI for a mechanism that already existed. */
export function ThemeToggle() {
  const mounted = useSyncExternalStore(subscribeMounted, isMountedClient, isMountedServer);
  const dark = useSyncExternalStore(subscribeDarkClass, isDark, isDarkServerFallback);

  if (!mounted) {
    return <span className="block size-4" aria-hidden />;
  }

  function toggle() {
    const next = !dark;
    function apply() {
      document.documentElement.classList.toggle("dark", next);
      try {
        localStorage.setItem("theme", next ? "dark" : "light");
      } catch {
        // Storage disabled/full — the toggle still works for this visit.
      }
    }
    // Crossfades the whole page between themes instead of an instant snap —
    // the ::view-transition-old/new(root) timing lives in globals.css.
    // Falls back to an instant swap on browsers without the API (Firefox).
    if (typeof document.startViewTransition === "function") {
      document.startViewTransition(apply);
    } else {
      apply();
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      className="flex size-6 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
    >
      {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
