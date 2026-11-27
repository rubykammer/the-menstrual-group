import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import rubyPhoto from "@/assets/images/ruby.jpg";
import { ButtonLink } from "@/components/ButtonLink";
import { CycleExplorer } from "@/components/CycleExplorer";
import { CycleRing } from "@/components/CycleRing";
import { MythList } from "@/components/MythList";
import { PostCard } from "@/components/PostCard";
import { QuizCtas } from "@/components/QuizCtas";
import { doorScenes } from "@/components/illustrations/scenes";
import { getAllPosts } from "@/lib/posts";
import { absoluteUrl, organization, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  ...pageMetadata({
    title: `${site.name}: ${site.tagline}`,
    description: site.description,
    path: "/",
  }),
  // The home page is the one place without " | The Menstrual Group".
  title: { absolute: `${site.name}: ${site.tagline}` },
};

type Door = {
  title: string;
  body: string;
  href: string;
  cta: string;
  tint: string;
  art: keyof typeof doorScenes;
  more?: { href: string; label: string }[];
};

const doors: Door[] = [
  {
    title: "I have a cycle",
    body: "Understand what your body is doing, feel better on the harder days, and know when it's time to ask for help.",
    href: "/your-cycle",
    cta: "Start with the basics",
    tint: "bg-phase-luteal-tint border-phase-luteal",
    art: "self",
  },
  {
    title: "I’m supporting someone",
    body: "What's actually happening each month, what to say, and the practical things that help a partner, daughter or friend.",
    href: "/partners",
    cta: "Start with the partner guide",
    tint: "bg-phase-follicular-tint border-phase-follicular",
    art: "supporter",
    more: [
      { href: "/dads", label: "For dads" },
      { href: "/friends", label: "For friends" },
    ],
  },
];

export default function Home() {
  const [latest, ...rest] = getAllPosts();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: site.name,
          description: site.description,
          url: absoluteUrl("/"),
          inLanguage: "en",
          publisher: organization(),
        }}
      />
      <section className="page-width grid items-center gap-10 pt-12 pb-16 sm:pt-16 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16 lg:pt-20 lg:pb-24">
        <div>
          <h1 className="text-[2.625rem] min-[375px]:text-5xl sm:text-6xl lg:text-7xl">
            Periods are <span className="text-primary">everyone&rsquo;s</span>{" "}
            conversation.
          </h1>
          <p className="mt-6 max-w-xl text-lg sm:text-xl">
            Clear, practical guidance on menstrual cycles. For the people who
            have them, and for the partners, dads and friends who want to
            understand what&rsquo;s going on and how to help.
          </p>
          {/* One main action: the quizzes are quick and lead on to the guides.
              They're for supporters, so people with a cycle get their own link. */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <ButtonLink href="/quiz" className="px-8 py-4 text-lg">
              Take the 1-minute quiz
            </ButtonLink>
            <Link
              href="/your-cycle"
              className="self-center py-2 font-extrabold text-primary-strong underline-offset-4 transition-colors duration-200 hover:text-accent-strong hover:underline sm:self-auto"
            >
              Have a cycle? Start with the basics
              <span aria-hidden="true"> →</span>
            </Link>
          </div>
        </div>
        {/* Decorative, so phones skip it and reach the starting points sooner */}
        <div className="hidden sm:block">
          <CycleRing className="mx-auto w-full max-w-sm lg:max-w-none" />
          <p className="mt-2 text-center text-sm font-bold text-muted" aria-hidden="true">
            Hover over or tap a day to see its phase
          </p>
        </div>
      </section>

      <section aria-labelledby="doors-heading" className="page-width">
        <h2 id="doors-heading" className="reveal text-3xl sm:text-4xl">
          Where would you like to start?
        </h2>
        <ul className="mt-8 grid gap-6 md:grid-cols-2">
          {doors.map((door) => (
            <li
              key={door.title}
              className={`reveal group relative overflow-hidden rounded-card border-t-8 p-6 transition-all sm:p-8 duration-300 hover:shadow-soft motion-safe:hover:-translate-y-1 ${door.tint}`}
            >
              <div className="-mx-6 -mt-6 mb-6 flex justify-center overflow-hidden rounded-t-card bg-foreground/5 pt-4 sm:-mx-8 sm:-mt-8">
                <svg
                  viewBox="50 10 300 230"
                  className="figure-art block h-40 w-auto origin-bottom transition-transform duration-300 motion-safe:group-hover:scale-105 sm:h-48"
                  aria-hidden="true"
                  focusable="false"
                >
                  {doorScenes[door.art]}
                </svg>
              </div>
              <h3 className="text-2xl sm:text-3xl">{door.title}</h3>
              <p className="mt-3">{door.body}</p>
              <Link
                href={door.href}
                className="mt-3 inline-block py-2 font-extrabold text-primary-strong underline-offset-4 group-hover:underline after:absolute after:inset-0"
              >
                {door.cta}
                <span aria-hidden="true"> →</span>
              </Link>
              {door.more && (
                <div className="mt-4 flex flex-wrap gap-3">
                  {door.more.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="relative z-10 inline-flex min-h-11 items-center rounded-full border-2 border-primary-strong px-4 font-extrabold text-primary-strong transition-colors duration-200 hover:bg-primary-strong hover:text-on-primary"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-14 sm:mt-20">
        <QuizCtas />
      </div>

      <section aria-labelledby="ruby-heading" className="page-width mt-14 sm:mt-20">
        <div className="reveal flex flex-col gap-6 rounded-card bg-surface p-6 shadow-soft sm:flex-row sm:items-center sm:gap-10 sm:p-10">
          <Image
            src={rubyPhoto}
            alt="Ruby, smiling"
            placeholder="blur"
            sizes="10rem"
            className="size-28 shrink-0 rounded-full object-cover sm:size-40"
          />
          <div>
            <h2 id="ruby-heading" className="text-2xl sm:text-3xl">
              Hi, I&rsquo;m Ruby
            </h2>
            <p className="mt-3 text-lg">
              This site grew out of a WhatsApp group with two friends, where we
              shared every phase of our cycles. When I asked male friends what
              they knew, most thought a period was a four-day thing. They
              wanted to know more, so I built a place to learn.
            </p>
            <Link
              href="/about"
              className="mt-3 inline-block py-2 font-extrabold text-primary-strong underline-offset-4 transition-colors duration-200 hover:text-accent-strong hover:underline"
            >
              Why I started The Menstrual Group
              <span aria-hidden="true"> →</span>
            </Link>
          </div>
        </div>
      </section>

      <section
        id="the-cycle"
        aria-labelledby="cycle-heading"
        className="mt-14 bg-peach py-14 sm:mt-20 sm:py-20"
      >
        <div className="page-width">
          <div className="reveal max-w-2xl">
            <h2 id="cycle-heading" className="text-3xl sm:text-4xl">
              One month, four phases
            </h2>
            <p className="mt-3 text-lg">
              A cycle is much more than a period. Pick a phase to see what&apos;s
              happening, and how to work with it.
            </p>
          </div>
          <div className="reveal">
            <CycleExplorer />
          </div>
        </div>
      </section>

      <section
        id="myths"
        aria-labelledby="myths-heading"
        className="page-width mt-14 sm:mt-20"
      >
        <div className="reveal max-w-2xl">
          <h2 id="myths-heading" className="text-3xl sm:text-4xl">
            Myths worth retiring
          </h2>
          <p className="mt-3 text-lg">
            Most of us picked these up somewhere along the way. Here&apos;s what
            the evidence actually says.
          </p>
        </div>
        <MythList />
      </section>

      <section aria-labelledby="forum-heading" className="page-width mt-14 sm:mt-20">
        <div className="reveal flex flex-col gap-6 rounded-card bg-mist p-6 sm:flex-row sm:items-center sm:justify-between sm:p-10">
          <div className="max-w-2xl">
            <h2 id="forum-heading" className="text-2xl sm:text-3xl">
              Talk to people who get it
            </h2>
            <p className="mt-2 text-lg">
              Swap tips on products, pain and moods, or ask how to support
              someone. The forum is members-only, so it stays a kind place.
            </p>
          </div>
          <ButtonLink href="/forum" className="shrink-0 self-start sm:self-auto">
            Join the conversation
          </ButtonLink>
        </div>
      </section>

      <section aria-labelledby="latest-heading" className="page-width mt-14 sm:mt-20">
        <div className="reveal flex flex-wrap items-end justify-between gap-4">
          <h2 id="latest-heading" className="text-3xl sm:text-4xl">
            Latest from the blog
          </h2>
          <Link
            href="/blog"
            className="-my-2 inline-block py-2 font-extrabold text-primary-strong underline-offset-4 transition-colors duration-200 hover:text-accent-strong hover:underline"
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

      <section className="page-width mt-14 sm:mt-20">
        <div className="reveal rounded-card bg-panel px-6 py-12 text-on-panel sm:px-12 sm:py-16">
          <p className="max-w-3xl font-display text-3xl leading-tight font-semibold sm:text-4xl">
            Ask what helps. Do it without being asked twice.
          </p>
          <p className="mt-4 max-w-2xl text-lg">
            That&apos;s most of being a good partner, and the rest fits on a
            single page.
          </p>
          <Link
            href="/partners"
            className="mt-4 inline-block py-2 font-extrabold text-panel-link underline-offset-4 transition-colors duration-200 hover:text-panel-link-hover hover:underline"
          >
            See the partner guide
            <span aria-hidden="true"> →</span>
          </Link>
        </div>
      </section>
    </>
  );
}
