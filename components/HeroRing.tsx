import { phaseForDay } from "@/lib/cycle";

const DAYS = 28;
const CENTER = 180;
const RADIUS = 160;

/**
 * The cycle ring at poster size, drawn behind the home page headline.
 * The 404 page passes `missingDay` to leave a gap in it.
 */
export function HeroRing({
  className,
  missingDay,
}: {
  className?: string;
  missingDay?: number;
}) {
  return (
    <svg viewBox="0 0 360 360" className={className} aria-hidden="true">
      {Array.from({ length: DAYS }, (_, index) => {
        const phase = phaseForDay(index + 1);
        const angle = (index / DAYS) * 2 * Math.PI - Math.PI / 2;
        const missing = index + 1 === missingDay;
        return (
          <circle
            key={index}
            cx={(CENTER + RADIUS * Math.cos(angle)).toFixed(2)}
            cy={(CENTER + RADIUS * Math.sin(angle)).toFixed(2)}
            r={missing ? 8 : 9}
            fill={missing ? "none" : phase.color}
            stroke={missing ? "var(--color-primary)" : undefined}
            strokeWidth={missing ? 2 : undefined}
            strokeDasharray={missing ? "3 3.3" : undefined}
          />
        );
      })}
    </svg>
  );
}
