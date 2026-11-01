"use server";

import { headers } from "next/headers";

export type SignupState = {
  status: "idle" | "success" | "error";
  message: string;
  email?: string;
};

// Buttondown answers 400 for an address that's already on the list. Giving both
// cases the same reply means the form can't reveal who has subscribed.
const received: SignupState = {
  status: "success",
  message:
    "Thank you! If you're new here, check your inbox for a link to confirm.",
};

const failureMessage =
  "Sorry, that didn't work. Please try again in a little while.";

export async function subscribe(
  _state: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return {
      status: "error",
      message: "Please enter a valid email address.",
      email,
    };
  }

  // Real visitors never see this field, so anything in it came from a bot.
  if (formData.get("website")) return received;

  const failed: SignupState = {
    status: "error",
    message: failureMessage,
    email,
  };

  const apiKey = process.env.BUTTONDOWN_API_KEY;
  if (!apiKey) {
    console.error("Newsletter signup failed: BUTTONDOWN_API_KEY is not set");
    return failed;
  }

  // Every signup reaches Buttondown from this server, so pass on the visitor's
  // address, or its spam check sees them all as one sender.
  const forwardedFor = (await headers()).get("x-forwarded-for");
  const ipAddress = forwardedFor?.split(",")[0].trim();

  try {
    const response = await fetch("https://api.buttondown.com/v1/subscribers", {
      method: "POST",
      headers: {
        Authorization: `Token ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email_address: email, ip_address: ipAddress }),
      signal: AbortSignal.timeout(8000),
    });

    if (response.ok || response.status === 400) return received;
    console.error(`Newsletter signup failed: status ${response.status}`);
  } catch (error) {
    console.error("Newsletter signup failed:", error);
  }

  return failed;
}
