import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { signOut } from "@/app/actions/auth";
import { GoogleButton } from "@/components/GoogleButton";
import { getSession } from "@/lib/auth";
import { adminConfigured, googleAdminConfigured } from "@/lib/session";
import { SignInForm } from "./SignInForm";

export const metadata: Metadata = {
  title: "Admin sign-in",
  robots: { index: false, follow: false },
};

const errors: Record<string, string> = {
  "not-allowed": "That Google account isn't on the admin list.",
  google: "Google sign-in didn't finish. Please try again.",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getSession();
  const configured = adminConfigured();
  if (!configured && process.env.NODE_ENV !== "development") notFound();
  if (session?.role === "admin") redirect("/admin");

  const google = googleAdminConfigured();
  const hasPassword = Boolean(process.env.ADMIN_PASSWORD);
  const { error } = await searchParams;
  const message = typeof error === "string" ? errors[error] : undefined;

  return (
    <div className="page-width pt-12 pb-16 sm:pt-16">
      <div className="max-w-md">
        <h1 className="text-4xl sm:text-5xl">Admin sign-in</h1>

        {message && (
          <p role="alert" className="mt-6 rounded-card bg-mist p-4">
            {message}
          </p>
        )}

        {session && (
          <div className="mt-6 rounded-card bg-honey p-4">
            <p>
              You&apos;re signed in as <strong>{session.email}</strong>, which
              isn&apos;t an admin account. Sign in below with one that is, or go
              to{" "}
              <Link href="/account" className="font-bold underline">
                your account
              </Link>
              .
            </p>
            <form action={signOut} className="mt-3">
              <button type="submit" className="font-bold underline">
                Sign out
              </button>
            </form>
          </div>
        )}

        {google && <GoogleButton next="/admin" />}

        {google && hasPassword && (
          <p className="mt-8 text-sm font-bold text-muted">
            Or use the admin password
          </p>
        )}

        {hasPassword && <SignInForm />}

        {!configured && (
          <div className="mt-8 rounded-card bg-honey p-6">
            <p className="font-bold">Set up admin sign-in first.</p>
            <p className="mt-2">
              For Google sign-in, create an OAuth client in Google Cloud and add
              these to <code>.env.local</code>, then reload this page:
            </p>
            <pre className="mt-3 overflow-x-auto rounded-xl bg-surface p-3 text-sm">
              {`GOOGLE_CLIENT_ID=…
GOOGLE_CLIENT_SECRET=…
ADMIN_EMAILS=you@gmail.com`}
            </pre>
            <p className="mt-2">
              Or set a long <code>ADMIN_PASSWORD</code> instead.
            </p>
            <p className="mt-2 text-sm text-muted">
              Until one is set, the live site has no admin at all.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
