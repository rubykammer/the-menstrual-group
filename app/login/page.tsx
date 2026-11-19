import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { GoogleButton } from "@/components/GoogleButton";
import { getSession } from "@/lib/auth";
import { googleConfigured, safeNext } from "@/lib/session";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

const errors: Record<string, string> = {
  google: "Google sign-in didn't finish. Please try again.",
};

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const session = await getSession();
  const { next: nextParam, error } = await searchParams;
  const next = safeNext(nextParam);
  if (session) redirect(next);

  const message = typeof error === "string" ? errors[error] : undefined;
  const google = googleConfigured();

  return (
    <div className="page-width pt-12 pb-16 sm:pt-16">
      <div className="max-w-md">
        <h1 className="text-4xl sm:text-5xl">Sign in</h1>
        <p className="mt-4 text-lg">
          Sign in with your Google account. We only see your email address.
        </p>

        {message && (
          <p role="alert" className="mt-6 rounded-card bg-blush p-4">
            {message}
          </p>
        )}

        {google ? (
          <GoogleButton next={next} />
        ) : process.env.NODE_ENV === "development" ? (
          <div className="mt-8 rounded-card bg-honey p-6">
            <p className="font-bold">Set up Google sign-in first.</p>
            <p className="mt-2">
              Create an OAuth client in Google Cloud and add these to{" "}
              <code>.env.local</code>, then reload this page:
            </p>
            <pre className="mt-3 overflow-x-auto rounded-xl bg-surface p-3 text-sm">
              {`GOOGLE_CLIENT_ID=…
GOOGLE_CLIENT_SECRET=…`}
            </pre>
          </div>
        ) : (
          <p className="mt-8 rounded-card bg-honey p-6">
            Signing in isn&apos;t available yet. Please check back soon.
          </p>
        )}

        <p className="mt-8 text-sm text-muted">
          Running the site?{" "}
          <Link href="/admin/login" className="font-bold underline">
            Admin sign-in
          </Link>
        </p>
      </div>
    </div>
  );
}
