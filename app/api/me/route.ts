import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getProfile } from "@/lib/profile";

/**
 * Who's signed in, for the header's account button: just a name, photo and
 * whether they're an admin (to show the Admin link), never the email. Pages
 * are the same for everyone, so the header asks here.
 */
export async function GET() {
  const headers = { "Cache-Control": "private, no-store" };
  const session = await getSession();
  if (!session) return NextResponse.json({ signedIn: false }, { headers });

  let name = "";
  let avatarUrl: string | null = null;
  if (session.email) {
    const profile = await getProfile(session.email);
    if (profile.status === "ok") {
      name = profile.profile.displayName;
      avatarUrl = profile.profile.avatarUrl;
    }
  }
  return NextResponse.json(
    { signedIn: true, name, avatarUrl, isAdmin: session.role === "admin" },
    { headers },
  );
}
