"use client";

import { Suspense } from "react";
import { searchEntries, type SearchEntry } from "@/lib/search";
import { SearchField, useUrlQuery } from "./SearchField";

const suggestions = ["cramps", "PMS", "endometriosis", "tampons", "what to say"];

/** The page is prerendered, so it shows the suggestions until the URL can be read. */
export function SiteSearch({ entries }: { entries: SearchEntry[] }) {
  return (
    <Suspense fallback={<SearchView entries={entries} query="" />}>
      <LiveSearch entries={entries} />
    </Suspense>
  );
}

function LiveSearch({ entries }: { entries: SearchEntry[] }) {
  const [query, setQuery] = useUrlQuery();
  return <SearchView entries={entries} query={query} onQueryChange={setQuery} />;
}

function SearchView({
  entries,
  query,
  onQueryChange,
}: {
  entries: SearchEntry[];
  query: string;
  onQueryChange?: (query: string) => void;
}) {
  const searching = query.trim() !== "";
  const results = searching ? searchEntries(entries, query) : [];

  return (
    <>
      <SearchField
        id="site-search"
        label="Search the whole site"
        placeholder="Articles, guides and quizzes"
        query={query}
        onQueryChange={onQueryChange}
        autoFocus
        large
      />

      <p role="status" className="mt-4 font-bold text-muted empty:hidden">
        {searching &&
          `${results.length} ${results.length === 1 ? "result" : "results"} found`}
      </p>

      {!searching && (
        <div className="mt-6">
          <p className="font-bold text-muted">Popular searches</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {suggestions.map((word) => (
              <li key={word}>
                <button
                  type="button"
                  disabled={!onQueryChange}
                  onClick={() => onQueryChange?.(word)}
                  className="cursor-pointer rounded-full border-2 border-line bg-surface px-4 py-2 font-bold transition-colors duration-200 hover:border-primary"
                >
                  {word}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {searching &&
        (results.length > 0 ? (
          <ul
            aria-label="Search results"
            className="mt-6 max-w-3xl divide-y divide-line overflow-hidden rounded-card bg-surface shadow-soft"
          >
            {results.map((entry) => (
              <li key={entry.slug}>{entry.card}</li>
            ))}
          </ul>
        ) : (
          <div className="mt-6 max-w-3xl rounded-card bg-surface p-8 shadow-soft">
            <h2 className="text-2xl">Nothing found for that search</h2>
            <p className="mt-2 text-muted">
              Try a shorter or different word, or one of the popular searches.
            </p>
          </div>
        ))}
    </>
  );
}
