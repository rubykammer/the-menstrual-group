"use client";

import { useEffect, useRef, useState } from "react";
import { myths } from "@/lib/myths";

// One row on wide screens. The rest are still in the page, just hidden,
// so search engines and "find in page" see them all.
const SHOWN_AT_FIRST = 3;

export function MythList() {
  const [expanded, setExpanded] = useState(false);
  const firstHidden = useRef<HTMLLIElement>(null);
  const more = myths.length - SHOWN_AT_FIRST;

  // Hand focus to the first new card so keyboard users carry on from there
  useEffect(() => {
    if (expanded) firstHidden.current?.focus({ preventScroll: true });
  }, [expanded]);

  return (
    <>
      <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {myths.map(({ myth, fact, source }, index) => (
          <li
            key={myth}
            ref={index === SHOWN_AT_FIRST ? firstHidden : undefined}
            tabIndex={index === SHOWN_AT_FIRST ? -1 : undefined}
            hidden={!expanded && index >= SHOWN_AT_FIRST ? true : undefined}
            className="reveal flex flex-col rounded-card bg-surface p-6 shadow-soft outline-none transition-all duration-300 hover:shadow-lg motion-safe:hover:-translate-y-1"
          >
            <p className="self-start rounded-full bg-mist px-3 py-0.5 text-sm font-extrabold tracking-wide text-accent-strong uppercase">
              Myth
            </p>
            <h3 className="mt-3 text-xl sm:text-2xl">{myth}</h3>
            <p className="mt-4 border-t border-line pt-4">
              <strong className="font-extrabold text-primary-strong">
                The truth:
              </strong>{" "}
              {fact}
            </p>
            <p className="mt-auto pt-4 text-sm">
              <a
                href={source.url}
                rel="noopener noreferrer"
                className="text-muted underline underline-offset-2 transition-colors duration-200 hover:text-primary-strong"
              >
                <span className="sr-only">Source: </span>
                {source.label}
              </a>
            </p>
          </li>
        ))}
      </ul>
      {!expanded && more > 0 && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="inline-flex min-h-11 cursor-pointer items-center rounded-full border-2 border-primary-strong px-6 font-extrabold text-primary-strong transition-colors duration-200 hover:bg-primary-strong hover:text-on-primary"
          >
            Show {more} more myths
          </button>
        </div>
      )}
    </>
  );
}
