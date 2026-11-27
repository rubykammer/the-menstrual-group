/**
 * One hand-drawn picture per period product, on the same 400 x 240 canvas
 * and in the same style as the article scenes. Cards crop the edges, so the
 * object stays between x 80 and 320.
 */

import type { ReactNode } from "react";
import { backdrops, brand, Heart, line, PAPER, Sparkle } from "./kit";
import type { Scene } from "./scenes";

function Drop({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${s})`}
      d="M0 -14 Q10 0 10 6 A10 10 0 0 1 -10 6 Q-10 0 0 -14 Z"
      fill={brand.red}
      {...line}
    />
  );
}

const pad: ReactNode = (
  <>
    <g transform="translate(200 122) rotate(-90)">
      {/* Wings */}
      <path
        d="M-30 -22 Q-50 -40 -58 -20 Q-62 0 -58 20 Q-50 40 -30 22 Z M30 -22 Q50 -40 58 -20 Q62 0 58 20 Q50 40 30 22 Z"
        fill={PAPER}
        {...line}
      />
      <rect
        x="-34"
        y="-110"
        width="68"
        height="220"
        rx="34"
        fill={PAPER}
        {...line}
      />
      <rect
        x="-18"
        y="-82"
        width="36"
        height="164"
        rx="18"
        fill="none"
        {...line}
        strokeWidth={2}
        strokeDasharray="6 6"
      />
    </g>
    <Drop x={200} y={124} s={1.2} />
    <Sparkle x={92} y={52} />
    <Sparkle x={318} y={196} s={0.8} />
  </>
);

const reusablePad: ReactNode = (
  <>
    <g transform="translate(200 122) rotate(-90)">
      <path
        d="M-30 -24 Q-54 -30 -60 0 Q-54 30 -30 24 Z M30 -24 Q54 -30 60 0 Q54 30 30 24 Z"
        fill={brand.apricot}
        {...line}
      />
      <rect
        x="-34"
        y="-104"
        width="68"
        height="208"
        rx="34"
        fill={brand.sun}
        {...line}
      />
      {/* Stitching and a print */}
      <rect
        x="-26"
        y="-96"
        width="52"
        height="192"
        rx="26"
        fill="none"
        {...line}
        strokeWidth={2}
        strokeDasharray="3 6"
      />
      <circle cx="-8" cy="-50" r="5" fill={PAPER} {...line} strokeWidth={2} />
      <circle cx="10" cy="-10" r="5" fill={PAPER} {...line} strokeWidth={2} />
      <circle cx="-6" cy="34" r="5" fill={PAPER} {...line} strokeWidth={2} />
      <circle cx="12" cy="70" r="5" fill={PAPER} {...line} strokeWidth={2} />
      {/* Popper */}
      <circle cx="-52" cy="0" r="6" fill={PAPER} {...line} strokeWidth={2} />
    </g>
    {/* Washing bubbles */}
    <circle cx="96" cy="70" r="12" fill={PAPER} {...line} strokeWidth={2} />
    <circle cx="118" cy="46" r="7" fill={PAPER} {...line} strokeWidth={2} />
    <circle cx="306" cy="182" r="10" fill={PAPER} {...line} strokeWidth={2} />
    <Heart x={312} y={62} s={0.8} />
  </>
);

const tampon: ReactNode = (
  <>
    <g transform="translate(176 104) rotate(-30)">
      <rect
        x="-22"
        y="-62"
        width="44"
        height="112"
        rx="22"
        fill={PAPER}
        {...line}
      />
      <path
        d="M-22 -20 L22 -20 M-22 4 L22 4 M-22 28 L22 28"
        {...line}
        strokeWidth={2}
      />
      <path
        d="M0 50 Q-12 76 4 94 Q18 112 2 132"
        fill="none"
        stroke={brand.red}
        strokeWidth={4}
        strokeLinecap="round"
      />
    </g>
    {/* Applicator */}
    <g transform="translate(268 134) rotate(24)">
      <rect
        x="-16"
        y="-58"
        width="32"
        height="76"
        rx="12"
        fill={brand.redLight}
        {...line}
      />
      <rect
        x="-10"
        y="18"
        width="20"
        height="44"
        rx="6"
        fill={brand.red}
        {...line}
      />
    </g>
    <Sparkle x={92} y={186} />
    <Sparkle x={318} y={52} s={0.8} />
  </>
);

const cup: ReactNode = (
  <>
    <g transform="translate(200 108) rotate(-8)">
      <path
        d="M-56 -50 Q-56 42 0 56 Q56 42 56 -50 Z"
        fill={brand.red}
        {...line}
      />
      <ellipse cx="0" cy="-50" rx="56" ry="13" fill={brand.redLight} {...line} />
      {/* Grip rings and stem */}
      <path d="M-14 66 L14 66 M-12 74 L12 74" {...line} strokeWidth={2} />
      <path d="M0 56 L0 98" {...line} strokeWidth={7} />
      <path
        d="M-30 -14 Q-28 18 -10 32"
        fill="none"
        stroke={PAPER}
        strokeWidth={4}
        strokeLinecap="round"
      />
    </g>
    <Sparkle x={104} y={60} />
    <Sparkle x={306} y={186} s={0.9} />
    <Heart x={314} y={66} s={0.7} fill={brand.amber} />
  </>
);

const disc: ReactNode = (
  <>
    <g transform="translate(200 118) rotate(-14)">
      {/* Pouch */}
      <path d="M-74 0 Q-60 70 0 74 Q60 70 74 0 Z" fill={brand.redLight} {...line} />
      {/* Rim, seen at an angle */}
      <ellipse cx="0" cy="0" rx="78" ry="24" fill={brand.red} {...line} />
      <ellipse
        cx="0"
        cy="0"
        rx="62"
        ry="15"
        fill={brand.redLight}
        {...line}
        strokeWidth={2}
      />
      <path
        d="M-40 34 Q-20 52 10 50"
        fill="none"
        stroke={PAPER}
        strokeWidth={4}
        strokeLinecap="round"
      />
    </g>
    <Sparkle x={96} y={52} />
    <Sparkle x={318} y={190} s={0.8} />
  </>
);

const underwear: ReactNode = (
  <>
    <g transform="translate(200 120)">
      <path
        d="M-96 -58 L96 -58 L90 -26 Q46 -18 24 50 L-24 50 Q-46 -18 -90 -26 Z"
        fill={brand.apricot}
        {...line}
      />
      <path
        d="M-96 -58 L96 -58 L94 -44 L-94 -44 Z"
        fill={brand.orange}
        {...line}
      />
      {/* Absorbent gusset */}
      <path
        d="M-30 -8 Q0 -14 30 -8 L22 44 L-22 44 Z"
        fill={brand.sun}
        {...line}
        strokeWidth={2}
      />
      <path
        d="M-18 4 L18 4 M-16 18 L16 18 M-14 32 L14 32"
        {...line}
        strokeWidth={1.5}
        strokeDasharray="4 4"
      />
    </g>
    <Heart x={102} y={182} s={0.9} />
    <Sparkle x={310} y={186} s={0.9} />
    <Sparkle x={316} y={44} s={0.7} />
  </>
);

const liner: ReactNode = (
  <>
    <g transform="translate(200 104) rotate(-90)">
      <rect
        x="-24"
        y="-96"
        width="48"
        height="192"
        rx="24"
        fill={PAPER}
        {...line}
      />
      <path
        d="M0 -70 L0 70"
        {...line}
        strokeWidth={1.5}
        strokeDasharray="4 6"
      />
    </g>
    {/* A second liner, still in its wrapper */}
    <g transform="translate(206 176) rotate(-6)">
      <rect
        x="-70"
        y="-18"
        width="140"
        height="36"
        rx="10"
        fill={brand.redLight}
        {...line}
      />
      <path d="M-46 -18 L-46 18 M46 -18 L46 18" {...line} strokeWidth={2} />
    </g>
    <Drop x={316} y={64} s={0.7} />
    <Sparkle x={94} y={56} />
  </>
);

const scenes: Record<string, Scene> = {
  pads: { bg: backdrops.peach, art: pad },
  "reusable-pads": { bg: backdrops.honey, art: reusablePad },
  tampons: { bg: backdrops.mist, art: tampon },
  "menstrual-cup": { bg: backdrops.honey, art: cup },
  "menstrual-disc": { bg: backdrops.peach, art: disc },
  "period-underwear": { bg: backdrops.mist, art: underwear },
  "panty-liners": { bg: backdrops.honey, art: liner },
};

export function productScene(slug: string): Scene {
  return (
    scenes[slug] ?? { bg: backdrops.peach, art: <Drop x={200} y={120} s={3} /> }
  );
}

/** Decorative only; the product name carries the meaning. */
export function ProductArt({
  slug,
  fit = "cover",
  className = "",
}: {
  slug: string;
  fit?: "cover" | "contain";
  className?: string;
}) {
  const scene = productScene(slug);
  return (
    <svg
      viewBox="0 0 400 240"
      preserveAspectRatio={fit === "cover" ? "xMidYMid slice" : "xMidYMid meet"}
      className={`block h-full w-full ${className}`}
      style={{ background: scene.bg }}
      aria-hidden="true"
      focusable="false"
    >
      <rect width="400" height="240" fill={scene.bg} />
      {scene.art}
    </svg>
  );
}
