import { useSyncExternalStore } from "react";

/**
 * A single "physical" bookmark — like a real bookmark, there's only one at a
 * time. Setting it on a new verse moves it; it doesn't stack up like
 * highlights do.
 */
export type BookmarkEntry = {
  bookId: string;
  chapter: number;
  verse: number;
  /** Human-readable reference, e.g. "Salmos 24:3". */
  reference: string;
  /** Verse text snapshotted when the bookmark was placed. */
  quote: string;
  updatedAt: number;
};

const KEY = "raiz:bible:bookmark";
const EVENT = "raiz:bookmark-changed";

let cache: BookmarkEntry | null | undefined;

function readFromStorage(): BookmarkEntry | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as BookmarkEntry) : null;
  } catch {
    return null;
  }
}

/** Current value — safe to call during render (memoized in module state). */
export function getBookmark(): BookmarkEntry | null {
  if (cache === undefined) {
    cache = typeof window === "undefined" ? null : readFromStorage();
  }
  return cache;
}

export function setBookmark(entry: BookmarkEntry | null) {
  cache = entry;
  if (typeof window === "undefined") return;
  if (entry) {
    window.localStorage.setItem(KEY, JSON.stringify(entry));
  } else {
    window.localStorage.removeItem(KEY);
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(EVENT, callback);
  return () => window.removeEventListener(EVENT, callback);
}

function getServerSnapshot(): BookmarkEntry | null {
  return null;
}

/** Reactive read — re-renders whenever any component calls setBookmark. */
export function useBookmark(): BookmarkEntry | null {
  return useSyncExternalStore(subscribe, getBookmark, getServerSnapshot);
}
