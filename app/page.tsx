import { ArrowRight, Download, BriefcaseBusiness, LayoutGrid, Cpu, Flame } from "lucide-react";
import { Container } from "@/components/layout/container";
import { ProfileEmblem } from "@/components/home/profile-emblem";
import { StatCard } from "@/components/home/stat-card";

export default function Home() {
  return (
    <main className="relative flex flex-1 flex-col text-foreground">
      <Container>
        <div className="relative grid grid-cols-1 items-center gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <ProfileEmblem />

          <div className="flex max-w-[540px] flex-col">
            <div className="flex items-center gap-3 font-mono text-[10.5px] tracking-[.24em] uppercase">
              <span className="text-primary">01</span>
              <span className="text-accent">Presentación</span>
              <span className="h-px w-9 bg-border" />
              <span className="text-muted-foreground/70">Ecuador</span>
            </div>

            <h1 className="mt-6 font-heading text-h1 text-balance">
              Desarrollo soluciones que generan{" "}
              <span className="font-black text-primary [text-shadow:0_0_52px_hsl(var(--primary-h)_var(--primary-s)_var(--primary-l)_/_.55)]">
                impacto
              </span>
              .
            </h1>

            <p className="mt-7 max-w-[470px] text-body text-pretty text-muted-foreground">
              Construyo aplicaciones web modernas con Next.js, Laravel y
              Postgres. Me interesa lo que pasa debajo de la interfaz:
              rendimiento, arquitectura limpia y decisiones que aguantan el
              crecimiento del producto.
            </p>

            <div className="mt-9 flex gap-3.5">
              <a
                href="#"
                className="inline-flex items-center gap-2.5 rounded-[14px] bg-[linear-gradient(135deg,var(--primary),var(--primary-2))] px-[26px] py-[15px] text-[13.5px] font-semibold text-primary-foreground shadow-[0_14px_42px_hsl(var(--primary-2-h)_var(--primary-2-s)_var(--primary-2-l)_/_.44),inset_0_1px_0_rgba(255,255,255,.28)]"
              >
                Ver proyectos <ArrowRight className="size-[15px]" />
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2.5 rounded-[14px] border border-border bg-card px-[26px] py-[15px] text-[13.5px] font-medium text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,.16)] backdrop-blur-[18px]"
              >
                Descargar CV{" "}
                <Download className="size-[15px] text-muted-foreground" />
              </a>
            </div>

            <div
              className="flex items-center gap-6 font-mono text-[10.5px] tracking-[.14em] text-muted-foreground/60 uppercase"
              style={{ marginTop: "52px" }}
            >
              <span>Next.js</span>
              <span className="size-[3px] rounded-full bg-accent/70" />
              <span>Laravel</span>
              <span className="size-[3px] rounded-full bg-accent/70" />
              <span>Postgres</span>
              <span className="size-[3px] rounded-full bg-accent/70" />
              <span>Python</span>
            </div>
          </div>
        </div>

        <div className="relative grid grid-cols-2 gap-5 pb-16 lg:grid-cols-4">
          <StatCard
            icon={BriefcaseBusiness}
            value={3}
            prefix="+"
            label="Años de experiencia"
          />
          <StatCard
            icon={LayoutGrid}
            value={15}
            prefix="+"
            label="Proyectos completados"
          />
          <StatCard
            icon={Cpu}
            value={8}
            prefix="+"
            label="Tecnologías dominadas"
          />
          <StatCard
            icon={Flame}
            value={100}
            suffix="%"
            label="Comprometido"
            highlight
          />
        </div>
      </Container>
    </main>
  );
}
