import type { Metadata } from "next";
import Image from "next/image";
import rubyPhoto from "@/assets/images/ruby.jpg";
import { ButtonLink } from "@/components/ButtonLink";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "How a group chat between three friends became The Menstrual Group, who it's for, and how its articles on periods and menstrual health are written and sourced.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="page-width pt-12 sm:pt-16">
      {/* The photo is only about 550px wide, so it stays at most 17rem
          (272px) across: still sharp on high-density screens. */}
      <section className="grid items-center gap-8 md:grid-cols-[auto_minmax(0,1fr)] md:gap-12">
        <Image
          src={rubyPhoto}
          alt="Ruby, smiling, with long wavy hair"
          placeholder="blur"
          priority
          sizes="(min-width: 640px) 17rem, 14rem"
          className="mx-auto aspect-square w-56 rounded-card object-cover shadow-soft sm:w-68 md:mx-0"
        />
        {/* Centred under the photo on phones, beside it from md up */}
        <div className="text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl">
            Hi, I&rsquo;m Ruby. This site started in a group chat.
          </h1>
          <p className="mt-5 text-lg sm:text-xl">
            The Menstrual Group began as a WhatsApp chat with two of my closest
            friends. We called it the menstrual group, and we agreed to be
            completely open with each other about every phase of our cycles.
          </p>
        </div>
      </section>

      <div className="mt-14 max-w-2xl">
        <section>
          <h2 className="text-2xl sm:text-3xl">Why I started it</h2>
          <p className="mt-3 text-lg">
            In that chat we shared everything: the cramps, the moods, the
            good weeks and the hard ones. Comparing our own experiences helped
            all three of us understand our cycles far better than we ever had
            on our own.
          </p>
          <p className="mt-4 text-lg">
            Then I started asking male friends what they knew. The honest
            answer was very little. Most thought a period was a four-day ordeal
            once a month, and that was the whole story. They were surprised,
            and genuinely interested, to learn that it&rsquo;s a cycle that
            never stops: there&rsquo;s always a phase going on, and each one
            shapes how we feel.
          </p>
        </section>

        <figure className="mt-10 rounded-card bg-panel px-6 py-8 text-on-panel sm:px-10">
          <blockquote className="font-display text-2xl leading-snug font-semibold sm:text-3xl">
            &ldquo;It&rsquo;s not just a few days a month. We never
            don&rsquo;t have a cycle.&rdquo;
          </blockquote>
          <figcaption className="mt-3 font-bold text-panel-link">
            What I wanted my friends to know
          </figcaption>
        </figure>

        <p className="mt-10 text-lg">
          That curiosity is why this site exists. It&rsquo;s a place to share
          what my friends and I have learned, written for people who have a
          cycle and for everyone who wants to understand one.
        </p>

        <section className="mt-12">
          <h2 className="text-2xl sm:text-3xl">Who this is for</h2>
          <p className="mt-3 text-lg">
            Everyone. Women who want to understand their own bodies better, and
            men and partners who want to know how to help. Dads with daughters,
            and moms with sons. Anyone who has ever stood in the period aisle,
            feeling lost.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl sm:text-3xl">How we write</h2>
          <p className="mt-3 text-lg">
            We keep things plain, warm and shame-free. Health information is
            based on published guidance from organizations such as the World
            Health Organization, the NHS, the American College of Obstetricians
            and Gynecologists, and the US Office on Women&apos;s Health. Each
            article lists its sources, so you can read further.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl sm:text-3xl">What we aren&apos;t</h2>
          <p className="mt-3 text-lg">
            We aren&apos;t a clinic, and nothing here is medical advice. Bodies
            differ, and a healthcare professional who knows you is always the
            best source of guidance about your own health.
          </p>
        </section>

        <div className="mt-10">
          <ButtonLink href="/blog">Start reading</ButtonLink>
        </div>
      </div>
    </div>
  );
}
