"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Pencil, Trash2, ArrowRight, Notebook } from "lucide-react";
import { VERSES, verseRef } from "@/lib/reading-data";
import {
  HIGHLIGHT_STYLES,
  updateHighlights,
  useHighlights,
} from "@/lib/highlights-store";
import { cn } from "@/lib/utils";

type Filter = "todos" | "grifos" | "notas";

export default function NotasPage() {
  const entries = useHighlights();
  const [filter, setFilter] = useState<Filter>("todos");
  const [query, setQuery] = useState("");
  const [openVerse, setOpenVerse] = useState<number | null>(null);
  const [draft, setDraft] = useState("");

  const items = useMemo(() => {
    return Object.entries(entries)
      .map(([verseStr, entry]) => {
        const verse = Number(verseStr);
        const verseData = VERSES.find((v) => v.number === verse);
        return verseData ? { verse, text: verseData.text, ...entry } : null;
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .filter((item) => {
        if (filter === "grifos") return Boolean(item.color);
        if (filter === "notas") return Boolean(item.note?.trim());
        return true;
      })
      .filter((item) => {
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        return (
          item.text.toLowerCase().includes(q) ||
          item.note?.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }, [entries, filter, query]);

  const openVerseData = openVerse !== null ? VERSES.find((v) => v.number === openVerse) : undefined;

  function startEditing(verse: number) {
    setOpenVerse(verse);
    setDraft(entries[verse]?.note ?? "");
  }

  function saveNote() {
    if (openVerse === null) return;
    updateHighlights((prev) => ({
      ...prev,
      [openVerse]: { ...prev[openVerse], note: draft.trim() || undefined, updatedAt: Date.now() },
    }));
  }

  function removeEntry(verse: number) {
    updateHighlights((prev) => {
      const next = { ...prev };
      delete next[verse];
      return next;
    });
    setOpenVerse(null);
  }

  return (
    <div className="flex flex-1 flex-col">
      <h1 className="mb-4 text-xl font-medium">Minhas Notas</h1>

      <div className="mb-3 flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2.5 shadow-elevated">
        <Search className="h-4 w-4 text-muted-foreground" strokeWidth={1.9} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por palavra ou capítulo"
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div className="mb-5 flex gap-2 overflow-x-auto">
        {(
          [
            { key: "todos", label: "Tudo" },
            { key: "grifos", label: "Grifos" },
            { key: "notas", label: "Notas" },
          ] as { key: Filter; label: string }[]
        ).map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={cn(
              "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors",
              filter === key
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-card text-muted-foreground"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
            <Notebook className="h-6 w-6" strokeWidth={1.7} />
          </div>
          <div className="space-y-1">
            <p className="font-serif text-base font-medium">Nada por aqui ainda</p>
            <p className="mx-auto max-w-[26ch] text-sm text-muted-foreground">
              Grife um versículo ou escreva uma nota durante a leitura pra
              começar sua coleção.
            </p>
          </div>
          <Link
            href="/biblia"
            className="rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground"
          >
            Ir para a leitura
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {items.map((item) => (
            <button
              key={item.verse}
              type="button"
              onClick={() => startEditing(item.verse)}
              className="rounded-xl border border-border bg-card p-3 text-left shadow-elevated transition-transform active:scale-[0.99]"
            >
              <div className="mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-accent">
                  {item.color && (
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: HIGHLIGHT_STYLES[item.color].dot }}
                    />
                  )}
                  {verseRef(item.verse)}
                </span>
                <span className="text-[10px] font-semibold text-muted-foreground">
                  {new Date(item.updatedAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "short",
                  })}
                </span>
              </div>
              <p
                className="font-serif text-sm leading-snug"
                style={{
                  backgroundColor: item.color ? HIGHLIGHT_STYLES[item.color].bg : undefined,
                }}
              >
                {item.text}
              </p>
              {item.note?.trim() && (
                <div className="mt-2 flex items-start gap-1.5 rounded-lg bg-muted px-2.5 py-2 text-xs leading-relaxed text-muted-foreground">
                  <Pencil className="mt-0.5 h-3 w-3 shrink-0 text-accent" strokeWidth={2} />
                  <span className="line-clamp-2">{item.note}</span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Detail bottom sheet */}
      {openVerse !== null && openVerseData && (
        <div className="fixed inset-0 z-30 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/35" onClick={() => setOpenVerse(null)} />
          <div className="relative w-full max-w-sm animate-in slide-in-from-bottom duration-200 rounded-t-3xl bg-card p-5 pb-6 shadow-elevated-lg">
            <div className="mx-auto mb-4 h-1 w-8 rounded-full bg-border" />
            <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-accent">
              {verseRef(openVerse)}
            </p>
            <p className="mb-4 border-l-2 border-accent pl-3 font-serif text-sm italic leading-relaxed text-muted-foreground">
              &ldquo;{openVerseData.text}&rdquo;
            </p>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Escreva o que esse trecho significa pra você…"
              rows={3}
              className="w-full resize-none rounded-xl border border-border bg-background p-3 text-sm leading-relaxed outline-none focus:border-accent"
            />
            <div className="mt-4 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => removeEntry(openVerse)}
                aria-label="Remover"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-accent"
              >
                <Trash2 className="h-4 w-4" strokeWidth={1.9} />
              </button>
              <div className="flex gap-2">
                <Link
                  href="/biblia"
                  className="flex items-center gap-1 rounded-full border border-border px-4 py-2 text-xs font-bold"
                >
                  Abrir no capítulo
                  <ArrowRight className="h-3 w-3" strokeWidth={2.4} />
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    saveNote();
                    setOpenVerse(null);
                  }}
                  className="rounded-full bg-primary px-5 py-2 text-xs font-bold text-primary-foreground"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
