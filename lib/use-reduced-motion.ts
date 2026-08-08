"use client";

import { useSyncExternalStore } from "react";

/**
 * Does this visitor want motion kept to a minimum?
 *
 * ── WHY THIS EXISTS RATHER THAN motion/react's useReducedMotion ────────────
 * It is a one-line media query, and importing it from `motion/react` pulled the
 * entire animation library into any component that asked. `pipeline-diagram.tsx`
 * was doing exactly that: the whole library, to read one boolean.
 *
 * Keeping this local means `motion` is now imported by the hero carousel alone,
 * which is the only component that actually animates with it — so it loads on
 * the home page instead of on every route in the site.
 *
 * ── WHY useSyncExternalStore ───────────────────────────────────────────────
 * `matchMedia` is an external store the server cannot read, which is the exact
 * case this primitive is built for. It renders the server snapshot through
 * hydration so the markup always matches, then swaps to the real value straight
 * after — no effect, no cascading second render, no "have we mounted" flag.
 * Same pattern as components/admin/use-auth.ts.
 *
 * The server snapshot is `false` (motion allowed), matching what motion/react
 * did: it is the common case, and the first client render corrects it
 * immediately for the minority who set the preference.
 */

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void): () => void {
  const list = window.matchMedia(QUERY);
  // `change` rather than the deprecated addListener — the preference can be
  // toggled at the OS level while the page is open.
  list.addEventListener("change", onChange);
  return () => list.removeEventListener("change", onChange);
}

function getSnapshot(): boolean {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot(): boolean {
  return false;
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
