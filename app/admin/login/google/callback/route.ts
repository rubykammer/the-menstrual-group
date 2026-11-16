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
  sessionCookieOptions,
} from "@/lib/admin";

type IdTokenClaims = {
  iss?: string;
  aud?: string;
  exp?: number;
  email?: string;
  email_verified?: boolean;
};

function back(request: NextRequest, error: string) {
  const url = new URL("/admin/login", request.url);
  url.searchParams.set("error", error);
  return NextResponse.redirect(url);
}

/** Google sends the visitor back here with a one-time code. */
export async function GET(request: NextRequest) {
  if (!googleConfigured()) return back(request, "google");

  const params = request.nextUrl.searchParams;
  const jar = await cookies();
  const saved = jar.get(OAUTH_COOKIE)?.value ?? "";
  jar.delete({ name: OAUTH_COOKIE, path: "/admin/login/google" });

  const [savedState, verifier] = saved.split(".");
  const state = params.get("state") ?? "";
  const code = params.get("code");
  // Cancelling at Google, or a link that didn't start here.
  if (!code || !savedState || !verifier || !safeEqual(state, savedState)) {
    return back(request, "google");
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
    return back(request, "google");
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
  if (!valid) return back(request, "google");

  if (!adminEmails().includes(email)) return back(request, "not-allowed");

  const token = googleSessionToken(email);
  if (!token) return back(request, "google");
  jar.set(SESSION_COOKIE, token, sessionCookieOptions);

  return NextResponse.redirect(new URL("/admin", request.url));
}
