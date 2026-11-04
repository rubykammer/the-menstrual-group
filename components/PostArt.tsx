import type { TopicSlug } from "@/lib/site";

const palettes = [
  { bg: "#ffedd5", a: "#ea580c", b: "#fb923c", c: "#ec4899" },
  { bg: "#fce7f3", a: "#ec4899", b: "#f9a8d4", c: "#ea580c" },
  { bg: "#fef3c7", a: "#d97706", b: "#fbbf24", c: "#ea580c" },
];

type Palette = (typeof palettes)[number];

const motifs: Record<TopicSlug, (p: Palette) => React.ReactNode> = {
  // Concentric arcs: the cycle turning
  "cycle-basics": (p) => (
    <g fill="none" strokeLinecap="round" strokeWidth="26">
      <path d="M60 240a140 140 0 0 1 280 0" stroke={p.a} />
      <path d="M112 240a88 88 0 0 1 176 0" stroke={p.b} />
      <path d="M164 240a36 36 0 0 1 72 0" stroke={p.c} />
    </g>
  ),
  // Soft hills: the rise and fall of how the body feels
  health: (p) => (
    <>
      <circle cx="312" cy="70" r="34" fill={p.c} />
      <path d="M0 170c70-70 140-70 210-10s130 50 190-10v90H0z" fill={p.b} />
      <path d="M0 210c80-40 150-30 220 0s120 20 180-20v50H0z" fill={p.a} />
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
  "for-partners": (p) => (
    <>
      <circle cx="160" cy="120" r="84" fill={p.a} />
      <circle cx="240" cy="120" r="84" fill={p.b} style={{ mixBlendMode: "multiply" }} />
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
  const mirrored = (seed >> 3) % 2 === 1;
  return (
    <svg
      viewBox="0 0 400 240"
      preserveAspectRatio="xMidYMid slice"
      className={`block h-full w-full ${className}`}
      aria-hidden="true"
    >
      <rect width="400" height="240" fill={palette.bg} />
      <g transform={mirrored ? "matrix(-1 0 0 1 400 0)" : undefined}>
        {motifs[topic](palette)}
      </g>
    </svg>
  );
}
