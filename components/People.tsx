/**
 * Hand-drawn style line-art people: bold ink outlines, flat ink and white
 * fills, and one brand-colored detail each. Decorative only.
 */

const ink = "var(--color-foreground)";
const paper = "#ffffff";

const line = {
  stroke: ink,
  strokeWidth: 3,
  strokeLinejoin: "round" as const,
  strokeLinecap: "round" as const,
};

type FigureProps = { className?: string };

function Svg({ className, children }: FigureProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 160 310"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

function Shoe({ x, fill, flip = false }: { x: number; fill: string; flip?: boolean }) {
  return (
    <path
      d={`M${x} 290 Q${x} 284 ${x + 8} 284 L${x + 14} 284 Q${x + 26} 286 ${x + 28} 296 L${x} 296 Z`}
      fill={fill}
      transform={flip ? `translate(${2 * x + 28} 0) scale(-1 1)` : undefined}
      {...line}
    />
  );
}

/** A partner bringing over a hot drink. */
export function PartnerFigure({ className }: FigureProps) {
  return (
    <Svg className={className}>
      {/* Long hair, behind the head */}
      <path d="M54 58 Q52 24 80 24 Q108 24 106 58 L110 100 Q80 108 50 100 Z" fill={ink} {...line} />
      {/* Trousers */}
      <path d="M58 168 L104 168 L112 286 L97 286 L81 204 L65 286 L50 286 Z" fill={paper} {...line} />
      <path d="M81 204 L81 178" fill="none" {...line} />
      <Shoe x={40} fill={ink} flip />
      <Shoe x={95} fill={ink} />
      {/* Left arm, hanging */}
      <path d="M60 96 Q44 132 50 170 L62 170 Q60 136 70 112 Z" fill={ink} {...line} />
      <circle cx="56" cy="175" r="6.5" fill={paper} {...line} />
      {/* Sweater */}
      <path d="M58 94 Q80 84 102 94 L108 172 Q80 180 52 172 Z" fill={ink} {...line} />
      {/* Right arm, holding the mug */}
      <path d="M100 96 Q114 118 112 140 L100 144 Q100 124 92 110 Z" fill={ink} {...line} />
      <path d="M104 134 L128 124 L132 136 L108 146 Z" fill={ink} {...line} />
      {/* Mug and steam */}
      <path d="M140 116 Q150 116 150 124 Q150 132 140 132" fill="none" {...line} />
      <rect x="124" y="110" width="18" height="24" rx="3" fill="var(--color-primary)" {...line} />
      <path d="M128 102 Q124 96 128 90 M136 102 Q132 96 136 90" fill="none" {...line} strokeWidth={2.5} />
      <circle cx="129" cy="132" r="6.5" fill={paper} {...line} />
      {/* Neck and head */}
      <path d="M74 72 L74 90 Q80 94 86 90 L86 72" fill={paper} {...line} />
      <circle cx="80" cy="54" r="21" fill={paper} {...line} />
      <path d="M58 52 Q60 30 80 30 Q100 30 102 52 Q92 40 76 44 Q66 46 58 52 Z" fill={ink} {...line} />
      <circle cx="73" cy="57" r="2.2" fill={ink} />
      <circle cx="88" cy="57" r="2.2" fill={ink} />
      <path d="M74 65 Q81 71 88 65" fill="none" {...line} strokeWidth={2.5} />
    </Svg>
  );
}

/** A dad with a first-period kit in hand. */
export function DadFigure({ className }: FigureProps) {
  return (
    <Svg className={className}>
      {/* Trousers */}
      <path d="M56 170 L104 170 L110 286 L95 286 L80 206 L67 286 L52 286 Z" fill={ink} {...line} />
      <Shoe x={42} fill={paper} flip />
      <Shoe x={93} fill={paper} />
      {/* Arms, rolled sleeves */}
      <path d="M60 96 Q46 128 50 160 L62 160 Q62 132 70 112 Z" fill={paper} {...line} />
      <path d="M100 96 Q114 128 110 160 L98 160 Q98 132 90 112 Z" fill={paper} {...line} />
      <path d="M50 150 L62 150 M98 150 L110 150" fill="none" {...line} />
      <path d="M52 160 L53 168 M108 160 L108 168" fill="none" {...line} />
      <circle cx="54" cy="171" r="6.5" fill={paper} {...line} />
      {/* Shirt */}
      <path d="M58 94 Q80 84 102 94 L104 176 L56 176 Z" fill={paper} {...line} />
      <path d="M80 100 L80 176" fill="none" {...line} strokeWidth={2} />
      {[114, 132, 150].map((y) => (
        <circle key={y} cx="85" cy={y} r="1.8" fill={ink} />
      ))}
      <path d="M90 116 L98 116 L98 126 L90 126 Z" fill="none" {...line} strokeWidth={2} />
      {/* The kit: a small zip pouch with a heart */}
      <rect x="98" y="166" width="32" height="24" rx="7" fill="var(--color-accent)" {...line} />
      <path d="M100 174 L128 174" fill="none" {...line} strokeWidth={2} />
      <path d="M114 186 L109 181 Q107 178 110 177 Q113 176 114 179 Q115 176 118 177 Q121 178 119 181 Z" fill={paper} stroke={ink} strokeWidth={1.5} strokeLinejoin="round" />
      <circle cx="106" cy="170" r="6.5" fill={paper} {...line} />
      {/* Neck, collar and head */}
      <path d="M74 72 L74 90 Q80 94 86 90 L86 72" fill={paper} {...line} />
      <path d="M70 90 L80 102 L90 90" fill={paper} {...line} />
      <circle cx="80" cy="54" r="21" fill={paper} {...line} />
      <path d="M59 50 Q58 28 80 28 Q102 28 101 50 Q98 38 86 38 Q72 36 59 50 Z" fill={ink} {...line} />
      {/* Beard */}
      <path d="M60 58 Q62 80 80 80 Q98 80 100 58 Q98 72 90 72 Q80 70 70 72 Q62 72 60 58 Z" fill={ink} {...line} />
      <path d="M74 64 Q80 69 86 64" fill="none" {...line} strokeWidth={2.5} />
      {/* Glasses */}
      <circle cx="72" cy="53" r="6.5" fill="none" {...line} strokeWidth={2.5} />
      <circle cx="89" cy="53" r="6.5" fill="none" {...line} strokeWidth={2.5} />
      <path d="M78.5 53 L82.5 53" fill="none" {...line} strokeWidth={2.5} />
      <circle cx="72" cy="54" r="1.8" fill={ink} />
      <circle cx="89" cy="54" r="1.8" fill={ink} />
    </Svg>
  );
}

/** A friend waving hello, in an open jacket. */
export function FriendFigure({ className }: FigureProps) {
  return (
    <Svg className={className}>
      {/* Hair buns */}
      <circle cx="60" cy="34" r="11" fill={ink} {...line} />
      <circle cx="100" cy="34" r="11" fill={ink} {...line} />
      {/* Trousers with rolled cuffs */}
      <path d="M58 170 L104 170 L112 276 L97 276 L81 206 L65 276 L50 276 Z" fill={paper} {...line} />
      <path d="M51 266 L66 266 M96 266 L111 266" fill="none" {...line} />
      <Shoe x={42} fill={paper} flip />
      <Shoe x={93} fill={paper} />
      <path d="M54 276 L53 286 M63 276 L63 286 M99 276 L99 286 M109 276 L110 286" fill="none" {...line} />
      {/* Top */}
      <path d="M66 92 L94 92 L98 176 L62 176 Z" fill={ink} {...line} />
      {/* Left arm, hanging */}
      <path d="M58 96 Q44 132 48 168 L60 168 Q60 134 68 112 Z" fill="var(--color-secondary)" {...line} />
      <circle cx="54" cy="174" r="6.5" fill={paper} {...line} />
      {/* Jacket panels */}
      <path d="M58 94 Q66 88 72 90 L76 178 L54 176 Z" fill="var(--color-secondary)" {...line} />
      <path d="M102 94 Q94 88 88 90 L84 178 L106 176 Z" fill="var(--color-secondary)" {...line} />
      {/* Right arm, waving */}
      <path d="M100 96 Q120 84 122 60 L134 62 Q132 92 106 112 Z" fill="var(--color-secondary)" {...line} />
      <path d="M122 56 Q120 44 124 40 Q126 46 127 50 Q128 38 132 38 Q133 46 132 52 Q136 44 139 46 Q137 54 134 60 Z" fill={paper} {...line} strokeWidth={2.5} />
      <path d="M142 36 Q148 42 146 50 M138 28 Q146 30 150 36" fill="none" {...line} strokeWidth={2.5} />
      {/* Neck and head */}
      <path d="M74 72 L74 90 Q80 94 86 90 L86 72" fill={paper} {...line} />
      <circle cx="80" cy="54" r="21" fill={paper} {...line} />
      <path d="M59 52 Q60 32 80 32 Q100 32 101 52 Q94 42 80 44 Q66 42 59 52 Z" fill={ink} {...line} />
      <path d="M71 54 Q73 51 75 54 M85 54 Q87 51 89 54" fill="none" {...line} strokeWidth={2.5} />
      <path d="M72 62 Q80 72 88 62 Z" fill={ink} {...line} strokeWidth={2.5} />
    </Svg>
  );
}
