import type { Metadata } from "next";
import { Archivo, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { SiteBackground } from "@/components/layout/site-background";
import "../globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Admin — Gonzalo Romero",
  robots: { index: false, follow: false },
};

/** Independent root layout: /admin does NOT go through
    app/[locale]/layout.tsx — it's a tool, not public-facing content in
    either language, so it skips that layout's i18n route param, generateStaticParams,
    and Edge Config read. Next.js allows multiple root layouts when nothing
    above them defines one (this project has no app/layout.tsx); navigating
    between /admin and /es|/en does a full page load instead of a client
    transition, which is fine since they're unrelated sections. See
    node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/
    layout.md, "Root Layout".

    AdminConsole (components/admin/admin-console.tsx) still renders the real
    Header/HomeView/Footer directly, wrapped in its own LocaleProvider, to
    replicate the public page for previewing edits — it just does that
    itself instead of inheriting it from app/[locale]/layout.tsx. `flex
    flex-col` on body matches that layout's body class so the replica's
    Footer sticks to the bottom the same way. */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${archivo.variable} ${spaceGrotesk.variable} ${jetBrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Same pre-hydration dark-mode script as app/[locale]/layout.tsx —
            duplicated on purpose, this tree doesn't import that layout. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t!=="light")document.documentElement.classList.add("dark")}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <SiteBackground />
        {children}
      </body>
    </html>
  );
}
