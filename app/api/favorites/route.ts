import { NextResponse, type NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { favoriteExists, isFavorite, isFavoriteKind } from "@/lib/favorites";

/**
 * Whether the visitor has saved an article or product. Article and product
 * pages are prerendered for everyone, so the save button asks here once the
 * page has loaded.
 */
export async function GET(request: NextRequest) {
  const kind = request.nextUrl.searchParams.get("kind");
  const slug = request.nextUrl.searchParams.get("slug") ?? "";
  if (!isFavoriteKind(kind) || !favoriteExists(kind, slug)) {
    return NextResponse.json({ error: "Unknown item" }, { status: 400 });
  }

  const session = await getSession();
  const headers = { "Cache-Control": "private, no-store" };
  if (!session?.email) {
    return NextResponse.json({ signedIn: false, saved: false }, { headers });
  }
  const saved = await isFavorite(session.email, kind, slug);
  return NextResponse.json({ signedIn: true, saved }, { headers });
}
