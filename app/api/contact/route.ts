import { NextResponse } from "next/server";
import { Resend } from "resend";

import { contactSchema, type ContactResponse } from "@/lib/schemas";
import { SITE } from "@/lib/content";

/**
 * Contact form endpoint.
 *
 * Validation runs here regardless of what the client did - the client schema
 * is UX, this one is the actual gate.
 */

const TO_EMAIL = process.env.CONTACT_TO_EMAIL ?? SITE.email;
/** Resend requires a verified sender domain; onboarding@resend.dev works untilthen. */
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev";

/**
 * Per-IP rate limit.
 *
 * In-memory and therefore per-instance: it resets on deploy and is not shared
 * across serverless instances. That is deliberate - it costs nothing and stops
 * casual abuse. If this form ever attracts real spam, move to a durable store
 * (Upstash Redis / Vercel KV) rather than raising these numbers.
 */
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);

  // Opportunistic cleanup so the map cannot grow without bound.
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }
  return recent.length > MAX_PER_WINDOW;
}

function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(req: Request): Promise<NextResponse<ContactResponse>> {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Malformed request." },
      { status: 400 },
    );
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Please check the highlighted fields and try again.",
        fieldErrors: parsed.error.flatten().fieldErrors as Record<
          string,
          string[]
        >,
      },
      { status: 400 },
    );
  }

  // Honeypot tripped: respond exactly as if delivery succeeded, so a bot gets
  // no signal that it was caught. Nothing is sent.
  if (parsed.data.website && parsed.data.website.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  if (isRateLimited(clientIp(req))) {
    return NextResponse.json(
      { ok: false, error: "Too many messages. Please try again later." },
      { status: 429 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Loud in logs, honest to the user - never a silent success.
    console.warn(
      "[contact] RESEND_API_KEY is not set; message was not delivered.",
    );
    return NextResponse.json(
      {
        ok: false,
        error: `Email delivery is not configured yet. Please reach us directly at ${SITE.email}.`,
      },
      { status: 503 },
    );
  }

  const { name, email, subject, message } = parsed.data;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: `OmicsCraft Website <${FROM_EMAIL}>`,
      to: [TO_EMAIL],
      replyTo: email,
      subject: subject?.trim()
        ? `[Website] ${subject}`
        : `[Website] New message from ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        subject ? `Subject: ${subject}` : null,
        "",
        message,
      ]
        .filter((line) => line !== null)
        .join("\n"),
    });

    if (error) {
      // Log the provider detail; do not leak it to the client.
      console.error("[contact] Resend error:", error);
      return NextResponse.json(
        {
          ok: false,
          error: `We could not send your message. Please email ${SITE.email} directly.`,
        },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (cause) {
    console.error("[contact] Unexpected failure:", cause);
    return NextResponse.json(
      {
        ok: false,
        error: `Something went wrong. Please email ${SITE.email} directly.`,
      },
      { status: 500 },
    );
  }
}
