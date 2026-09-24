"use client";

import { useState, type FormEvent } from "react";
import { DEFAULT_THEME, type ThemeConfig } from "@/lib/theme-config";
import { BrandColorSection } from "@/components/admin/theme-section";
import { BackgroundSection } from "@/components/admin/background-section";
import { ChromeSection } from "@/components/admin/chrome-section";

/** Mirrors the site's real CSS custom properties on THIS tab's document,
    for an instant preview while dragging sliders. /admin has its own root
    layout (no Edge Config read there — see app/admin/layout.tsx), so this
    is the only way this page shows anything changing; it doesn't touch what
    other visitors see — that's the two fetch calls below. */
function applyState(state: ThemeConfig) {
  const root = document.documentElement.style;
  root.setProperty("--primary-h", `${state.brand.h}`);
  root.setProperty("--primary-s", `${state.brand.s}%`);
  root.setProperty("--primary-l", `${state.brand.l}%`);

  root.setProperty("--mesh-opacity", `${state.background.opacity}`);
  root.setProperty("--mesh-blur-scale", `${state.background.blurScale}`);
  root.setProperty("--mesh-speed", `${state.background.speed}`);
  root.setProperty("--mesh-amount", `${state.background.amount}`);
  root.setProperty("--mesh-cursor", `${state.background.cursor}`);
  if (state.background.toneAnchored) {
    root.removeProperty("--mesh-2-h");
    root.removeProperty("--mesh-2-s");
    root.removeProperty("--mesh-2-l");
  } else {
    root.setProperty("--mesh-2-h", `${state.background.tone.h}`);
    root.setProperty("--mesh-2-s", `${state.background.tone.s}%`);
    root.setProperty("--mesh-2-l", `${state.background.tone.l}%`);
  }

  root.setProperty("--chrome-opacity", `${state.chrome.opacity}%`);
  root.setProperty("--chrome-blur", `${state.chrome.blur}px`);
}

async function verifySecret(secret: string): Promise<{ ok: true; theme: ThemeConfig } | { ok: false }> {
  try {
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret }),
    });
    if (!res.ok) return { ok: false };
    const data = (await res.json()) as { theme: ThemeConfig };
    return { ok: true, theme: data.theme };
  } catch {
    return { ok: false };
  }
}

async function persistTheme(secret: string, theme: ThemeConfig): Promise<boolean> {
  try {
    const res = await fetch("/api/admin/theme", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, theme }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

function PassphraseGate({ onUnlock }: { onUnlock: (secret: string, theme: ThemeConfig) => void }) {
  const [passphrase, setPassphrase] = useState("");
  const [status, setStatus] = useState<"idle" | "checking" | "error">("idle");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("checking");
    const result = await verifySecret(passphrase);
    if (result.ok) onUnlock(passphrase, result.theme);
    else setStatus("error");
  }

  return (
    <div className="flex min-h-dvh items-center justify-center px-5">
      <form
        onSubmit={submit}
        className="flex w-full max-w-xs flex-col gap-4 rounded-2xl border border-border bg-card p-6 backdrop-blur-xl"
      >
        <div>
          <h1 className="font-heading text-sm font-bold tracking-tight">Consola admin</h1>
          <p className="mt-1 font-mono text-[11px] leading-relaxed text-muted-foreground/70">
            Acceso restringido.
          </p>
        </div>
        <input
          type="password"
          value={passphrase}
          onChange={(e) => {
            setPassphrase(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          placeholder="passphrase"
          autoFocus
          className="rounded-lg border border-input bg-background px-3 py-2 font-mono text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
        {status === "error" && <p className="font-mono text-[11px] text-destructive">passphrase incorrecta</p>}
        <button
          type="submit"
          disabled={status === "checking" || passphrase.length === 0}
          className="rounded-full bg-primary px-4 py-2 font-mono text-xs font-medium text-primary-foreground hover:bg-primary/80 disabled:opacity-50"
        >
          {status === "checking" ? "verificando…" : "entrar"}
        </button>
      </form>
    </div>
  );
}

export function AdminConsole() {
  const [unlocked, setUnlocked] = useState(false);
  // Kept in memory only (never localStorage/sessionStorage) — reused to
  // authorize "guardar" without asking again, lost on refresh/close.
  const [secret, setSecret] = useState<string | null>(null);
  const [saved, setSaved] = useState<ThemeConfig | null>(null);
  const [state, setState] = useState<ThemeConfig | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  function unlock(secretValue: string, theme: ThemeConfig) {
    setSecret(secretValue);
    setState(theme);
    setSaved(theme);
    setUnlocked(true);
    applyState(theme); // reflect the real persisted value, not theme.css's compiled defaults
  }

  function update(next: ThemeConfig) {
    setState(next);
    applyState(next);
    setSaveStatus("idle");
  }

  function discard() {
    if (!saved) return;
    setState(saved);
    applyState(saved);
    setSaveStatus("idle");
  }

  async function save() {
    if (!state || !secret) return;
    setSaveStatus("saving");
    const ok = await persistTheme(secret, state);
    if (ok) {
      setSaved(state);
      setSaveStatus("saved");
    } else {
      setSaveStatus("error");
    }
  }

  if (!unlocked || !state) {
    return <PassphraseGate onUnlock={unlock} />;
  }

  const dirty = JSON.stringify(state) !== JSON.stringify(saved);

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col gap-6 px-5 pt-10 pb-28">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-lg font-extrabold tracking-tight">Consola admin</h1>
          <p className="font-mono text-[11px] leading-relaxed text-muted-foreground/70">
            Los sliders se previsualizan en vivo solo en esta pestaña.
            &quot;Guardar cambios&quot; lo publica para todos los visitantes
            (puede tardar unos segundos en propagarse).
          </p>
        </div>
        <button
          type="button"
          onClick={() => setUnlocked(false)}
          className="shrink-0 font-mono text-[10px] tracking-wide text-muted-foreground uppercase hover:text-foreground"
        >
          salir
        </button>
      </header>

      <BrandColorSection
        value={state.brand}
        onChange={(brand) => update({ ...state, brand })}
        onReset={() => update({ ...state, brand: DEFAULT_THEME.brand })}
      />
      <BackgroundSection
        value={state.background}
        onChange={(background) => update({ ...state, background })}
        onReset={() =>
          update({
            ...state,
            background: { ...DEFAULT_THEME.background, tone: { ...DEFAULT_THEME.background.tone, h: state.brand.h - 13 } },
          })
        }
      />
      <ChromeSection
        value={state.chrome}
        onChange={(chrome) => update({ ...state, chrome })}
        onReset={() => update({ ...state, chrome: DEFAULT_THEME.chrome })}
      />

      <div className="fixed inset-x-0 bottom-0 border-t border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-4 px-5 py-4">
          <span className="font-mono text-[11px] text-muted-foreground">
            {saveStatus === "saving" && "guardando…"}
            {saveStatus === "saved" && !dirty && "guardado — se está propagando a todos los visitantes"}
            {saveStatus === "error" && "error al guardar — reintenta"}
            {saveStatus === "idle" && (dirty ? "cambios sin guardar" : "sin cambios")}
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={discard}
              disabled={!dirty}
              className="font-mono text-xs text-muted-foreground uppercase hover:text-foreground disabled:opacity-40"
            >
              descartar
            </button>
            <button
              type="button"
              onClick={save}
              disabled={!dirty || saveStatus === "saving"}
              className="rounded-full bg-primary px-4 py-2 font-mono text-xs font-medium text-primary-foreground hover:bg-primary/80 disabled:opacity-50"
            >
              guardar cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
