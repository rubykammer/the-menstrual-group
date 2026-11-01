import { phaseForDay } from "@/lib/cycle";

const DAYS = 28;
const CENTER = 180;
const RADIUS = 160;

/** The cycle ring at poster size, drawn behind the home page headline. */
export function HeroRing({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 360 360" className={className} aria-hidden="true">
      {Array.from({ length: DAYS }, (_, index) => {
        const phase = phaseForDay(index + 1);
        const angle = (index / DAYS) * 2 * Math.PI - Math.PI / 2;
        return (
          <circle
            key={index}
            cx={(CENTER + RADIUS * Math.cos(angle)).toFixed(2)}
            cy={(CENTER + RADIUS * Math.sin(angle)).toFixed(2)}
            r={9}
            fill={phase.color}
          />
        );
      })}
    </svg>
  );
}
