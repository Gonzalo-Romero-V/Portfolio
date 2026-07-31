// The emblem's shapes need room to pan/grow past the visible square without
// getting clipped by it — that "outer frame" the shapes were hitting is the
// visible container's own box: an absolutely-positioned div can never paint
// outside its own box no matter what its clip-path shape says. The fix is a
// wrapper that's physically larger than the visible square (see
// canvasInset), with every position/size value converted into that wrapper's
// coordinate space so the user-facing sliders keep meaning "fraction of the
// visible square" regardless of how much headroom canvasScale adds.

export function toCanvasPosition(value: number, canvasScale: number): number {
  return 0.5 + (value - 0.5) / canvasScale;
}

export function toCanvasSize(value: number, canvasScale: number): number {
  return value / canvasScale;
}

/** CSS `inset` value (negative, percent) that makes a wrapper canvasScale× the size of its positioned parent, centered. */
export function canvasInset(canvasScale: number): string {
  return `${-((canvasScale - 1) * 50)}%`;
}
