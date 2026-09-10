"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, List, Search, Pencil, Copy, X, Check } from "lucide-react";
import { Mascot } from "@/components/mascot";
import { CURRENT_CHAPTER, VERSES, verseRef } from "@/lib/reading-data";
import {
  HIGHLIGHT_STYLES,
  updateHighlights,
  useHighlights,
  type HighlightColor,
} from "@/lib/highlights-store";
import { cn } from "@/lib/utils";

export default function BibliaPage() {
  const [progress, setProgress] = useState(0);
  const entries = useHighlights();
  const [activeVerse, setActiveVerse] = useState<number | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [noteVerse, setNoteVerse] = useState<number | null>(null);

  useEffect(() => {
    function onScroll() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(100, Math.round((window.scrollY / max) * 100)) : 0);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function updateEntry(verse: number, patch: Partial<{ color?: HighlightColor; note?: string }>) {
    updateHighlights((prev) => {
      const current = prev[verse] ?? { updatedAt: Date.now() };
      const next = { ...current, ...patch, updatedAt: Date.now() };
      const isEmpty = !next.color && !next.note?.trim();
      const copy = { ...prev };
      if (isEmpty) {
        delete copy[verse];
      } else {
        copy[verse] = next;
      }
      return copy;
    });
  }

  function toggleVerse(n: number) {
    setActiveVerse((prev) => (prev === n ? null : n));
  }

  function applyHighlight(color: HighlightColor) {
    if (activeVerse === null) return;
    const current = entries[activeVerse]?.color;
    updateEntry(activeVerse, { color: current === color ? undefined : color });
  }

  function openNote() {
    if (activeVerse === null) return;
    setNoteVerse(activeVerse);
    setNoteDraft(entries[activeVerse]?.note ?? "");
  }

  function saveNote() {
    if (noteVerse === null) return;
    updateEntry(noteVerse, { note: noteDraft.trim() || undefined });
    setNoteVerse(null);
    setActiveVerse(null);
  }

  return (
    <div className="relative flex flex-1 flex-col">
      <div className="flex items-center justify-between pb-3">
        <Link
          href="/home"
          aria-label="Voltar"
          className="rounded-full p-1 text-foreground/80 transition-colors hover:text-foreground"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={1.9} />
        </Link>
        <span className="text-sm font-bold">{CURRENT_CHAPTER.ref}</span>
        <div className="flex items-center gap-4 text-foreground/70">
          <List className="h-[18px] w-[18px]" strokeWidth={1.8} />
          <Search className="h-[18px] w-[18px]" strokeWidth={1.8} />
        </div>
      </div>

      <div className="h-[3px] w-full overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Contextual action bar for the tapped verse */}
      <div
        className={cn(
          "sticky top-0 z-10 mt-3 overflow-hidden rounded-2xl bg-[#241c14] text-[#f6f0e2] shadow-elevated-lg transition-all duration-200",
          activeVerse !== null ? "max-h-16 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="flex items-center gap-1 px-3 py-2.5">
          <span className="mr-1 text-[11px] font-bold text-[#f6f0e2]/70">
            {activeVerse !== null ? verseRef(activeVerse) : ""}
          </span>
          <div className="ml-auto flex items-center gap-1.5">
            {(Object.keys(HIGHLIGHT_STYLES) as HighlightColor[]).map((color) => {
              const isOn = activeVerse !== null && entries[activeVerse]?.color === color;
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => applyHighlight(color)}
                  aria-label={`Grifar em ${HIGHLIGHT_STYLES[color].label}`}
                  className="flex h-7 w-7 items-center justify-center rounded-full transition-transform active:scale-90"
                  style={{ backgroundColor: HIGHLIGHT_STYLES[color].dot }}
                >
                  {isOn && <Check className="h-3.5 w-3.5 text-[#241c14]" strokeWidth={3} />}
                </button>
              );
            })}
            <span className="mx-1 h-5 w-px bg-white/15" />
            <button
              type="button"
              onClick={openNote}
              aria-label="Adicionar nota"
              className="flex h-7 w-7 items-center justify-center rounded-full text-[#f6f0e2] hover:bg-white/10"
            >
              <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
            <button
              type="button"
              aria-label="Copiar"
              className="flex h-7 w-7 items-center justify-center rounded-full text-[#f6f0e2] hover:bg-white/10"
            >
              <Copy className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={() => setActiveVerse(null)}
              aria-label="Fechar"
              className="flex h-7 w-7 items-center justify-center rounded-full text-[#f6f0e2] hover:bg-white/10"
            >
              <X className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-accent">
          {CURRENT_CHAPTER.subheading}
        </p>
        <h1 className="mb-4 text-xl font-medium text-balance">
          {CURRENT_CHAPTER.heading}
        </h1>

        <p className="font-serif text-[15px] leading-[1.9]">
          {VERSES.map((v) => {
            const entry = entries[v.number];
            const hasNote = Boolean(entry?.note?.trim());
            const isActive = activeVerse === v.number;
            return (
              <span key={v.number} className="relative">
                <sup className="mr-0.5 font-sans text-[9px] font-bold text-accent">
                  {v.number}
                </sup>
                <span
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleVerse(v.number)}
                  onKeyDown={(e) => e.key === "Enter" && toggleVerse(v.number)}
                  className={cn(
                    "cursor-pointer rounded transition-colors",
                    isActive && "ring-2 ring-accent/50"
                  )}
                  style={{
                    backgroundColor: entry?.color
                      ? HIGHLIGHT_STYLES[entry.color].bg
                      : undefined,
                  }}
                >
                  {v.text}
                  {hasNote && (
                    <span
                      aria-hidden
                      className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-accent align-middle"
                    />
                  )}
                </span>{" "}
              </span>
            );
          })}
        </p>
      </div>

      <div className="flex-1" />

      {/* Floating Cordeirinho FAB */}
      <div className="pointer-events-none fixed inset-x-0 z-10 flex justify-center" style={{ bottom: "6.75rem" }}>
        <div className="w-full max-w-sm px-5">
          <div className="flex justify-end">
            <Link
              href="/chat"
              className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full border border-border bg-card shadow-elevated-lg transition-transform active:scale-95"
              aria-label="Conversar com o Cordeirinho"
            >
              <Mascot className="h-9 w-9" />
            </Link>
          </div>
        </div>
      </div>

      {/* Note bottom sheet */}
      {noteVerse !== null && (
        <div className="fixed inset-0 z-30 flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black/35"
            onClick={() => setNoteVerse(null)}
          />
          <div className="relative w-full max-w-sm animate-in slide-in-from-bottom duration-200 rounded-t-3xl bg-card p-5 pb-6 shadow-elevated-lg">
            <div className="mx-auto mb-4 h-1 w-8 rounded-full bg-border" />
            <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-accent">
              Sua nota · {verseRef(noteVerse)}
            </p>
            <p className="mb-4 border-l-2 border-accent pl-3 font-serif text-sm italic leading-relaxed text-muted-foreground">
              &ldquo;{VERSES.find((v) => v.number === noteVerse)?.text}&rdquo;
            </p>
            <textarea
              autoFocus
              value={noteDraft}
              onChange={(e) => setNoteDraft(e.target.value)}
              placeholder="Escreva o que esse trecho significa pra você…"
              rows={3}
              className="w-full resize-none rounded-xl border border-border bg-background p-3 text-sm leading-relaxed outline-none focus:border-accent"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setNoteVerse(null)}
                className="rounded-full px-4 py-2 text-xs font-bold text-muted-foreground"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={saveNote}
                className="rounded-full bg-primary px-5 py-2 text-xs font-bold text-primary-foreground"
              >
                Salvar nota
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
