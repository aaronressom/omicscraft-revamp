import { cn } from "@/lib/utils";

/**
 * Skeletal-structure backdrop.
 *
 * The previous site used chemistry watermarks — benzene rings, bonds, atom
 * labels — behind its content, and that did real work: it signalled the domain
 * before anyone read a word. An ambient gradient glow does not. This restores
 * that cue as hand-authored line art rather than a stock texture.
 *
 * Purely decorative and aria-hidden. Drawn at low opacity so it never competes
 * with text contrast.
 */
export function MolecularBackdrop({
  className,
  variant = "dark",
  clearCenter = false,
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
}) {
  const stroke = variant === "dark" ? "rgb(255 255 255)" : "rgb(15 23 42)";
  const opacity = variant === "dark" ? 0.07 : 0.05;

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
      style={
        clearCenter
          ? {
              maskImage:
                "radial-gradient(ellipse 42% 70% at 50% 50%, transparent 40%, black 100%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 42% 70% at 50% 50%, transparent 40%, black 100%)",
            }
          : undefined
      }
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
        {/* Indole-like fused ring system, upper left */}
        <g transform="translate(90 70) scale(1.1)">
          <path d="M0 26 L22 0 L66 8 L88 42 L66 76 L22 68 Z" />
          <path d="M8 32 L26 10" />
          <path d="M62 14 L82 42" />
          <path d="M62 70 L26 62" />
          <path d="M88 42 L130 36 L146 74 L118 100 L84 84" />
          <path d="M132 44 L142 72" />
          <text
            x="152"
            y="80"
            fontSize="15"
            stroke="none"
            fill={stroke}
            fillOpacity={opacity * 1.6}
            fontFamily="ui-sans-serif, system-ui"
          >
            NH
          </text>
        </g>

        {/* Carboxyl + amine fragment, upper right */}
        <g transform="translate(880 50) scale(1.15)">
          <path d="M0 40 L34 20 L68 40 L102 20" />
          <path d="M34 20 L34 -14" />
          <path d="M31 -14 L31 -40" />
          <path d="M37 -14 L37 -40" />
          <path d="M102 20 L136 40" />
          <text
            x="20"
            y="-46"
            fontSize="15"
            stroke="none"
            fill={stroke}
            fillOpacity={opacity * 1.6}
            fontFamily="ui-sans-serif, system-ui"
          >
            O
          </text>
          <text
            x="106"
            y="10"
            fontSize="15"
            stroke="none"
            fill={stroke}
            fillOpacity={opacity * 1.6}
            fontFamily="ui-sans-serif, system-ui"
          >
            OH
          </text>
        </g>

        {/* Steroid-like fused rings, lower left */}
        <g transform="translate(120 470) scale(0.95)">
          <path d="M0 30 L26 0 L66 6 L80 44 L54 74 L14 68 Z" />
          <path d="M80 44 L120 40 L140 76 L114 106 L74 100 L54 74" />
          <path d="M140 76 L180 74 L196 110 L170 138 L132 132 L114 106" />
        </g>

        {/* Hexagon lattice, lower right */}
        <g transform="translate(830 430)">
          {[0, 1, 2].map((row) =>
            [0, 1, 2, 3].map((col) => {
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

        {/* Long alkyl chain, mid band */}
        <g transform="translate(400 300)">
          <path d="M0 20 L30 0 L60 20 L90 0 L120 20 L150 0 L180 20 L210 0 L240 20" />
        </g>

        {/* Double-helix suggestion, centre right */}
        <g transform="translate(660 120)">
          <path d="M0 0 C 30 40, 30 80, 0 120 C -30 160, -30 200, 0 240" />
          <path d="M40 0 C 10 40, 10 80, 40 120 C 70 160, 70 200, 40 240" />
          <path d="M6 30 L34 30 M2 60 L38 60 M6 90 L34 90 M6 150 L34 150 M2 180 L38 180 M6 210 L34 210" />
        </g>
      </svg>
    </div>
  );
}
