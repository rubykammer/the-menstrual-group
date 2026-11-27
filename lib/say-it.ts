/**
 * "Help me say it": the AI helper on the supporter pages that suggests kind
 * words for a situation the visitor describes. Shared by the form and the
 * API route, so it holds nothing secret.
 */

export type SayItAudience = "partner" | "dad" | "friend";

export const sayItAudiences: Record<
  SayItAudience,
  { who: string; placeholder: string; examples: string[] }
> = {
  partner: {
    who: "a partner supporting the person they're with",
    placeholder: "For example: She's been snappy all week and I said something stupid about her period…",
    examples: [
      "I joked about PMS and they got really hurt",
      "Their cramps are bad and we're meant to see my parents",
      "They've just been told they might have endometriosis",
    ],
  },
  dad: {
    who: "a dad or other parent talking with their child",
    placeholder: "For example: My 11-year-old is embarrassed and won't talk to me about her period…",
    examples: [
      "My daughter's first period started at school",
      "She won't tell me when she needs more pads",
      "My son keeps making period jokes at his sister",
    ],
  },
  friend: {
    who: "a friend, colleague or housemate",
    placeholder: "For example: My friend keeps cancelling plans and I think it's her period pain…",
    examples: [
      "A colleague is in pain at work but won't go home",
      "My friend thinks her periods aren't normal",
      "Someone in our group made a gross comment about periods",
    ],
  },
};

export const sayItLimits = {
  /** Characters in the situation the visitor describes. */
  maxLength: 600,
};

/** What the helper sends back for a situation it can help with. */
export type SayItReply =
  | { ok: true; sayThis: string[]; notThat: string; thenDo: string; note?: string }
  | { ok: false; message: string };
