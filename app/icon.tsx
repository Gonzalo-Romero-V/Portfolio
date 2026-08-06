import { ImageResponse } from "next/og";

export const contentType = "image/png";

async function loadArchivoBlack() {
  const cssRes = await fetch(
    "https://fonts.googleapis.com/css2?family=Archivo:wght@900",
  );
  const css = await cssRes.text();
  const fontUrl = css.match(/src: url\(([^)]+)\)/)?.[1];
  if (!fontUrl) throw new Error("Could not resolve the Archivo Black font URL");
  const fontRes = await fetch(fontUrl);
  return fontRes.arrayBuffer();
}

// Two variants of the same mark:
// - "tab": 32x32, bare "GR" — what browsers pick for the tab favicon.
// - "search": 48x48 (Google's minimum recommended favicon size, must be a
//   multiple of 48px), full "GR." logo with the primary-colored dot from
//   the header (components/layout/header.tsx) — Google indexes this one
//   for search results instead of the plain tab icon.
export function generateImageMetadata() {
  return [
    { id: "tab", size: { width: 32, height: 32 }, contentType },
    { id: "search", size: { width: 48, height: 48 }, contentType },
  ];
}

export default async function Icon({ id }: { id: Promise<string | number> }) {
  const iconId = await id;
  const archivoBlack = await loadArchivoBlack();
  const withDot = iconId === "search";
  const scale = withDot ? 48 / 32 : 1;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // Fixed dark background (site's --background in dark mode) so
          // the mark stays legible regardless of the browser/tab chrome's
          // own theme, instead of a transparent PNG that disappears
          // against a light browser UI.
          background: "#050303",
          color: "#f5efec",
          fontFamily: "Archivo",
          fontWeight: 900,
          fontSize: 20 * scale,
          letterSpacing: `${-0.5 * scale}px`,
        }}
      >
        <span style={{ display: "flex" }}>GR</span>
        {withDot && (
          <span style={{ display: "flex", color: "#6dd09c" }}>.</span>
        )}
      </div>
    ),
    {
      width: withDot ? 48 : 32,
      height: withDot ? 48 : 32,
      fonts: [{ name: "Archivo", data: archivoBlack, weight: 900, style: "normal" }],
    },
  );
}
