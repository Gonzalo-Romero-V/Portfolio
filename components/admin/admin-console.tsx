"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Menu, X, Sun, Moon, Trash2 } from "lucide-react";
import {
  themePairToCss,
  type ThemeConfig,
  type ThemeMode,
  type ThemePair,
  type ThemeStoreState,
} from "@/lib/theme-config";
import { LocaleProvider } from "@/components/layout/locale-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HomeView } from "@/app/[locale]/home-view";
import { BrandColorSection } from "@/components/admin/theme-section";
import { BackgroundSection } from "@/components/admin/background-section";
import { ChromeSection } from "@/components/admin/chrome-section";

async function postAdmin(
  path: string,
  secret: string,
  body: Record<string, unknown> = {},
): Promise<{ ok: true; state: ThemeStoreState } | { ok: false; error?: string }> {
  try {
    const res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, ...body }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) return { ok: false, error: data?.error };
    return { ok: true, state: data.state as ThemeStoreState };
  } catch {
    return { ok: false };
  }
}

function PassphraseGate({
  onUnlock,
}: {
  onUnlock: (secret: string, state: ThemeStoreState) => void;
}) {
  const [passphrase, setPassphrase] = useState("");
  const [status, setStatus] = useState<"idle" | "checking" | "error">("idle");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("checking");
    const result = await postAdmin("/api/admin/auth", passphrase);
    if (result.ok) onUnlock(passphrase, result.state);
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
          <p className="mt-1 font-mono text-[11px] leading-relaxed text-muted-foreground/70">Acceso restringido.</p>
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

function ModeTabs({ mode, onChange }: { mode: ThemeMode; onChange: (mode: ThemeMode) => void }) {
  return (
    <div className="flex items-center gap-0.5 rounded-full border border-border bg-background/60 p-[3px]">
      {(["light", "dark"] as const).map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => onChange(m)}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[10px] tracking-wide uppercase transition-colors ${
            mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {m === "light" ? <Sun className="size-3" /> : <Moon className="size-3" />}
          {m === "light" ? "Claro" : "Oscuro"}
        </button>
      ))}
    </div>
  );
}

function StatusLine({ text }: { text: string }) {
  if (!text) return null;
  return <p className="font-mono text-[11px] text-muted-foreground">{text}</p>;
}

export function AdminConsole() {
  const [unlocked, setUnlocked] = useState(false);
  const [secret, setSecret] = useState<string | null>(null);
  const [server, setServer] = useState<ThemeStoreState | null>(null);
  const [draft, setDraft] = useState<ThemePair | null>(null);
  const [mode, setMode] = useState<ThemeMode>("light");
  const [panelOpen, setPanelOpen] = useState(true);
  const [saveStatus, setSaveStatus] = useState("");
  const [actionStatus, setActionStatus] = useState("");
  const [presetName, setPresetName] = useState("");

  // The <style> override only differentiates by the .dark class (same
  // mechanism as the public site) — this keeps this tab's class in sync
  // with whichever mode the panel has selected, so switching tabs actually
  // shows that mode's preview instead of just changing which sliders are
  // wired up.
  useEffect(() => {
    if (!unlocked) return;
    document.documentElement.classList.toggle("dark", mode === "dark");
  }, [mode, unlocked]);

  function unlock(secretValue: string, state: ThemeStoreState) {
    setSecret(secretValue);
    setServer(state);
    setDraft(state.live);
    setMode("light");
    setUnlocked(true);
  }

  if (!unlocked || !draft || !server || !secret) {
    return <PassphraseGate onUnlock={unlock} />;
  }

  const dirtyMode = JSON.stringify(draft[mode]) !== JSON.stringify(server.live[mode]);
  const dirtyAny = JSON.stringify(draft) !== JSON.stringify(server.live);

  function setSection(next: ThemeConfig) {
    setDraft((d) => (d ? { ...d, [mode]: next } : d));
    setSaveStatus("");
  }

  function discardMode() {
    setDraft((d) => (d ? { ...d, [mode]: server!.live[mode] } : d));
    setSaveStatus("");
  }

  async function saveMode() {
    setSaveStatus("guardando…");
    const result = await postAdmin("/api/admin/theme", secret!, { mode, theme: draft![mode] });
    if (result.ok) {
      setServer(result.state);
      setDraft(result.state.live);
      setSaveStatus("guardado — se está propagando a todos los visitantes");
    } else {
      setSaveStatus(`error al guardar${result.error ? `: ${result.error}` : ""}`);
    }
  }

  async function promote() {
    if (dirtyAny) return;
    if (!window.confirm("Esto hace que el tema vigente (claro y oscuro) sea el nuevo default de seguridad. ¿Continuar?")) return;
    setActionStatus("promoviendo…");
    const result = await postAdmin("/api/admin/theme/default", secret!, { action: "promote" });
    if (result.ok) {
      setServer(result.state);
      setActionStatus("default actualizado");
    } else {
      setActionStatus("error al promover");
    }
  }

  async function restore() {
    if (!window.confirm("Esto reemplaza el tema vigente (claro y oscuro) por el default guardado, para todos los visitantes. ¿Continuar?")) return;
    setActionStatus("restaurando…");
    const result = await postAdmin("/api/admin/theme/default", secret!, { action: "restore" });
    if (result.ok) {
      setServer(result.state);
      setDraft(result.state.live);
      setActionStatus("restaurado al default");
    } else {
      setActionStatus("error al restaurar");
    }
  }

  async function savePreset() {
    const name = presetName.trim();
    if (!name || dirtyAny) return;
    setActionStatus("guardando preset…");
    const result = await postAdmin("/api/admin/theme/presets", secret!, { action: "save", name });
    if (result.ok) {
      setServer(result.state);
      setPresetName("");
      setActionStatus(`preset "${name}" guardado`);
    } else {
      setActionStatus("error al guardar preset");
    }
  }

  async function applyPreset(id: string, name: string) {
    if (!window.confirm(`Aplicar el preset "${name}" como vigente para todos los visitantes?`)) return;
    setActionStatus("aplicando preset…");
    const result = await postAdmin("/api/admin/theme/presets", secret!, { action: "apply", id });
    if (result.ok) {
      setServer(result.state);
      setDraft(result.state.live);
      setActionStatus(`"${name}" aplicado`);
    } else {
      setActionStatus("error al aplicar preset");
    }
  }

  async function deletePreset(id: string, name: string) {
    if (!window.confirm(`¿Borrar el preset "${name}"? Esto no se puede deshacer desde aquí.`)) return;
    setActionStatus("borrando preset…");
    const result = await postAdmin("/api/admin/theme/presets", secret!, { action: "delete", id });
    if (result.ok) {
      setServer(result.state);
      setActionStatus(`"${name}" borrado`);
    } else {
      setActionStatus("error al borrar preset");
    }
  }

  return (
    <>
      {/* Live-preview override for THIS tab only — same mechanism/helper as
          the real site (see app/[locale]/layout.tsx), fed the in-progress
          draft instead of the published state, so switching the mode tab
          above actually previews that mode's unsaved edits too. */}
      <style dangerouslySetInnerHTML={{ __html: themePairToCss(draft) }} />

      {/* The replica: the real Header/HomeView/Footer, exactly as visitors
          see them (SiteBackground is already mounted once in
          app/admin/layout.tsx, behind everything). Locale is fixed to "es"
          — this previews appearance, not translations. */}
      <LocaleProvider locale="es">
        <Header />
        <HomeView />
        <Footer />
      </LocaleProvider>

      <button
        type="button"
        onClick={() => setPanelOpen((o) => !o)}
        aria-label={panelOpen ? "Cerrar panel" : "Abrir panel"}
        className="fixed top-6 right-6 z-50 flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-lg backdrop-blur-xl"
      >
        {panelOpen ? <X className="size-4" /> : <Menu className="size-4" />}
      </button>

      {panelOpen && (
        <aside className="fixed inset-y-0 right-0 z-40 w-full max-w-sm overflow-y-auto border-l border-border bg-background/95 p-5 pt-20 shadow-2xl backdrop-blur-2xl">
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between gap-3">
              <h1 className="font-heading text-base font-extrabold tracking-tight">Consola admin</h1>
              <button
                type="button"
                onClick={() => setUnlocked(false)}
                className="font-mono text-[10px] tracking-wide text-muted-foreground uppercase hover:text-foreground"
              >
                salir
              </button>
            </div>

            <ModeTabs mode={mode} onChange={setMode} />

            <BrandColorSection
              value={draft[mode].brand}
              onChange={(brand) => setSection({ ...draft[mode], brand })}
              onReset={() => setSection({ ...draft[mode], brand: server.default[mode].brand })}
            />
            <BackgroundSection
              value={draft[mode].background}
              onChange={(background) => setSection({ ...draft[mode], background })}
              onReset={() => setSection({ ...draft[mode], background: server.default[mode].background })}
            />
            <ChromeSection
              value={draft[mode].chrome}
              onChange={(chrome) => setSection({ ...draft[mode], chrome })}
              onReset={() => setSection({ ...draft[mode], chrome: server.default[mode].chrome })}
            />

            <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-4">
              <StatusLine text={saveStatus || (dirtyMode ? "cambios sin guardar en este modo" : "sin cambios")} />
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={discardMode}
                  disabled={!dirtyMode}
                  className="font-mono text-xs text-muted-foreground uppercase hover:text-foreground disabled:opacity-40"
                >
                  descartar
                </button>
                <button
                  type="button"
                  onClick={saveMode}
                  disabled={!dirtyMode}
                  className="rounded-full bg-primary px-4 py-2 font-mono text-xs font-medium text-primary-foreground hover:bg-primary/80 disabled:opacity-50"
                >
                  guardar {mode === "light" ? "claro" : "oscuro"}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-4">
              <p className="font-mono text-[10px] tracking-widest text-accent uppercase">Default de seguridad</p>
              <p className="font-mono text-[10px] leading-relaxed text-muted-foreground/70">
                &quot;Restaurar&quot; publica el default (claro+oscuro) para todos. &quot;Promover&quot; hace que lo
                vigente ahora mismo sea el nuevo default — requiere no tener cambios sin guardar.
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={restore}
                  className="font-mono text-xs text-muted-foreground uppercase hover:text-foreground"
                >
                  restaurar default
                </button>
                <button
                  type="button"
                  onClick={promote}
                  disabled={dirtyAny}
                  className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 font-mono text-xs text-primary uppercase hover:bg-primary/20 disabled:opacity-40"
                >
                  vigente → default
                </button>
              </div>
              <StatusLine text={actionStatus} />
            </div>

            <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
              <p className="font-mono text-[10px] tracking-widest text-accent uppercase">Presets</p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  placeholder="nombre del preset"
                  className="min-w-0 flex-1 rounded-lg border border-input bg-background px-2.5 py-1.5 font-mono text-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
                <button
                  type="button"
                  onClick={savePreset}
                  disabled={!presetName.trim() || dirtyAny}
                  className="shrink-0 rounded-full border border-border px-3 py-1.5 font-mono text-[10px] uppercase hover:text-foreground disabled:opacity-40"
                >
                  guardar vigente
                </button>
              </div>
              {dirtyAny && (
                <p className="font-mono text-[9px] text-muted-foreground/60">
                  guarda tus cambios de claro y oscuro antes de crear un preset o promover a default.
                </p>
              )}
              <div className="flex flex-col gap-1.5">
                {server.presets.length === 0 && (
                  <p className="font-mono text-[10px] text-muted-foreground/50">sin presets guardados</p>
                )}
                {server.presets.map((preset) => (
                  <div
                    key={preset.id}
                    className="flex items-center justify-between gap-2 rounded-lg bg-background/50 px-2.5 py-1.5"
                  >
                    <span className="truncate font-mono text-[11px]">{preset.name}</span>
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={() => applyPreset(preset.id, preset.name)}
                        className="font-mono text-[9px] tracking-wide text-muted-foreground uppercase hover:text-foreground"
                      >
                        aplicar
                      </button>
                      <button
                        type="button"
                        onClick={() => deletePreset(preset.id, preset.name)}
                        aria-label={`Borrar preset ${preset.name}`}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      )}
    </>
  );
}
