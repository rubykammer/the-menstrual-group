import type { TopicSlug } from "@/lib/site";
import { postScene } from "./illustrations/scenes";

/**
 * A hand-drawn scene for each article (see components/illustrations).
 * Decorative only; the post title carries the meaning.
 */
export function PostArt({
  slug,
  fit = "cover",
  className = "",
}: {
  slug: string;
  /** Kept for callers; every post now has its own scene */
  topic?: TopicSlug;
  /** "cover" crops to fill (cards); "contain" shows it all on its backdrop (wide banners) */
  fit?: "cover" | "contain";
  className?: string;
}) {
  const scene = postScene(slug);
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
