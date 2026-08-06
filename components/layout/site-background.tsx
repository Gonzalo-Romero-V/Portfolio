/** The site's ambient mesh — lives in the root layout (not any one page), so
    it's painted once behind Header/{children}/Footer and never remounts or
    restarts on navigation between pages; only {children} changes. Motion is
    pure CSS (see the mesh-blob-* keyframes in globals.css) driven by the
    compositor, not JS — a Server Component, no client JS ships for this at
    all. `--mesh-amount` (read live by the animation) and `--opacity`/
    `-blur-scale` (plain CSS) are the tunable knobs; see theme.css. Colored
    from --primary-h/-s so it rotates with the rest of the brand palette. */
export function SiteBackground() {
  return (
    <div
      className="pointer-events-none fixed -z-10 overflow-hidden bg-background"
      style={{
        top: 0,
        left: 0,
        right: 0,
        // Extends well past the viewport's bottom edge instead of a plain
        // `inset-0` flush to it: on mobile, the address bar collapsing on
        // the first scroll of a session grows the visible viewport in
        // real time, and the fixed layer's repaint can lag that by a
        // frame, leaving a blank gap at the bottom. This overscan means
        // there's already background there regardless of that timing.
        bottom: "-160px",
        opacity: "var(--mesh-opacity)",
      }}
    >
      <div
        className="mesh-blob mesh-blob-1 absolute -top-[6%] -left-[12%] h-[900px] w-[900px] rounded-full"
        style={{
          filter: "blur(calc(100px * var(--mesh-blur-scale)))",
          background:
            "radial-gradient(circle at 42% 62%, hsl(calc(var(--primary-h) + 5) var(--primary-s) 55% / .46), hsl(var(--mesh-2-h) var(--mesh-2-s) var(--mesh-2-l) / .24) 46%, transparent 70%)",
        }}
      />
      <div
        className="mesh-blob mesh-blob-2 absolute top-[34%] -right-[16%] h-[760px] w-[860px] rounded-[48%]"
        style={{
          filter: "blur(calc(120px * var(--mesh-blur-scale)))",
          background:
            "radial-gradient(ellipse at 40% 50%, hsl(calc(var(--primary-h) + 15) var(--primary-s) 54% / .3), hsl(var(--mesh-2-h) var(--mesh-2-s) var(--mesh-2-l) / .2) 48%, transparent 72%)",
        }}
      />
      <div
        className="mesh-blob mesh-blob-3 absolute -bottom-[30%] left-[6%] h-[600px] w-[1200px] rounded-full"
        style={{
          filter: "blur(calc(130px * var(--mesh-blur-scale)))",
          background:
            "radial-gradient(ellipse at 30% 40%, hsl(calc(var(--primary-h) + 2) var(--primary-s) 54% / .2), transparent 66%)",
        }}
      />
    </div>
  );
}
