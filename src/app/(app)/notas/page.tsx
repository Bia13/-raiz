"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Pencil,
  Trash2,
  ArrowRight,
  Notebook,
  Plus,
  BookMarked,
} from "lucide-react";
import { VERSES, verseRef } from "@/lib/reading-data";
import {
  HIGHLIGHT_STYLES,
  updateHighlights,
  useHighlights,
  type HighlightColor,
} from "@/lib/highlights-store";
import {
  updateJournal,
  useJournal,
  type JournalEntry,
} from "@/lib/journal-store";
import { ReferenceCombobox } from "@/components/reference-combobox";
import { cn } from "@/lib/utils";

type Filter = "todos" | "grifos" | "notas";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "todos", label: "Tudo" },
  { key: "grifos", label: "Grifos" },
  { key: "notas", label: "Notas" },
];

type NoteItem =
  | {
      kind: "verse";
      key: string;
      reference: string;
      quote: string;
      color?: HighlightColor;
      note?: string;
      updatedAt: number;
    }
  | {
      kind: "journal";
      id: string;
      text: string;
      reference?: string;
      /** Populated when `reference` exactly matches a known verse. */
      matchedQuote?: string;
      updatedAt: number;
    };

function findMatchedQuote(reference?: string): string | undefined {
  if (!reference) return undefined;
  return VERSES.find((v) => verseRef(v.number) === reference)?.text;
}

type JournalDraft = { id: string | null; text: string; reference: string };

export default function NotasPage() {
  const highlights = useHighlights();
  const journal = useJournal();

  const [filter, setFilter] = useState<Filter>("todos");
  const [query, setQuery] = useState("");
  const [openVerse, setOpenVerse] = useState<string | null>(null);
  const [verseDraft, setVerseDraft] = useState("");
  const [journalDraft, setJournalDraft] = useState<JournalDraft | null>(null);

  const items = useMemo(() => {
    const verseItems: NoteItem[] = Object.entries(highlights).map(
      ([key, entry]): NoteItem => ({
        kind: "verse",
        key,
        reference: entry.reference,
        quote: entry.quote,
        color: entry.color,
        note: entry.note,
        updatedAt: entry.updatedAt,
      })
    );

    const journalItems: NoteItem[] = Object.values(journal).map((entry: JournalEntry) => ({
      kind: "journal" as const,
      id: entry.id,
      text: entry.text,
      reference: entry.reference,
      matchedQuote: findMatchedQuote(entry.reference),
      updatedAt: entry.updatedAt,
    }));

    return [...verseItems, ...journalItems]
      .filter((item) => {
        if (filter === "grifos") return item.kind === "verse" && Boolean(item.color);
        if (filter === "notas") {
          return item.kind === "journal" || Boolean(item.note?.trim());
        }
        return true;
      })
      .filter((item) => {
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        if (item.kind === "verse") {
          return (
            item.quote.toLowerCase().includes(q) ||
            item.note?.toLowerCase().includes(q)
          );
        }
        return (
          item.text.toLowerCase().includes(q) ||
          item.reference?.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }, [highlights, journal, filter, query]);

  const openVerseEntry = openVerse !== null ? highlights[openVerse] : undefined;

  function startEditingVerse(key: string) {
    setOpenVerse(key);
    setVerseDraft(highlights[key]?.note ?? "");
  }

  function saveVerseNote() {
    if (openVerse === null) return;
    updateHighlights((prev) => ({
      ...prev,
      [openVerse]: { ...prev[openVerse], note: verseDraft.trim() || undefined, updatedAt: Date.now() },
    }));
  }

  function removeVerseEntry(key: string) {
    updateHighlights((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setOpenVerse(null);
  }

  function saveJournalDraft() {
    if (!journalDraft || !journalDraft.text.trim()) return;
    const reference = journalDraft.reference.trim() || undefined;
    const text = journalDraft.text.trim();
    const now = Date.now();
    updateJournal((prev) => {
      if (journalDraft.id) {
        const existing = prev[journalDraft.id];
        return {
          ...prev,
          [journalDraft.id]: { ...existing, text, reference, updatedAt: now },
        };
      }
      const id = crypto.randomUUID();
      return { ...prev, [id]: { id, text, reference, createdAt: now, updatedAt: now } };
    });
    setJournalDraft(null);
  }

  function removeJournalDraft() {
    if (!journalDraft?.id) return;
    const id = journalDraft.id;
    updateJournal((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setJournalDraft(null);
  }

  return (
    <div className="relative flex flex-1 flex-col">
      <div className="animate-in fade-in slide-in-from-top-2 duration-500">
        <h1 className="mb-4 font-serif text-xl font-medium">Minhas Notas</h1>

        <div className="mb-3 flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2.5 shadow-elevated transition-shadow focus-within:shadow-elevated-lg">
          <Search className="h-4 w-4 text-muted-foreground" strokeWidth={1.9} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por palavra ou capítulo"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        <div className="mb-5 flex gap-2 overflow-x-auto">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-bold transition-all",
                filter === key
                  ? "border-foreground bg-foreground text-background shadow-elevated"
                  : "border-border bg-card text-muted-foreground hover:border-foreground/30"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 py-16 text-center animate-in fade-in duration-500">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/15 to-primary/10 text-accent shadow-elevated">
            <Notebook className="h-7 w-7" strokeWidth={1.6} />
          </div>
          <div className="space-y-1.5">
            <p className="font-serif text-base font-medium">Nada por aqui ainda</p>
            <p className="mx-auto max-w-[26ch] text-sm leading-relaxed text-muted-foreground">
              Grife um versículo na leitura, ou escreva livremente aqui — como
              um diário.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/biblia"
              className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2.5 text-xs font-bold transition-colors hover:bg-muted"
            >
              Ir para a leitura
            </Link>
            <button
              type="button"
              onClick={() => setJournalDraft({ id: null, text: "", reference: "" })}
              className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-elevated transition-transform active:scale-[0.98]"
            >
              Escrever agora
              <ArrowRight className="h-3 w-3" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5 pb-20">
          {items.map((item, i) => (
            <button
              key={item.kind === "verse" ? `verse-${item.key}` : item.id}
              type="button"
              onClick={() =>
                item.kind === "verse"
                  ? startEditingVerse(item.key)
                  : setJournalDraft({
                      id: item.id,
                      text: item.text,
                      reference: item.reference ?? "",
                    })
              }
              style={{ animationDelay: `${i * 60}ms`, animationFillMode: "backwards" }}
              className="animate-in fade-in slide-in-from-bottom-2 rounded-xl border border-border bg-card p-3 text-left shadow-elevated transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elevated-lg active:scale-[0.99]"
            >
              <div className="mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-accent">
                  {item.kind === "verse" ? (
                    <>
                      {item.color && (
                        <span
                          className="h-2 w-2 rounded-full ring-2 ring-card"
                          style={{ backgroundColor: HIGHLIGHT_STYLES[item.color].dot }}
                        />
                      )}
                      {item.reference}
                    </>
                  ) : item.reference ? (
                    <>
                      <BookMarked className="h-3 w-3" strokeWidth={2.2} />
                      {item.reference}
                    </>
                  ) : (
                    <>
                      <Notebook className="h-3 w-3" strokeWidth={2.2} />
                      Diário
                    </>
                  )}
                </span>
                <span className="text-[10px] font-semibold text-muted-foreground">
                  {new Date(item.updatedAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "short",
                  })}
                </span>
              </div>

              {item.kind === "verse" ? (
                <>
                  <p
                    className="rounded font-serif text-sm leading-snug"
                    style={{
                      backgroundColor: item.color ? HIGHLIGHT_STYLES[item.color].bg : undefined,
                    }}
                  >
                    {item.quote}
                  </p>
                  {item.note?.trim() && (
                    <div className="mt-2 flex items-start gap-1.5 rounded-lg bg-muted px-2.5 py-2 text-xs leading-relaxed text-muted-foreground">
                      <Pencil className="mt-0.5 h-3 w-3 shrink-0 text-accent" strokeWidth={2} />
                      <span className="line-clamp-2">{item.note}</span>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {item.matchedQuote && (
                    <p className="mb-2 rounded bg-accent/10 px-2 py-1.5 font-serif text-sm italic leading-snug text-foreground">
                      &ldquo;{item.matchedQuote}&rdquo;
                    </p>
                  )}
                  <p className="line-clamp-3 text-sm leading-relaxed text-foreground">
                    {item.text}
                  </p>
                </>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Floating "write freely" button */}
      <div className="pointer-events-none fixed inset-x-0 z-10 flex justify-center" style={{ bottom: "6.75rem" }}>
        <div className="w-full max-w-sm px-5">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setJournalDraft({ id: null, text: "", reference: "" })}
              aria-label="Nova nota livre"
              className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-elevated-lg transition-transform active:scale-95"
            >
              <Plus className="h-6 w-6" strokeWidth={2.2} />
            </button>
          </div>
        </div>
      </div>

      {/* Verse note sheet */}
      {openVerse !== null && openVerseEntry && (
        <div className="fixed inset-0 z-30 flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black/35 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setOpenVerse(null)}
          />
          <div className="relative w-full max-w-sm animate-in slide-in-from-bottom duration-200 rounded-t-3xl bg-card p-5 pb-6 shadow-elevated-lg">
            <div className="mx-auto mb-4 h-1 w-8 rounded-full bg-border" />
            <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-accent">
              {openVerseEntry.reference}
            </p>
            <p className="mb-4 border-l-2 border-accent pl-3 font-serif text-sm italic leading-relaxed text-muted-foreground">
              &ldquo;{openVerseEntry.quote}&rdquo;
            </p>
            <textarea
              value={verseDraft}
              onChange={(e) => setVerseDraft(e.target.value)}
              placeholder="Escreva o que esse trecho significa pra você…"
              rows={3}
              className="w-full resize-none rounded-xl border border-border bg-background p-3 text-sm leading-relaxed outline-none transition-colors focus:border-accent"
            />
            <div className="mt-4 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => removeVerseEntry(openVerse)}
                aria-label="Remover"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-accent transition-colors hover:bg-accent/10"
              >
                <Trash2 className="h-4 w-4" strokeWidth={1.9} />
              </button>
              <div className="flex gap-2">
                <Link
                  href="/biblia"
                  className="flex items-center gap-1 rounded-full border border-border px-4 py-2 text-xs font-bold transition-colors hover:bg-muted"
                >
                  Abrir no capítulo
                  <ArrowRight className="h-3 w-3" strokeWidth={2.4} />
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    saveVerseNote();
                    setOpenVerse(null);
                  }}
                  className="rounded-full bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-elevated transition-transform active:scale-[0.98]"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Free journal composer / editor sheet */}
      {journalDraft && (
        <div className="fixed inset-0 z-30 flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black/35 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setJournalDraft(null)}
          />
          <div className="relative w-full max-w-sm animate-in slide-in-from-bottom duration-200 rounded-t-3xl bg-card p-5 pb-6 shadow-elevated-lg">
            <div className="mx-auto mb-4 h-1 w-8 rounded-full bg-border" />
            <p className="mb-3 font-serif text-base font-medium">
              {journalDraft.id ? "Editar nota" : "Escrever livremente"}
            </p>

            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
              Referência (opcional)
            </label>
            <div className="mb-3">
              <ReferenceCombobox
                value={journalDraft.reference}
                onChange={(reference) =>
                  setJournalDraft((d) => (d ? { ...d, reference } : d))
                }
              />
            </div>

            {(() => {
              const preview = findMatchedQuote(journalDraft.reference);
              return preview ? (
                <p className="mb-3 rounded-lg bg-accent/10 px-3 py-2 font-serif text-sm italic leading-snug text-foreground animate-in fade-in duration-200">
                  &ldquo;{preview}&rdquo;
                </p>
              ) : null;
            })()}

            <textarea
              autoFocus
              value={journalDraft.text}
              onChange={(e) =>
                setJournalDraft((d) => (d ? { ...d, text: e.target.value } : d))
              }
              placeholder="O que você quer registrar hoje?"
              rows={5}
              className="w-full resize-none rounded-xl border border-border bg-background p-3 text-sm leading-relaxed outline-none transition-colors focus:border-accent"
            />

            <div className="mt-4 flex items-center justify-between gap-2">
              {journalDraft.id ? (
                <button
                  type="button"
                  onClick={removeJournalDraft}
                  aria-label="Remover"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-accent transition-colors hover:bg-accent/10"
                >
                  <Trash2 className="h-4 w-4" strokeWidth={1.9} />
                </button>
              ) : (
                <span />
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setJournalDraft(null)}
                  className="rounded-full px-4 py-2 text-xs font-bold text-muted-foreground transition-colors hover:bg-muted"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={!journalDraft.text.trim()}
                  onClick={saveJournalDraft}
                  className={cn(
                    "rounded-full bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-elevated transition-transform active:scale-[0.98]",
                    !journalDraft.text.trim() && "opacity-40"
                  )}
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
