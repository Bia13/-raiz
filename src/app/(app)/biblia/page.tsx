"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  List,
  Search,
  Pencil,
  X,
  Ban,
  Loader2,
  RefreshCw,
  Sparkles,
  Bookmark as BookmarkIcon,
} from "lucide-react";
import { Mascot } from "@/components/mascot";
import { ColorSelector } from "@/components/color-selector";
import { CopyButton } from "@/components/copy-button";
import { CURRENT_CHAPTER, VERSES } from "@/lib/reading-data";
import {
  type BibleChapter,
  type ChapterLocation,
  fetchChapter,
  formatReference,
  nextChapterLocation,
  verseKey,
} from "@/lib/bible-api";
import {
  HIGHLIGHT_STYLES,
  updateHighlights,
  useHighlights,
  type HighlightColor,
} from "@/lib/highlights-store";
import { setBookmark, useBookmark, type BookmarkEntry } from "@/lib/bookmark-store";
import { cn } from "@/lib/utils";

type VerseId = { bookId: string; chapter: number; verse: number };

function sameVerse(a: VerseId | null, b: VerseId): boolean {
  return !!a && a.bookId === b.bookId && a.chapter === b.chapter && a.verse === b.verse;
}

function verseElementId(id: VerseId): string {
  return `v-${verseKey(id, id.verse)}`;
}

/** The very first chapter is preloaded locally (no fetch, no flash of loading state). */
const INITIAL_LOCATION: ChapterLocation = { bookId: "PSA", chapter: 23 };
const INITIAL_CHAPTER: BibleChapter = {
  bookId: INITIAL_LOCATION.bookId,
  bookName: CURRENT_CHAPTER.book,
  chapter: CURRENT_CHAPTER.chapter,
  verses: VERSES,
};

type LoadStatus = "idle" | "loading" | "error" | "done";

export default function BibliaPage() {
  const entries = useHighlights();
  const bookmark = useBookmark();

  const [chapters, setChapters] = useState<BibleChapter[]>([INITIAL_CHAPTER]);
  const [status, setStatus] = useState<LoadStatus>("idle");
  const [jumping, setJumping] = useState(false);

  const [activeVerse, setActiveVerse] = useState<VerseId | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [noteVerse, setNoteVerse] = useState<VerseId | null>(null);

  const chaptersRef = useRef<BibleChapter[]>([INITIAL_CHAPTER]);
  const nextLocRef = useRef<ChapterLocation | null>(nextChapterLocation(INITIAL_LOCATION));
  const loadingRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  /** Fetches and appends exactly one chapter. Returns whether it succeeded. */
  const stepLoad = useCallback(async (): Promise<boolean> => {
    if (loadingRef.current) return false;
    const loc = nextLocRef.current;
    if (!loc) {
      setStatus("done");
      return false;
    }
    loadingRef.current = true;
    setStatus("loading");
    try {
      const chapter = await fetchChapter(loc);
      chaptersRef.current = [...chaptersRef.current, chapter];
      setChapters(chaptersRef.current);
      nextLocRef.current = nextChapterLocation(loc);
      setStatus(nextLocRef.current ? "idle" : "done");
      return true;
    } catch {
      setStatus("error");
      return false;
    } finally {
      loadingRef.current = false;
    }
  }, []);

  const loadMore = useCallback(() => {
    stepLoad();
  }, [stepLoad]);

  // Lazy-load the next chapter a little before the reader actually hits the
  // bottom, so the new text is already there by the time they scroll to it.
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || status === "done") return;
    const observer = new IntersectionObserver(
      (observed) => {
        if (observed[0].isIntersecting && status !== "error") loadMore();
      },
      { rootMargin: "800px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore, status]);

  /**
   * The bookmark can point at a chapter further ahead than what's currently
   * loaded (e.g. right after a page reload). Fetch forward, chapter by
   * chapter, until it's on the page, then scroll to it.
   */
  async function goToBookmark(bm: BookmarkEntry) {
    setJumping(true);
    try {
      while (
        !chaptersRef.current.some((c) => c.bookId === bm.bookId && c.chapter === bm.chapter)
      ) {
        const loaded = await stepLoad();
        if (!loaded) break;
      }
      requestAnimationFrame(() => {
        document
          .getElementById(verseElementId({ bookId: bm.bookId, chapter: bm.chapter, verse: bm.verse }))
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    } finally {
      setJumping(false);
    }
  }

  function findVerseText(id: VerseId): string {
    const chapter = chapters.find((c) => c.bookId === id.bookId && c.chapter === id.chapter);
    return chapter?.verses.find((v) => v.number === id.verse)?.text ?? "";
  }

  function updateEntry(id: VerseId, patch: Partial<{ color?: HighlightColor; note?: string }>) {
    const key = verseKey(id, id.verse);
    const chapter = chapters.find((c) => c.bookId === id.bookId && c.chapter === id.chapter);
    const reference = formatReference(chapter?.bookName ?? id.bookId, id.chapter, id.verse);
    const quote = findVerseText(id);
    updateHighlights((prev) => {
      const current = prev[key];
      const next = { ...current, ...patch, updatedAt: Date.now(), reference, quote };
      const isEmpty = !next.color && !next.note?.trim();
      const copy = { ...prev };
      if (isEmpty) {
        delete copy[key];
      } else {
        copy[key] = next;
      }
      return copy;
    });
  }

  function toggleVerse(id: VerseId) {
    setActiveVerse((prev) => (sameVerse(prev, id) ? null : id));
  }

  function setHighlightColor(color: HighlightColor) {
    if (!activeVerse) return;
    updateEntry(activeVerse, { color });
  }

  function clearHighlightColor() {
    if (!activeVerse) return;
    updateEntry(activeVerse, { color: undefined });
  }

  function isBookmark(id: VerseId): boolean {
    return !!bookmark && bookmark.bookId === id.bookId && bookmark.chapter === id.chapter && bookmark.verse === id.verse;
  }

  function toggleBookmark(id: VerseId) {
    if (isBookmark(id)) {
      setBookmark(null);
      return;
    }
    const chapter = chapters.find((c) => c.bookId === id.bookId && c.chapter === id.chapter);
    setBookmark({
      bookId: id.bookId,
      chapter: id.chapter,
      verse: id.verse,
      reference: formatReference(chapter?.bookName ?? id.bookId, id.chapter, id.verse),
      quote: findVerseText(id),
      updatedAt: Date.now(),
    });
  }

  const colorByHex = Object.fromEntries(
    (Object.keys(HIGHLIGHT_STYLES) as HighlightColor[]).map((c) => [HIGHLIGHT_STYLES[c].dot, c])
  ) as Record<string, HighlightColor>;
  const colorHexes = (Object.keys(HIGHLIGHT_STYLES) as HighlightColor[]).map(
    (c) => HIGHLIGHT_STYLES[c].dot
  );

  function openNote() {
    if (!activeVerse) return;
    setNoteVerse(activeVerse);
    setNoteDraft(entries[verseKey(activeVerse, activeVerse.verse)]?.note ?? "");
  }

  function saveNote() {
    if (!noteVerse) return;
    updateEntry(noteVerse, { note: noteDraft.trim() || undefined });
    setNoteVerse(null);
    setActiveVerse(null);
  }

  const activeEntry = activeVerse ? entries[verseKey(activeVerse, activeVerse.verse)] : undefined;
  const activeChapter = activeVerse
    ? chapters.find((c) => c.bookId === activeVerse.bookId && c.chapter === activeVerse.chapter)
    : undefined;

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
        <span className="text-sm font-bold">Bíblia</span>
        <div className="flex items-center gap-4 text-foreground/70">
          {bookmark && (
            <button
              type="button"
              onClick={() => goToBookmark(bookmark)}
              disabled={jumping}
              aria-label={`Ir para o marcador em ${bookmark.reference}`}
              className="text-accent transition-transform active:scale-90 disabled:opacity-50"
            >
              {jumping ? (
                <Loader2 className="h-[18px] w-[18px] animate-spin" strokeWidth={1.8} />
              ) : (
                <BookmarkIcon className="h-[18px] w-[18px]" strokeWidth={1.8} fill="currentColor" fillOpacity={0.18} />
              )}
            </button>
          )}
          <List className="h-[18px] w-[18px]" strokeWidth={1.8} />
          <Search className="h-[18px] w-[18px]" strokeWidth={1.8} />
        </div>
      </div>

      {/* Contextual action bar for the tapped verse */}
      <div
        className={cn(
          "sticky top-0 z-20 mt-1 overflow-hidden rounded-2xl bg-[#241c14] text-[#f6f0e2] shadow-elevated-lg transition-all duration-200",
          activeVerse !== null ? "max-h-16 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="flex items-center gap-1 px-3 py-2.5">
          <span className="mr-1 text-[11px] font-bold text-[#f6f0e2]/70">
            {activeVerse ? formatReference(activeChapter?.bookName ?? activeVerse.bookId, activeVerse.chapter, activeVerse.verse) : ""}
          </span>
          <div className="ml-auto flex items-center gap-2">
            {activeVerse && (
              <ColorSelector
                key={verseKey(activeVerse, activeVerse.verse)}
                colors={colorHexes}
                defaultValue={
                  (activeEntry?.color && HIGHLIGHT_STYLES[activeEntry.color].dot) || colorHexes[0]
                }
                size="sm"
                onColorSelect={(hex) => {
                  const color = colorByHex[hex];
                  if (color) setHighlightColor(color);
                }}
              />
            )}
            <button
              type="button"
              onClick={clearHighlightColor}
              aria-label="Remover grifo"
              className="flex h-7 w-7 items-center justify-center rounded-full text-[#f6f0e2] hover:bg-white/10"
            >
              <Ban className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
            <span className="mx-0.5 h-5 w-px bg-white/15" />
            <button
              type="button"
              onClick={() => activeVerse && toggleBookmark(activeVerse)}
              aria-label={activeVerse && isBookmark(activeVerse) ? "Remover marcador" : "Marcar esta página"}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full hover:bg-white/10",
                activeVerse && isBookmark(activeVerse) ? "text-[#d3865c]" : "text-[#f6f0e2]"
              )}
            >
              <BookmarkIcon
                className="h-3.5 w-3.5"
                strokeWidth={2}
                fill={activeVerse && isBookmark(activeVerse) ? "currentColor" : "none"}
              />
            </button>
            <span className="mx-0.5 h-5 w-px bg-white/15" />
            <button
              type="button"
              onClick={openNote}
              aria-label="Adicionar nota"
              className="flex h-7 w-7 items-center justify-center rounded-full text-[#f6f0e2] hover:bg-white/10"
            >
              <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
            <CopyButton
              value={activeVerse ? findVerseText(activeVerse) : ""}
              size="sm"
              className="text-[#f6f0e2] hover:bg-white/10"
            />
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

      <div className="mt-2">
        {chapters.map((chapter, i) => (
          <section key={`${chapter.bookId}-${chapter.chapter}`} className={i > 0 ? "mt-8" : undefined}>
            <div className="sticky top-0 z-10 -mx-5 border-b border-border/70 bg-background/92 px-5 py-2 backdrop-blur-md">
              <span className="text-xs font-bold tracking-wide text-foreground/80">
                {chapter.bookName} {chapter.chapter}
              </span>
            </div>

            {i === 0 && (
              <div className="mt-4 mb-1">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-accent">
                  {CURRENT_CHAPTER.subheading}
                </p>
                <h1 className="mb-3 text-xl font-medium text-balance">
                  {CURRENT_CHAPTER.heading}
                </h1>
              </div>
            )}

            <p className={cn("font-serif text-[15px] leading-[1.9]", i === 0 ? "" : "mt-4")}>
              {chapter.verses.map((v) => {
                const id: VerseId = { bookId: chapter.bookId, chapter: chapter.chapter, verse: v.number };
                const entry = entries[verseKey(id, v.number)];
                const hasNote = Boolean(entry?.note?.trim());
                const isActive = sameVerse(activeVerse, id);
                const bookmarked = isBookmark(id);
                return (
                  <span key={v.number} id={verseElementId(id)} className="relative scroll-mt-24">
                    {bookmarked && (
                      <BookmarkIcon
                        aria-hidden
                        className="mr-0.5 -mt-0.5 inline-block h-3 w-3 text-accent align-middle"
                        strokeWidth={2}
                        fill="currentColor"
                      />
                    )}
                    <sup className="mr-0.5 font-sans text-[9px] font-bold text-accent">
                      {v.number}
                    </sup>
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={() => toggleVerse(id)}
                      onKeyDown={(e) => e.key === "Enter" && toggleVerse(id)}
                      className={cn(
                        "cursor-pointer rounded transition-colors",
                        isActive && "ring-2 ring-accent/50"
                      )}
                      style={{
                        backgroundColor: entry?.color ? HIGHLIGHT_STYLES[entry.color].bg : undefined,
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
          </section>
        ))}

        <div ref={sentinelRef} aria-hidden className="h-px" />

        <div className="flex flex-col items-center gap-2 py-8 text-center">
          {status === "loading" && (
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2.2} />
              Carregando próximo capítulo…
            </div>
          )}
          {status === "error" && (
            <button
              type="button"
              onClick={loadMore}
              className="flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-xs font-bold shadow-elevated transition-colors hover:bg-muted"
            >
              <RefreshCw className="h-3.5 w-3.5" strokeWidth={2.2} />
              Não deu pra carregar — tentar de novo
            </button>
          )}
          {status === "done" && (
            <div className="flex flex-col items-center gap-2 py-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/15 to-primary/10 text-accent shadow-elevated">
                <Sparkles className="h-5 w-5" strokeWidth={1.7} />
              </div>
              <p className="text-xs font-semibold text-muted-foreground">
                Você chegou ao fim — Apocalipse 22.
              </p>
            </div>
          )}
        </div>
      </div>

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
              Sua nota ·{" "}
              {formatReference(
                chapters.find((c) => c.bookId === noteVerse.bookId && c.chapter === noteVerse.chapter)
                  ?.bookName ?? noteVerse.bookId,
                noteVerse.chapter,
                noteVerse.verse
              )}
            </p>
            <p className="mb-4 border-l-2 border-accent pl-3 font-serif text-sm italic leading-relaxed text-muted-foreground">
              &ldquo;{findVerseText(noteVerse)}&rdquo;
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
