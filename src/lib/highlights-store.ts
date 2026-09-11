import { useSyncExternalStore } from "react";

export type HighlightColor = "amber" | "olive" | "gold";

export type HighlightEntry = {
  color?: HighlightColor;
  note?: string;
  updatedAt: number;
  /** Human-readable reference, e.g. "Salmos 23:1" — denormalized so Notas can render it without the chapter loaded. */
  reference: string;
  /** Verse text snapshotted at highlight time, for the same reason. */
  quote: string;
};

/** Keyed by `verseKey()` from `bible-api.ts` (e.g. "PSA-23-1") — unique across the whole Bible. */
export type HighlightsMap = Record<string, HighlightEntry>;

const KEY = "raiz:bible:highlights";
const EVENT = "raiz:highlights-changed";
const DEFAULT_MAP: HighlightsMap = {
  "PSA-23-1": {
    color: "amber",
    updatedAt: 0,
    reference: "Salmos 23:1",
    quote: "O Senhor é o meu pastor; nada me faltará.",
  },
};

let cache: HighlightsMap | null = null;

function readFromStorage(): HighlightsMap {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as HighlightsMap) : DEFAULT_MAP;
  } catch {
    return DEFAULT_MAP;
  }
}

/** Current value — safe to call during render (memoized in module state). */
export function getHighlights(): HighlightsMap {
  if (cache === null) {
    cache = typeof window === "undefined" ? {} : readFromStorage();
  }
  return cache;
}

export function setHighlights(map: HighlightsMap) {
  cache = map;
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(map));
  window.dispatchEvent(new Event(EVENT));
}

export function updateHighlights(updater: (prev: HighlightsMap) => HighlightsMap) {
  setHighlights(updater(getHighlights()));
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(EVENT, callback);
  return () => window.removeEventListener(EVENT, callback);
}

const EMPTY_MAP: HighlightsMap = {};

function getServerSnapshot(): HighlightsMap {
  return EMPTY_MAP;
}

/** Reactive read — re-renders whenever any component calls setHighlights/updateHighlights. */
export function useHighlights(): HighlightsMap {
  return useSyncExternalStore(subscribe, getHighlights, getServerSnapshot);
}

export const HIGHLIGHT_STYLES: Record<HighlightColor, { bg: string; dot: string; label: string }> = {
  amber: { bg: "rgba(211,134,92,.28)", dot: "#d3865c", label: "Âmbar" },
  olive: { bg: "rgba(143,168,120,.32)", dot: "#8fa878", label: "Verde" },
  gold: { bg: "rgba(201,168,106,.35)", dot: "#c9a86a", label: "Dourado" },
};
