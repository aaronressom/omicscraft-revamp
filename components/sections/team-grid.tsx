"use client";

import Image from "next/image";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { HEADINGS, TEAM, type TeamMember } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Team grid.
 *
 * Cards show a truncated bio to keep the grid scannable; the full VERBATIM bio
 * opens in a dialog. No bio is shortened in the data - only visually clamped -
 * so the complete text is always one click away.
 *
 * Avatars render at 176px. The source photos range from 200x200 (Mengistu,
 * Yan) to 3487x3984 (Ressom); rendering larger would visibly soften the small
 * ones, so the box is capped to the smallest usable source.
 */
export function TeamGrid() {
  const [active, setActive] = useState<TeamMember | null>(null);

  return (
    <section className="bg-surface py-24 lg:py-32">
      <Container>
        <SectionHeading
          eyebrow={HEADINGS.team.eyebrow}
          title={HEADINGS.team.title}
        />

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {TEAM.map((member) => (
            <li key={member.name}>
              <button
                type="button"
                onClick={() => setActive(member)}
                aria-haspopup="dialog"
                className={cn(
                  "group flex h-full w-full flex-col rounded-2xl border border-slate-200 bg-white p-5 text-left",
                  "transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-xl hover:shadow-navy-950/8",
                )}
              >
                <span className="relative block overflow-hidden rounded-xl bg-slate-100">
                  <Image
                    src={member.photo}
                    alt={`${member.name}, ${member.role}`}
                    width={176}
                    height={176}
                    className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </span>

                <span className="mt-4 block font-display text-base font-semibold tracking-tight text-navy-900">
                  {member.name}
                  <span className="text-slate-500">, {member.credential}</span>
                </span>
                <span className="mt-0.5 block text-sm font-medium text-cyan-ink">
                  {member.role}
                </span>

                {/* No `block` here: line-clamp needs display:-webkit-box, and a
                    display utility alongside it silently defeats the clamp. */}
                <span className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">
                  {member.bio}
                </span>

                <span className="mt-4 block text-sm font-semibold text-navy-900 group-hover:text-cyan-ink">
                  Read bio
                </span>
              </button>
            </li>
          ))}
        </ul>
      </Container>

      <Dialog
        open={active !== null}
        onOpenChange={(open) => {
          if (!open) setActive(null);
        }}
      >
        <DialogContent className="max-w-lg">
          {active ? (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4">
                  <Image
                    src={active.photo}
                    alt=""
                    width={72}
                    height={72}
                    className="size-18 shrink-0 rounded-xl object-cover"
                  />
                  <div className="min-w-0">
                    <DialogTitle className="font-display text-lg font-semibold tracking-tight">
                      {active.name}, {active.credential}
                    </DialogTitle>
                    <p className="mt-0.5 text-sm font-medium text-cyan-ink">
                      {active.role}
                    </p>
                  </div>
                </div>
              </DialogHeader>

              <DialogDescription className="text-[0.95rem] leading-relaxed text-slate-600">
                {active.bio}
              </DialogDescription>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}
