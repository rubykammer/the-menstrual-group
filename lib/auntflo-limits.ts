/**
 * Limits on what a visitor can send to AuntFlo, so one chat can't run up a
 * big bill. Shared by the chat panel and the API route.
 */
export const chatLimits = {
  /** Messages kept from the conversation (the oldest are dropped first). */
  maxMessages: 20,
  /** Characters in a single message from the visitor. */
  maxMessageLength: 2000,
};
