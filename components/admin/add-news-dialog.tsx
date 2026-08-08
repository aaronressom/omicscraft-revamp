"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DRAFT_CATEGORIES,
  newDraftId,
  newsDraftSchema,
  type NewsDraft,
  type NewsDraftInput,
} from "@/lib/news-drafts";
import { cn } from "@/lib/utils";

/**
 * The "+" tile on the News page, and the form behind it.
 *
 * Rendered only for signed-in users (the caller decides), and sized to match a
 * news card exactly so the grid does not reflow when it appears.
 *
 * WHAT THIS DOES NOT DO: publish. The saved announcement lives in this
 * browser's storage — see the header of lib/news-drafts.ts. The dialog says so
 * in plain words rather than in a footnote, because the person using it is the
 * one who most needs to know.
 */
export function AddNewsCard({ onCreate }: { onCreate: (draft: NewsDraft) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <button
            type="button"
            className="group flex h-full min-h-64 w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-cyan-ink/30 bg-white/50 p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-cyan-ink/60 hover:bg-white"
          />
        }
      >
        <span className="grid size-14 place-items-center rounded-full bg-cyan-500/12 text-cyan-ink ring-1 ring-cyan-500/25 transition-colors group-hover:bg-cyan-500/20">
          <Plus className="size-7" aria-hidden />
        </span>
        <span className="font-display text-base font-semibold text-navy-900">
          Add an announcement
        </span>
        <span className="text-[0.875rem] leading-relaxed text-slate-600">
          Publications, presentations and platform releases
        </span>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] gap-0 overflow-y-auto p-0 sm:max-w-2xl">
        <NewsForm
          onSubmitted={(draft) => {
            onCreate(draft);
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

function NewsForm({ onSubmitted }: { onSubmitted: (draft: NewsDraft) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewsDraftInput>({
    resolver: zodResolver(newsDraftSchema),
    mode: "onBlur",
    defaultValues: {
      category: "Publication",
      title: "",
      summary: "",
      // Today, in the visitor's own timezone. `toISOString()` would be UTC and
      // can land on yesterday for anyone west of Greenwich — which is where
      // this is being used.
      date: localToday(),
      linkHref: "",
      linkText: "",
    },
  });

  return (
    <form
      noValidate
      onSubmit={handleSubmit((values) =>
        onSubmitted({
          ...values,
          id: newDraftId(),
          createdAt: new Date().toISOString(),
        }),
      )}
    >
      <DialogHeader className="border-b border-slate-200 p-6">
        <DialogTitle className="font-display text-lg font-semibold text-navy-900">
          New announcement
        </DialogTitle>
        <DialogDescription className="text-slate-600">
          This becomes a card on the News page.
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col gap-5 p-6">
        {/* Said once, up front, in the words that matter. The badge on the
            finished card repeats it — see news-board.tsx. */}
        <p className="flex items-start gap-2.5 rounded-xl border border-amber-500/35 bg-amber-50 p-3.5 text-[0.85rem] leading-relaxed text-amber-900">
          <Info className="mt-0.5 size-4 shrink-0 text-amber-600" aria-hidden />
          <span>
            <strong className="font-semibold">Saved on this computer only.</strong>{" "}
            You will see this card on the News page, but visitors and colleagues
            will not. Send it to the web team to publish it for everyone.
          </span>
        </p>

        <Field id="news-category" label="Category" required error={errors.category?.message}>
          {/* A native select, deliberately: it is the control every phone and
              screen reader already knows, and this form is for people who do
              not use the site's own conventions daily. */}
          <select
            id="news-category"
            aria-invalid={!!errors.category}
            aria-describedby={errors.category ? "news-category-error" : undefined}
            className="h-11 w-full rounded-lg border border-input bg-white px-2.5 text-base text-navy-900 outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
            {...register("category")}
          >
            {DRAFT_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </Field>

        <Field id="news-title" label="Subject line" required error={errors.title?.message}>
          <Input
            id="news-title"
            className="h-11"
            placeholder="aiSysMet published in Bioinformatics"
            aria-invalid={!!errors.title}
            aria-describedby={errors.title ? "news-title-error" : undefined}
            {...register("title")}
          />
        </Field>

        <Field id="news-summary" label="Subtext" required error={errors.summary?.message}>
          <Textarea
            id="news-summary"
            rows={4}
            placeholder="One or two sentences describing the announcement."
            aria-invalid={!!errors.summary}
            aria-describedby={errors.summary ? "news-summary-error" : undefined}
            {...register("summary")}
          />
        </Field>

        <Field id="news-date" label="Date" required error={errors.date?.message}>
          <Input
            id="news-date"
            type="date"
            className="h-11"
            aria-invalid={!!errors.date}
            aria-describedby={errors.date ? "news-date-error" : undefined}
            {...register("date")}
          />
        </Field>

        <Field
          id="news-link"
          label="Link address"
          required
          hint="The page this card opens — paste the full address, starting with https://"
          error={errors.linkHref?.message}
        >
          <Input
            id="news-link"
            type="url"
            inputMode="url"
            className="h-11"
            placeholder="https://academic.oup.com/…"
            aria-invalid={!!errors.linkHref}
            aria-describedby={errors.linkHref ? "news-link-error" : "news-link-hint"}
            {...register("linkHref")}
          />
        </Field>

        <Field
          id="news-link-text"
          label="Link text"
          required
          hint="What the link says, e.g. “Read the paper”"
          error={errors.linkText?.message}
        >
          <Input
            id="news-link-text"
            className="h-11"
            placeholder="Read the paper"
            aria-invalid={!!errors.linkText}
            aria-describedby={
              errors.linkText ? "news-link-text-error" : "news-link-text-hint"
            }
            {...register("linkText")}
          />
        </Field>
      </div>

      <div className="flex justify-end gap-3 border-t border-slate-200 bg-surface-tint p-6">
        <Button type="submit" size="xl">
          Add announcement
        </Button>
      </div>
    </form>
  );
}

/** Today as YYYY-MM-DD in local time, which is what `<input type="date">` wants. */
function localToday(): string {
  const now = new Date();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  const day = `${now.getDate()}`.padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function Field({
  id,
  label,
  required = false,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
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
      {hint ? (
        <p id={`${id}-hint`} className="text-[0.8rem] text-slate-500">
          {hint}
        </p>
      ) : null}
      {children}
      {error ? (
        <p id={`${id}-error`} className={cn("text-sm text-destructive")}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
