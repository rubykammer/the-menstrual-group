/**
 * One hand-drawn scene per article, plus the homepage "doors". All scenes are
 * drawn on a 400 x 240 canvas; cards crop the edges, so the important parts
 * stay roughly between x 60 and 340.
 */

import type { ReactNode } from "react";
import {
  Arm,
  backdrops,
  brand,
  Bubble,
  Bust,
  type BustProps,
  Heart,
  INK,
  line,
  Mug,
  PAPER,
  Sparkle,
  Steam,
  type Eyes,
  type Hair,
  type Mouth,
  type Top,
} from "./kit";

export type Scene = { bg: string; art: ReactNode };

function Question({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M-7 -6 Q-7 -15 0 -15 Q8 -15 8 -8 Q8 -2 0 2 L0 6" fill="none" {...line} strokeWidth={3.5} />
      <circle cx="0" cy="13" r="2.5" fill={INK} />
    </g>
  );
}

function Calendar() {
  const period = new Set(["0,0", "1,0", "2,0", "3,0", "4,0"]);
  return (
    <g transform="rotate(4 288 115)">
      <rect x="225" y="40" width="126" height="152" rx="10" fill={PAPER} {...line} />
      <path d="M235 40 H341 Q351 40 351 50 V68 H225 V50 Q225 40 235 40 Z" fill={brand.orange} {...line} />
      <rect x="252" y="30" width="8" height="20" rx="4" fill={INK} />
      <rect x="316" y="30" width="8" height="20" rx="4" fill={INK} />
      {[0, 1, 2, 3, 4].flatMap((col) =>
        [0, 1, 2, 3].map((row) => {
          const key = `${col},${row}`;
          return (
            <circle
              key={key}
              cx={244 + col * 22}
              cy={90 + row * 26}
              r="6.5"
              fill={period.has(key) ? brand.pink : key === "3,2" ? brand.sun : PAPER}
              {...line}
              strokeWidth={2.5}
            />
          );
        }),
      )}
      <circle cx={244 + 3 * 22} cy={90 + 2 * 26} r="13" fill="none" {...line} strokeWidth={2.5} />
    </g>
  );
}

const posts: Record<string, Scene> = {
  "menstrual-cycle-explained": {
    bg: backdrops.honey,
    art: (
      <>
        <Calendar />
        <Bust x={128} y={130} s={1.1} hair="puffs" top="stripes" eyes="side" mouth="grin">
          <Arm d="M50 150 Q56 70 92 4" hand={[94, 0]} color={PAPER} />
          <path d="M94 -8 L98 -24" {...line} strokeWidth={6} />
        </Bust>
        <Sparkle x={60} y={52} />
      </>
    ),
  },

  "guide-to-period-products": {
    bg: backdrops.peach,
    art: (
      <>
        {/* Pad */}
        <g transform="translate(78 112) rotate(-18)">
          <path d="M-34 -12 Q-22 -20 -22 -6 L-22 6 Q-22 20 -34 12 Z M34 -12 Q22 -20 22 -6 L22 6 Q22 20 34 12 Z" fill={PAPER} {...line} />
          <rect x="-23" y="-52" width="46" height="104" rx="23" fill={PAPER} {...line} />
          <rect x="-12" y="-36" width="24" height="72" rx="12" fill="none" {...line} strokeWidth={2} strokeDasharray="5 5" />
        </g>
        {/* Tampon */}
        <g transform="translate(318 62) rotate(28)">
          <rect x="-9" y="-28" width="18" height="48" rx="9" fill={PAPER} {...line} />
          <path d="M-9 -8 L9 -8 M-9 2 L9 2" {...line} strokeWidth={2} />
          <path d="M0 20 Q-6 32 2 40 Q8 48 0 56" fill="none" stroke={brand.pink} strokeWidth={3} strokeLinecap="round" />
        </g>
        {/* Cup */}
        <g transform="translate(330 170) rotate(-12)">
          <path d="M-24 -26 Q-24 18 0 24 Q24 18 24 -26 Z" fill={brand.pink} {...line} />
          <ellipse cx="0" cy="-26" rx="24" ry="6" fill={brand.rose} {...line} />
          <path d="M0 24 L0 42" {...line} strokeWidth={5} />
        </g>
        <Bust x={200} y={132} s={1.1} hair="bob" top="tee-ink" eyes="wide" mouth="open" brows="raised" />
        <Sparkle x={140} y={42} s={0.9} />
        <Sparkle x={268} y={128} s={0.7} />
      </>
    ),
  },

  "cramps-what-actually-helps": {
    bg: backdrops.blush,
    art: (
      <>
        <Bust x={200} y={94} s={1.1} hair="long" top="hoodie" eyes="closed" mouth="smile">
          {/* Hot water bottle, hugged close */}
          <g transform="translate(0 98) scale(0.85)">
            <rect x="-14" y="-52" width="28" height="18" rx="3" fill={brand.orange} {...line} />
            <rect x="-18" y="-62" width="36" height="12" rx="3" fill={INK} />
            <rect x="-36" y="-38" width="72" height="76" rx="20" fill={brand.orange} {...line} />
            {[-18, -2, 14].map((y) => (
              <path key={y} d={`M-26 ${y} q6.5 -6 13 0 t13 0 t13 0 t13 0`} fill="none" stroke={PAPER} strokeWidth={3} strokeLinecap="round" />
            ))}
          </g>
          <Arm d="M-58 160 Q-62 114 -32 98" hand={[-30, 96]} />
          <Arm d="M58 160 Q62 114 32 98" hand={[30, 96]} />
        </Bust>
        <path d="M108 150 q8 -8 0 -16 q-8 -8 0 -16 M292 150 q8 -8 0 -16 q-8 -8 0 -16" fill="none" stroke={brand.orange} strokeWidth={3.5} strokeLinecap="round" />
        <Heart x={300} y={66} s={0.8} />
        <Sparkle x={104} y={70} />
      </>
    ),
  },

  "pms-or-pmdd": {
    bg: backdrops.honey,
    art: (
      <>
        {/* Sun peeking out behind a rain cloud: good days and hard days */}
        <g transform="translate(300 74)">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <path key={a} transform={`rotate(${a} 26 -24)`} d="M26 -54 L26 -46" {...line} />
          ))}
          <circle cx="26" cy="-24" r="18" fill={brand.sun} {...line} />
          <path
            d="M-40 12 Q-54 12 -52 -2 Q-50 -16 -34 -14 Q-30 -32 -10 -28 Q4 -42 20 -28 Q40 -32 42 -12 Q56 -8 50 8 Q46 16 34 14 Z"
            fill={PAPER}
            {...line}
          />
          <path d="M-26 26 l-4 10 M-6 26 l-4 10 M14 26 l-4 10 M34 26 l-4 10" {...line} />
        </g>
        <circle cx="222" cy="112" r="5" fill={PAPER} {...line} />
        <circle cx="240" cy="98" r="7" fill={PAPER} {...line} />
        <Bust x={146} y={136} s={1.05} hair="afro" top="sweater" color={brand.pink} brows="worried" mouth="worried" />
      </>
    ),
  },

  "luteal-rage-is-real": {
    bg: backdrops.blush,
    art: (
      <>
        {/* Hormones rising, then dropping before a period: where the anger flares */}
        <g transform="translate(222 96)">
          <path d="M0 64 L130 64" {...line} strokeWidth={2.5} />
          <path d="M0 52 Q30 50 50 20 Q72 -10 96 18 Q112 40 128 58" fill="none" {...line} strokeWidth={4} />
          <path d="M96 18 Q112 40 128 58" fill="none" stroke={brand.pink} strokeWidth={6} strokeLinecap="round" />
          {/* Lightning bolt at the drop */}
          <path d="M120 -6 L106 18 L118 18 L108 40 L132 10 L120 10 L128 -6 Z" fill={brand.sun} {...line} strokeWidth={2.5} />
        </g>
        {/* Angry scribble cloud */}
        <g transform="translate(150 34)">
          <path d="M-40 10 Q-52 -6 -34 -14 Q-28 -30 -8 -24 Q4 -36 20 -24 Q40 -28 40 -10 Q52 4 34 14 Q20 24 0 16 Q-20 24 -40 10 Z" fill={PAPER} {...line} />
          <path d="M-24 -2 q6 -12 12 0 q6 12 12 0 q6 -12 12 0 q6 12 12 0" fill="none" stroke={brand.orange} strokeWidth={3.5} strokeLinecap="round" />
        </g>
        <circle cx="132" cy="70" r="4" fill={PAPER} {...line} />
        <Bust x={126} y={140} s={1.05} hair="long" top="hoodie" eyes="dot" mouth="flat" brows="cross" />
        <Sparkle x={66} y={90} s={0.8} />
      </>
    ),
  },

  "endometriosis-guide": {
    bg: backdrops.peach,
    art: (
      <>
        <Bust x={132} y={128} s={1.05} hair="hijab" top="tee-paper" eyes="closed" mouth="flat" brows="worried">
          <Arm d="M56 160 Q46 104 8 82" hand={[6, 80]} />
        </Bust>
        <path d="M70 196 l8 -9 l7 9 l8 -9 l7 9" fill="none" stroke={brand.pink} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
        <Bust x={282} y={134} s={1} hair="short" beard glasses top="collar" eyes="dot">
          <Arm d="M-54 150 Q-80 70 -100 50" hand={[-100, 48]} />
        </Bust>
        <Heart x={206} y={58} />
        <Sparkle x={238} y={36} s={0.7} />
      </>
    ),
  },

  "whats-normal-when-to-see-a-doctor": {
    bg: backdrops.blush,
    art: (
      <>
        <Bubble x={168} y={26} w={60} h={50} tail="left">
          <Question x={198} y={51} />
        </Bubble>
        <Bust x={118} y={134} s={1.05} hair="quiff" top="vneck" eyes="side" mouth="talk" />
        <Bust x={282} y={124} s={1.08} hair="bun" glasses top="coat" flip>
          <path d="M-20 44 Q-26 84 -8 94 Q10 100 14 82" fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" />
          <circle cx="14" cy="80" r="7" fill={brand.orange} {...line} />
          {/* Clipboard */}
          <rect x="22" y="40" width="46" height="56" rx="4" fill={PAPER} {...line} />
          <rect x="36" y="34" width="18" height="10" rx="2" fill={INK} />
          <path d="M30 56 L60 56 M30 68 L60 68 M30 80 L50 80" {...line} strokeWidth={2} />
          <Arm d="M56 160 Q62 110 40 86" hand={[38, 84]} />
        </Bust>
      </>
    ),
  },

  "being-a-good-partner": {
    bg: backdrops.peach,
    art: (
      <>
        <Bust x={124} y={138} s={1.05} hair="curly" top="tee-ink" eyes="happy" mouth="grin" />
        <Bust x={278} y={130} s={1.08} hair="short" top="stripes" eyes="dot">
          <Mug x={-128} y={26} />
          <Arm d="M-50 100 Q-80 72 -100 52" hand={[-102, 50]} />
        </Bust>
        <Heart x={196} y={52} />
        <Heart x={226} y={34} s={0.6} fill={brand.apricot} />
      </>
    ),
  },

  "what-to-say-and-what-not-to": {
    bg: backdrops.honey,
    art: (
      <>
        <Bubble x={212} y={28} w={124} h={40} tail="left">
          {[248, 274, 300].map((cx) => (
            <circle key={cx} cx={cx} cy={48} r="5" fill={INK} />
          ))}
        </Bubble>
        <Bubble x={236} y={92} w={110} h={40} tail="right" fill={brand.pink}>
          <Heart x={291} y={115} s={0.8} fill={PAPER} />
        </Bubble>
        <Bubble x={212} y={156} w={124} h={40} tail="left">
          <path d="M228 170 L300 170 M228 182 L280 182" {...line} strokeWidth={2.5} />
        </Bubble>
        <Bust x={128} y={128} s={1.1} hair="beanie" color={brand.orange} top="tank" eyes="side">
          {/* Phone */}
          <rect x="16" y="32" width="30" height="50" rx="6" fill={INK} {...line} />
          <rect x="20" y="38" width="22" height="36" rx="2" fill={PAPER} />
          <Arm d="M52 160 Q62 110 32 82" hand={[30, 80]} />
        </Bust>
      </>
    ),
  },

  "talking-to-kids-about-periods": {
    bg: backdrops.blush,
    art: (
      <>
        <Bust x={138} y={126} s={1.1} hair="hat" color={brand.orange} mustache top="collar" eyes="dot">
          {/* Open book, shared */}
          <g transform="translate(78 62)">
            <path d="M-46 -2 L-46 34 Q-22 28 0 36 Q22 28 46 34 L46 -2" fill={brand.orange} {...line} />
            <path d="M0 0 Q-20 -8 -42 -4 L-42 28 Q-20 24 0 32 Z M0 0 Q20 -8 42 -4 L42 28 Q20 24 0 32 Z" fill={PAPER} {...line} />
            <path d="M-34 6 L-10 8 M-34 14 L-10 16 M10 8 L34 6 M10 16 L34 14" {...line} strokeWidth={1.5} />
          </g>
          <Arm d="M56 160 Q58 110 40 82" hand={[40, 80]} />
        </Bust>
        <Bust x={294} y={164} s={0.78} hair="bun" headband={brand.pink} top="tee-ink" eyes="wide" mouth="open" />
        <Bubble x={318} y={58} w={54} h={46} tail="left">
          <Question x={345} y={81} />
        </Bubble>
      </>
    ),
  },
};

/* Any post without a hand-made scene still gets its own character */

const hairs: Hair[] = ["short", "fringe", "long", "bun", "puffs", "curly", "bald", "bob", "quiff", "afro"];
const tops: Top[] = ["tee-ink", "tee-paper", "stripes", "vneck", "collar", "hoodie", "sweater", "tank"];
const eyeSet: Eyes[] = ["dot", "happy", "wink", "side"];
const mouths: Mouth[] = ["smile", "grin", "talk"];
const accents = [brand.orange, brand.pink, brand.amber];
const bgs = [backdrops.peach, backdrops.honey, backdrops.blush];

function hash(text: string) {
  let h = 2166136261;
  for (const ch of text) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return h >>> 0;
}

function generated(slug: string): Scene {
  const h = hash(slug);
  const pick = <T,>(list: T[], shift: number) => list[(h >>> shift) % list.length];
  const bust: BustProps = {
    x: 200,
    y: 132,
    s: 1.1,
    hair: pick(hairs, 0),
    top: pick(tops, 4),
    eyes: pick(eyeSet, 8),
    mouth: pick(mouths, 11),
    glasses: ((h >>> 14) & 3) === 0,
    color: pick(accents, 17),
  };
  return {
    bg: pick(bgs, 20),
    art: (
      <>
        <Heart x={290} y={70} fill={bust.color} />
        <Sparkle x={110} y={60} />
        <Steam x={300} y={120} />
        <Bust {...bust} />
      </>
    ),
  };
}

export function postScene(slug: string): Scene {
  return posts[slug] ?? generated(slug);
}

/* Homepage doors: transparent, drawn to sit on a tinted card */

export const doorScenes = {
  self: (
    <>
      <circle cx="292" cy="72" r="34" fill={brand.sun} {...line} />
      <Bust x={196} y={110} s={0.95} hair="fringe" top="sweater" color={brand.orange} eyes="happy" mouth="smile" wheelchair />
      <Sparkle x={110} y={56} />
      <Sparkle x={330} y={140} s={0.7} />
    </>
  ),
  supporter: (
    <>
      <Bust x={154} y={124} s={1} hair="long" top="vneck" eyes="happy" mouth="grin" />
      <Bust x={252} y={120} s={1.02} hair="bald" glasses top="hoodie" eyes="happy" flip>
        <Arm d="M40 130 Q58 76 68 46" hand={[68, 44]} />
      </Bust>
      <Heart x={204} y={36} />
    </>
  ),
} satisfies Record<string, ReactNode>;
