"use server";

import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { isValidEmail } from "@/lib/email";
import { trackServer } from "@/lib/track-server";

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

// Supabase only stores the address and sends no email, so there's no
// confirmation link to mention.
const saved: SignupState = {
  status: "success",
  message: "Thank you! You're on the list.",
};

// The publishable key is public by design: the table's Row Level Security only
// lets it add signups, never read them. See supabase/newsletter_signups.sql.
function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

const failureMessage =
  "Sorry, that didn't work. Please try again in a little while.";

export async function subscribe(
  _state: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!isValidEmail(email)) {
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
  const supabase = getSupabase();

  if (supabase) {
    const { error } = await supabase
      .from("newsletter_signups")
      .insert({ email });

    // 23505 means the address is already on the list. Answer as if it were new,
    // so the form can't reveal who has subscribed.
    if (error && error.code !== "23505") {
      console.error("Newsletter signup failed to save:", error.message);
      return failed;
    }
    if (!apiKey) {
      // Only new addresses count, not repeats of one already on the list.
      if (!error) await trackServer("Newsletter Signup");
      return saved;
    }
  } else if (!apiKey) {
    // With neither Supabase nor Buttondown set up, pretend every signup worked,
    // everywhere, including the public site. Nothing is saved, so these
    // addresses are lost. The warning shows in Vercel's logs as a reminder.
    console.warn(
      "Newsletter signup pretended to succeed: SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY are not set",
    );
    return saved;
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

    // 400 means the address was already on the list, so it isn't counted.
    if (response.ok) await trackServer("Newsletter Signup");
    if (response.ok || response.status === 400) return received;
    console.error(`Newsletter signup failed: status ${response.status}`);
  } catch (error) {
    console.error("Newsletter signup failed:", error);
  }

  return failed;
}
