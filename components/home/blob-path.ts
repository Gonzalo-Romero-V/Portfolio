// Deterministic organic-blob path generator (Catmull-Rom -> cubic Bezier
// through N points scattered around a circle). Coordinates are emitted in
// 0..1 space so the resulting path can back an SVG <clipPath
// clipPathUnits="objectBoundingBox">, which scales correctly with the
// element it clips regardless of the element's actual pixel size.

function mulberry32(seed: number) {
  let state = seed | 0;
  return function random() {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface BlobParams {
  /** Center of the blob, 0..1 within the shared reference box. */
  cx: number;
  cy: number;
  /** Base radius, 0..0.5 within the shared reference box. */
  radius: number;
  /** Uniform multiplier on top of radius — a quick resize knob distinct from radius itself. */
  scale: number;
  /** How many anchor points define the silhouette. 5-10 reads as organic; more looks noisy. */
  points: number;
  /** 0 = perfect circle, ~0.15-0.35 = organic blob, higher = spikier. */
  irregularity: number;
  /** Any integer — same seed always reproduces the same silhouette. */
  seed: number;
  /** Rotates the whole silhouette around (cx, cy), in degrees. */
  rotation: number;
}

export function generateBlobPath({
  cx,
  cy,
  radius,
  scale,
  points,
  irregularity,
  seed,
  rotation,
}: BlobParams): string {
  const random = mulberry32(seed);
  const angleStep = (Math.PI * 2) / points;
  const rotationRad = (rotation * Math.PI) / 180;

  const anchors = Array.from({ length: points }, (_, i) => {
    const variance = 1 + (random() * 2 - 1) * irregularity;
    const angle = i * angleStep - Math.PI / 2 + rotationRad;
    const r = radius * scale * variance;
    return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r };
  });

  const n = anchors.length;
  const segments: string[] = [`M ${anchors[0].x.toFixed(4)} ${anchors[0].y.toFixed(4)}`];

  for (let i = 0; i < n; i++) {
    const p0 = anchors[(i - 1 + n) % n];
    const p1 = anchors[i];
    const p2 = anchors[(i + 1) % n];
    const p3 = anchors[(i + 2) % n];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    segments.push(
      `C ${cp1x.toFixed(4)} ${cp1y.toFixed(4)}, ${cp2x.toFixed(4)} ${cp2y.toFixed(4)}, ${p2.x.toFixed(4)} ${p2.y.toFixed(4)}`,
    );
  }

  segments.push("Z");
  return segments.join(" ");
}
