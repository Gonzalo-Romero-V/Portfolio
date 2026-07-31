"use client";

import { useEffect, useRef } from "react";

interface BlobMotion {
  /** Independent periods (seconds) for x/y/scale — irrational-ish relative
      to each other so the combined path doesn't visibly repeat on any
      timescale a visitor would notice. */
  periodX: number;
  periodY: number;
  periodScale: number;
  phase: number;
  /** Base drift distance, px (scaled by --mesh-amount). */
  amplitude: number;
  scaleAmplitude: number;
  /** How strongly this blob responds to the cursor relative to the others —
      gives the parallax a sense of depth instead of everything moving in lockstep. */
  depth: number;
}

const BLOBS: BlobMotion[] = [
  { periodX: 37, periodY: 29, periodScale: 53, phase: 0, amplitude: 55, scaleAmplitude: 0.09, depth: 0.6 },
  { periodX: 41, periodY: 61, periodScale: 47, phase: 2.1, amplitude: 65, scaleAmplitude: 0.07, depth: 1 },
  { periodX: 71, periodY: 43, periodScale: 59, phase: 4.4, amplitude: 70, scaleAmplitude: 0.1, depth: 1.4 },
];

function wave(t: number, period: number, phase: number) {
  return Math.sin((t / period) * Math.PI * 2 + phase);
}

/** The site's ambient mesh — lives in the root layout (not any one page), so
    it's painted once behind Header/{children}/Footer and never remounts or
    restarts on navigation between pages; only {children} changes. Motion is
    procedural (summed sine drift, not a fixed CSS keyframe loop) plus a
    subtle cursor parallax, driven by one rAF loop that writes `transform`
    straight to each blob's ref — no React re-renders, no restart cost.
    `--mesh-speed`/`-amount`/`-cursor` (read live each frame) and
    `-opacity`/`-blur-scale` (plain CSS, no JS needed) are the tunable knobs;
    see the Site background group in the emblem tuner. Colored from
    --primary-h/-s so it rotates with the rest of the brand palette. */
export function SiteBackground() {
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    function handlePointerMove(e: PointerEvent) {
      pointer.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };
    }
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    const start = performance.now();
    let frame = 0;

    function tick(now: number) {
      const t = (now - start) / 1000;
      const style = getComputedStyle(document.documentElement);
      const speed = Number.parseFloat(style.getPropertyValue("--mesh-speed")) || 1;
      const amount = Number.parseFloat(style.getPropertyValue("--mesh-amount")) || 1;
      const cursorStrength = Number.parseFloat(style.getPropertyValue("--mesh-cursor")) || 0;

      BLOBS.forEach((blob, i) => {
        const el = refs.current[i];
        if (!el) return;
        const bt = t * speed;
        const dx = wave(bt, blob.periodX, blob.phase) * blob.amplitude * amount + pointer.current.x * 60 * cursorStrength * blob.depth;
        const dy = wave(bt, blob.periodY, blob.phase + 1.3) * blob.amplitude * amount + pointer.current.y * 60 * cursorStrength * blob.depth;
        const scale = 1 + wave(bt, blob.periodScale, blob.phase + 2.6) * blob.scaleAmplitude;
        el.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
      });

      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background"
      style={{ opacity: "var(--mesh-opacity)" }}
    >
      <div
        ref={(el) => {
          refs.current[0] = el;
        }}
        className="absolute -top-[6%] -left-[12%] h-[900px] w-[900px] rounded-full"
        style={{
          filter: "blur(calc(100px * var(--mesh-blur-scale)))",
          background:
            "radial-gradient(circle at 42% 62%, hsl(calc(var(--primary-h) + 5) var(--primary-s) 55% / .46), hsl(var(--mesh-2-h) var(--mesh-2-s) var(--mesh-2-l) / .24) 46%, transparent 70%)",
        }}
      />
      <div
        ref={(el) => {
          refs.current[1] = el;
        }}
        className="absolute top-[34%] -right-[16%] h-[760px] w-[860px] rounded-[48%]"
        style={{
          filter: "blur(calc(120px * var(--mesh-blur-scale)))",
          background:
            "radial-gradient(ellipse at 40% 50%, hsl(calc(var(--primary-h) + 15) var(--primary-s) 54% / .3), hsl(var(--mesh-2-h) var(--mesh-2-s) var(--mesh-2-l) / .2) 48%, transparent 72%)",
        }}
      />
      <div
        ref={(el) => {
          refs.current[2] = el;
        }}
        className="absolute -bottom-[30%] left-[6%] h-[600px] w-[1200px] rounded-full"
        style={{
          filter: "blur(calc(130px * var(--mesh-blur-scale)))",
          background:
            "radial-gradient(ellipse at 30% 40%, hsl(calc(var(--primary-h) + 2) var(--primary-s) 54% / .2), transparent 66%)",
        }}
      />
    </div>
  );
}
