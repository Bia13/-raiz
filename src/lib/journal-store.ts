import { useSyncExternalStore } from "react";

export type JournalEntry = {
  id: string;
  text: string;
  /** Free text — a verse reference, a theme, or nothing at all. */
  reference?: string;
  createdAt: number;
  updatedAt: number;
};

export type JournalMap = Record<string, JournalEntry>;

const KEY = "raiz:journal";
const EVENT = "raiz:journal-changed";
const EMPTY_MAP: JournalMap = {};

let cache: JournalMap | null = null;

function readFromStorage(): JournalMap {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as JournalMap) : {};
  } catch {
    return {};
  }
}

export function getJournal(): JournalMap {
  if (cache === null) {
    cache = typeof window === "undefined" ? {} : readFromStorage();
  }
  return cache;
}

export function setJournal(map: JournalMap) {
  cache = map;
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(map));
  window.dispatchEvent(new Event(EVENT));
}

export function updateJournal(updater: (prev: JournalMap) => JournalMap) {
  setJournal(updater(getJournal()));
}

export function addJournalEntry(text: string, reference?: string) {
  const id = crypto.randomUUID();
  const now = Date.now();
  updateJournal((prev) => ({
    ...prev,
    [id]: { id, text, reference: reference || undefined, createdAt: now, updatedAt: now },
  }));
  return id;
}

export function removeJournalEntry(id: string) {
  updateJournal((prev) => {
    const next = { ...prev };
    delete next[id];
    return next;
  });
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(EVENT, callback);
  return () => window.removeEventListener(EVENT, callback);
}

function getServerSnapshot(): JournalMap {
  return EMPTY_MAP;
}

/** Reactive read — re-renders whenever any component writes to the journal. */
export function useJournal(): JournalMap {
  return useSyncExternalStore(subscribe, getJournal, getServerSnapshot);
}
