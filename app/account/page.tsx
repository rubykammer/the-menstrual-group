import type { Metadata } from "next";
import Link from "next/link";
import { signOut } from "@/app/actions/auth";
import { requireUser } from "@/lib/auth";
import { getProfile } from "@/lib/profile";
import { ProfileForm } from "./ProfileForm";

export const metadata: Metadata = {
  title: "Your profile",
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const session = await requireUser("/account");
  const isAdmin = session.role === "admin";
  const profile = session.email ? await getProfile(session.email) : null;

  return (
    <div className="max-w-xl">
      <h2 className="sr-only">Profile</h2>
      <section
        aria-label="Profile"
        className="rounded-card bg-surface p-6 shadow-soft"
      >
        {profile === null && (
          <p>
            You signed in with the admin password, which isn&apos;t tied to
            anyone, so there&apos;s no profile to edit. Sign in with Google to
            have one.
          </p>
        )}
        {profile?.status === "not-set-up" && (
          <div>
            <p className="font-bold">Profiles aren&apos;t set up yet.</p>
            <p className="mt-2">
              In Supabase, open SQL Editor → New query, paste in{" "}
              <code>supabase/profiles.sql</code> from this project, and run it.
            </p>
          </div>
        )}
        {profile?.status === "error" && (
          <p>Couldn&apos;t load your profile: {profile.message}</p>
        )}
        {profile?.status === "ok" && session.email && (
          <ProfileForm profile={profile.profile} email={session.email} />
        )}
      </section>

      <section
        aria-label="Account"
        className="mt-8 flex flex-wrap items-end justify-between gap-6"
      >
        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1">
          <dt className="text-sm font-bold text-muted">Signed in as</dt>
          <dd className="font-bold break-all">
            {session.email ?? "the admin password"}
          </dd>
          <dt className="text-sm font-bold text-muted">Role</dt>
          <dd>{isAdmin ? "Admin" : "Member"}</dd>
        </dl>

        <div className="flex flex-wrap items-center gap-3">
          {isAdmin && (
            <Link
              href="/admin"
              className="rounded-full px-4 py-2 font-bold text-primary-strong hover:bg-peach"
            >
              Go to admin
            </Link>
          )}
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-full border-2 border-primary-strong px-5 py-2 font-extrabold text-primary-strong hover:bg-primary-strong hover:text-on-primary"
            >
              Sign out
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
