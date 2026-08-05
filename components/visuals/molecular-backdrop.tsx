import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Skeletal-structure backdrop.
 *
 * The previous site used chemistry watermarks — benzene rings, bonds, atom
 * labels — behind its content, and that did real work: it signalled the domain
 * before anyone read a word. An ambient gradient glow does not. This restores
 * that cue as hand-authored line art rather than a stock texture.
 *
 * SEVEN COMPOSITIONS, NOT ONE. A single arrangement repeated on every route
 * read as a watermark stamped in the same place each time rather than as
 * texture — the client spotted the identical fragment sitting behind the nav on
 * page after page. Each route now passes its own `pattern`, built from a shared
 * set of motifs at different positions and scales.
 *
 * KEEP THE TOP BAND CLEAR. The header floats over the first section of every
 * page, so anything drawn in the top ~15% of a hero competes with the nav
 * links. Compositions avoid that band, and `fadeTop` masks whatever remains.
 *
 * Purely decorative and aria-hidden. Drawn at low opacity so it never competes
 * with text contrast.
 */

export const PATTERN_COUNT = 7;

export function MolecularBackdrop({
  className,
  variant = "dark",
  clearCenter = false,
  subtle = false,
  pattern = 0,
  fadeTop = false,
}: {
  className?: string;
  variant?: "dark" | "light";
  /**
   * Fades the artwork out through the middle of the section, leaving it at the
   * edges. For centred content — the funding band — the structures otherwise
   * run straight under the text and make it harder to read. The mask keeps the
   * texture present without it competing with anything.
   */
  clearCenter?: boolean;
  /**
   * Roughly half opacity. For the long-form reading pages — Projects, About,
   * Contact — which asked for the same domain cue as the rest of the site but
   * more discreetly, since those sections are dense text rather than cards.
   */
  subtle?: boolean;
  /** Which composition to draw, 0..PATTERN_COUNT-1. Wraps if out of range. */
  pattern?: number;
  /**
   * Fades the artwork out under the floating header. Use on any section that
   * sits at the top of a page.
   */
  fadeTop?: boolean;
}) {
  const stroke = variant === "dark" ? "rgb(255 255 255)" : "rgb(15 23 42)";
  const base = variant === "dark" ? 0.07 : 0.05;
  const opacity = subtle ? base * 0.55 : base;

  const masks = [
    clearCenter
      ? "radial-gradient(ellipse 42% 70% at 50% 50%, transparent 40%, black 100%)"
      : null,
    fadeTop
      ? "linear-gradient(to bottom, transparent 0%, transparent 8%, black 26%)"
      : null,
  ].filter(Boolean) as string[];

  // Two masks compose by intersection, which is what we want: clear the centre
  // AND clear the top when both are asked for.
  const maskStyle =
    masks.length > 0
      ? {
          maskImage: masks.join(", "),
          WebkitMaskImage: masks.join(", "),
          maskComposite: "intersect" as const,
          WebkitMaskComposite: "source-in",
        }
      : undefined;

  const Composition = PATTERNS[pattern % PATTERN_COUNT];

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
      style={maskStyle}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1200 700"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        stroke={stroke}
        strokeOpacity={opacity}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Composition stroke={stroke} opacity={opacity} />
      </svg>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Motifs                                                                     */
/*                                                                            */
/* Each takes a transform so a composition can place it. Atom labels are drawn */
/* at a slightly higher opacity than the bonds, or they disappear entirely.    */
/* -------------------------------------------------------------------------- */

type MotifProps = { stroke: string; opacity: number; transform?: string };

function Label({
  x,
  y,
  stroke,
  opacity,
  children,
}: {
  x: number;
  y: number;
  stroke: string;
  opacity: number;
  children: ReactNode;
}) {
  return (
    <text
      x={x}
      y={y}
      fontSize="15"
      stroke="none"
      fill={stroke}
      fillOpacity={opacity * 1.6}
      fontFamily="ui-sans-serif, system-ui"
    >
      {children}
    </text>
  );
}

/** Indole-like fused bicyclic, with an NH label. */
function FusedRings({ stroke, opacity, transform }: MotifProps) {
  return (
    <g transform={transform}>
      <path d="M0 26 L22 0 L66 8 L88 42 L66 76 L22 68 Z" />
      <path d="M8 32 L26 10" />
      <path d="M62 14 L82 42" />
      <path d="M62 70 L26 62" />
      <path d="M88 42 L130 36 L146 74 L118 100 L84 84" />
      <path d="M132 44 L142 72" />
      <Label x={152} y={80} stroke={stroke} opacity={opacity}>
        NH
      </Label>
    </g>
  );
}

/** Carboxylic acid fragment: chain, carbonyl, hydroxyl. */
function Carboxyl({ stroke, opacity, transform }: MotifProps) {
  return (
    <g transform={transform}>
      <path d="M0 40 L34 20 L68 40 L102 20" />
      <path d="M34 20 L34 -14" />
      <path d="M31 -14 L31 -40" />
      <path d="M37 -14 L37 -40" />
      <path d="M102 20 L136 40" />
      <Label x={20} y={-46} stroke={stroke} opacity={opacity}>
        O
      </Label>
      <Label x={106} y={10} stroke={stroke} opacity={opacity}>
        OH
      </Label>
    </g>
  );
}

/** Steroid-like three-ring system. */
function Steroid({ transform }: MotifProps) {
  return (
    <g transform={transform}>
      <path d="M0 30 L26 0 L66 6 L80 44 L54 74 L14 68 Z" />
      <path d="M80 44 L120 40 L140 76 L114 106 L74 100 L54 74" />
      <path d="M140 76 L180 74 L196 110 L170 138 L132 132 L114 106" />
    </g>
  );
}

/** Honeycomb of hexagons. */
function HexLattice({
  rows = 3,
  cols = 4,
  transform,
}: MotifProps & { rows?: number; cols?: number }) {
  return (
    <g transform={transform}>
      {Array.from({ length: rows }, (_, row) =>
        Array.from({ length: cols }, (_, col) => {
          const x = col * 62 + (row % 2 === 1 ? 31 : 0);
          const y = row * 54;
          return (
            <path
              key={`${row}-${col}`}
              d={`M${x} ${y + 18} L${x + 17} ${y} L${x + 45} ${y + 4} L${
                x + 56
              } ${y + 30} L${x + 39} ${y + 48} L${x + 11} ${y + 44} Z`}
            />
          );
        }),
      )}
    </g>
  );
}

/** Saturated alkyl chain. */
function Chain({
  links = 8,
  transform,
}: MotifProps & { links?: number }) {
  const points = Array.from(
    { length: links + 1 },
    (_, i) => `${i * 30} ${i % 2 === 0 ? 20 : 0}`,
  );
  return (
    <g transform={transform}>
      <path d={`M${points.join(" L")}`} />
    </g>
  );
}

/** Double-helix suggestion with base-pair rungs. */
function Helix({ transform }: MotifProps) {
  return (
    <g transform={transform}>
      <path d="M0 0 C 30 40, 30 80, 0 120 C -30 160, -30 200, 0 240" />
      <path d="M40 0 C 10 40, 10 80, 40 120 C 70 160, 70 200, 40 240" />
      <path d="M6 30 L34 30 M2 60 L38 60 M6 90 L34 90 M6 150 L34 150 M2 180 L38 180 M6 210 L34 210" />
    </g>
  );
}

/** Pyranose ring drawn in the Haworth style, with hydroxyls. */
function SugarRing({ stroke, opacity, transform }: MotifProps) {
  return (
    <g transform={transform}>
      <path d="M0 34 L20 6 L64 0 L96 22 L88 58 L40 66 Z" />
      <path d="M20 6 L14 -18" />
      <path d="M96 22 L124 12" />
      <path d="M40 66 L34 92" />
      <Label x={0} y={-24} stroke={stroke} opacity={opacity}>
        HO
      </Label>
      <Label x={128} y={12} stroke={stroke} opacity={opacity}>
        OH
      </Label>
      <Label x={24} y={110} stroke={stroke} opacity={opacity}>
        OH
      </Label>
    </g>
  );
}

/** Peptide backbone fragment: two residues and an amide bond. */
function Peptide({ stroke, opacity, transform }: MotifProps) {
  return (
    <g transform={transform}>
      <path d="M0 24 L32 4 L64 24 L96 4 L128 24 L160 4" />
      <path d="M32 4 L32 -22" />
      <path d="M96 4 L96 -22" />
      <path d="M64 24 L64 52" />
      <Label x={22} y={-28} stroke={stroke} opacity={opacity}>
        O
      </Label>
      <Label x={86} y={-28} stroke={stroke} opacity={opacity}>
        O
      </Label>
      <Label x={54} y={70} stroke={stroke} opacity={opacity}>
        NH
      </Label>
    </g>
  );
}

/** Benzene ring with a delocalisation circle. */
function Benzene({ transform }: MotifProps) {
  return (
    <g transform={transform}>
      <path d="M0 28 L24 0 L62 4 L78 38 L54 68 L16 62 Z" />
      <circle cx="39" cy="34" r="19" />
    </g>
  );
}

/**
 * Interaction network: nodes joined by edges.
 *
 * Fixed coordinates rather than random — a randomised layout would differ
 * between the server render and the client and produce a hydration mismatch.
 */
function Network({ transform }: MotifProps) {
  const nodes = [
    [0, 40],
    [58, 0],
    [96, 62],
    [150, 22],
    [40, 104],
    [128, 120],
    [186, 84],
  ] as const;
  const edges = [
    [0, 1],
    [1, 2],
    [2, 3],
    [0, 4],
    [2, 4],
    [2, 5],
    [3, 6],
    [5, 6],
  ] as const;

  return (
    <g transform={transform}>
      {edges.map(([a, b]) => (
        <path
          key={`${a}-${b}`}
          d={`M${nodes[a][0]} ${nodes[a][1]} L${nodes[b][0]} ${nodes[b][1]}`}
        />
      ))}
      {nodes.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="5" />
      ))}
    </g>
  );
}

/* -------------------------------------------------------------------------- */
/* Compositions                                                               */
/*                                                                            */
/* viewBox is 1200x700. Nothing sits above y≈130 across the middle of the      */
/* canvas, which is where the floating header lands on a hero section.         */
/* -------------------------------------------------------------------------- */

type CompositionProps = { stroke: string; opacity: number };

function Pattern0({ stroke, opacity }: CompositionProps) {
  const p = { stroke, opacity };
  return (
    <>
      <FusedRings {...p} transform="translate(60 150) scale(1.1)" />
      <Carboxyl {...p} transform="translate(900 190) scale(1.15)" />
      <Steroid {...p} transform="translate(120 470) scale(0.95)" />
      <HexLattice {...p} transform="translate(830 430)" />
      <Chain {...p} transform="translate(400 320)" />
      <Helix {...p} transform="translate(660 200)" />
    </>
  );
}

function Pattern1({ stroke, opacity }: CompositionProps) {
  const p = { stroke, opacity };
  return (
    <>
      <SugarRing {...p} transform="translate(80 210) scale(1.15)" />
      <Network {...p} transform="translate(880 160) scale(1.2)" />
      <Benzene {...p} transform="translate(300 520) scale(1.3)" />
      <Chain {...p} transform="translate(560 430) rotate(-8)" links={10} />
      <Steroid {...p} transform="translate(960 470) scale(0.85)" />
      <Peptide {...p} transform="translate(140 620) scale(0.9)" />
    </>
  );
}

function Pattern2({ stroke, opacity }: CompositionProps) {
  const p = { stroke, opacity };
  return (
    <>
      <Peptide {...p} transform="translate(70 260) scale(1.25)" />
      <HexLattice {...p} rows={2} cols={5} transform="translate(760 180)" />
      <Helix {...p} transform="translate(420 400)" />
      <SugarRing {...p} transform="translate(900 500) scale(1)" />
      <Benzene {...p} transform="translate(180 560) scale(1.1)" />
      <Network {...p} transform="translate(600 150) scale(0.9)" />
    </>
  );
}

function Pattern3({ stroke, opacity }: CompositionProps) {
  const p = { stroke, opacity };
  return (
    <>
      <Network {...p} transform="translate(90 300) scale(1.35)" />
      <FusedRings {...p} transform="translate(820 210) scale(0.95)" />
      <Chain {...p} transform="translate(300 200) rotate(6)" links={7} />
      <SugarRing {...p} transform="translate(520 520) scale(1.1)" />
      <HexLattice {...p} rows={2} cols={3} transform="translate(980 540)" />
      <Benzene {...p} transform="translate(660 300) scale(0.95)" />
    </>
  );
}

function Pattern4({ stroke, opacity }: CompositionProps) {
  const p = { stroke, opacity };
  return (
    <>
      <Benzene {...p} transform="translate(110 230) scale(1.4)" />
      <Carboxyl {...p} transform="translate(420 250) scale(1)" />
      <Helix {...p} transform="translate(960 220)" />
      <Peptide {...p} transform="translate(520 560) scale(1.05)" />
      <Steroid {...p} transform="translate(80 500) scale(0.8)" />
      <Network {...p} transform="translate(830 520) scale(1)" />
    </>
  );
}

function Pattern5({ stroke, opacity }: CompositionProps) {
  const p = { stroke, opacity };
  return (
    <>
      <HexLattice {...p} rows={3} cols={3} transform="translate(70 180)" />
      <SugarRing {...p} transform="translate(660 200) scale(1.2)" />
      <Chain {...p} transform="translate(880 400) rotate(-5)" links={9} />
      <FusedRings {...p} transform="translate(340 520) scale(1)" />
      <Benzene {...p} transform="translate(1000 590) scale(1.15)" />
      <Peptide {...p} transform="translate(420 300) scale(0.85)" />
    </>
  );
}

function Pattern6({ stroke, opacity }: CompositionProps) {
  const p = { stroke, opacity };
  return (
    <>
      <Steroid {...p} transform="translate(120 220) scale(1.05)" />
      <Network {...p} transform="translate(520 200) scale(1.1)" />
      <Carboxyl {...p} transform="translate(880 620) scale(0.95)" />
      <Helix {...p} transform="translate(200 430)" />
      <SugarRing {...p} transform="translate(1000 250) scale(0.95)" />
      <Chain {...p} transform="translate(560 520)" links={11} />
    </>
  );
}

const PATTERNS = [
  Pattern0,
  Pattern1,
  Pattern2,
  Pattern3,
  Pattern4,
  Pattern5,
  Pattern6,
];
