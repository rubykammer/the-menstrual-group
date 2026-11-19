import { NextResponse, type NextRequest } from "next/server";
import {
  SESSION_COOKIE,
  hasRole,
  readSession,
  requiredRole,
} from "@/lib/session";

/**
 * Sends visitors without the role a path needs (see protectedPaths) to sign
 * in before the page renders, which also covers pages that are prerendered
 * and never run code per request. This only reads the cookie; pages, routes
 * and actions still check with requireUser() or requireAdmin().
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const role = requiredRole(pathname);
  if (!role) return NextResponse.next();

  const session = readSession(request.cookies.get(SESSION_COOKIE)?.value);
  if (hasRole(session, role)) return NextResponse.next();

  // The admin sign-in page also tells signed-in members they aren't admins.
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
