import { phaseForDay, phases } from "@/lib/cycle";

const DAYS = 28;
const CENTER = 180;
const RADIUS = 146;

type CycleRingProps = {
  activePhaseId?: string;
  className?: string;
};

/** Twenty-eight beads, one per day. Decorative: the same facts are always in the text beside it. */
export function CycleRing({ activePhaseId, className }: CycleRingProps) {
  const active = phases.find((phase) => phase.id === activePhaseId);

  return (
    <svg viewBox="0 0 360 360" className={className} aria-hidden="true">
      {Array.from({ length: DAYS }, (_, index) => {
        const day = index + 1;
        const phase = phaseForDay(day);
        const angle = (index / DAYS) * 2 * Math.PI - Math.PI / 2;
        const dimmed = active && active.id !== phase.id;
        return (
          <circle
            key={day}
            cx={(CENTER + RADIUS * Math.cos(angle)).toFixed(2)}
            cy={(CENTER + RADIUS * Math.sin(angle)).toFixed(2)}
            fill={phase.color}
            opacity={dimmed ? 0.22 : 1}
            className="transition-all duration-300"
            style={{ r: active?.id === phase.id ? 15 : 12 }}
          />
        );
      })}
      <text
        x={CENTER}
        y={active ? CENTER - 6 : CENTER - 8}
        textAnchor="middle"
        className="fill-foreground font-display text-[30px] font-semibold"
      >
        {active ? active.name : "28 days"}
      </text>
      <text
        x={CENTER}
        y={CENTER + 24}
        textAnchor="middle"
        className="fill-muted font-sans text-[17px] font-bold"
      >
        {active ? active.days : "give or take"}
      </text>
    </svg>
  );
}
