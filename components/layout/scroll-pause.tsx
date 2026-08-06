"use client";

import { useEffect } from "react";

/** Pauses the ambient mesh drift (.mesh-blob-* in globals.css) while the
    page is actively scrolling. The blobs are `position: fixed` with a live
    blur filter; keeping them animating at the same time as a fast scroll
    forces older/weaker GPUs to composite both at once every frame, which is
    what read as scroll jank on older phones. The motion is slow (14.8-23.6s
    per cycle), so freezing it for the ~150ms after the last scroll event is
    invisible, but it frees up the GPU exactly when scrolling needs it most. */
export function ScrollPause() {
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    function handleScroll() {
      document.documentElement.classList.add("is-scrolling");
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        document.documentElement.classList.remove("is-scrolling");
      }, 150);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeout);
    };
  }, []);

  return null;
}
