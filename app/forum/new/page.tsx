import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getCategory } from "@/lib/forum";
import { Guidelines } from "../parts";
import { NewThreadForm } from "./NewThreadForm";

export const metadata: Metadata = {
  title: "Start a conversation",
  robots: { index: false, follow: false },
};

export default async function NewThreadPage({
  searchParams,
}: PageProps<"/forum/new">) {
  const session = await requireUser("/forum/new");
  const { category } = await searchParams;

  return (
    <div className="page-width pt-8 pb-16 sm:pt-12">
      <nav aria-label="Breadcrumb" className="text-sm font-bold text-muted">
        <Link href="/forum" className="hover:text-primary-strong">
          ← Forum
        </Link>
      </nav>
      <h1 className="mt-6 text-4xl sm:text-5xl">Start a conversation</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_20rem]">
        <div className="rounded-card bg-surface p-6 shadow-soft sm:p-8">
          {session.email ? (
            <NewThreadForm category={getCategory(category)?.slug} />
          ) : (
            <p>
              You signed in with the admin password, which isn&apos;t tied to
              anyone. Sign in with Google to post.
            </p>
          )}
        </div>
        <Guidelines />
      </div>
    </div>
  );
}
