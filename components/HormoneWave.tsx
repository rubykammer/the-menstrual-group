import { useState, type MouseEvent } from "react";
import { hormones, hormoneTrend, phaseForDay, phases } from "@/lib/cycle";

const DAYS = 28;
const WIDTH = 380;
const TOP = 30;
const BOTTOM = 220;
const HEIGHT = BOTTOM + 40;
const DAY_TICKS = [1, 7, 14, 21, 28];

const dayX = (day: number) => ((day - 0.5) / DAYS) * WIDTH;
const levelY = (level: number) => BOTTOM - (level / 100) * (BOTTOM - TOP);

function linePath(level: (day: number) => number) {
  const points = Array.from({ length: DAYS * 4 + 1 }, (_, index) => {
    const day = 0.5 + index / 4;
    return `${dayX(day).toFixed(1)} ${levelY(level(day)).toFixed(1)}`;
  });
  return `M${points.join("L")}`;
}

const lines = hormones.map((hormone) => ({
  ...hormone,
  path: linePath(hormone.level),
}));

const dashFor = (id: string) => (id === "progesterone" ? "7 5" : undefined);

type HormoneWaveProps = {
  activePhaseId: string;
  onPhaseSelect: (phaseId: string) => void;
};

/** Estrogen and progesterone across the month. Move along it to read each day. */
export function HormoneWave({ activePhaseId, onPhaseSelect }: HormoneWaveProps) {
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  function dayAt(event: MouseEvent<SVGSVGElement>) {
    const box = event.currentTarget.getBoundingClientRect();
    const day = Math.ceil(((event.clientX - box.left) / box.width) * DAYS);
    return Math.min(Math.max(day, 1), DAYS);
  }

  return (
    <figure className="rounded-card bg-surface p-4 shadow-soft sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="font-display text-xl font-semibold">Your hormones</p>
        <ul className="flex gap-4 text-sm font-bold text-muted">
          {hormones.map((hormone) => (
            <li key={hormone.id} className="flex items-center gap-1.5">
              <svg viewBox="0 0 20 4" className="h-1 w-5" aria-hidden="true">
                <line
                  x1="0"
                  y1="2"
                  x2="20"
                  y2="2"
                  stroke={hormone.color}
                  strokeWidth="4"
                  strokeDasharray={dashFor(hormone.id)}
                />
              </svg>
              {hormone.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="relative mt-3">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-label="Line chart of estrogen and progesterone across a 28-day cycle. Estrogen climbs to a peak just before ovulation, falls, then rises a little in the luteal phase. Progesterone stays low until after ovulation, peaks around day 21, then falls along with estrogen before the next period."
          className="w-full cursor-pointer touch-pan-y"
          onPointerMove={(event) => setHoveredDay(dayAt(event))}
          onPointerLeave={() => setHoveredDay(null)}
          onClick={(event) => onPhaseSelect(phaseForDay(dayAt(event)).id)}
        >
          {phases.map((phase) => {
            const left = ((phase.firstDay - 1) / DAYS) * WIDTH;
            const right = (phase.lastDay / DAYS) * WIDTH;
            const selected = phase.id === activePhaseId;
            return (
              <g key={phase.id}>
                <rect
                  x={left}
                  y={TOP - 30}
                  width={right - left}
                  height={BOTTOM - TOP + 30}
                  fill={phase.color}
                  opacity={selected ? 0.14 : 0}
                  className="transition-opacity duration-300"
                />
                <rect
                  x={left + 1}
                  y={BOTTOM + 5}
                  width={right - left - 2}
                  height={8}
                  rx={4}
                  fill={phase.color}
                  opacity={selected ? 1 : 0.4}
                  className="transition-opacity duration-300"
                />
              </g>
            );
          })}

          <line
            x1="0"
            y1={BOTTOM}
            x2={WIDTH}
            y2={BOTTOM}
            className="stroke-line"
            strokeWidth="1"
          />

          {lines.map((hormone) => (
            <path
              key={hormone.id}
              d={hormone.path}
              fill="none"
              stroke={hormone.color}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={dashFor(hormone.id)}
            />
          ))}

          {lines.map((hormone) => (
            <text
              key={hormone.id}
              x={dayX(hormone.peakDay)}
              y={levelY(hormone.level(hormone.peakDay)) - 9}
              textAnchor="middle"
              className="fill-foreground font-sans text-[16px] font-bold"
            >
              {hormone.name}
            </text>
          ))}

          {DAY_TICKS.map((day) => (
            <text
              key={day}
              x={dayX(day)}
              y={BOTTOM + 34}
              textAnchor={day === 1 ? "start" : day === DAYS ? "end" : "middle"}
              className="fill-muted font-sans text-[16px] font-semibold"
            >
              {day === 1 ? "Day 1" : day}
            </text>
          ))}

          {hoveredDay && (
            <g className="pointer-events-none">
              <line
                x1={dayX(hoveredDay)}
                y1="0"
                x2={dayX(hoveredDay)}
                y2={BOTTOM}
                className="stroke-foreground"
                strokeWidth="1"
              />
              {hormones.map((hormone) => (
                <circle
                  key={hormone.id}
                  cx={dayX(hoveredDay)}
                  cy={levelY(hormone.level(hoveredDay))}
                  r="6"
                  fill={hormone.color}
                  className="stroke-surface"
                  strokeWidth="2"
                />
              ))}
            </g>
          )}
        </svg>

        {hoveredDay && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 w-48 rounded-2xl bg-foreground px-3 py-2 text-sm text-background shadow-soft"
            style={{
              left: `clamp(0px, calc(${(dayX(hoveredDay) / WIDTH) * 100}% ${
                hoveredDay <= DAYS / 2 ? "+ 0.75rem" : "- 12.75rem"
              }), calc(100% - 12rem))`,
            }}
          >
            <p className="font-extrabold">
              Day {hoveredDay}, {phaseForDay(hoveredDay).name}
            </p>
            {hormones.map((hormone) => (
              <p key={hormone.id}>
                {hormone.name}{" "}
                <span className="font-extrabold">
                  {hormoneTrend(hormone, hoveredDay)}
                </span>
              </p>
            ))}
          </div>
        )}
      </div>

      <figcaption className="mt-2 text-sm text-muted">
        A simplified picture, not real measurements. Each hormone is drawn
        against its own peak.
      </figcaption>
    </figure>
  );
}
