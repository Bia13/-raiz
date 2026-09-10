import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import FallbackAvatar from "@/components/fallback-avatar";
import { TiltCard } from "@/components/tilt-card";
import { Badge } from "@/components/ui/badge";
import { StreakBadge } from "@/components/streak-badge";
import { PageTransition } from "@/components/page-transition";
import { cn } from "@/lib/utils";

const WEEK = [
  { day: "D", date: 17 },
  { day: "S", date: 18 },
  { day: "T", date: 19 },
  { day: "Q", date: 20 },
  { day: "Q", date: 21 },
  { day: "S", date: 22 },
  { day: "S", date: 23 },
];
const TODAY_INDEX = 2;

const DEVOTIONALS = [
  { tag: "3 dias", title: "Gratidão em tempos difíceis" },
  { tag: "5 dias", title: "Confiança nas incertezas" },
];

export default function HomePage() {
  return (
    <PageTransition>
    <div className="flex flex-col gap-7">
      <div className="flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-500">
        <div className="flex items-center gap-3">
          <FallbackAvatar
            name="Marcos Andrade"
            size={40}
            className="shadow-elevated ring-2 ring-card"
          />
          <div>
            <p className="text-xs text-muted-foreground">Bom dia,</p>
            <p className="font-serif text-lg leading-tight font-medium">
              Marcos
            </p>
          </div>
        </div>
        <StreakBadge />
      </div>

      <div className="relative flex justify-between">
        <div className="absolute inset-x-3.5 top-[13px] h-px bg-border" />
        {WEEK.map((d, i) => (
          <div
            key={d.date}
            className="relative flex flex-col items-center gap-1.5 text-[10px] font-bold text-muted-foreground"
          >
            <span>{d.day}</span>
            <span
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold text-foreground ring-4 ring-background transition-colors",
                i === TODAY_INDEX && "bg-accent text-accent-foreground shadow-elevated",
                i < TODAY_INDEX && "bg-primary/15 text-primary",
                i > TODAY_INDEX && "bg-muted"
              )}
            >
              {d.date}
            </span>
          </div>
        ))}
      </div>

      <TiltCard
        tiltLimit={7}
        scale={1.015}
        perspective={1000}
        effect="gravitate"
        className="rounded-3xl bg-gradient-to-br from-[#3b2f22] via-[#2c2318] to-[#1e170f] p-6 text-[#f6f0e2] shadow-elevated-lg"
      >
        <div className="pointer-events-none absolute -top-16 -right-10 h-48 w-48 rounded-full bg-accent/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />

        <div className="relative flex flex-col items-center">
          <div
            className="mb-4 flex h-[72px] w-[72px] items-center justify-center rounded-full"
            style={{
              background: "conic-gradient(#d3865c 40%, rgba(255,255,255,0.12) 0)",
            }}
          >
            <div className="flex h-[58px] w-[58px] items-center justify-center rounded-full bg-[#241c14]">
              <span className="font-serif text-base font-semibold">40%</span>
            </div>
          </div>
          <p className="mb-2 text-center text-[10px] font-bold tracking-[0.14em] text-[#d3865c] uppercase">
            Jornada de hoje
          </p>
          <p className="text-center text-[17px] leading-snug font-serif text-balance text-[#f6f0e2]/95 italic">
            &ldquo;Deixe o Espírito trazer paz enquanto você lê, escuta e
            reflete.&rdquo;
          </p>
          <div className="mt-5 flex w-full gap-2">
            
            <Link
              href="/devocional"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#d3865c] py-2.5 text-xs font-bold text-[#241c14] shadow-[0_8px_20px_-8px_rgba(211,134,92,0.7)] transition-transform active:scale-[0.98]"
            >
              Continuar
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.4} />
            </Link>
          </div>
        </div>
      </TiltCard>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-bold tracking-wide text-muted-foreground uppercase">
            Devocionais para você
          </p>
          <Link
            href="/devocional"
            className="flex items-center gap-0.5 text-xs font-bold text-accent transition-colors hover:text-accent/80"
          >
            Ver todos
            <ArrowRight className="h-3 w-3" strokeWidth={2.5} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {DEVOTIONALS.map((d) => (
            <Link
              key={d.title}
              href="/devocional"
              className="group flex flex-col gap-2.5 rounded-2xl border border-border bg-card p-3.5 shadow-elevated transition-all hover:-translate-y-0.5 hover:shadow-elevated-lg"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/12 text-accent transition-colors group-hover:bg-accent/20">
                <BookOpen className="h-4 w-4" strokeWidth={1.8} />
              </div>
              <div>
                <Badge
                  variant="secondary"
                  className="mb-1.5 bg-accent/10 text-[9px] font-bold text-accent"
                >
                  {d.tag}
                </Badge>
                <p className="text-xs leading-tight font-bold">{d.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
    </PageTransition>
  );
}
