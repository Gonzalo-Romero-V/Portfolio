"use client";

import { useState } from "react";
import { generateBlobPath } from "@/components/home/blob-path";
import { hsla } from "@/components/home/color";
import { canvasInset, toCanvasPosition, toCanvasSize } from "@/components/home/canvas-space";
import { readCssVarNumber } from "@/components/home/css-var";
import { defaultEmblemState } from "@/components/home/emblem-state";
import type { CircleLayer as CircleLayerConfig, PrimaryHsl, RimParams } from "@/components/home/emblem-state";
import { EmblemTuner } from "@/components/home/emblem-tuner";
import { SocialLinks } from "@/components/home/social-links";

function fillGradient(hue: number, saturation: number, alpha: number) {
  return `radial-gradient(circle at 34% 30%, ${hsla(hue, saturation, 60, 0.72 * alpha)}, ${hsla(hue, saturation, 45, 0.52 * alpha)} 30%, ${hsla(hue, saturation, 33, 0.4 * alpha)} 52%, ${hsla(hue, saturation, 15, 0.3 * alpha)} 74%, ${hsla(hue, saturation, 6, 0.18 * alpha)} 92%)`;
}

function RimStroke({ path, color, rim }: { path: string; color: string; rim: RimParams }) {
  return (
    <>
      {rim.glow > 0 && (
        <path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth={rim.width + rim.glow * 1.5}
          strokeOpacity={rim.opacity * 0.5}
          vectorEffect="non-scaling-stroke"
          style={{ filter: `blur(${rim.glow}px)` }}
        />
      )}
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={rim.width}
        strokeOpacity={rim.opacity}
        vectorEffect="non-scaling-stroke"
      />
    </>
  );
}

/** One self-contained circle: position/size, internal fill, external glow,
    glass backdrop and rim — every circle in the emblem is exactly one of
    these, configured differently. Color is passed in separately (hue/
    saturation) rather than living on `layer`, so the caller can point the
    big circle at the site's --primary hue while the small one keeps its
    own independent color — glow/backdrop/rim intensity stay per-component
    either way, regardless of where the color comes from. Lives in
    canvas-space (see canvas-space.ts) so it has room to pan/grow without
    hitting the frame. */
function CircleLayer({
  layer,
  hue,
  saturation,
  canvasScale,
  clipId,
}: {
  layer: CircleLayerConfig;
  hue: number;
  saturation: number;
  canvasScale: number;
  clipId: string;
}) {
  const canvasBlob = {
    ...layer.blob,
    cx: toCanvasPosition(layer.blob.cx, canvasScale),
    cy: toCanvasPosition(layer.blob.cy, canvasScale),
    radius: toCanvasSize(layer.blob.radius, canvasScale),
  };
  const path = generateBlobPath(canvasBlob);
  const glowPath = generateBlobPath({ ...canvasBlob, radius: canvasBlob.radius * layer.glow.spread });
  const hasBackdrop = layer.backdrop.blur > 0;

  return (
    <div className="absolute" style={{ inset: canvasInset(canvasScale) }}>
      <svg width="0" height="0" className="absolute">
        <defs>
          <clipPath id={clipId} clipPathUnits="objectBoundingBox">
            <path d={path} />
          </clipPath>
        </defs>
      </svg>

      {/* External glow: an enlarged, blurred, UNclipped copy of the same
          silhouette — box-shadow doesn't follow clip-path on organic
          shapes, so a real blurred duplicate is what actually reads as a
          glow hugging this circle's own outline (not a generic circle). */}
      {layer.glow.opacity > 0 && (
        <svg viewBox="0 0 1 1" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 overflow-visible">
          <path
            d={glowPath}
            fill={hsla(hue, saturation, 60, layer.glow.opacity)}
            style={{ filter: `blur(${layer.glow.blur}px)` }}
          />
        </svg>
      )}

      {/* Internal fill — the circle's own body. backdrop-filter only when
          this circle should read as glass (blur > 0); a plain solid disc
          otherwise. */}
      <div
        className="absolute inset-0"
        style={{
          clipPath: `url(#${clipId})`,
          background: fillGradient(hue, saturation, layer.fillAlpha),
          backdropFilter: hasBackdrop ? `blur(${layer.backdrop.blur}px) saturate(${layer.backdrop.saturate}%)` : undefined,
          WebkitBackdropFilter: hasBackdrop ? `blur(${layer.backdrop.blur}px) saturate(${layer.backdrop.saturate}%)` : undefined,
        }}
      />

      {/* Rim / edge. */}
      <svg viewBox="0 0 1 1" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 overflow-visible">
        <RimStroke path={path} color={hsla(hue, saturation, 75, 1)} rim={layer.rim} />
      </svg>
    </div>
  );
}

export function ProfileEmblem() {
  const [state, setState] = useState(defaultEmblemState);

  // The big circle inherits its color from the site's --primary-h/-s
  // instead of carrying its own independent hue/saturation — read once on
  // mount (client only) and kept in sync with the Site-theme sliders below,
  // which update both this state (so the big circle repaints) and the CSS
  // variables (so the rest of the page — header, CTA, stat cards —
  // repaints too). Glow/backdrop/rim intensity stay in EmblemState,
  // independent of this.
  const [primary, setPrimaryState] = useState<PrimaryHsl>(() => ({
    h: readCssVarNumber("--primary-h", 8),
    s: readCssVarNumber("--primary-s", 100),
    l: readCssVarNumber("--primary-l", 56),
  }));

  function setPrimary(next: PrimaryHsl) {
    setPrimaryState(next);
    document.documentElement.style.setProperty("--primary-h", `${next.h}`);
    document.documentElement.style.setProperty("--primary-s", `${next.s}%`);
    document.documentElement.style.setProperty("--primary-l", `${next.l}%`);
  }

  function resetPrimary() {
    document.documentElement.style.removeProperty("--primary-h");
    document.documentElement.style.removeProperty("--primary-s");
    document.documentElement.style.removeProperty("--primary-l");
    setPrimaryState({
      h: readCssVarNumber("--primary-h", 8),
      s: readCssVarNumber("--primary-s", 100),
      l: readCssVarNumber("--primary-l", 56),
    });
  }

  // The photo is deliberately NOT part of either CircleLayer's canvas-space
  // wrapper: it's a single plain <img>, positioned/sized by hand
  // (image.x/y/size — no object-fit, no cropping math), clipped by nothing
  // except the intersection of the two circles' own silhouettes
  // (un-converted — applied to a box the size of the visible square, that's
  // the same on-screen shape the canvas-space conversion is built to
  // preserve).
  const bigPathPhoto = generateBlobPath(state.big.blob);
  const smallPathPhoto = generateBlobPath(state.small.blob);

  return (
    <div className="relative aspect-square w-full max-w-sm sm:max-w-md">
      {/* Layer 1: big circle — color inherited from the site's primary hue. */}
      <CircleLayer
        layer={state.big}
        hue={primary.h}
        saturation={primary.s}
        canvasScale={state.canvasScale}
        clipId="emblem-visual-big"
      />

      {/* Layer 2: small circle, on top of layer 1 — keeps its own independent color. */}
      <CircleLayer
        layer={state.small}
        hue={state.small.hue}
        saturation={state.small.saturation}
        canvasScale={state.canvasScale}
        clipId="emblem-visual-small"
      />

      {/* Layer 3: the photo, clipped ONLY to where both circles overlap.
          Hidden (not deleted) for now — everything about it stays defined,
          it just doesn't render until image.visible flips back on. */}
      {state.image.visible && (
        <>
          <svg width="0" height="0" className="absolute">
            <defs>
              <clipPath id="emblem-photo-big" clipPathUnits="objectBoundingBox">
                <path d={bigPathPhoto} />
              </clipPath>
              <clipPath id="emblem-photo-small" clipPathUnits="objectBoundingBox">
                <path d={smallPathPhoto} />
              </clipPath>
            </defs>
          </svg>
          <div className="absolute inset-0" style={{ clipPath: "url(#emblem-photo-big)" }}>
            <div className="absolute inset-0" style={{ clipPath: "url(#emblem-photo-small)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element -- plain
                  img on purpose: no object-fit, no cropping, just x/y/size. */}
              <img
                src="/pictures/profile-picture.png"
                alt="Gonzalo Romero"
                style={{
                  position: "absolute",
                  left: `${state.image.x}%`,
                  top: `${state.image.y}%`,
                  width: `${state.image.size}%`,
                  height: "auto",
                  maxWidth: "none",
                  transform: "translate(-50%, -50%)",
                  opacity: state.photoOpacity,
                }}
              />
            </div>
          </div>
        </>
      )}

      {/* Layer 4: name, tagline, socials — right-aligned, compact. */}
      <div
        className="absolute flex flex-col items-end text-right"
        style={{
          left: `${state.text.x * 100}%`,
          top: `${state.text.y * 100}%`,
          width: `${state.text.width * 100}%`,
          transform: "translateX(-100%)",
        }}
      >
        <p
          className="font-heading font-extrabold tracking-tight [text-shadow:0_10px_44px_rgba(0,0,0,.75)]"
          style={{ fontSize: state.text.nameSize }}
        >
          Gonzalo Romero
        </p>
        <p
          className="font-mono text-accent uppercase"
          style={{ fontSize: state.text.taglineSize, marginTop: state.text.gap, letterSpacing: "0.22em" }}
        >
          Software Developer
        </p>
        <SocialLinks config={state.social} />
      </div>

      <EmblemTuner state={state} onChange={setState} primary={primary} onPrimaryChange={setPrimary} onPrimaryReset={resetPrimary} />
    </div>
  );
}
