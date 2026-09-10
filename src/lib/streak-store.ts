import { useSyncExternalStore } from "react";

const STREAK_KEY = "raiz:streak";
const LAST_KEY = "raiz:streak:last-date";
const EVENT = "raiz:streak-changed";
const DEFAULT_STREAK = 7;

let cache: number | null = null;

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function readStreak(): number {
  const raw = window.localStorage.getItem(STREAK_KEY);
  return raw ? Number(raw) : DEFAULT_STREAK;
}

export function getStreak(): number {
  if (cache === null) {
    cache = typeof window === "undefined" ? DEFAULT_STREAK : readStreak();
  }
  return cache;
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(EVENT, callback);
  return () => window.removeEventListener(EVENT, callback);
}

function getServerSnapshot() {
  return DEFAULT_STREAK;
}

/** Reactive read — re-renders whenever completeToday() bumps the streak. */
export function useStreak(): number {
  return useSyncExternalStore(subscribe, getStreak, getServerSnapshot);
}

/** Bumps the streak once per calendar day; calling it again today is a no-op. */
export function completeToday(): number {
  if (typeof window === "undefined") return DEFAULT_STREAK;
  const today = todayStr();
  if (window.localStorage.getItem(LAST_KEY) === today) {
    return getStreak();
  }
  const next = getStreak() + 1;
  cache = next;
  window.localStorage.setItem(STREAK_KEY, String(next));
  window.localStorage.setItem(LAST_KEY, today);
  window.dispatchEvent(new Event(EVENT));
  return next;
}
