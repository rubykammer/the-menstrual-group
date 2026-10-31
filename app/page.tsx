import Link from "next/link";
import { ButtonLink } from "@/components/ButtonLink";
import { CycleExplorer } from "@/components/CycleExplorer";
import { CycleRing } from "@/components/CycleRing";
import { PostCard } from "@/components/PostCard";
import { getAllPosts } from "@/lib/posts";

const doors = [
  {
    title: "I have a cycle",
    body: "Understand what your body is doing, feel better on the harder days, and know when it's time to ask for help.",
    href: "/blog/topic/cycle-basics",
    cta: "Start with the basics",
    tint: "bg-honey",
  },
  {
    title: "I love someone who does",
    body: "Learn what's going on, what to say, and the small things that make a real difference to a partner, daughter or friend.",
    href: "/partners",
    cta: "Read the partner guide",
    tint: "bg-blush",
  },
];

export default function Home() {
  const [latest, ...rest] = getAllPosts();

  return (
    <>
      <section className="page-width grid items-center gap-10 pt-12 pb-16 sm:pt-16 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16 lg:pt-20 lg:pb-24">
        <div>
          <h1 className="text-[2.625rem] min-[375px]:text-5xl sm:text-6xl lg:text-7xl">
            Periods are <span className="text-primary">everyone&rsquo;s</span>{" "}
            conversation.
          </h1>
          <p className="mt-6 max-w-xl text-lg sm:text-xl">
            Warm, honest guidance on menstrual cycles, for the people who have
            them and for the partners, dads and friends who want to show up
            well.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/blog">Read the blog</ButtonLink>
            <ButtonLink href="/partners" variant="secondary">
              How to be a good partner
            </ButtonLink>
          </div>
        </div>
        <CycleRing className="mx-auto w-full max-w-xs sm:max-w-sm lg:max-w-none" />
      </section>

      <section aria-labelledby="doors-heading" className="page-width">
        <h2 id="doors-heading" className="sr-only">
          Where would you like to start?
        </h2>
        <ul className="grid gap-6 md:grid-cols-2">
          {doors.map((door) => (
            <li
              key={door.title}
              className={`group relative rounded-card p-8 transition-all duration-300 hover:shadow-soft motion-safe:hover:-translate-y-1 ${door.tint}`}
            >
              <h3 className="text-2xl sm:text-3xl">{door.title}</h3>
              <p className="mt-3">{door.body}</p>
              <Link
                href={door.href}
                className="mt-5 inline-block font-extrabold text-primary-strong underline-offset-4 group-hover:underline after:absolute after:inset-0"
              >
                {door.cta}
                <span aria-hidden="true"> →</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section
        id="the-cycle"
        aria-labelledby="cycle-heading"
        className="mt-20 bg-peach py-16 sm:py-20"
      >
        <div className="page-width">
          <div className="max-w-2xl">
            <h2 id="cycle-heading" className="text-3xl sm:text-4xl">
              One month, four phases
            </h2>
            <p className="mt-3 text-lg">
              A cycle is much more than a period. Pick a phase to see what&apos;s
              happening, and how to work with it.
            </p>
          </div>
          <CycleExplorer />
        </div>
      </section>

      <section aria-labelledby="latest-heading" className="page-width mt-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="latest-heading" className="text-3xl sm:text-4xl">
            Latest from the blog
          </h2>
          <Link
            href="/blog"
            className="font-extrabold text-primary-strong underline-offset-4 transition-colors duration-200 hover:text-accent-strong hover:underline"
          >
            All articles
            <span aria-hidden="true"> →</span>
          </Link>
        </div>
        <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <PostCard post={latest} featured />
          {rest.slice(0, 3).map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section className="page-width mt-20">
        <div className="rounded-card bg-foreground px-6 py-12 text-background sm:px-12 sm:py-16">
          <p className="max-w-3xl font-display text-3xl leading-tight font-semibold sm:text-4xl">
            Ask what helps. Do it without being asked twice.
          </p>
          <p className="mt-4 max-w-2xl text-lg">
            That&apos;s most of being a good partner, and the rest fits on a
            single page.
          </p>
          <Link
            href="/partners"
            className="mt-6 inline-block font-extrabold text-orange-300 underline-offset-4 transition-colors duration-200 hover:text-orange-200 hover:underline"
          >
            See the partner guide
            <span aria-hidden="true"> →</span>
          </Link>
        </div>
      </section>
    </>
  );
}
