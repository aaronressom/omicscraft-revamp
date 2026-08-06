"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/layout/container";
import { GlowBackdrop } from "@/components/visuals/glow-backdrop";
import { MolecularBackdrop } from "@/components/visuals/molecular-backdrop";
import { PipelineDiagram } from "@/components/visuals/pipeline-diagram";
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
   One interval for every slide, at the client's direction. Two earlier
   versions derived per-slide durations from the pipeline diagram's run length,
   which is what left the carousel sitting on a slide for 10-11 seconds.

   THE ONE CONSTRAINT: slide 0's pipeline diagram has to reach 05/05 inside
   this window, or the slide changes mid-run. It takes four hand-offs at
   CYCLE_MS (pipeline-diagram.tsx) — 4.8s at the current 1200ms, comfortably
   inside 6s. Raising CYCLE_MS past 1500 breaks that; raise this to match. */
const SLIDE_MS = 6000;

const TOTAL = SLIDES.length + 1;

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  // Which way the slides travel; -1 when stepping backwards. Presentation
  // only — it does not affect where the carousel goes next.
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();
  const regionRef = useRef<HTMLElement>(null);

  /**
   * Step one slide. The ONLY way the index moves.
   *
   * The modulo wraps in both directions — TOTAL is added before it so a
   * negative never reaches `%`, which in JS returns a negative — so slide 1
   * steps back to slide 7 and slide 7 steps forward to slide 1 with no special
   * cases anywhere.
   *
   * The functional update is what keeps this stable across renders: it reads
   * no state, so it never changes identity, so the autoplay effect below is
   * not torn down and rebuilt on every render.
   */
  const step = useCallback((delta: number) => {
    setDirection(delta > 0 ? 1 : -1);
    setIndex((current) => (current + delta + TOTAL) % TOTAL);
  }, []);

  const next = useCallback(() => step(1), [step]);
  const previous = useCallback(() => step(-1), [step]);

  /**
   * Autoplay: one timer, one direction, restarted from scratch on every slide
   * change.
   *
   * `index` in the dependencies is the whole mechanism. Any change to it —
   * autoplay's own, an arrow, a dot, a keypress — tears this effect down and
   * starts a fresh SLIDE_MS timeout, so a manual step always buys a full
   * interval on the slide it lands on. A timeout rather than an interval for
   * the same reason: an interval would keep the original phase and could fire
   * a moment after a click.
   *
   * (It used to stall here instead: clicking an arrow focused the button,
   * `onFocusCapture` latched `paused`, and nothing ever cleared it because
   * focus never left the carousel. Focus now only pauses for keyboard users;
   * see onFocusCapture.)
   */
  useEffect(() => {
    if (paused || reduceMotion) return;
    const timer = window.setTimeout(() => step(1), SLIDE_MS);
    return () => window.clearTimeout(timer);
  }, [index, paused, reduceMotion, step]);

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
      {/* The generous bottom padding dates from when the motto plaque rode up
          into this section and would otherwise have covered the pagination
          dots. The plaque now sits fully in the band below (see
          motto-band.tsx), so this is only breathing room under the controls. */}
      <Container className="relative flex flex-1 flex-col pb-24 pt-36 lg:pb-32 lg:pt-44">
        {/* A GRID STACK, NOT ABSOLUTE POSITIONING. Every slide occupies the
            same cell (col-start-1 row-start-1), so the row is as tall as the
            tallest slide and the section grows to fit it. Absolutely
            positioning the slides instead pinned them to a box that slide one —
            headline, subhead, two CTAs and the pipeline diagram stacked — is
            taller than on a phone, and centring inside it pushed the headline
            up under the header and the diagram down through the controls. */}
        {/* EVERY SLIDE'S FIRST LINE STARTS ON THE SAME BASELINE, and it is
            structural rather than a nudge. `content-center` sizes the single
            row to the tallest slide (slide 0) and centres that row in the
            available height; `items-start` then pins all seven to its top
            edge. Slide 0's own columns are top-aligned too (see below), so its
            h1 sits on that same edge — which is what the photographic slides'
            headlines now line up with. Centring the items instead floated the
            short slides in the middle of slide 0's height, leaving their
            headlines ~100px below it. */}
        <div className="grid flex-1 content-center items-start">
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
            One centred group: [ < ] [ dots ] [ > ]. The arrows sit on either
            side of the dots rather than paired off to one edge, and the
            "01 / 07" counter is gone — the dots already say both where you are
            and how many there are, so the readout was the same information a
            second time.

            Centred even though slide 0's copy is left-aligned: the group
            belongs to the whole carousel, and slides 2-7 are centred title
            cards, so the page's axis is the only mark all seven share. */}
        <div className="relative mt-10 flex items-center justify-center gap-4 sm:gap-6">
          <ArrowButton label="Previous slide" onClick={previous}>
            <ChevronLeft className="size-5" aria-hidden />
          </ArrowButton>

          <ul className="flex items-center gap-2.5">
            {Array.from({ length: TOTAL }, (_, position) => {
              const isCurrent = position === index;
              return (
                <li key={position}>
                  <button
                    type="button"
                    // A dot is a jump: `step` moves by a delta, so the delta to
                    // this dot is what gets passed, and the wrap logic stays in
                    // one place. Zero when it is already the current slide,
                    // which is a no-op that still restarts the timer — the
                    // same thing every other control does.
                    onClick={() => step(position - index)}
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

          <ArrowButton label="Next slide" onClick={next}>
            <ChevronRight className="size-5" aria-hidden />
          </ArrowButton>
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
        "col-start-1 row-start-1 flex flex-col transition-opacity duration-500",
        // Slide 0 stays where the parent grid puts it: top of the row, so its
        // h1 starts at the top of the section's content box. Slides 1-6 are
        // title cards — `self-stretch` gives them slide 0's full height and
        // `justify-center` centres them inside it, which is what puts the
        // headline on the optical centre of the photograph behind it.
        slide ? "self-stretch justify-center" : null,
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
            ? // CINEMATIC TITLE CARD. These six slides are a headline and one
              // line of subhead over a full-bleed photograph — left-aligning
              // them the way slide 0 is left-aligned stranded two short lines
              // against a very wide empty right-hand side, because there is no
              // second column here to fill it. Centred, the photograph is the
              // composition and the type sits on its axis.
              "mx-auto max-w-4xl text-center"
            : // items-start, not items-center: the pipeline column is the
              // taller of the two, so centring dropped the h1 below the top of
              // the row. Top-aligned, the headline starts where the section's
              // content box does.
              "grid items-start gap-14 lg:grid-cols-[minmax(0,1fr)_26rem] lg:gap-16",
        )}
      >
        {slide ? (
          <>
            <h2 className="type-display text-white">{slide.headline}</h2>
            {/* mx-auto: `measure` caps this at 65ch, and without it the capped
                box would sit hard left inside the centred column. */}
            <p className="type-lead measure mx-auto mt-6 text-slate-200">
              {slide.subhead}
            </p>
          </>
        ) : (
          <>
            <div>
              {/* The page's only h1. The other six slides carry h2s: they are
                  peers within the carousel, not competing page titles.

                  TRACKING AND LEADING ARE OVERRIDDEN HERE, not in
                  `.type-display`. At the top of that class's clamp — 68px on a
                  desktop, three lines deep — the shared setting read as
                  cramped, with the lines almost touching. These two utilities
                  open it up for this headline alone; every other display
                  heading on the site keeps the tighter setting, which is
                  correct for the one- and two-line cases they are. `.type-*`
                  live in @layer components, so plain utilities win over them
                  without an `!important`. */}
              <h1 className="type-display measure-tight leading-[1.3] tracking-wide text-white">
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
