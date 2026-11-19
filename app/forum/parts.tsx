import Link from "next/link";
import { Avatar } from "@/components/Avatar";
import type { Author } from "@/lib/forum";

/** Shown wherever the forum isn't ready yet. */
export function ForumNotSetUp() {
  return (
    <div className="mt-8 rounded-card bg-honey p-6">
      <p className="font-bold">The forum isn&apos;t set up yet.</p>
      <p className="mt-2">
        In Supabase, open SQL Editor → New query, paste in{" "}
        <code>supabase/forum.sql</code> from this project, and run it.
      </p>
    </div>
  );
}

export function AuthorBadge({
  author,
  size = 40,
}: {
  author: Author;
  size?: number;
}) {
  return (
    <span className="flex min-w-0 items-center gap-3">
      <Avatar src={author.avatarUrl} name={author.name} size={size} />
      <span className="flex min-w-0 flex-wrap items-center gap-2">
        <span className="truncate font-bold">{author.name}</span>
        {author.isTeam && (
          <span className="rounded-full bg-peach px-2 py-0.5 text-xs font-extrabold text-primary-strong">
            Team
          </span>
        )}
      </span>
    </span>
  );
}

export function Guidelines() {
  return (
    <aside
      aria-labelledby="guidelines-heading"
      className="rounded-card bg-surface p-6 shadow-soft"
    >
      <h2 id="guidelines-heading" className="text-xl">
        Before you post
      </h2>
      <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 marker:text-primary-strong">
        <li>Be kind. Everyone&apos;s body and experience is different.</li>
        <li>
          Share what worked for you, but this isn&apos;t medical advice. If
          something worries you, see a doctor.
        </li>
        <li>
          Other members can read what you post, so keep personal details like
          your full name or address to yourself.
        </li>
        <li>The team removes posts that are unkind, unsafe or spam.</li>
      </ul>
      <p className="mt-4 text-sm text-muted">
        Posts show the name and photo from{" "}
        <Link href="/account" className="font-bold underline">
          your profile
        </Link>
        , never your email address.
      </p>
    </aside>
  );
}
