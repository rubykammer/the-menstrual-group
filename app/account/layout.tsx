import type { Metadata } from "next";
import { AccountNav } from "./AccountNav";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/**
 * Every /account page: a heading and the section menu. Each page checks
 * sign-in itself with requireUser(); proxy.ts also guards /account.
 */
export default function AccountLayout({ children }: LayoutProps<"/account">) {
  return (
    <div className="page-width pt-12 pb-16 sm:pt-16">
      <h1 className="text-4xl sm:text-5xl">Your account</h1>
      <AccountNav />
      <div className="mt-8">{children}</div>
    </div>
  );
}
