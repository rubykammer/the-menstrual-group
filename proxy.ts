import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, readSession, requiredRole } from "@/lib/session";

/**
 * Sends visitors who aren't signed in to the right sign-in page for a
 * protected path (see protectedPaths) before the page renders, which also covers pages that are prerendered
 * and never run code per request. This only reads the cookie; pages, routes
 * and actions still check with requireUser() or requireAdmin().
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const role = requiredRole(pathname);
  if (!role) return NextResponse.next();

  // Only whether someone is signed in: roles saved in Supabase are checked by
  // the page, so the proxy never waits on the database.
  if (readSession(request.cookies.get(SESSION_COOKIE)?.value)) {
    return NextResponse.next();
  }

  if (role === "admin") {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const login = new URL("/login", request.url);
  login.searchParams.set("next", pathname + search);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg).*)"],
};
