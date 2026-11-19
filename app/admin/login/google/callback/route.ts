import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import {
  OAUTH_COOKIE,
  SESSION_COOKIE,
  adminEmails,
  googleCallbackUrl,
  googleConfigured,
  googleSessionToken,
  safeEqual,
  safeNext,
  sessionCookieOptions,
} from "@/lib/session";

type IdTokenClaims = {
  iss?: string;
  aud?: string;
  exp?: number;
  email?: string;
  email_verified?: boolean;
};

function back(request: NextRequest, error: string, next = "/admin") {
  const url = new URL(
    next.startsWith("/admin") ? "/admin/login" : "/login",
    request.url,
  );
  url.searchParams.set("error", error);
  if (!next.startsWith("/admin")) url.searchParams.set("next", next);
  return NextResponse.redirect(url);
}

/** Google sends the visitor back here with a one-time code. */
export async function GET(request: NextRequest) {
  if (!googleConfigured()) return back(request, "google", "/account");

  const params = request.nextUrl.searchParams;
  const jar = await cookies();
  const saved = jar.get(OAUTH_COOKIE)?.value ?? "";
  jar.delete({ name: OAUTH_COOKIE, path: "/admin/login/google" });

  const [savedState, verifier, encodedNext] = saved.split(".");
  const next = safeNext(
    Buffer.from(encodedNext ?? "", "base64url").toString() || undefined,
  );
  const state = params.get("state") ?? "";
  const code = params.get("code");
  // Cancelling at Google, or a link that didn't start here.
  if (!code || !savedState || !verifier || !safeEqual(state, savedState)) {
    return back(request, "google", next);
  }

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: googleCallbackUrl(request.nextUrl.origin),
      grant_type: "authorization_code",
      code_verifier: verifier,
    }),
    cache: "no-store",
  });
  if (!response.ok) {
    console.error("Google token exchange failed:", await response.text());
    return back(request, "google", next);
  }

  // The ID token came straight from Google over HTTPS in exchange for our
  // client secret, so its claims can be read without checking the signature.
  const { id_token } = (await response.json()) as { id_token?: string };
  const claims = JSON.parse(
    Buffer.from(id_token?.split(".")[1] ?? "", "base64url").toString() || "{}",
  ) as IdTokenClaims;

  const email = claims.email?.toLowerCase();
  const valid =
    (claims.iss === "https://accounts.google.com" ||
      claims.iss === "accounts.google.com") &&
    claims.aud === process.env.GOOGLE_CLIENT_ID &&
    (claims.exp ?? 0) * 1000 > Date.now() &&
    claims.email_verified === true &&
    email !== undefined;
  if (!valid) return back(request, "google", next);

  // Anyone can sign in as a member, but signing in from the admin page with
  // an address that isn't an admin's leaves the visitor signed out, as before.
  const isAdmin = adminEmails().includes(email);
  if (next.startsWith("/admin") && !isAdmin) {
    return back(request, "not-allowed");
  }

  const token = googleSessionToken(email);
  if (!token) return back(request, "google", next);
  jar.set(SESSION_COOKIE, token, sessionCookieOptions);

  return NextResponse.redirect(new URL(next, request.url));
}
