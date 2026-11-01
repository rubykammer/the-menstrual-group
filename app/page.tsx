import Link from "next/link";
import { ButtonLink } from "@/components/ButtonLink";
import { CycleExplorer } from "@/components/CycleExplorer";
import { HeroRing } from "@/components/HeroRing";
import { MythList } from "@/components/MythList";
import { PostCard } from "@/components/PostCard";
import { getAllPosts } from "@/lib/posts";

const sources = [
  "World Health Organization",
  "NHS",
  "American College of Obstetricians and Gynecologists",
  "US Office on Women's Health",
];

const doors = [
  {
    title: "I have a cycle",
    body: "Understand what your body is doing, feel better on the harder days, and know when it's time to ask for help.",
    href: "/blog/topic/cycle-basics",
    cta: "Start with the basics",
    tint: "bg-sage",
  },
  {
    title: "I love someone who does",
    body: "Learn what's going on, what to say, and the small things that make a real difference to a partner, daughter or friend.",
    href: "/partners",
    cta: "Read the partner guide",
    tint: "bg-sky",
  },
];

export default function Home() {
  return (
    <>
      <section className="relative -mt-[4.25rem] flex min-h-[min(100svh,56rem)] items-center justify-center overflow-hidden bg-primary-strong px-6 py-32 text-center text-background">
        <HeroRing className="absolute top-1/2 left-1/2 w-[max(46rem,128vw)] max-w-[66rem] -translate-x-1/2 -translate-y-1/2" />
        <div className="relative max-w-3xl">
          <h1 className="text-5xl sm:text-7xl lg:text-8xl">
            Periods are <span className="text-rose">everyone&rsquo;s</span>{" "}
            conversation.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg sm:text-xl">
            Warm, honest guidance on menstrual cycles, for the people who have
            them and for the partners, dads and friends who want to show up
            well.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/blog" variant="rose">
              Read the blog
            </ButtonLink>
            <ButtonLink href="/partners" variant="light">
              How to be a good partner
            </ButtonLink>
          </div>
        </div>
      </section>

      <section aria-labelledby="sources-heading" className="page-width py-10">
        <h2
          id="sources-heading"
          className="text-center font-sans text-sm font-semibold tracking-normal text-muted"
        >
          Based on published guidance from
        </h2>
        <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-10 gap-y-2 text-center font-display text-lg">
          {sources.map((source) => (
            <li key={source}>{source}</li>
          ))}
        </ul>
      </section>

      <section className="page-width">
        <div className="rounded-card bg-rose px-6 py-16 text-center sm:py-24">
          <p className="mx-auto max-w-3xl font-display text-4xl leading-tight font-light tracking-tight text-balance sm:text-6xl">
            Ask what helps. Do it without being asked twice.
          </p>
          <p className="mx-auto mt-5 max-w-xl text-lg">
            That&apos;s most of being a good partner, and the rest fits on a
            single page.
          </p>
          <ButtonLink href="/partners" className="mt-7">
            See the partner guide
          </ButtonLink>
        </div>
      </section>

      <section aria-labelledby="latest-heading" className="page-width mt-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="latest-heading" className="text-4xl sm:text-6xl">
            Latest from the blog
          </h2>
          <Link
            href="/blog"
            className="font-extrabold underline underline-offset-4 transition-colors duration-200 hover:text-primary-strong"
          >
            All articles
          </Link>
        </div>
        <div className="mt-10 grid gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {getAllPosts()
            .slice(0, 3)
            .map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
        </div>
      </section>

      <section
        id="myths"
        aria-labelledby="myths-heading"
        className="page-width mt-24 grid gap-10 lg:mt-32 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16"
      >
        <div className="self-start lg:sticky lg:top-24">
          <h2 id="myths-heading" className="text-4xl sm:text-6xl">
            Myths worth retiring
          </h2>
          <p className="mt-4 text-lg">
            Most of us picked these up somewhere along the way. Here&apos;s what
            the evidence actually says.
          </p>
        </div>
        <MythList />
      </section>

      <section
        id="the-cycle"
        aria-labelledby="cycle-heading"
        className="page-width mt-24"
      >
        <div className="rounded-card bg-stone p-5 sm:p-10 lg:p-14">
          <div className="max-w-2xl">
            <h2 id="cycle-heading" className="text-4xl sm:text-6xl">
              One month, four phases
            </h2>
            <p className="mt-4 text-lg">
              A cycle is much more than a period. Pick a phase to see what&apos;s
              happening, and how to work with it.
            </p>
          </div>
          <CycleExplorer />
        </div>
      </section>

      <section aria-labelledby="doors-heading" className="page-width mt-6">
        <h2 id="doors-heading" className="sr-only">
          Where would you like to start?
        </h2>
        <ul className="grid gap-6 md:grid-cols-2">
          {doors.map((door) => (
            <li
              key={door.title}
              className={`relative flex min-h-80 flex-col rounded-card p-8 sm:p-10 ${door.tint}`}
            >
              <h3 className="text-4xl font-light sm:text-5xl">{door.title}</h3>
              <p className="mt-4 max-w-md">{door.body}</p>
              <Link
                href={door.href}
                className="mt-auto self-start rounded-full bg-foreground px-5 py-2.5 font-extrabold text-background transition-colors duration-200 after:absolute after:inset-0 hover:bg-primary-strong"
              >
                {door.cta}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
