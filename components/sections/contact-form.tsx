"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { contactSchema, type ContactInput, type ContactResponse } from "@/lib/schemas";
import { SITE } from "@/lib/content";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
  });

  async function onSubmit(values: ContactInput) {
    setStatus("submitting");
    setServerError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data: ContactResponse = await res.json();

      if (data.ok) {
        setStatus("success");
        reset();
      } else {
        setStatus("error");
        setServerError(data.error);
      }
    } catch {
      setStatus("error");
      setServerError(
        `We could not reach the server. Please email ${SITE.email} directly.`,
      );
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="flex flex-col items-start gap-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-8"
      >
        <span className="inline-flex size-11 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-ink">
          <CheckCircle2 className="size-5" aria-hidden />
        </span>
        <div>
          <h3 className="font-display text-lg font-semibold text-navy-900">
            Message sent
          </h3>
          <p className="mt-1.5 text-[0.95rem] leading-relaxed text-slate-600">
            Thanks for reaching out — we&apos;ll get back to you at the address
            you provided.
          </p>
        </div>
        <Button
          variant="outline"
          className="h-11 px-5"
          onClick={() => setStatus("idle")}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <Field
        id="name"
        label="Your name"
        required
        error={errors.name?.message}
      >
        <Input
          id="name"
          autoComplete="name"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          className="h-11"
          {...register("name")}
        />
      </Field>

      <Field
        id="email"
        label="Your email"
        required
        error={errors.email?.message}
      >
        <Input
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          className="h-11"
          {...register("email")}
        />
      </Field>

      <Field id="subject" label="Subject" error={errors.subject?.message}>
        <Input
          id="subject"
          aria-invalid={!!errors.subject}
          aria-describedby={errors.subject ? "subject-error" : undefined}
          className="h-11"
          {...register("subject")}
        />
      </Field>

      <Field
        id="message"
        label="Message"
        required
        error={errors.message?.message}
      >
        <Textarea
          id="message"
          rows={6}
          placeholder="Tell us about your study — sample types, platform, and what you're hoping to find."
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          {...register("message")}
        />
      </Field>

      {/* Honeypot. Hidden from sighted users and from assistive tech, and
          removed from the tab order - only an automated filler will reach it. */}
      <div aria-hidden className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Leave this field empty</label>
        <input
          id="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      {status === "error" && serverError ? (
        <p
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
        >
          <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>
            {serverError}{" "}
            <a
              href={`mailto:${SITE.email}`}
              className="font-semibold underline underline-offset-2"
            >
              {SITE.email}
            </a>
          </span>
        </p>
      ) : null}

      <div className="flex items-center gap-4">
        <Button
          type="submit"
          size="xl"
          disabled={status === "submitting"}
          className="min-w-44"
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="animate-spin" aria-hidden />
              Sending…
            </>
          ) : (
            "Send message"
          )}
        </Button>
        <p className="text-xs text-slate-500">
          We&apos;ll only use your details to reply.
        </p>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  required = false,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className="text-sm font-medium text-navy-900">
        {label}
        {required ? (
          <span className="text-destructive" aria-hidden>
            *
          </span>
        ) : null}
        {required ? <span className="sr-only">(required)</span> : null}
      </Label>
      {children}
      {error ? (
        <p id={`${id}-error`} className={cn("text-sm text-destructive")}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
