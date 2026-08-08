"use client";

import { useCallback, useSyncExternalStore } from "react";

import {
  ADMIN_PASSWORD,
  ADMIN_SESSION_KEY,
  ADMIN_USERNAME,
} from "@/lib/admin-auth";

/**
 * Who is signed in.
 *
 * A placeholder for AWS Cognito — see the warning in lib/admin-auth.ts. The
 * shape is roughly the shape a real client would have (`user`, `signIn`,
 * `signOut`), so swapping the implementation touches this file and not the
 * two components that consume it.
 *
 * ── WHY useSyncExternalStore AND NOT useState + useEffect ──────────────────
 * The session lives in sessionStorage, which is an external store the server
 * cannot see. Reading it into state inside an effect works, but it is the
 * pattern React now warns about: it renders once with the wrong answer, then
 * synchronously sets state and renders again.
 *
 * useSyncExternalStore is the primitive built for exactly this. It renders
 * `getServerSnapshot()` on the server AND through hydration — so the markup
 * always matches — then re-renders with the real value the moment hydration is
 * done. No effect, no cascading render, and no "have we mounted yet" flag for
 * consumers to remember to check.
 *
 * It also makes every consumer agree without a provider: they all subscribe to
 * the same store, so the header icon and the News page cannot disagree about
 * whether someone is signed in.
 */

const AUTH_EVENT = "omicscraft:auth-change";

function subscribe(onChange: () => void): () => void {
  // The custom event covers this tab. `storage` only fires for localStorage
  // and only in OTHER tabs, so it does nothing for a sessionStorage session —
  // it is listened for anyway so that a future move to a shared store needs no
  // change here.
  window.addEventListener(AUTH_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(AUTH_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** Returns a string or null — a primitive, so it is stable across reads. */
function getSnapshot(): string | null {
  try {
    return window.sessionStorage.getItem(ADMIN_SESSION_KEY);
  } catch {
    // Storage throws in some private modes. Signed out is the right failure.
    return null;
  }
}

function getServerSnapshot(): string | null {
  return null;
}

export function useAuth() {
  const user = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const signIn = useCallback((username: string, password: string) => {
    // Trimmed, because a trailing space pasted from a password manager is not
    // a wrong password as far as the person typing is concerned. The
    // comparison is case-sensitive on both fields.
    const name = username.trim();
    if (name !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      // One message for both fields: saying which half was wrong tells an
      // attacker which half to keep.
      return "That username and password did not match.";
    }
    try {
      window.sessionStorage.setItem(ADMIN_SESSION_KEY, name);
    } catch {
      // Signing in still works for this tab; it just will not survive a
      // reload. Better than refusing to sign in at all.
    }
    window.dispatchEvent(new Event(AUTH_EVENT));
    return null;
  }, []);

  const signOut = useCallback(() => {
    try {
      window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
    } catch {
      /* Nothing to clean up if storage is unavailable. */
    }
    window.dispatchEvent(new Event(AUTH_EVENT));
  }, []);

  return { user, signIn, signOut };
}
