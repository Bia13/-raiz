import { BIBLE_BOOKS, type BibleBook } from "@/lib/bible-books";

export type BibleVerse = {
  number: number;
  text: string;
};

export type BibleChapter = {
  bookId: string;
  bookName: string;
  chapter: number;
  verses: BibleVerse[];
};

/** Position of a chapter within the whole Bible. */
export type ChapterLocation = {
  bookId: string;
  chapter: number;
};

const TRANSLATION = "almeida";

function bookIndexOf(bookId: string): number {
  return BIBLE_BOOKS.findIndex((b) => b.id === bookId);
}

export function getBook(bookId: string): BibleBook | undefined {
  return BIBLE_BOOKS.find((b) => b.id === bookId);
}

/** The chapter right after `loc`, or `null` once Apocalipse 22 is reached. */
export function nextChapterLocation(loc: ChapterLocation): ChapterLocation | null {
  const idx = bookIndexOf(loc.bookId);
  if (idx === -1) return null;
  const book = BIBLE_BOOKS[idx];
  if (loc.chapter < book.chapters) {
    return { bookId: book.id, chapter: loc.chapter + 1 };
  }
  const nextBook = BIBLE_BOOKS[idx + 1];
  if (!nextBook) return null;
  return { bookId: nextBook.id, chapter: 1 };
}

/** Stable string key for a chapter — safe to use in React `key` props or maps. */
export function chapterKey(loc: ChapterLocation): string {
  return `${loc.bookId}-${loc.chapter}`;
}

/** Stable string key for one verse — unique across the whole Bible. */
export function verseKey(loc: ChapterLocation, verse: number): string {
  return `${loc.bookId}-${loc.chapter}-${verse}`;
}

/** Human-readable reference, e.g. "Salmos 23:1". */
export function formatReference(bookName: string, chapter: number, verse?: number): string {
  return verse === undefined
    ? `${bookName} ${chapter}`
    : `${bookName} ${chapter}:${verse}`;
}

const chapterCache = new Map<string, BibleChapter>();

/**
 * Fetches one chapter's verses from bible-api.com (João Ferreira de Almeida —
 * public domain Portuguese translation). Results are cached in memory so
 * re-entering a chapter (or a stray double IntersectionObserver fire) never
 * re-fetches it.
 */
export async function fetchChapter(loc: ChapterLocation): Promise<BibleChapter> {
  const key = chapterKey(loc);
  const cached = chapterCache.get(key);
  if (cached) return cached;

  const res = await fetch(
    `https://bible-api.com/data/${TRANSLATION}/${loc.bookId}/${loc.chapter}`
  );
  if (!res.ok) {
    throw new Error(`Falha ao carregar ${loc.bookId} ${loc.chapter} (${res.status})`);
  }
  const data = (await res.json()) as {
    verses: { book: string; chapter: number; verse: number; text: string }[];
  };
  if (!data.verses?.length) {
    throw new Error(`Capítulo vazio: ${loc.bookId} ${loc.chapter}`);
  }
  const chapter: BibleChapter = {
    bookId: loc.bookId,
    bookName: data.verses[0].book,
    chapter: loc.chapter,
    verses: data.verses.map((v) => ({ number: v.verse, text: v.text.trim() })),
  };
  chapterCache.set(key, chapter);
  return chapter;
}
