import type { TopicSlug } from "@/lib/site";

const palettes = [
  { bg: "#e7e4e1", a: "#5a7c97", b: "#aec8dd", c: "#edc462" },
  { bg: "#e5b8bb", a: "#a8686f", b: "#f1ecea", c: "#4a2a20" },
  { bg: "#4a2a20", a: "#e5b8bb", b: "#a8686f", c: "#edc462" },
];

type Palette = (typeof palettes)[number];

const hills = [
  {
    sun: { cx: 312, cy: 70, r: 34 },
    back: "M0 170c70-70 140-70 210-10s130 50 190-10v90H0z",
    front: "M0 210c80-40 150-30 220 0s120 20 180-20v50H0z",
  },
  {
    sun: { cx: 104, cy: 78, r: 46 },
    back: "M0 150c60 30 130 50 200 20s140-70 200-40v110H0z",
    front: "M0 196c70 24 150 14 220-16s130-20 180 10v50H0z",
  },
  {
    sun: { cx: 214, cy: 128, r: 62 },
    back: "M0 186c60-30 130-40 200-10s140 30 200-16v80H0z",
    front: "M0 216c80 10 150-10 220-14s120 10 180-6v44H0z",
  },
];

const pairs = [
  { first: { cx: 160, cy: 120, r: 84 }, second: { cx: 240, cy: 120, r: 84 } },
  { first: { cx: 142, cy: 104, r: 66 }, second: { cx: 238, cy: 136, r: 92 } },
  { first: { cx: 150, cy: 140, r: 92 }, second: { cx: 252, cy: 96, r: 62 } },
];

const motifs: Record<
  TopicSlug,
  (p: Palette, variant: number) => React.ReactNode
> = {
  // Concentric arcs: the cycle turning
  "cycle-basics": (p) => (
    <g fill="none" strokeLinecap="round" strokeWidth="26">
      <path d="M60 240a140 140 0 0 1 280 0" stroke={p.a} />
      <path d="M112 240a88 88 0 0 1 176 0" stroke={p.b} />
      <path d="M164 240a36 36 0 0 1 72 0" stroke={p.c} />
    </g>
  ),
  // Soft hills: the rise and fall of how the body feels
  health: (p, variant) => (
    <>
      <circle {...hills[variant].sun} fill={p.c} />
      <path d={hills[variant].back} fill={p.b} />
      <path d={hills[variant].front} fill={p.a} />
    </>
  ),
  // Pebbles: small, ordinary, everyday things
  "everyday-life": (p) => (
    <>
      <ellipse cx="110" cy="150" rx="70" ry="52" fill={p.a} />
      <ellipse cx="235" cy="104" rx="60" ry="46" fill={p.b} />
      <ellipse cx="300" cy="182" rx="50" ry="38" fill={p.c} />
    </>
  ),
  // Two overlapping circles: two people, side by side
  "for-partners": (p, variant) => (
    <>
      <circle {...pairs[variant].first} fill={p.a} />
      <circle
        {...pairs[variant].second}
        fill={p.b}
        style={{ mixBlendMode: "multiply" }}
      />
    </>
  ),
};

function hash(text: string) {
  return [...text].reduce(
    (total, char) => (total * 31 + char.charCodeAt(0)) >>> 0,
    7,
  );
}

export function PostArt({
  slug,
  topic,
  className = "",
}: {
  slug: string;
  topic: TopicSlug;
  className?: string;
}) {
  const seed = hash(slug);
  const palette = palettes[seed % palettes.length];
  const mirrored = (seed >>> 3) % 2 === 1;
  const variant = (seed >>> 8) % hills.length;
  return (
    <svg
      viewBox="0 0 400 240"
      preserveAspectRatio="xMidYMid slice"
      className={`block h-full w-full ${className}`}
      aria-hidden="true"
    >
      <rect width="400" height="240" fill={palette.bg} />
      <g transform={mirrored ? "matrix(-1 0 0 1 400 0)" : undefined}>
        {motifs[topic](palette, variant)}
      </g>
    </svg>
  );
}
