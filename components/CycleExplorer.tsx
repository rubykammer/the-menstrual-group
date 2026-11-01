"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { phases } from "@/lib/cycle";
import { HormoneWave } from "./HormoneWave";

export function CycleExplorer() {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const active = phases[activeIndex];

  function selectTab(index: number) {
    setActiveIndex(index);
    tabs.current[index]?.focus();
  }

  function handleKeyDown(event: KeyboardEvent) {
    const last = phases.length - 1;
    const next: Record<string, number> = {
      ArrowRight: activeIndex === last ? 0 : activeIndex + 1,
      ArrowDown: activeIndex === last ? 0 : activeIndex + 1,
      ArrowLeft: activeIndex === 0 ? last : activeIndex - 1,
      ArrowUp: activeIndex === 0 ? last : activeIndex - 1,
      Home: 0,
      End: last,
    };
    if (event.key in next) {
      event.preventDefault();
      selectTab(next[event.key]);
    }
  }

  return (
    <div className="mt-10 grid items-start gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
      <HormoneWave
        activePhaseId={active.id}
        onPhaseSelect={(id) =>
          setActiveIndex(phases.findIndex((phase) => phase.id === id))
        }
      />

      <div>
        <div
          role="tablist"
          aria-label="Phases of the menstrual cycle"
          onKeyDown={handleKeyDown}
          className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4"
        >
          {phases.map((phase, index) => {
            const selected = index === activeIndex;
            return (
              <button
                key={phase.id}
                ref={(node) => {
                  tabs.current[index] = node;
                }}
                id={`tab-${phase.id}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`panel-${phase.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActiveIndex(index)}
                className="flex min-h-11 items-center justify-center gap-2 rounded-full border border-foreground/20 px-3 py-2 font-extrabold transition-colors duration-200 hover:border-foreground aria-selected:border-foreground aria-selected:bg-surface"
              >
                <span
                  className="size-3 shrink-0 rounded-full"
                  style={{ backgroundColor: phase.color }}
                  aria-hidden="true"
                />
                {phase.name}
              </button>
            );
          })}
        </div>

        <div
          id={`panel-${active.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${active.id}`}
          tabIndex={0}
          className="mt-5 rounded-card bg-surface p-6 shadow-soft sm:p-8"
        >
          <p className="text-sm font-extrabold text-primary-strong">
            {active.days}
          </p>
          <p className="mt-2 text-lg">{active.summary}</p>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-rose p-4">
              <dt className="font-extrabold">If it&apos;s your cycle</dt>
              <dd className="mt-1">{active.forYou}</dd>
            </div>
            <div className="rounded-2xl bg-sky p-4">
              <dt className="font-extrabold">If you&apos;re a partner</dt>
              <dd className="mt-1">{active.forPartners}</dd>
            </div>
          </dl>
        </div>

        <p className="mt-4 text-sm text-muted">
          These days are based on a textbook 28-day cycle. Yours may look
          different, and that&apos;s usually okay.
        </p>
      </div>
    </div>
  );
}
