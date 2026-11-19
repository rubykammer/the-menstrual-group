import type { Metadata } from "next";
import Link from "next/link";
import { signOut } from "@/app/actions/auth";
import { requireUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Your account",
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const session = await requireUser("/account");
  const isAdmin = session.role === "admin";

  return (
    <div className="page-width pt-12 pb-16 sm:pt-16">
      <div className="max-w-md">
        <h1 className="text-4xl sm:text-5xl">Your account</h1>

        <div className="mt-8 rounded-card bg-surface p-6 shadow-soft">
          <p className="text-sm font-bold text-muted">Signed in as</p>
          <p className="mt-1 text-lg font-bold break-all">
            {session.email ?? "the admin password"}
          </p>
          <p className="mt-4 text-sm font-bold text-muted">Role</p>
          <p className="mt-1">{isAdmin ? "Admin" : "Member"}</p>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          {isAdmin && (
            <Link
              href="/admin"
              className="rounded-full bg-primary-strong px-6 py-3 font-extrabold text-on-primary hover:bg-primary-hover"
            >
              Go to admin
            </Link>
          )}
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-full border-2 border-primary-strong px-6 py-3 font-extrabold text-primary-strong hover:bg-primary-strong hover:text-on-primary"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
