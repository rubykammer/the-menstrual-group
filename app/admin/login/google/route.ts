import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { OAUTH_COOKIE, googleCallbackUrl, googleConfigured } from "@/lib/admin";

/** Sends the visitor to Google's sign-in page. */
export async function GET(request: NextRequest) {
  if (!googleConfigured()) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const state = randomBytes(16).toString("base64url");
  const verifier = randomBytes(32).toString("base64url");
  const challenge = createHash("sha256").update(verifier).digest("base64url");

  (await cookies()).set(OAUTH_COOKIE, `${state}.${verifier}`, {
    maxAge: 10 * 60,
    path: "/admin/login/google",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });

  const google = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  google.search = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: googleCallbackUrl(request.nextUrl.origin),
    response_type: "code",
    scope: "openid email",
    state,
    code_challenge: challenge,
    code_challenge_method: "S256",
    prompt: "select_account",
  }).toString();

  return NextResponse.redirect(google);
}
