import type { Metadata } from "next";
import Link from "next/link";
import { getAdminSupabase, requireAdmin, type Signup } from "@/lib/admin";
import { formatDate, getAllPosts } from "@/lib/posts";
import { getTopic } from "@/lib/site";
import { signOut } from "./actions";
import { AddSignupForm } from "./AddSignupForm";
import { SignupRow } from "./SignupRow";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

const DAY = 24 * 60 * 60 * 1000;

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

async function loadSignups() {
  const supabase = getAdminSupabase();
  if (!supabase) return { status: "no-key" as const };

  const { data, error } = await supabase
    .from("newsletter_signups")
    .select("id, email, created_at")
    .order("created_at", { ascending: false });

  if (error) return { status: "error" as const, message: error.message };

  const signups = data as Signup[];
  const now = Date.now();
  const since = (days: number) =>
    signups.filter((s) => now - Date.parse(s.created_at) < days * DAY).length;

  return {
    status: "ok" as const,
    signups,
    lastWeek: since(7),
    lastMonth: since(30),
  };
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-card bg-surface p-5 shadow-soft">
      <p className="text-sm font-bold text-muted">{label}</p>
      <p className="mt-1 font-display text-4xl text-primary-strong">{value}</p>
    </div>
  );
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  await requireAdmin();

  const { q } = await searchParams;
  const query = (typeof q === "string" ? q : "").trim().toLowerCase();
  const result = await loadSignups();
  const posts = getAllPosts();

  return (
    <div className="page-width pt-12 pb-16 sm:pt-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-4xl sm:text-5xl">Admin</h1>
        <form action={signOut}>
          <button
            type="submit"
            className="rounded-full px-4 py-2 font-bold text-muted hover:bg-peach hover:text-primary-strong"
          >
            Sign out
          </button>
        </form>
      </div>

      <section className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl">Newsletter signups</h2>
          {result.status === "ok" && result.signups.length > 0 && (
            <a
              href="/admin/export"
              className="rounded-full border-2 border-primary-strong px-5 py-2 font-extrabold text-primary-strong hover:bg-primary-strong hover:text-on-primary"
            >
              Download CSV
            </a>
          )}
        </div>

        {result.status === "no-key" && (
          <div className="mt-5 rounded-card bg-honey p-6">
            <p className="font-bold">
              Add your Supabase secret key to see signups.
            </p>
            <p className="mt-2">
              The site&apos;s publishable key can only add signups, not read
              them. In Supabase, open Project Settings → API Keys, copy a{" "}
              <strong>secret</strong> key, and add it to <code>.env.local</code>
              :
            </p>
            <pre className="mt-3 overflow-x-auto rounded-xl bg-surface p-3 text-sm">
              SUPABASE_SECRET_KEY=sb_secret_…
            </pre>
            <p className="mt-2 text-sm text-muted">
              On the live site, add it in Vercel under Settings → Environment
              Variables instead. Never commit this key or give it a NEXT_PUBLIC_
              name.
            </p>
          </div>
        )}

        {result.status === "error" && (
          <p className="mt-5 rounded-card bg-blush p-6">
            Couldn&apos;t load signups: {result.message}
          </p>
        )}

        {result.status === "ok" && (
          <>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <Stat label="Total" value={result.signups.length} />
              <Stat label="Last 7 days" value={result.lastWeek} />
              <Stat label="Last 30 days" value={result.lastMonth} />
            </div>

            <AddSignupForm />

            <form className="mt-6 flex gap-2" role="search">
              <label htmlFor="admin-search" className="sr-only">
                Search signups
              </label>
              <input
                id="admin-search"
                name="q"
                type="search"
                defaultValue={query}
                placeholder="Search by email"
                className="min-w-0 flex-1 rounded-full border-2 border-line bg-surface px-4 py-2"
              />
              <button
                type="submit"
                className="rounded-full bg-primary-strong px-5 py-2 font-extrabold text-on-primary hover:bg-primary-hover"
              >
                Search
              </button>
            </form>

            <SignupList
              signups={result.signups.filter((s) =>
                s.email.toLowerCase().includes(query),
              )}
              query={query}
            />
          </>
        )}
      </section>

      <section className="mt-14">
        <h2 className="text-2xl sm:text-3xl">Articles ({posts.length})</h2>
        <p className="mt-2 text-muted">
          Articles are Markdown files in <code>content/posts/</code>. See the
          README for how to add one.
        </p>
        <ul className="mt-5 divide-y divide-line overflow-hidden rounded-card bg-surface shadow-soft">
          {posts.map((post) => (
            <li
              key={post.slug}
              className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-5 py-3"
            >
              <Link
                href={`/blog/${post.slug}`}
                className="font-bold hover:text-primary-strong"
              >
                {post.title}
              </Link>
              <span className="text-sm text-muted">
                {getTopic(post.topic)?.label} · {formatDate(post.date)} ·{" "}
                {post.readingMinutes} min
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function SignupList({ signups, query }: { signups: Signup[]; query: string }) {
  if (signups.length === 0) {
    return (
      <p className="mt-5 text-muted">
        {query ? `No signups match “${query}”.` : "No signups yet."}
      </p>
    );
  }

  return (
    <ul className="mt-5 divide-y divide-line overflow-hidden rounded-card bg-surface shadow-soft">
      {signups.map((signup) => (
        <SignupRow
          key={signup.id}
          signup={signup}
          signedUpLabel={formatTime(signup.created_at)}
        />
      ))}
    </ul>
  );
}
