import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import {
  adminConfigured,
  googleConfigured,
  isSignedIn,
  waitForRequest,
} from "@/lib/admin";
import { SignInForm } from "./SignInForm";

export const metadata: Metadata = {
  title: "Admin sign-in",
  robots: { index: false, follow: false },
};

const errors: Record<string, string> = {
  "not-allowed": "That Google account isn't on the admin list.",
  google: "Google sign-in didn't finish. Please try again.",
};

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="h-5 w-5">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"
      />
    </svg>
  );
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  await waitForRequest();
  const configured = adminConfigured();
  if (!configured && process.env.NODE_ENV !== "development") notFound();
  if (await isSignedIn()) redirect("/admin");

  const google = googleConfigured();
  const hasPassword = Boolean(process.env.ADMIN_PASSWORD);
  const { error } = await searchParams;
  const message = typeof error === "string" ? errors[error] : undefined;

  return (
    <div className="page-width pt-12 pb-16 sm:pt-16">
      <div className="max-w-md">
        <h1 className="text-4xl sm:text-5xl">Admin sign-in</h1>

        {message && (
          <p role="alert" className="mt-6 rounded-card bg-blush p-4">
            {message}
          </p>
        )}

        {google && (
          <a
            href="/admin/login/google"
            className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-full border-2 border-line bg-surface px-6 py-3 font-extrabold hover:border-primary-strong"
          >
            <GoogleIcon />
            Sign in with Google
          </a>
        )}

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
              For Google sign-in, create an OAuth client in Google Cloud and
              add these to <code>.env.local</code>, then reload this page:
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
