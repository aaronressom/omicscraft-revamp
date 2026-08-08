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
 * Autoplay stops entirely under prefers-reduced-motion, pauses for keyboard
 * users while focus is inside it, and pauses while the tab is hidden.
 *
 * IT DOES NOT PAUSE ON HOVER — deliberately, after two rounds of the client
 * reporting the carousel as broken. This section is the full height of the
 * viewport, so the pointer is inside it from the moment the page loads: the
 * hover pause fired before anyone had done anything, and the rotation never
 * started. The same flag was what froze it after a click on an arrow, since
 * the pointer necessarily sits inside the carousel then too. A hover pause is
 * the textbook courtesy for this pattern and it is genuinely useful on a
 * narrow strip; on a full-bleed hero it means "paused, always".
 *
 * What replaces it for anyone who needs the motion to stop: reduced-motion
 * (which disables autoplay outright), keyboard focus, and seven dots plus two
 * arrows that put the reader in charge of which slide is up.
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

/**
 * Line height of the hero h1, and the unit slides 1-6 are dropped by.
 *
 * ONE CONSTANT, TWO PLACES, ON PURPOSE. The h1 sets its leading from this, and
 * the photographic slides pad their top by exactly one line of it so their
 * headline starts on the h1's SECOND line — level with "metabolomics", not
 * with "From raw". Top-aligned against a three-line headline they read as
 * floating too high; a full line down, they sit where the eye has already
 * been. Hardcoding 1.3 in both places would let them drift apart silently.
 *
 * The font size comes from `--type-display-size` (globals.css) so the offset
 * tracks the fluid clamp at every viewport width instead of being right at one.
 */
const HERO_LEADING = 1.3;
const PHOTO_SLIDE_OFFSET = `calc(${HERO_LEADING} * var(--type-display-size))`;

const TOTAL = SLIDES.length + 1;

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  // Which way the slides travel; -1 when stepping backwards. Presentation
  // only — it does not affect where the carousel goes next.
  const [direction, setDirection] = useState(1);
  /**
   * TWO SEPARATE REASONS TO PAUSE, not one flag.
   *
   * They were one boolean set by focus, by the tab going away and (until the
   * hover pause was dropped — see the header) by the pointer, each clearing
   * whatever the others had set. Coming back to the tab could therefore
   * release a focus pause that was still legitimately in force. Kept apart,
   * each reason clears only itself.
   */
  const [focusPaused, setFocusPaused] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const paused = focusPaused || tabHidden;
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
   */
  useEffect(() => {
    if (paused || reduceMotion) return;
    const timer = window.setTimeout(() => step(1), SLIDE_MS);
    return () => window.clearTimeout(timer);
  }, [index, paused, reduceMotion, step]);

  // A background tab still fires timers; without this the carousel would be
  // several slides on by the time someone came back to it. Its own flag, so
  // coming back to the tab cannot clear a hover or focus pause that is still
  // legitimately in force.
  useEffect(() => {
    const onVisibility = () => setTabHidden(document.hidden);
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
      // No onMouseEnter/onMouseLeave pause here. See the header — on a
      // full-height hero it fired before the first slide had ever advanced.
      onFocusCapture={(event) => {
        // Keyboard focus only. A plain click on the prev/next buttons also
        // focuses them, and pausing on that would stop the carousel on a
        // gesture that meant "show me the next slide". :focus-visible is the
        // browser's own read of keyboard vs pointer.
        const target = event.target as Element;
        if (target.matches?.(":focus-visible")) setFocusPaused(true);
      }}
      onBlurCapture={(event) => {
        // Only resume when focus actually leaves the carousel, not when it
        // moves between the controls inside it.
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
          setFocusPaused(false);
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
            One group, left-aligned: [ < ] [ dots ] [ > ]. The arrows sit
            either side of the dots rather than paired off to one end, and the
            "01 / 07" counter is gone — the dots already say both where you are
            and how many there are, so the readout was the same information a
            second time.

            Left, not centred: every slide's copy starts on this edge, so the
            controls line up under the text they belong to rather than floating
            on an axis nothing else uses. */}
        <div className="relative mt-10 flex items-center justify-start gap-4 sm:gap-6">
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
        // Every panel sits at the top of the shared row; the photographic ones
        // then pad down by one line of the hero headline, so all seven slides
        // start on the h1's second line rather than its first. See
        // PHOTO_SLIDE_OFFSET.
        "col-start-1 row-start-1 flex flex-col transition-opacity duration-500",
        isCurrent ? "opacity-100" : "pointer-events-none opacity-0",
      )}
      style={slide ? { paddingTop: PHOTO_SLIDE_OFFSET } : undefined}
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
            ? // Left-aligned on the same edge as slide 0's h1, and capped at
              // the same measure. One format across all seven slides, at the
              // client's direction.
              "max-w-3xl"
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
            <p className="type-lead measure mt-6 text-slate-200">
              {slide.subhead}
            </p>
            {/* The same two CTAs slide 0 carries. They used to appear only
                there, which meant that for six sevenths of the rotation the
                page's primary actions were not on screen at all — the carousel
                was spending most of its time showing copy with nowhere to go.

                Each slide keeps its own subhead above them rather than
                repeating slide 0's: that line is what the slide is about, and
                two paragraphs stacked would read as a duplicate.

                Duplicating the links across seven panels is safe because the
                panels that are not showing are `inert` (see below) — only the
                visible pair is focusable or in the accessibility tree. */}
            <HeroCtas />
          </>
        ) : (
          <>
            <div>
              {/* The page's only h1. The other six slides carry h2s: they are
                  peers within the carousel, not competing page titles.

                  SPACING IS OVERRIDDEN HERE, not in `.type-display`, because
                  it is this headline that needs it: three lines at the top of
                  that class's clamp (68px), where the shared setting reads as
                  cramped. Every other display heading on the site is one or
                  two lines and keeps the tighter default.

                  WORD SPACING, NOT LETTER SPACING. An earlier pass added
                  `tracking-wide` here, which pushed the letters inside each
                  word apart as well as the words — so the words themselves got
                  wider and the gaps between them stayed proportionally just as
                  tight. The tracking is back to `.type-display`'s own
                  -0.005em; only the word gaps are opened, and inline because
                  there is no Tailwind utility for word-spacing.

                  The leading is set from HERO_LEADING rather than a Tailwind
                  class because the photographic slides offset themselves by
                  exactly one line of it — the two must not be able to
                  disagree. */}
              <h1
                className="type-display measure-tight text-white"
                style={{ lineHeight: HERO_LEADING, wordSpacing: "0.15em" }}
              >
                {HERO.headline}
              </h1>

              <p className="type-lead measure mt-6 text-slate-300">
                {HERO.subhead}
              </p>

              <HeroCtas />
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

/**
 * The hero's two calls to action, on every slide.
 *
 * One component rather than a copy per branch: they are the same two links to
 * the same two routes, and the moment they are duplicated in source someone
 * will change one and not the other.
 */
function HeroCtas() {
  return (
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
