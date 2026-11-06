/**
 * A small kit for hand-drawn style people: bold ink outlines, flat black and
 * white fills, simple dot-eye faces, and one brand color per scene.
 *
 * Everything is drawn in a bust's own coordinates: the head is centred on
 * (0, 0), about 50 wide and 58 tall, and the torso runs off the bottom.
 * Colors are fixed (not theme tokens) so the art reads like a picture in
 * both light and dark mode.
 */

import type { ReactNode, SVGProps } from "react";

export const INK = "#1f1b19";
export const PAPER = "#ffffff";

export const brand = {
  orange: "#ea580c",
  apricot: "#fb923c",
  pink: "#ec4899",
  rose: "#f9a8d4",
  amber: "#f59e0b",
  sun: "#fbbf24",
};

export const backdrops = {
  peach: "#ffedd5",
  honey: "#fef3c7",
  blush: "#fce7f3",
};

export const line = {
  stroke: INK,
  strokeWidth: 3,
  strokeLinejoin: "round" as const,
  strokeLinecap: "round" as const,
};

export type Hair =
  | "short"
  | "fringe"
  | "long"
  | "bun"
  | "puffs"
  | "curly"
  | "bald"
  | "bob"
  | "hijab"
  | "quiff"
  | "beanie"
  | "afro"
  | "hat";

export type Top =
  | "tee-ink"
  | "tee-paper"
  | "stripes"
  | "vneck"
  | "collar"
  | "hoodie"
  | "sweater"
  | "tank"
  | "coat";

export type Eyes = "dot" | "happy" | "wide" | "wink" | "closed" | "side";
export type Mouth = "smile" | "grin" | "open" | "flat" | "worried" | "talk";
export type Brows = "none" | "worried" | "raised";

const TORSO = "M-62 160 L-60 80 Q-58 50 -22 42 L22 42 Q58 50 60 80 L62 160 Z";

function HairBack({ hair, color }: { hair: Hair; color: string }) {
  switch (hair) {
    case "long":
      return (
        <path
          d="M-30 -4 Q-35 -40 0 -40 Q35 -40 30 -4 L38 74 Q0 84 -38 74 Z"
          fill={INK}
          {...line}
        />
      );
    case "bun":
      return <circle cx="0" cy="-40" r="12" fill={INK} {...line} />;
    case "puffs":
      return (
        <>
          <circle cx="-27" cy="-25" r="13" fill={INK} {...line} />
          <circle cx="27" cy="-25" r="13" fill={INK} {...line} />
        </>
      );
    case "curly": {
      const curls = [];
      for (let a = 180; a <= 360; a += 22.5) {
        const r = (a * Math.PI) / 180;
        curls.push(
          <circle
            key={a}
            cx={(31 * Math.cos(r)).toFixed(1)}
            cy={(-2 + 33 * Math.sin(r)).toFixed(1)}
            r="11"
            fill={INK}
            {...line}
          />,
        );
      }
      return <>{curls}</>;
    }
    case "afro": {
      // A big round cloud of curls
      const puffs = [];
      for (let a = 0; a < 360; a += 30) {
        const r = (a * Math.PI) / 180;
        puffs.push(
          <circle
            key={a}
            cx={(36 * Math.cos(r)).toFixed(1)}
            cy={(-14 + 34 * Math.sin(r)).toFixed(1)}
            r="16"
            fill={INK}
            {...line}
          />,
        );
      }
      return (
        <>
          {puffs}
          <circle cx="0" cy="-14" r="40" fill={INK} />
        </>
      );
    }
    case "bob":
      return (
        <path
          d="M-31 -6 Q-34 -40 0 -40 Q34 -40 31 -6 L33 26 Q22 32 17 24 L-17 24 Q-22 32 -33 26 Z"
          fill={PAPER}
          {...line}
        />
      );
    case "hijab":
      return (
        <path
          d="M-40 70 Q-44 -46 0 -46 Q44 -46 40 70 Q0 82 -40 70 Z"
          fill={color}
          {...line}
        />
      );
    default:
      return null;
  }
}

function HairFront({ hair, color }: { hair: Hair; color: string }) {
  switch (hair) {
    case "short":
      return (
        <path
          d="M-26 -2 Q-30 -36 2 -35 Q30 -35 26 -4 Q22 -21 6 -23 Q-12 -23 -26 -2 Z"
          fill={INK}
          {...line}
        />
      );
    case "fringe":
      return (
        <path
          d="M-27 6 Q-31 -37 0 -36 Q31 -37 27 6 L23 -8 Q0 -15 -23 -8 Z"
          fill={INK}
          {...line}
        />
      );
    case "long":
      return (
        <path
          d="M-26 2 Q-29 -34 0 -34 Q27 -34 27 -6 Q12 -25 -8 -20 Q-20 -14 -26 2 Z"
          fill={INK}
          {...line}
        />
      );
    case "bun":
    case "puffs":
    case "curly":
      return (
        <path
          d="M-26 -2 Q-28 -33 0 -33 Q28 -33 26 -2 Q20 -24 0 -24 Q-20 -24 -26 -2 Z"
          fill={INK}
          {...line}
        />
      );
    case "bob":
      return (
        <>
          <path
            d="M-27 0 Q-29 -35 0 -35 Q29 -35 27 0 Q22 -18 8 -16 Q-6 -20 -27 0 Z"
            fill={PAPER}
            {...line}
          />
          <path d="M-12 -28 Q-16 -20 -18 -12 M4 -30 Q2 -24 0 -19" fill="none" {...line} strokeWidth={2} />
        </>
      );
    case "hijab":
      return (
        <path d="M-26 -10 Q0 -34 26 -10" fill="none" stroke={PAPER} strokeWidth={3} strokeLinecap="round" />
      );
    case "afro":
      return (
        <path
          d="M-27 4 Q-30 -34 0 -34 Q30 -34 27 4 Q22 -16 0 -18 Q-22 -16 -27 4 Z"
          fill={INK}
          {...line}
        />
      );
    case "hat":
      return (
        <>
          <path d="M-26 -2 Q-28 -20 0 -22 Q28 -20 26 -2 Q16 -12 0 -12 Q-16 -12 -26 -2 Z" fill={INK} {...line} />
          <path d="M-46 -14 Q0 -30 46 -14 Q0 -4 -46 -14 Z" fill={INK} {...line} />
          <path d="M-24 -18 Q-26 -50 0 -50 Q26 -50 24 -18 Z" fill={INK} {...line} />
          <path d="M-24 -22 Q0 -28 24 -22" fill="none" stroke={color} strokeWidth={5} />
        </>
      );
    case "quiff":
      return (
        <path
          d="M-26 -2 Q-30 -30 -8 -34 Q2 -50 22 -42 Q34 -32 26 -4 Q20 -22 0 -22 Q-16 -20 -26 -2 Z"
          fill={INK}
          {...line}
        />
      );
    case "beanie":
      return (
        <>
          <path d="M-29 -6 Q-31 -44 0 -44 Q31 -44 29 -6 Z" fill={color} {...line} />
          <path d="M-30 -14 L30 -14 L30 -3 L-30 -3 Z" fill={color} {...line} />
          <path d="M-20 -14 L-20 -3 M-10 -14 L-10 -3 M0 -14 L0 -3 M10 -14 L10 -3 M20 -14 L20 -3" {...line} strokeWidth={2} />
          <circle cx="0" cy="-47" r="7" fill={PAPER} {...line} />
        </>
      );
    default:
      return null;
  }
}

function Clothes({ top, color }: { top: Top; color: string }) {
  switch (top) {
    case "tee-ink":
      return (
        <>
          <path d={TORSO} fill={INK} {...line} />
          <path d="M-15 43 Q0 58 15 43" fill="none" stroke={PAPER} strokeWidth={3} strokeLinecap="round" />
          <path d="M-46 160 L-44 104 M46 160 L44 104" stroke={PAPER} strokeWidth={2.5} strokeLinecap="round" />
        </>
      );
    case "tee-paper":
      return (
        <>
          <path d={TORSO} fill={PAPER} {...line} />
          <path d="M-15 43 Q0 57 15 43" fill="none" {...line} />
          <path d="M-46 160 L-44 104 M46 160 L44 104" fill="none" {...line} strokeWidth={2.5} />
        </>
      );
    case "stripes":
      return (
        <>
          <path d={TORSO} fill={PAPER} {...line} />
          {[84, 100, 116, 132, 148].map((y) => (
            <path key={y} d={`M-58 ${y} L58 ${y}`} stroke={INK} strokeWidth={6} />
          ))}
          <path d="M-15 43 Q0 57 15 43" fill="none" {...line} />
        </>
      );
    case "vneck":
      return (
        <>
          <path d={TORSO} fill={INK} {...line} />
          <path d="M-14 42 L0 66 L14 42 Z" fill={PAPER} {...line} />
        </>
      );
    case "collar":
      return (
        <>
          <path d={TORSO} fill={PAPER} {...line} />
          <path d="M0 52 L0 160" {...line} strokeWidth={2.5} />
          {[78, 102, 126].map((y) => (
            <circle key={y} cx="5" cy={y} r="2" fill={INK} />
          ))}
          <path d="M-14 40 L0 54 L-6 64 L-22 50 Z M14 40 L0 54 L6 64 L22 50 Z" fill={PAPER} {...line} />
        </>
      );
    case "hoodie":
      return (
        <>
          <path d={TORSO} fill={PAPER} {...line} />
          <path d="M-32 46 Q0 78 32 46" fill="none" {...line} strokeWidth={5} />
          <path d="M-8 64 L-10 96 M8 64 L10 96" {...line} />
          <circle cx="-10" cy="98" r="2.5" fill={INK} />
          <circle cx="10" cy="98" r="2.5" fill={INK} />
          <path d="M-30 160 L-28 128 Q0 122 28 128 L30 160" fill="none" {...line} strokeWidth={2.5} />
        </>
      );
    case "sweater":
      return (
        <>
          <path d={TORSO} fill={color} {...line} />
          <path d="M-16 43 Q0 60 16 43" fill="none" {...line} strokeWidth={5} />
          <path d="M-36 120 L-30 128 L-24 120 L-18 128 L-12 120 L-6 128 L0 120 L6 128 L12 120 L18 128 L24 120 L30 128 L36 120" fill="none" {...line} strokeWidth={2.5} />
        </>
      );
    case "tank":
      return (
        <>
          <path d={TORSO} fill={PAPER} {...line} />
          <path
            d="M-36 160 L-34 74 Q-32 52 -20 44 L-13 44 Q0 64 13 44 L20 44 Q32 52 34 74 L36 160 Z"
            fill={INK}
            {...line}
          />
        </>
      );
    case "coat":
      return (
        <>
          <path d={TORSO} fill={PAPER} {...line} />
          <path d="M-12 44 L0 72 L12 44" fill={INK} {...line} />
          <path d="M-14 42 L-4 90 L-26 60 Z M14 42 L4 90 L26 60 Z" fill={PAPER} {...line} />
          <path d="M-36 112 L-20 112 L-20 126 L-36 126 Z" fill="none" {...line} strokeWidth={2.5} />
        </>
      );
  }
}

function Eyes({ eyes }: { eyes: Eyes }) {
  switch (eyes) {
    case "happy":
      return <path d="M-14 4 Q-9 -2 -4 4 M4 4 Q9 -2 14 4" fill="none" {...line} strokeWidth={2.5} />;
    case "closed":
      return <path d="M-14 2 Q-9 7 -4 2 M4 2 Q9 7 14 2" fill="none" {...line} strokeWidth={2.5} />;
    case "wide":
      return (
        <>
          <circle cx="-9" cy="1" r="5.5" fill={PAPER} {...line} strokeWidth={2.5} />
          <circle cx="9" cy="1" r="5.5" fill={PAPER} {...line} strokeWidth={2.5} />
          <circle cx="-9" cy="2" r="2.2" fill={INK} />
          <circle cx="9" cy="2" r="2.2" fill={INK} />
        </>
      );
    case "wink":
      return (
        <>
          <circle cx="-9" cy="2" r="2.8" fill={INK} />
          <path d="M4 3 Q9 -2 14 3" fill="none" {...line} strokeWidth={2.5} />
        </>
      );
    case "side":
      return (
        <>
          <circle cx="-6" cy="2" r="2.8" fill={INK} />
          <circle cx="12" cy="2" r="2.8" fill={INK} />
        </>
      );
    default:
      return (
        <>
          <circle cx="-9" cy="2" r="2.8" fill={INK} />
          <circle cx="9" cy="2" r="2.8" fill={INK} />
        </>
      );
  }
}

function Mouth({ mouth }: { mouth: Mouth }) {
  switch (mouth) {
    case "grin":
      return (
        <>
          <path d="M-10 15 Q0 17 10 15 Q9 26 0 26 Q-9 26 -10 15 Z" fill={PAPER} {...line} strokeWidth={2.5} />
          <path d="M-9 19 L9 19 M-3 16 L-3 25 M3 16 L3 25" {...line} strokeWidth={1.5} />
        </>
      );
    case "open":
      return <ellipse cx="0" cy="19" rx="4" ry="5" fill={INK} />;
    case "flat":
      return <path d="M-6 19 L6 19" {...line} strokeWidth={2.5} />;
    case "worried":
      return <path d="M-7 21 Q0 15 7 21" fill="none" {...line} strokeWidth={2.5} />;
    case "talk":
      return <path d="M-8 15 Q0 27 8 15 Z" fill={INK} {...line} strokeWidth={2} />;
    default:
      return <path d="M-8 16 Q0 24 8 16" fill="none" {...line} strokeWidth={2.5} />;
  }
}

export type BustProps = {
  x: number;
  y: number;
  s?: number;
  flip?: boolean;
  hair: Hair;
  top: Top;
  eyes?: Eyes;
  mouth?: Mouth;
  brows?: Brows;
  glasses?: boolean;
  beard?: boolean;
  mustache?: boolean;
  sunglasses?: boolean;
  /** Seated in a wheelchair: wheel and push handles behind the body */
  wheelchair?: boolean;
  headband?: string;
  /** Color for a sweater, beanie or hijab */
  color?: string;
  /** Extra drawing in the bust's coordinates: arms, hands, held props */
  children?: ReactNode;
};

/** One person from the chest up, in the hand-drawn style. */
export function Bust({
  x,
  y,
  s = 1,
  flip = false,
  hair,
  top,
  eyes = "dot",
  mouth = "smile",
  brows = "none",
  glasses = false,
  beard = false,
  mustache = false,
  sunglasses = false,
  wheelchair = false,
  headband,
  color = brand.orange,
  children,
}: BustProps) {
  const covered = hair === "hijab";
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      {wheelchair && (
        <g>
          <path d="M-56 70 L-62 40 L-74 40 M56 70 L62 40 L74 40" fill="none" {...line} strokeWidth={5} />
          <circle cx="-62" cy="150" r="58" fill="none" {...line} strokeWidth={5} />
          <circle cx="-62" cy="150" r="48" fill="none" {...line} strokeWidth={2.5} />
          <path d="M-62 102 L-62 198 M-110 150 L-14 150 M-96 116 L-28 184 M-96 184 L-28 116" {...line} strokeWidth={2} />
          <circle cx="-62" cy="150" r="7" fill={PAPER} {...line} />
        </g>
      )}
      {hair !== "hijab" && <HairBack hair={hair} color={color} />}
      <Clothes top={top} color={color} />
      {covered ? (
        <HairBack hair={hair} color={INK} />
      ) : (
        <>
          <path d="M-10 18 L-10 44 Q0 50 10 44 L10 18" fill={PAPER} {...line} />
          <circle cx="-25" cy="4" r="6" fill={PAPER} {...line} />
          <circle cx="25" cy="4" r="6" fill={PAPER} {...line} />
        </>
      )}
      <ellipse cx="0" cy="0" rx={covered ? 23 : 25} ry={covered ? 28 : 29} fill={PAPER} {...line} />
      {beard && (
        <path
          d="M-24 6 Q-22 34 0 34 Q22 34 24 6 Q20 22 10 14 Q0 12 -10 14 Q-20 22 -24 6 Z"
          fill={INK}
          {...line}
        />
      )}
      <HairFront hair={hair} color={color} />
      {headband && (
        <>
          <path d="M-25 -15 Q0 -32 25 -15" fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" />
          <path d="M-25 -15 Q0 -32 25 -15" fill="none" stroke={headband} strokeWidth={5} strokeLinecap="round" />
          <path d="M14 -28 L24 -38 L26 -24 Z M14 -28 L4 -38 L2 -24 Z" fill={headband} {...line} strokeWidth={2} />
        </>
      )}
      <Eyes eyes={eyes} />
      {brows === "worried" && (
        <path d="M-15 -9 L-5 -6 M15 -9 L5 -6" {...line} strokeWidth={2.5} />
      )}
      {brows === "raised" && (
        <path d="M-15 -8 Q-9 -13 -4 -9 M4 -9 Q9 -13 15 -8" fill="none" {...line} strokeWidth={2.5} />
      )}
      <path d="M1 6 Q6 9 2 13" fill="none" {...line} strokeWidth={2.5} />
      {beard ? (
        <path d="M-6 21 Q0 25 6 21" fill="none" stroke={PAPER} strokeWidth={2.5} strokeLinecap="round" />
      ) : (
        <Mouth mouth={mouth} />
      )}
      {mustache && (
        <path d="M-12 15 Q-6 9 0 13 Q6 9 12 15 Q6 18 0 15 Q-6 18 -12 15 Z" fill={INK} {...line} strokeWidth={2} />
      )}
      {sunglasses && (
        <g {...line} strokeWidth={2.5}>
          <path d="M-18 -3 L-1 -3 Q-1 8 -9 8 Q-17 8 -18 -3 Z M1 -3 L18 -3 Q17 8 9 8 Q1 8 1 -3 Z" fill={INK} />
          <path d="M-25 -2 L-18 -3 M18 -3 L25 -2" fill="none" />
        </g>
      )}
      {glasses && (
        <g fill="none" {...line} strokeWidth={2.5}>
          <circle cx="-9" cy="2" r="7.5" />
          <circle cx="9" cy="2" r="7.5" />
          <path d="M-1.5 1 L1.5 1" />
        </g>
      )}
      {children}
    </g>
  );
}

/** A sleeve: an outlined tube along a path, ending in a hand. */
export function Arm({
  d,
  hand,
  color = PAPER,
}: {
  d: string;
  hand?: [number, number];
  color?: string;
}) {
  return (
    <>
      <path d={d} fill="none" stroke={INK} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={color} strokeWidth={15} strokeLinecap="round" strokeLinejoin="round" />
      {hand && <circle cx={hand[0]} cy={hand[1]} r="9" fill={PAPER} {...line} />}
    </>
  );
}

/* Props, drawn in whatever coordinates they're placed in */

export function Heart({ x, y, s = 1, fill = brand.pink }: { x: number; y: number; s?: number; fill?: string }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${s})`}
      d="M0 8 L-11 -3 Q-17 -10 -11 -15 Q-5 -19 0 -12 Q5 -19 11 -15 Q17 -10 11 -3 Z"
      fill={fill}
      {...line}
    />
  );
}

export function Sparkle({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${s})`}
      d="M0 -10 L0 -4 M0 4 L0 10 M-10 0 L-4 0 M4 0 L10 0"
      {...line}
    />
  );
}

export function Bubble({
  x,
  y,
  w,
  h,
  tail = "left",
  fill = PAPER,
  children,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  tail?: "left" | "right";
  fill?: string;
  children?: ReactNode;
}) {
  const tx = tail === "left" ? x + 14 : x + w - 14;
  const dir = tail === "left" ? -1 : 1;
  return (
    <g>
      <path
        d={`M${x + 12} ${y} H${x + w - 12} Q${x + w} ${y} ${x + w} ${y + 12} V${y + h - 12} Q${x + w} ${y + h} ${x + w - 12} ${y + h} H${tx + 8 * -dir} L${tx + 6 * dir} ${y + h + 12} L${tx - 4 * dir} ${y + h} H${x + 12} Q${x} ${y + h} ${x} ${y + h - 12} V${y + 12} Q${x} ${y} ${x + 12} ${y} Z`}
        fill={fill}
        {...line}
      />
      {children}
    </g>
  );
}

export function Steam({ x, y }: { x: number; y: number }) {
  return (
    <path
      d={`M${x} ${y} q-5 -7 0 -14 q5 -7 0 -14 M${x + 10} ${y} q-5 -7 0 -14 q5 -7 0 -14`}
      fill="none"
      {...line}
      strokeWidth={2.5}
    />
  );
}

export function Mug({ x, y, fill = brand.orange }: { x: number; y: number; fill?: string }) {
  return (
    <g>
      <path d={`M${x + 22} ${y + 6} q12 0 12 10 q0 10 -12 10`} fill="none" {...line} />
      <rect x={x} y={y} width="24" height="30" rx="4" fill={fill} {...line} />
      <Steam x={x + 7} y={y - 6} />
    </g>
  );
}

export function Group(props: SVGProps<SVGGElement>) {
  return <g {...props} />;
}
