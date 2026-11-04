export type QuizQuestion = {
  question: string;
  options: string[];
  /** Index into `options`. */
  answer: number;
  explanation: string;
};

export type Quiz = {
  slug: "partners" | "dads" | "friends";
  label: string;
  title: string;
  teaser: string;
  intro: string;
  guideHref: string;
  guideLabel: string;
  tint: string;
  questions: QuizQuestion[];
};

export const quizzes: Quiz[] = [
  {
    slug: "partners",
    label: "For partners",
    title: "How good a period partner are you?",
    teaser: "Five everyday moments. Do you know the move that actually helps?",
    intro:
      "Five quick questions about the moments that come up in real life. No trick questions, and nobody sees your score.",
    guideHref: "/partners",
    guideLabel: "Read the partner guide",
    tint: "bg-peach",
    questions: [
      {
        question:
          "Your partner has bad cramps on the night you had plans. What's the best first move?",
        options: [
          "Tell them they'll probably feel better once they're out",
          "Offer to cancel, and ask what would help right now",
          "Give them space, and go out on your own",
        ],
        answer: 1,
        explanation:
          "Taking the plans off their plate and asking what helps beats guessing. Heat, rest and pain relief are often on the list.",
      },
      {
        question: "How long is a typical menstrual cycle?",
        options: [
          "Exactly 28 days, every time",
          "Anywhere from about 21 to 35 days",
          "The same as the lunar month",
        ],
        answer: 1,
        explanation:
          "28 days is just an average. For adults, anything from around 21 to 35 days is common, and it can vary month to month.",
      },
      {
        question:
          "Your partner is upset with you in the week before their period. What do you do?",
        options: [
          "Ask if it's that time of the month",
          "Wait for it to blow over in a few days",
          "Listen, and treat the concern as real",
        ],
        answer: 2,
        explanation:
          "Hormones can turn up the volume, but the feeling is still real. Blaming the period shuts the conversation down.",
      },
      {
        question: "Which of these is a good reason to see a doctor?",
        options: [
          "Period pain that stops them doing everyday things",
          "Feeling a little more tired than usual",
          "A period that lasts four days",
        ],
        answer: 0,
        explanation:
          "Pain that gets in the way of daily life isn't something to put up with. It deserves a proper check-up.",
      },
      {
        question: "They've run out of pads and ask you to pick some up. You…",
        options: [
          "Grab whichever pack is cheapest",
          "Ask which ones, and take a photo of the box for next time",
          "Suggest they go themselves, since they know what they need",
        ],
        answer: 1,
        explanation:
          "Products come in different sizes and absorbencies. A quick photo means you get it right every time after.",
      },
    ],
  },
  {
    slug: "dads",
    label: "For dads",
    title: "Are you ready for the period talk, Dad?",
    teaser: "Test what you know before the big moment, whether you have daughters, sons or both.",
    intro:
      "Five questions for dads of daughters, sons or both. It takes about a minute, and you might be surprised.",
    guideHref: "/dads",
    guideLabel: "Read the dad guide",
    tint: "bg-honey",
    questions: [
      {
        question: "How early can a first period start?",
        options: ["Around 8 years old", "Around 13 years old", "Around 16 years old"],
        answer: 0,
        explanation:
          "The average is about 12, but it can be as early as 8. That's why the first talk should come early.",
      },
      {
        question: "Your daughter tells you her period has started. What do you say?",
        options: [
          "“Maybe go and talk to your mom about that.”",
          "“Thanks for telling me. Have you got what you need?”",
          "Make a light joke to break the tension",
        ],
        answer: 1,
        explanation:
          "Calm and matter-of-fact tells her this is normal and that you're someone she can come to.",
      },
      {
        question: "Should dads talk to their sons about periods?",
        options: [
          "No, it doesn't affect them",
          "Only if they ask",
          "Yes, with the same facts at the same age",
        ],
        answer: 2,
        explanation:
          "Boys who understand periods are far less likely to tease, and far more likely to be kind friends and partners.",
      },
      {
        question: "What belongs in a first-period kit for a school bag?",
        options: [
          "A few pads, spare underwear and a sealable bag",
          "Just some painkillers",
          "Nothing, because school will have supplies",
        ],
        answer: 0,
        explanation:
          "A small, plain pouch with the basics means a first period at school is a hassle, not a crisis.",
      },
      {
        question: "Can you go swimming on your period?",
        options: [
          "No, never",
          "Yes, with a tampon, cup or period swimwear",
          "Only after the first three days",
        ],
        answer: 1,
        explanation:
          "Swimming is fine, and exercise can even ease cramps. Pads don't work in water, so a tampon, cup or period swimwear is needed.",
      },
    ],
  },
  {
    slug: "friends",
    label: "For friends",
    title: "What kind of period friend are you?",
    teaser: "Leaks, cramps and awkward comments. See how you'd handle them.",
    intro:
      "Five moments that come up between friends, roommates and coworkers. Pick what you'd actually do.",
    guideHref: "/friends",
    guideLabel: "Read the friend guide",
    tint: "bg-blush",
    questions: [
      {
        question: "A friend quietly asks if you have a pad. You…",
        options: [
          "Hand one over, no fuss",
          "Ask the whole group if anyone has one",
          "Say “ew, why are you asking me?”",
        ],
        answer: 0,
        explanation:
          "Quick and quiet is perfect. Carrying a spare, even if you never use one yourself, makes you a hero.",
      },
      {
        question: "You notice your friend's period has leaked onto their jeans. What do you do?",
        options: [
          "Say nothing and hope nobody notices",
          "Tell them quietly and offer your jacket",
          "Point it out so they can deal with it",
        ],
        answer: 1,
        explanation:
          "They'd want to know, but privately. Offering a jacket and helping them get to a bathroom is all it takes.",
      },
      {
        question: "A friend often cancels plans because of severe period pain. You…",
        options: [
          "Stop inviting them",
          "Tell them everyone gets cramps and to push through",
          "Believe them, and gently suggest it's worth seeing a doctor",
        ],
        answer: 2,
        explanation:
          "Pain that regularly stops someone living their life isn't normal. It can be a sign of a condition such as endometriosis.",
      },
      {
        question: "Do the periods of friends who live together sync up?",
        options: [
          "Yes, that's well proven",
          "There's no good evidence that they do",
          "Only for close friends",
        ],
        answer: 1,
        explanation:
          "It's a popular idea, but larger studies haven't found it. Cycles of different lengths drift in and out of overlap by chance.",
      },
      {
        question:
          "In a meeting, someone asks your friend “Is it that time of the month?” You…",
        options: [
          "Laugh along to keep things light",
          "Steer things back to the point your friend made",
          "Stay out of it",
        ],
        answer: 1,
        explanation:
          "Bringing the focus back to what they actually said backs them up without making a scene.",
      },
    ],
  },
];

export function getQuiz(slug: string) {
  return quizzes.find((quiz) => quiz.slug === slug);
}

export function quizResult(score: number, total: number) {
  if (score === total)
    return {
      heading: "You're a natural.",
      body: "Full marks. The people around you are lucky to have you.",
    };
  if (score >= total - 2)
    return {
      heading: "You're nearly there.",
      body: "You've got the instincts. The guide fills in the rest in a few minutes.",
    };
  return {
    heading: "A great place to start.",
    body: "Most of us were never taught this. The guide covers everything here, in plain language.",
  };
}
