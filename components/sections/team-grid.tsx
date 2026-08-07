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
import { MolecularBackdrop } from "@/components/visuals/molecular-backdrop";
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
    /* Short top padding: the About blocks sit on the same tint directly above
       and already carry their own bottom padding, so a full py-24 here left a
       dead band between the two. */
    <section className="relative isolate overflow-hidden bg-surface-tint pb-24 pt-14 lg:pb-32 lg:pt-16">
      <MolecularBackdrop variant="light" subtle pattern={6} />

      <Container className="relative">
        {/* Titleless since the client dropped "Bioinformaticians, engineers,
            and data scientists" — it repeated the Who We Are block a screen
            above. `emphasizeEyebrow` gives "Team" the presence the title used
            to carry, so the section still announces itself above seven cards
            rather than opening on a small caps label. */}
        <SectionHeading
          eyebrow={HEADINGS.team.eyebrow}
          title={HEADINGS.team.title}
          emphasizeEyebrow
        />

        {/* Flex-wrap with explicit widths rather than a CSS grid.
            The team is seven people in a four-column grid, so the last row runs
            3 + an empty cell — which reads as a vacancy, as though someone had
            left. Grid cannot centre a short final row; flex-wrap +
            justify-center can. The widths reproduce the grid exactly:
            calc(100%/n - gap*(n-1)/n) with gap-5 = 1.25rem. */}
        <ul className="mt-14 flex flex-wrap justify-center gap-5">
          {TEAM.map((member) => (
            <li
              key={member.name}
              className="w-full sm:w-[calc(50%-0.625rem)] lg:w-[calc(33.3333%-0.8334rem)] xl:w-[calc(25%-0.9375rem)]"
            >
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
        {/* `sm:max-w-2xl`, not `max-w-2xl`: DialogContent ships `sm:max-w-sm`,
            and tailwind-merge treats a responsive variant as a different group
            from the base utility — so a base `max-w-*` here loses above 640px.
            Match the variant to actually override it.
            max-h + overflow: the longest bio must not push the close button
            off-screen on a short laptop viewport. */}
        <DialogContent className="max-h-[85vh] w-[calc(100vw-2rem)] overflow-y-auto p-7 sm:max-w-2xl sm:p-9">
          {active ? (
            <>
              <DialogHeader>
                <div className="flex items-center gap-5">
                  <Image
                    src={active.photo}
                    alt=""
                    width={112}
                    height={112}
                    className="size-24 shrink-0 rounded-2xl object-cover"
                  />
                  <div className="min-w-0">
                    <DialogTitle className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
                      {active.name}, {active.credential}
                    </DialogTitle>
                    <p className="mt-1 text-[0.95rem] font-medium text-cyan-ink">
                      {active.role}
                    </p>
                  </div>
                </div>
              </DialogHeader>

              <DialogDescription className="mt-2 text-base leading-[1.75] text-slate-600">
                {active.bio}
              </DialogDescription>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}
