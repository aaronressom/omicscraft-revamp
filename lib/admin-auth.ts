/**
 * Temporary admin credentials.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * THIS IS NOT SECURITY. READ THIS BEFORE RELYING ON IT.
 * ─────────────────────────────────────────────────────────────────────────────
 * The username and password below are compiled into the JavaScript bundle that
 * every visitor downloads. Anyone can read them in devtools in about ten
 * seconds. The check runs in the browser, so it can also simply be skipped.
 *
 * That is acceptable ONLY because of what it currently gates: a form whose
 * output is saved to the visitor's own browser storage and is visible to
 * nobody else (see lib/news-drafts.ts). There is no server, no database and no
 * publish step behind this gate, so there is nothing here for an attacker to
 * reach that they do not already have.
 *
 * THE MOMENT THIS GATE PROTECTS A REAL WRITE — a database, an API route, an
 * S3 bucket, anything another person can see — this file must be deleted and
 * replaced with real authentication (the plan is AWS Cognito). Do not extend
 * it, do not add a second user to it, and do not move the password to
 * NEXT_PUBLIC_* env vars: those ship to the browser too and would look more
 * secure while being exactly as exposed.
 */

export const ADMIN_USERNAME = "Ressom";
export const ADMIN_PASSWORD = "Georgetown";

/**
 * sessionStorage, not localStorage: the session ends when the browser tab
 * closes. On a shared machine a permanent "logged in" flag is the wrong
 * default, and signing in again costs two fields.
 */
export const ADMIN_SESSION_KEY = "omicscraft:admin-session:v1";
