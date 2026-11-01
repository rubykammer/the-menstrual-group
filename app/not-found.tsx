import type { Metadata } from "next";
import Form from "next/form";
import Link from "next/link";
import { pillClass } from "@/components/BlogListing";
import { HeroRing } from "@/components/HeroRing";
import { topics } from "@/lib/site";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <div className="page-width py-12 text-center sm:py-16">
      <div className="relative mx-auto size-60 sm:size-72">
        <HeroRing missingDay={4} className="size-full" />
        <p className="absolute inset-0 flex items-center justify-center font-display text-7xl font-light tracking-tight sm:text-8xl">
          404
        </p>
      </div>

      <h1 className="mt-8 text-5xl sm:text-7xl">We can&apos;t find that page</h1>
      <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
        Cycles don&apos;t always run to plan, and neither do links. This one may
        have moved, or it might be off by a character or two.
      </p>

      <Form action="/blog" role="search" className="mx-auto mt-8 max-w-xl">
        <label htmlFor="not-found-search" className="font-extrabold">
          Search articles
        </label>
        <div className="relative mt-1">
          <input
            id="not-found-search"
            type="search"
            name="q"
            placeholder="Try cramps, PMS or partners"
            autoComplete="off"
            className="block min-h-12 w-full rounded-full border border-muted bg-surface pr-26 pl-5 transition-colors duration-200 placeholder:text-muted hover:border-primary-strong [&::-webkit-search-cancel-button]:hidden"
          />
          <button
            type="submit"
            className="absolute top-1/2 right-1 min-h-10 -translate-y-1/2 cursor-pointer rounded-full bg-foreground px-5 font-extrabold text-background transition-colors duration-200 hover:bg-primary-strong"
          >
            Search
          </button>
        </div>
      </Form>

      <nav aria-labelledby="not-found-topics" className="mt-8">
        <h2
          id="not-found-topics"
          className="font-sans text-base font-extrabold tracking-normal"
        >
          Or browse a topic
        </h2>
        <ul className="mt-3 flex flex-wrap justify-center gap-2">
          {topics.map((topic) => (
            <li key={topic.slug}>
              <Link href={`/blog/topic/${topic.slug}`} className={pillClass}>
                {topic.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <Link
        href="/"
        className="mt-8 inline-block font-extrabold underline underline-offset-4 transition-colors duration-200 hover:text-primary-strong"
      >
        Back to the home page
      </Link>
    </div>
  );
}
