"use client";

import Link from "next/link";
import {
  BookOpen,
  Bell,
  LogOut,
  ChevronRight,
  Pencil,
} from "lucide-react";
import FallbackAvatar from "@/components/fallback-avatar";
import { TiltCard } from "@/components/tilt-card";
import { Badge } from "@/components/ui/badge";
import { StreakBadge } from "@/components/streak-badge";
import { VERSES, verseRef } from "@/lib/reading-data";
import { useHighlights } from "@/lib/highlights-store";
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

const ACCOUNT_ROWS = [
  { icon: BookOpen, label: "Versão da Bíblia", value: "NVI" },
  { icon: Bell, label: "Notificações", value: undefined },
];

export default function PerfilPage() {
  const entries = useHighlights();
  const notesCount = Object.values(entries).filter((e) => e.note?.trim()).length;

  const todayVerse = VERSES[0];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="relative">
          <FallbackAvatar
            name="Marcos Andrade"
            size={40}
            className="shadow-elevated ring-2 ring-card"
          />
          <button
            type="button"
            aria-label="Editar perfil"
            className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-border bg-card shadow-elevated"
          >
            <Pencil className="h-2.5 w-2.5" strokeWidth={2.2} />
          </button>
        </div>
        <div>
          <p className="text-sm font-bold">Marcos Andrade</p>
          <p className="text-xs text-muted-foreground">No Raiz desde mar/2026</p>
        </div>
        <StreakBadge className="ml-auto" />
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
        tiltLimit={9}
        scale={1.02}
        perspective={900}
        effect="gravitate"
        className="rounded-2xl bg-gradient-to-br from-[#3b2f22] via-[#2c2318] to-[#1e170f] p-5 text-center text-[#f6f0e2] shadow-elevated-lg"
      >
        <div className="pointer-events-none absolute -top-14 -right-8 h-40 w-40 rounded-full bg-accent/20 blur-3xl" />
        <p className="relative mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#d3865c]">
          Baseado na sua leitura de hoje
        </p>
        <p className="relative mb-1 text-balance font-serif text-base italic leading-snug">
          &ldquo;{todayVerse.text}&rdquo;
        </p>
        <span className="relative text-[11px] font-semibold text-[#f6f0e2]/60">
          {verseRef(todayVerse.number)}
        </span>
      </TiltCard>

      <div>
        <div className="mb-2.5 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Devocionais para você
          </p>
          <Link href="/devocional" className="text-xs font-bold text-accent">
            Ver todos
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {DEVOTIONALS.map((d) => (
            <Link
              key={d.title}
              href="/devocional"
              className="rounded-xl border border-border bg-card p-3 shadow-elevated transition-transform active:scale-[0.98]"
            >
              <Badge variant="secondary" className="mb-1.5 bg-accent/10 text-[9px] font-bold text-accent">
                {d.tag}
              </Badge>
              <p className="text-xs font-bold leading-tight">{d.title}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        <div className="rounded-xl border border-border bg-card py-2.5 text-center shadow-elevated">
          <p className="font-serif text-base font-semibold">46</p>
          <p className="text-[8.5px] font-bold uppercase tracking-wide text-muted-foreground">
            Capítulos
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card py-2.5 text-center shadow-elevated">
          <p className="font-serif text-base font-semibold tabular-nums">{notesCount}</p>
          <p className="text-[8.5px] font-bold uppercase tracking-wide text-muted-foreground">
            Notas
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card py-2.5 text-center shadow-elevated">
          <p className="font-serif text-base font-semibold">4</p>
          <p className="text-[8.5px] font-bold uppercase tracking-wide text-muted-foreground">
            Conquistas
          </p>
        </div>
      </div>

      <div>
        <p className="mb-2.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Conta
        </p>
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-elevated">
          {ACCOUNT_ROWS.map(({ icon: Icon, label, value }, i) => (
            <div
              key={label}
              className={cn(
                "flex items-center gap-3 px-3.5 py-3",
                i > 0 && "border-t border-border"
              )}
            >
              <Icon className="h-4 w-4 text-accent" strokeWidth={1.8} />
              <span className="flex-1 text-sm font-semibold">{label}</span>
              {value && <span className="text-xs text-muted-foreground">{value}</span>}
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" strokeWidth={2} />
            </div>
          ))}
          <button
            type="button"
            className="flex w-full items-center gap-3 border-t border-border px-3.5 py-3 text-accent"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.8} />
            <span className="text-sm font-semibold">Sair da conta</span>
          </button>
        </div>
      </div>
    </div>
  );
}
