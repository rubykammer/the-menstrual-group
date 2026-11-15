"use client";

import { Suspense } from "react";
import { searchEntries, type SearchEntry } from "@/lib/search";
import { SearchField, useUrlQuery } from "./SearchField";

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
  const [query, setQuery] = useUrlQuery();
  return <SearchView {...props} query={query} onQueryChange={setQuery} />;
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
      <SearchField
        id="article-search"
        label={label}
        placeholder="Try cramps, PMS or partners"
        query={query}
        onQueryChange={onQueryChange}
      />

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
