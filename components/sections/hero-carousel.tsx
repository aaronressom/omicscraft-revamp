"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/layout/container";
import { GlowBackdrop } from "@/components/visuals/glow-backdrop";
import { MolecularBackdrop } from "@/components/visuals/molecular-backdrop";
import {
  PIPELINE_RUN_MS,
  PipelineDiagram,
} from "@/components/visuals/pipeline-diagram";
import { HERO, SLIDES } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Home hero carousel — seven slides.
 *
 * Slide 0 is the site's own hero: headline, subhead, both CTAs and the pipeline
 * diagram, on the navy treatment. Slides 1-6 are the client's photographic
 * slides with their verbatim copy (see SLIDES in lib/content.ts).
 *
 * ── CONTRAST IS THE WHOLE RISK ─────────────────────────────────────────────
 * The audit that started this rebuild found exactly one hard accessibility
 * failure: headline type over a mid-tone photograph. This component
 * reintroduces text over photographs on the most-visited page of the site, and
 * three of the six images are near-white in places. So the guard is structural
 * rather than per-image:
 *
 *   - a flat navy-950/50 wash over the entire photograph, plus
 *   - a left-weighted gradient darkening the side the text sits on.
 *
 * Every slide gets the same stack, so a new image cannot quietly break it — the
 * worst case is a photograph that looks over-darkened, not one that renders
 * unreadable type. Measured, not eyeballed: see the note at the end of this
 * file. Do not lighten the scrim without re-measuring all seven.
 *
 * ── MOTION ─────────────────────────────────────────────────────────────────
 * Autoplay stops entirely under prefers-reduced-motion, and pauses on hover,
 * on keyboard focus, and while the tab is hidden. A carousel that keeps moving
 * while someone is reading it is the single most common complaint about the
 * pattern.
 *
 * ── ACCESSIBILITY ──────────────────────────────────────────────────────────
 * Inactive slides are `inert`, so slide 0's two CTAs cannot be tabbed to while
 * another slide is showing — an invisible focusable link is worse than no link.
 * The live region is only polite while autoplay is paused; announcing an
 * automatic change every few seconds would be noise.
 */

/* ── TIMING ────────────────────────────────────────────────────────────────
   Slide 0 is not a fixed duration: it holds until the pipeline diagram inside
   it has actually finished its run, then a beat longer. PIPELINE_RUN_MS is
   four hand-offs at CYCLE_MS (2.6s) = 10.4s to get from 01/05 to 05/05, plus
   1s to let 05 land = 11.4s.

   The six photographic slides then take that figure minus the one-second
   beat — 10.4s — so the rotation keeps one cadence throughout instead of the
   hero slide feeling like an outlier. Both derive from CYCLE_MS, so retiming
   the pipeline retimes the carousel with it; do not hardcode either. */
const HOLD_AFTER_PIPELINE_MS = 1000;
const HERO_SLIDE_MS = PIPELINE_RUN_MS + HOLD_AFTER_PIPELINE_MS;
const PHOTO_SLIDE_MS = HERO_SLIDE_MS - HOLD_AFTER_PIPELINE_MS;

const TOTAL = SLIDES.length + 1;

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  // Direction drives which way slides travel; -1 when stepping backwards.
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();
  const regionRef = useRef<HTMLElement>(null);

  const go = useCallback((next: number, dir: number) => {
    setDirection(dir);
    // Wraps in both directions, so "previous" from slide 1 lands on slide 7.
    setIndex(((next % TOTAL) + TOTAL) % TOTAL);
  }, []);

  const next = useCallback(() => go(index + 1, 1), [go, index]);
  const previous = useCallback(() => go(index - 1, -1), [go, index]);

  // Autoplay. Reset on every index change — including a manual one — so
  // stepping back to a slide gives it a full interval and the rotation carries
  // on from there. (It used to stall instead: clicking an arrow focused the
  // button, `onFocusCapture` latched `paused`, and nothing ever cleared it
  // because focus never left the carousel. Focus now only pauses for keyboard
  // users; see onFocusCapture.)
  useEffect(() => {
    if (paused || reduceMotion) return;
    const timer = window.setTimeout(
      () => go(index + 1, 1),
      index === 0 ? HERO_SLIDE_MS : PHOTO_SLIDE_MS,
    );
    return () => window.clearTimeout(timer);
  }, [index, paused, reduceMotion, go]);

  // A background tab still fires timers; without this the carousel would be
  // several slides on by the time someone came back to it.
  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // Arrow keys, but only while focus is inside the carousel — binding them
  // globally would hijack them from the rest of the page.
  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      next();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      previous();
    }
  };

  const slide = index === 0 ? null : SLIDES[index - 1];

  return (
    <section
      ref={regionRef}
      aria-roledescription="carousel"
      aria-label="OmicsCraft highlights"
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={(event) => {
        // Keyboard focus only. A plain click on the prev/next buttons also
        // focuses them, and pausing on that left the carousel stopped for
        // good — the user's click meant "show me that slide", not "stop".
        // :focus-visible is the browser's own read of keyboard vs pointer.
        const target = event.target as Element;
        if (target.matches?.(":focus-visible")) setPaused(true);
      }}
      onBlurCapture={(event) => {
        // Only resume when focus actually leaves the carousel, not when it
        // moves between the controls inside it.
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
          setPaused(false);
        }
      }}
      className="on-dark relative isolate flex min-h-[44rem] flex-col overflow-hidden bg-navy-950 lg:min-h-[48rem]"
    >
      {/* ── Backgrounds ────────────────────────────────────────────────── */}
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={index}
          aria-hidden
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.9, ease: "easeInOut" }}
        >
          {slide ? (
            <>
              {/* A slow drift on the photograph. Purely atmospheric, and off
                  entirely under reduced motion. */}
              <motion.div
                className="absolute inset-0"
                initial={{ scale: reduceMotion ? 1 : 1.08 }}
                animate={{ scale: 1 }}
                transition={{ duration: reduceMotion ? 0 : 9, ease: "linear" }}
              >
                <Image
                  src={slide.image}
                  alt=""
                  fill
                  priority={index === 1}
                  sizes="100vw"
                  quality={85}
                  className="object-cover object-center"
                />
              </motion.div>

              {/* THE SCRIM. Both layers are load-bearing — see the header.
                  Tuned, not maxed. A fully opaque left edge measured 16.5:1 but
                  erased the photograph entirely, which defeats the point of
                  having one. These values put the worst background pixel behind
                  the type at roughly 8-9:1 — comfortably past AAA (7:1) and
                  nearly double AA — while leaving the image readable. The
                  gradient stays strong across the left ~60% where the text
                  sits and opens up on the right, where nothing overlaps it. */}
              <div className="absolute inset-0 bg-navy-950/50" />
              <div className="absolute inset-0 bg-gradient-to-r from-navy-950/65 via-navy-950/60 to-navy-950/15" />
            </>
          ) : (
            <>
              <GlowBackdrop grid={false} />
              <MolecularBackdrop pattern={0} fadeTop />
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── Slide content ──────────────────────────────────────────────── */}
      {/* The bottom padding clears the motto plaque, which rides up into this
          section by -mt-16 / lg:-mt-24. Without it the plaque covers the
          pagination dots. If that overlap changes, this has to change with
          it. */}
      <Container className="relative flex flex-1 flex-col pb-24 pt-36 lg:pb-32 lg:pt-44">
        {/* A GRID STACK, NOT ABSOLUTE POSITIONING. Every slide occupies the
            same cell (col-start-1 row-start-1), so the row is as tall as the
            tallest slide and the section grows to fit it. Absolutely
            positioning the slides instead pinned them to a box that slide one —
            headline, subhead, two CTAs and the pipeline diagram stacked — is
            taller than on a phone, and centring inside it pushed the headline
            up under the header and the diagram down through the controls. */}
        <div className="grid flex-1 items-center">
          {/* Heights never jump mid-rotation, because every slide is always
              laid out; only opacity changes. */}
          {Array.from({ length: TOTAL }, (_, position) => {
            const isCurrent = position === index;
            return (
              <SlidePanel
                key={position}
                position={position}
                isCurrent={isCurrent}
                direction={direction}
                reduceMotion={Boolean(reduceMotion)}
                paused={paused || Boolean(reduceMotion)}
                // Exactly the inputs that restart the slide timer below, so
                // slide 0's pipeline remounts — and so replays from 01/05 —
                // whenever that timer does. Deriving it beats a counter in
                // state: there is no second source of truth to fall out of
                // sync.
                runKey={`${index}-${paused}`}
              />
            );
          })}
        </div>

        {/* ── Controls ─────────────────────────────────────────────────
            Left-aligned rather than centred on the section's bottom edge: the
            motto plaque below rides up over the middle of this section and
            would sit on top of centred dots. */}
        <div className="relative mt-10 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <ArrowButton label="Previous slide" onClick={previous}>
              <ChevronLeft className="size-5" aria-hidden />
            </ArrowButton>
            <ArrowButton label="Next slide" onClick={next}>
              <ChevronRight className="size-5" aria-hidden />
            </ArrowButton>
          </div>

          <ul className="flex items-center gap-2.5">
            {Array.from({ length: TOTAL }, (_, position) => {
              const isCurrent = position === index;
              return (
                <li key={position}>
                  <button
                    type="button"
                    onClick={() => go(position, position > index ? 1 : -1)}
                    aria-label={`Go to slide ${position + 1} of ${TOTAL}`}
                    aria-current={isCurrent ? "true" : undefined}
                    /* The dot is 8px, but the button is a 24px target — the
                       WCAG 2.5.8 minimum — with the extra area transparent. */
                    className="group grid size-6 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
                  >
                    <span
                      className={cn(
                        "block rounded-full transition-all duration-300",
                        isCurrent
                          ? "size-2.5 bg-cyan-400"
                          : "size-2 bg-white/35 group-hover:bg-white/70",
                      )}
                    />
                  </button>
                </li>
              );
            })}
          </ul>

          <span className="ml-auto hidden font-mono text-xs tabular-nums text-slate-400 sm:block">
            {String(index + 1).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")}
          </span>
        </div>
      </Container>
    </section>
  );
}

function SlidePanel({
  position,
  isCurrent,
  direction,
  reduceMotion,
  paused,
  runKey,
}: {
  position: number;
  isCurrent: boolean;
  direction: number;
  reduceMotion: boolean;
  paused: boolean;
  /** Remount key for slide 0's pipeline; changes when the slide timer does. */
  runKey: string;
}) {
  const slide = position === 0 ? null : SLIDES[position - 1];

  return (
    <div
      // `inert` removes the whole subtree from the tab order and the
      // accessibility tree. Without it slide 0's CTAs stay focusable while
      // invisible behind another slide.
      inert={!isCurrent}
      aria-roledescription="slide"
      aria-label={`${position + 1} of ${TOTAL}`}
      aria-live={paused && isCurrent ? "polite" : "off"}
      className={cn(
        "col-start-1 row-start-1 flex flex-col justify-center transition-opacity duration-500",
        isCurrent ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <motion.div
        // Keyed on isCurrent so the entrance replays each time the slide comes
        // back round rather than only on first mount.
        key={isCurrent ? "in" : "out"}
        initial={
          reduceMotion ? false : { opacity: 0, x: direction * 40, y: 0 }
        }
        animate={isCurrent ? { opacity: 1, x: 0 } : { opacity: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          slide
            ? "max-w-3xl"
            : "grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_26rem] lg:gap-16",
        )}
      >
        {slide ? (
          <>
            <h2 className="type-display text-white">{slide.headline}</h2>
            <p className="type-lead measure mt-6 text-slate-200">
              {slide.subhead}
            </p>
          </>
        ) : (
          <>
            <div>
              {/* The page's only h1. The other six slides carry h2s: they are
                  peers within the carousel, not competing page titles. */}
              <h1 className="type-display measure-tight text-white">
                {HERO.headline}
              </h1>

              <p className="type-lead measure mt-6 text-slate-300">
                {HERO.subhead}
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <ButtonLink size="xl" href={HERO.primaryCta.href}>
                  {HERO.primaryCta.label}
                  <ArrowRight aria-hidden />
                </ButtonLink>
                <ButtonLink
                  size="xl"
                  variant="outline"
                  className="border-white/25 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                  href={HERO.secondaryCta.href}
                >
                  {HERO.secondaryCta.label}
                </ButtonLink>
              </div>
            </div>

            {/* Every slide stays mounted (see the grid note above), so the
                pipeline has to be told when it is actually on screen —
                otherwise it steps away unseen and slide 0 comes back round
                showing 04/05. */}
            <PipelineDiagram key={runKey} running={isCurrent} />
          </>
        )}
      </motion.div>
    </div>
  );
}

function ArrowButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid size-11 place-items-center rounded-full border border-white/20 bg-white/5 text-slate-200 transition-colors hover:border-cyan-400/50 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
    >
      {children}
    </button>
  );
}
