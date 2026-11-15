import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { adminConfigured, isSignedIn, waitForRequest } from "@/lib/admin";
import { SignInForm } from "./SignInForm";

export const metadata: Metadata = {
  title: "Admin sign-in",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  await waitForRequest();
  const configured = adminConfigured();
  if (!configured && process.env.NODE_ENV !== "development") notFound();
  if (await isSignedIn()) redirect("/admin");

  return (
    <div className="page-width pt-12 pb-16 sm:pt-16">
      <div className="max-w-md">
        <h1 className="text-4xl sm:text-5xl">Admin sign-in</h1>

        {configured ? (
          <SignInForm />
        ) : (
          <div className="mt-8 rounded-card bg-honey p-6">
            <p className="font-bold">Set an admin password first.</p>
            <p className="mt-2">
              Add a long password to <code>.env.local</code>, then reload this
              page:
            </p>
            <pre className="mt-3 overflow-x-auto rounded-xl bg-surface p-3 text-sm">
              ADMIN_PASSWORD=…
            </pre>
            <p className="mt-2 text-sm text-muted">
              Until it&apos;s set, the live site has no admin at all.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
