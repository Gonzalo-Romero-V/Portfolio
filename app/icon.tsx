import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
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

// "GR" in Archivo Black, same face as the header logo's font-heading/
// font-black (components/layout/header.tsx) — no dot here, just the letters.
export default async function Icon() {
  const archivoBlack = await loadArchivoBlack();

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
          // the white "GR" stays legible regardless of the browser/tab
          // chrome's own theme, instead of a transparent PNG that
          // disappears against a light browser UI.
          background: "#050303",
          color: "#f5efec",
          fontFamily: "Archivo",
          fontWeight: 900,
          fontSize: 20,
          letterSpacing: "-0.5px",
        }}
      >
        GR
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Archivo", data: archivoBlack, weight: 900, style: "normal" }],
    },
  );
}
