"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { searchEntries, type SearchEntry } from "@/lib/search";

type ArticleSearchProps = {
  entries: SearchEntry[];
  label: string;
};

/** The page is prerendered, so every article is there until the URL can be read. */
export function ArticleSearch(props: ArticleSearchProps) {
  return (
    <Suspense fallback={<SearchView {...props} query="" />}>
      <LiveSearch {...props} />
    </Suspense>
  );
}

function LiveSearch(props: ArticleSearchProps) {
  const initialQuery = useSearchParams().get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);

  // Keeps the search in the URL, so the back button and shared links return to it
  function updateQuery(next: string) {
    setQuery(next);
    const url = next ? `?q=${encodeURIComponent(next)}` : location.pathname;
    window.history.replaceState(null, "", url);
  }

  return <SearchView {...props} query={query} onQueryChange={updateQuery} />;
}

function SearchView({
  entries,
  label,
  query,
  onQueryChange,
}: ArticleSearchProps & {
  query: string;
  onQueryChange?: (query: string) => void;
}) {
  const results = searchEntries(entries, query);
  const searching = query.trim() !== "";

  return (
    <>
      <form
        role="search"
        className="mt-6 max-w-xl"
        onSubmit={(event) => event.preventDefault()}
      >
        <label htmlFor="article-search" className="font-extrabold">
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
            id="article-search"
            type="search"
            value={query}
            disabled={!onQueryChange}
            onChange={(event) => onQueryChange?.(event.target.value)}
            placeholder="Try cramps, PMS or partners"
            autoComplete="off"
            className="block min-h-12 w-full rounded-full border-2 border-muted bg-surface pr-14 pl-11 transition-colors duration-200 placeholder:text-muted hover:border-primary-strong [&::-webkit-search-cancel-button]:hidden"
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

      <p role="status" className="mt-4 font-bold text-muted empty:hidden">
        {searching &&
          `${results.length} ${results.length === 1 ? "article" : "articles"} found`}
      </p>

      <section aria-label="Articles" className="mt-6">
        {results.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {results.map((entry) => (
              <div key={entry.slug} className="grid">
                {entry.card}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-card bg-surface p-8 shadow-soft">
            <h2 className="text-2xl">Nothing found for that search</h2>
            <p className="mt-2 text-muted">
              Try a shorter or different word, or browse the topics above.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
