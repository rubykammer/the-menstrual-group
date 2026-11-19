/**
 * Period products, one page each at /products/<slug>. Keep the tone of the
 * blog: practical, friendly, no "best product". General information only;
 * every page links to its sources.
 */

export type Source = { label: string; url: string };

export type Product = {
  slug: string;
  name: string;
  /** One line for cards and the page's subtitle. */
  tagline: string;
  /** For search results: under 45 characters before " | The Menstrual Group". */
  seoTitle: string;
  /** For search results and share cards: 110 to 160 characters. */
  seoDescription: string;
  worn: "Inside underwear" | "Inside the vagina" | "As underwear";
  /** How long one can be worn, as the page states it. */
  wearTime: string;
  reusable: "Disposable" | "Reusable" | "Both kinds";
  /** A rough idea of cost, without prices that go out of date. */
  cost: string;
  howItWorks: string[];
  pros: string[];
  cons: string[];
  goodIf: string[];
  tips: string[];
  /** Products worn inside the vagina carry a toxic shock syndrome note. */
  tssNote: boolean;
  sources: Source[];
};

const sources = {
  nhsPeriods: {
    label: "Periods, NHS",
    url: "https://www.nhs.uk/conditions/periods/",
  },
  nhsTss: {
    label: "Toxic shock syndrome, NHS",
    url: "https://www.nhs.uk/conditions/toxic-shock-syndrome/",
  },
  nhsHeavy: {
    label: "Heavy periods, NHS",
    url: "https://www.nhs.uk/conditions/heavy-periods/",
  },
  acogFirst: {
    label: "Your first period, ACOG",
    url: "https://www.acog.org/womens-health/faqs/your-first-period",
  },
  lancetCups: {
    label:
      "Menstrual cup use, leakage, acceptability, safety and availability: a systematic review and meta-analysis, The Lancet Public Health (2019)",
    url: "https://doi.org/10.1016/S2468-2667(19)30111-2",
  },
} satisfies Record<string, Source>;

export const products: Product[] = [
  {
    slug: "pads",
    name: "Pads",
    tagline:
      "The easy starting point: sticks to your underwear, nothing goes inside.",
    seoTitle: "Pads: pros, cons and who they suit",
    seoDescription:
      "How disposable pads work, their pros and cons, and who they suit best. The easiest period product to start with, plus tips for choosing and using them.",
    worn: "Inside underwear",
    wearTime: "Change every 4 to 8 hours, or sooner when full",
    reusable: "Disposable",
    cost: "Cheap per pack, but you keep buying them",
    howItWorks: [
      "A pad is an absorbent strip with a sticky back that holds it in place inside your underwear. Many have wings that fold around the sides to stop leaks.",
      "They come in lots of lengths and thicknesses, from thin day pads to long overnight ones. The packet shows how absorbent each one is, usually with drops.",
    ],
    pros: [
      "Nothing goes inside your body, so there's no learning curve",
      "Easy to see how full it is and when to change it",
      "Sold almost everywhere, in lots of sizes",
      "No risk of toxic shock syndrome",
      "Good overnight, when you don't want to wake up to change",
    ],
    cons: [
      "Can feel bulky, and sometimes show under tight clothes",
      "Can rub or chafe, especially when you're active or it's hot",
      "Not suitable for swimming",
      "Creates a lot of waste, since most contain plastic",
      "The cost adds up over the years",
    ],
    goodIf: [
      "It's your first period, or you're helping someone with theirs",
      "You don't want to put anything inside your body",
      "You want simple overnight protection",
      "You use a tampon, cup or disc and want backup on heavy days",
    ],
    tips: [
      "Choose unscented pads. Fragrance can irritate sensitive skin.",
      "Wrap used pads in their wrapper or toilet paper and put them in a bin. Never flush them.",
      "Carry a spare in your bag, folded in its wrapper.",
    ],
    tssNote: false,
    sources: [sources.nhsPeriods, sources.acogFirst],
  },
  {
    slug: "reusable-pads",
    name: "Reusable pads",
    tagline: "Soft fabric pads you wash and wear again, for years.",
    seoTitle: "Reusable pads: pros, cons and care",
    seoDescription:
      "How reusable cloth pads work, their pros and cons, and how to wash them. Softer, cheaper over time and less waste than disposable pads.",
    worn: "Inside underwear",
    wearTime: "Change every 4 to 8 hours, or sooner when full",
    reusable: "Reusable",
    cost: "More up front, then very little for years",
    howItWorks: [
      "Reusable pads are made from layers of absorbent fabric, such as cotton or bamboo, often with a leak-proof backing. Instead of a sticky strip, wings wrap around your underwear and fasten with a popper.",
      "After use, you rinse them in cold water, then wash them with your laundry and let them dry before the next period.",
    ],
    pros: [
      "Feel softer and more like fabric than disposable pads",
      "Much less waste",
      "Cheaper over time, since a set lasts for years",
      "Nothing goes inside your body, and no risk of toxic shock syndrome",
    ],
    cons: [
      "Need rinsing, washing and drying between uses",
      "You'll need a small waterproof bag to carry used ones when you're out",
      "Thicker than many disposable pads",
      "Buying a full set costs more at the start",
    ],
    goodIf: [
      "You like pads but want to cut waste or cost",
      "Disposable pads irritate your skin",
      "You're happy to add them to your laundry routine",
    ],
    tips: [
      "Rinse in cold water first. Hot water can set stains.",
      "Skip fabric softener, which can stop the fabric absorbing well.",
      "Start with two or three to see how you get on before buying a full set.",
    ],
    tssNote: false,
    sources: [sources.nhsPeriods],
  },
  {
    slug: "tampons",
    name: "Tampons",
    tagline: "Small, discreet and fine for swimming, once you know how.",
    seoTitle: "Tampons: pros, cons and safe use",
    seoDescription:
      "How tampons work, their pros and cons, how to choose an absorbency, and the signs of toxic shock syndrome. Honest, practical guidance.",
    worn: "Inside the vagina",
    wearTime: "Change every 4 to 8 hours, and never longer than the pack says",
    reusable: "Disposable",
    cost: "Cheap per pack, but you keep buying them",
    howItWorks: [
      "A tampon is a small plug of absorbent material that you put into your vagina, where it soaks up blood before it leaves your body. A string hangs outside so you can pull it out.",
      "Some come with an applicator, a tube that helps you push the tampon into place. Others you put in with your finger. Absorbency is printed on the box, from light to super plus.",
    ],
    pros: [
      "Small and easy to carry",
      "Can't be seen or felt when they're in properly",
      "You can swim and play sport in them",
      "Sold almost everywhere",
    ],
    cons: [
      "Can take a few tries to get comfortable putting them in",
      "Carry a small risk of toxic shock syndrome",
      "Can feel dry and uncomfortable to remove on light days",
      "Easy to forget one is in",
      "Creates waste, and the cost adds up",
    ],
    goodIf: [
      "You swim, play sport or want something nobody can see",
      "You're comfortable putting something inside your vagina",
      "You'll remember to change it regularly",
    ],
    tips: [
      "Use the lowest absorbency your flow needs. If a tampon is still mostly white after 4 hours, go down a size.",
      "Wash your hands before and after.",
      "Set a reminder on your phone if you tend to forget. Remove the last tampon at the end of your period.",
      "Don't flush tampons or applicators. Wrap them and put them in a bin.",
      "If it hurts, it's probably not in far enough. Relax, and try again.",
    ],
    tssNote: true,
    sources: [sources.nhsPeriods, sources.nhsTss, sources.acogFirst],
  },
  {
    slug: "menstrual-cup",
    name: "Menstrual cup",
    tagline: "A soft, reusable cup that collects blood for up to 12 hours.",
    seoTitle: "Menstrual cups: pros, cons and tips",
    seoDescription:
      "How a menstrual cup works, its pros and cons, who it suits, and tips for getting started. Reusable for years, and holds more than a tampon.",
    worn: "Inside the vagina",
    wearTime: "Empty every 8 to 12 hours, or as the instructions say",
    reusable: "Reusable",
    cost: "More up front, then nothing for years",
    howItWorks: [
      "A menstrual cup is a small, flexible cup, usually made of medical-grade silicone. You fold it, put it into your vagina, and it opens and seals gently against the walls to collect blood rather than absorb it.",
      "Every 8 to 12 hours you take it out, empty it into the toilet, rinse it and put it back. Between periods you boil or sterilise it, as the instructions say. Cups come in different sizes.",
    ],
    pros: [
      "One cup can last for years, so it saves money and a lot of waste",
      "Holds more than a tampon, so you can go longer between changes",
      "Fine for swimming, sport and overnight",
      "A large review of studies found cups leak no more than pads or tampons",
    ],
    cons: [
      "There's a learning curve. It can take a few cycles to get right",
      "Emptying it in a public toilet can be awkward",
      "Getting the right size can take trial and error",
      "Carries a small risk of toxic shock syndrome",
      "If you have an IUD (coil), removing a cup can pull on the strings",
    ],
    goodIf: [
      "You want to cut waste and spend less over time",
      "You find tampons dry or uncomfortable",
      "You want long stretches without changing",
      "You're happy to practise for a cycle or two",
    ],
    tips: [
      "Practise at home on a day when you're relaxed, not right before you go out.",
      "Wet the rim with water to help it go in. To remove it, pinch the base to break the seal before pulling.",
      "Wash your hands before and after, and clean the cup as the instructions say.",
      "If you have an IUD, ask your doctor or nurse before using a cup, and always break the seal before removing it.",
    ],
    tssNote: true,
    sources: [sources.lancetCups, sources.nhsPeriods, sources.nhsTss],
  },
  {
    slug: "menstrual-disc",
    name: "Menstrual disc",
    tagline: "Sits higher than a cup and holds a lot, for up to 12 hours.",
    seoTitle: "Menstrual discs: pros, cons and tips",
    seoDescription:
      "How a menstrual disc works, how it differs from a cup, its pros and cons, and tips for placing and removing it without the mess.",
    worn: "Inside the vagina",
    wearTime: "Empty or change every 8 to 12 hours, or as the instructions say",
    reusable: "Both kinds",
    cost: "Reusable ones cost more up front; disposable ones you keep buying",
    howItWorks: [
      "A disc is a flat, flexible ring with a soft collecting pouch. You pinch it, push it back and up into the widest part of the vagina, and tuck the front rim up behind your pubic bone, where it stays in place.",
      "Unlike a cup, it doesn't use suction. Some are single-use, and some are reusable for years.",
    ],
    pros: [
      "Holds a lot, so it can help with heavy flow",
      "No suction, which some people find more comfortable than a cup",
      "Many people can't feel it once it's in",
      "Reusable discs save money and waste over time",
      "Can be worn during sex, although it isn't contraception",
    ],
    cons: [
      "Removing it can be messy until you get the hang of it",
      "There's a learning curve to placing it correctly",
      "Not as widely sold as tampons or pads",
      "Carries a small risk of toxic shock syndrome",
      "If you have an IUD, take care not to catch the strings",
    ],
    goodIf: [
      "Cups feel uncomfortable or you don't like the suction",
      "You have a heavy flow and want fewer changes",
      "You want something you can't feel",
    ],
    tips: [
      "Remove it sitting on the toilet, and keep it level as you take it out.",
      "If it leaks, the front rim probably isn't tucked up behind the pubic bone.",
      "If you have an IUD, ask your doctor or nurse before using a disc.",
    ],
    tssNote: true,
    sources: [sources.lancetCups, sources.nhsTss],
  },
  {
    slug: "period-underwear",
    name: "Period underwear",
    tagline: "Looks like ordinary pants, with absorbent layers built in.",
    seoTitle: "Period underwear: pros, cons and care",
    seoDescription:
      "How period underwear works, its pros and cons, who it suits, and how to wash it. Comfortable, reusable protection for lighter days and nights.",
    worn: "As underwear",
    wearTime: "Up to about 12 hours, depending on flow and brand",
    reusable: "Reusable",
    cost: "Each pair costs more than normal underwear, but lasts for years",
    howItWorks: [
      "Period underwear has several thin layers sewn into the gusset: one that wicks blood away from your skin, one that absorbs it, and a leak-proof layer underneath.",
      "Different styles hold different amounts, from light days to heavy flow. After wearing them, you rinse in cold water, wash and air-dry them.",
    ],
    pros: [
      "Comfortable, and feels like normal underwear",
      "Nothing to put in, stick on or remember to change during the day",
      "Great overnight, or as backup with a tampon, cup or disc",
      "Less waste, and no risk of toxic shock syndrome",
    ],
    cons: [
      "May not hold enough on its own on heavy days",
      "Changing when you're out means carrying a spare pair and a bag",
      "Needs rinsing and air-drying, which takes a while",
      "Buying several pairs costs more at the start",
      "Some brands have been found to contain PFAS chemicals",
    ],
    goodIf: [
      "You want comfort above everything else",
      "You have lighter periods, or want backup on heavier days",
      "You want reliable protection overnight",
    ],
    tips: [
      "Rinse in cold water straight after wearing, then wash on a cool cycle.",
      "Skip fabric softener and the tumble dryer, which can damage the absorbent layers.",
      "Look for brands that say they're PFAS-free and share independent test results.",
    ],
    tssNote: false,
    sources: [sources.nhsPeriods],
  },
  {
    slug: "panty-liners",
    name: "Panty liners",
    tagline: "Thin backup for light days, spotting or a cup that might leak.",
    seoTitle: "Panty liners: when to use them",
    seoDescription:
      "What panty liners are for, their pros and cons, and when to use them: light days, spotting, or backup with a tampon, cup or disc.",
    worn: "Inside underwear",
    wearTime: "Change every few hours, and whenever damp",
    reusable: "Both kinds",
    cost: "Cheap",
    howItWorks: [
      "Liners are very thin pads. They're too light for a full period on their own, but useful at the start and end of a period, for spotting, or as backup with a tampon, cup or disc.",
      "Disposable liners stick to your underwear. Reusable ones are made of fabric and fasten with a popper, like reusable pads.",
    ],
    pros: [
      "So thin you'll barely notice them",
      "Good for the first and last light days",
      "Cheap and easy to carry",
      "Nothing goes inside your body",
    ],
    cons: [
      "Not absorbent enough for a normal or heavy flow",
      "Wearing them every day can trap moisture and irritate skin",
      "Disposable ones add to waste",
    ],
    goodIf: [
      "You get spotting, or very light days",
      "You want backup with a tampon, cup or disc",
      "You're not sure when your period is about to start",
    ],
    tips: [
      "Choose unscented, breathable liners.",
      "Don't wear them every day out of habit. Give your skin a break.",
    ],
    tssNote: false,
    sources: [sources.nhsPeriods],
  },
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export const heavyPeriodsSource = sources.nhsHeavy;
