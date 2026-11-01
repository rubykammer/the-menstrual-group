import type { ReactNode } from "react";

export type SearchEntry = {
  slug: string;
  title: string;
  summary: string;
  body: string;
  card: ReactNode;
};

function normalize(text: string) {
  return text.toLowerCase().replace(/[’‘]/g, "'");
}

/** Keeps entries containing every word, title matches first, then newest first. */
export function searchEntries(entries: SearchEntry[], query: string) {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  if (words.length === 0) return entries;

  const scored = entries.map((entry) => {
    const title = normalize(entry.title);
    const summary = normalize(entry.summary);
    const body = normalize(entry.body);
    const found = words.every(
      (word) =>
        title.includes(word) || summary.includes(word) || body.includes(word),
    );
    const score = words.reduce(
      (total, word) =>
        total + (title.includes(word) ? 2 : summary.includes(word) ? 1 : 0),
      0,
    );
    return { entry, found, score };
  });

  return scored
    .filter(({ found }) => found)
    .sort((a, b) => b.score - a.score)
    .map(({ entry }) => entry);
}
