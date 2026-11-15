"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

/** The search text, kept in `?q=` so the back button and shared links return to it. */
export function useUrlQuery() {
  const initialQuery = useSearchParams().get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);

  function updateQuery(next: string) {
    setQuery(next);
    const url = next ? `?q=${encodeURIComponent(next)}` : location.pathname;
    window.history.replaceState(null, "", url);
  }

  return [query, updateQuery] as const;
}

type SearchFieldProps = {
  id: string;
  label: string;
  placeholder: string;
  query: string;
  /** Missing while the URL is still unread, which keeps the field disabled. */
  onQueryChange?: (query: string) => void;
  autoFocus?: boolean;
  large?: boolean;
};

export function SearchField({
  id,
  label,
  placeholder,
  query,
  onQueryChange,
  autoFocus,
  large,
}: SearchFieldProps) {
  return (
    <form
      role="search"
      className="mt-6 max-w-xl"
      onSubmit={(event) => event.preventDefault()}
    >
      <label htmlFor={id} className="font-extrabold">
        {label}
      </label>
      <div className="relative mt-1">
        <svg
          viewBox="0 0 24 24"
          className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M16.5 16.5L21 21" />
        </svg>
        <input
          id={id}
          type="search"
          value={query}
          disabled={!onQueryChange}
          onChange={(event) => onQueryChange?.(event.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          autoFocus={autoFocus}
          className={`block w-full rounded-full border-2 border-muted bg-surface pr-14 pl-11 transition-colors duration-200 placeholder:text-muted hover:border-primary-strong [&::-webkit-search-cancel-button]:hidden ${
            large ? "min-h-14 text-lg" : "min-h-12"
          }`}
        />
        {query && (
          <button
            type="button"
            onClick={() => onQueryChange?.("")}
            className="absolute top-1/2 right-1 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 hover:bg-peach"
          >
            <span className="sr-only">Clear search</span>
            <svg
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        )}
      </div>
    </form>
  );
}
