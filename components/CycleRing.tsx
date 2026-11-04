"use client";

import { useState, type PointerEvent } from "react";
import { phaseForDay } from "@/lib/cycle";

const DAYS = 28;
const CENTER = 180;
const RADIUS = 146;

type CycleRingProps = {
  className?: string;
};

/**
 * Twenty-eight beads, one per day. Hover a bead, or tap it on a touchscreen, to
 * see its day and phase. Decorative: the same facts are always in the phase tabs.
 */
export function CycleRing({ className }: CycleRingProps) {
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const shown = hoveredDay ? phaseForDay(hoveredDay) : undefined;

  // A finger lifting also fires pointerleave, which would undo the tap.
  function ignoreTouch(handler: () => void) {
    return (event: PointerEvent) => {
      if (event.pointerType !== "touch") handler();
    };
  }

  return (
    <svg viewBox="0 0 360 360" className={className} aria-hidden="true">
      <g onPointerLeave={ignoreTouch(() => setHoveredDay(null))}>
        {Array.from({ length: DAYS }, (_, index) => {
          const day = index + 1;
          const phase = phaseForDay(day);
          const angle = (index / DAYS) * 2 * Math.PI - Math.PI / 2;
          const cx = (CENTER + RADIUS * Math.cos(angle)).toFixed(2);
          const cy = (CENTER + RADIUS * Math.sin(angle)).toFixed(2);
          const dimmed = shown && shown.id !== phase.id;
          const beadRadius =
            day === hoveredDay ? 18 : shown?.id === phase.id ? 15 : 12;
          return (
            <g key={day}>
              <circle
                cx={cx}
                cy={cy}
                fill={phase.color}
                opacity={dimmed ? 0.22 : 1}
                className="transition-all duration-300"
                style={{ r: beadRadius }}
              />
              {/* Wider than the bead so the gaps don't flicker on the way past */}
              <circle
                cx={cx}
                cy={cy}
                r={19}
                fill="transparent"
                onPointerEnter={ignoreTouch(() => setHoveredDay(day))}
                onClick={() => setHoveredDay(day)}
              />
            </g>
          );
        })}
      </g>
      <text
        x={CENTER}
        y={shown ? CENTER - 6 : CENTER - 8}
        textAnchor="middle"
        className="fill-foreground font-display text-[30px] font-semibold"
      >
        {shown ? shown.name : "28 days"}
      </text>
      <text
        x={CENTER}
        y={CENTER + 24}
        textAnchor="middle"
        className="fill-muted font-sans text-[17px] font-bold"
      >
        {hoveredDay ? `Day ${hoveredDay}` : "give or take"}
      </text>
    </svg>
  );
}
