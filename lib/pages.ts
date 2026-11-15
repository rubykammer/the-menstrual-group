import { phases } from "./cycle";
import { myths } from "./myths";
import {
  dadScripts,
  friendScripts,
  partnerScripts,
  type PartnerScript,
} from "./partnerScripts";
import { quizzes } from "./quizzes";

export type SitePage = {
  href: string;
  kind: "Guide" | "Quiz" | "Page";
  title: string;
  description: string;
  /** Text from the page's content, so a search can find what's inside it. */
  body: string;
};

function scriptText(scripts: PartnerScript[]) {
  return scripts
    .map((s) => [s.situation, s.sayThis, s.notThat, s.thenDo].join(" "))
    .join(" ");
}

/** The site's non-article pages, for the site-wide search. */
export function getSitePages(): SitePage[] {
  return [
    {
      href: "/your-cycle",
      kind: "Guide",
      title: "Your Cycle",
      description:
        "For people who have periods: how to work with each phase of your cycle, and the signs it's time to see a doctor.",
      body: phases
        .map((p) => [p.name, p.summary, p.forYou, p.forPartners].join(" "))
        .join(" "),
    },
    {
      href: "/partners",
      kind: "Guide",
      title: "For Partners",
      description:
        "A practical guide for men and partners without a menstrual cycle: what to know, what to do and what to say.",
      body: scriptText(partnerScripts),
    },
    {
      href: "/dads",
      kind: "Guide",
      title: "For Dads",
      description:
        "A practical guide for dads: how to talk to your kids about periods, what to keep at home, and how to be the calm one.",
      body: scriptText(dadScripts),
    },
    {
      href: "/friends",
      kind: "Guide",
      title: "For Friends",
      description:
        "How to be a good friend or coworker to someone with a period: small, practical things that make a real difference.",
      body: scriptText(friendScripts),
    },
    ...quizzes.map((quiz) => ({
      href: `/quiz/${quiz.slug}`,
      kind: "Quiz" as const,
      title: quiz.title,
      description: quiz.teaser,
      body: [
        quiz.label,
        quiz.intro,
        ...quiz.questions.map((q) =>
          [q.question, ...q.options, q.explanation].join(" "),
        ),
      ].join(" "),
    })),
    {
      href: "/#myths",
      kind: "Page",
      title: "Myths worth retiring",
      description:
        "Things most of us picked up about periods along the way, and what the evidence actually says.",
      body: myths.map((m) => `${m.myth} ${m.fact}`).join(" "),
    },
    {
      href: "/about",
      kind: "Page",
      title: "About",
      description:
        "Why The Menstrual Group exists, who it's for, and how articles are written.",
      body: "",
    },
  ];
}
