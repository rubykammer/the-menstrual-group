import type { Metadata } from "next";
import { CookieChoice } from "@/components/CookieConsent";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy policy",
  description:
    "What The Menstrual Group collects, why, which cookies the site uses, and how to change your cookie choice.",
  path: "/privacy",
});

const updated = "24 November 2026";

export default function PrivacyPage() {
  return (
    <div className="page-width pt-12 sm:pt-16">
      <div className="max-w-2xl">
        <h1 className="text-4xl sm:text-5xl">Privacy policy</h1>
        <p className="mt-5 text-lg sm:text-xl">
          We collect as little as we can, never sell it, and never use it for
          advertising. Here&apos;s what that looks like in practice.
        </p>
        <p className="mt-3 text-sm text-muted">Last updated {updated}</p>

        <section className="mt-12">
          <h2 className="text-2xl sm:text-3xl">Cookies and local storage</h2>
          <ul className="mt-3 list-disc space-y-3 pl-6 text-lg">
            <li>
              <strong>Cookie choice</strong> (<code>tmg_consent</code>):
              remembers whether you accepted or declined analytics, for a year.
            </li>
            <li>
              <strong>Sign-in</strong> (<code>tmg_admin</code> and{" "}
              <code>tmg_admin_oauth</code>): keep you signed in for up to 30
              days, only if you sign in. They&apos;re needed for your account to
              work, so they don&apos;t depend on your cookie choice.
            </li>
            <li>
              <strong>Theme</strong>: if you switch between light and dark mode,
              your browser remembers it. This never leaves your device.
            </li>
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl sm:text-3xl">Analytics</h2>
          <p className="mt-3 text-lg">
            Only if you accept, we use Umami to count page views and a few
            actions (such as finishing a quiz or joining the newsletter), and
            Vercel Speed Insights to measure how fast pages load. They don&apos;t set
            cookies or build a profile of you, and we strip anything after the
            &quot;?&quot; in page addresses before it&apos;s sent. If you
            decline, none of this loads.
          </p>
          <CookieChoice />
        </section>

        <section className="mt-12">
          <h2 className="text-2xl sm:text-3xl">If you create an account</h2>
          <p className="mt-3 text-lg">
            Signing in with Google gives us your email address. We also keep
            what you choose to add: your display name, bio and photo, saved
            articles and products, quiz results, and forum posts. Forum posts
            and your profile name and photo are visible to other signed-in
            members.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl sm:text-3xl">The newsletter</h2>
          <p className="mt-3 text-lg">
            If you sign up, we store your email address and may pass it to
            Buttondown, the service that sends the newsletter, along with your
            IP address for its spam check. Every email has a link to
            unsubscribe.
          </p>
        </section>

        <section id="auntflo" className="mt-12">
          <h2 className="text-2xl sm:text-3xl">Chatting with AuntFlo</h2>
          <p className="mt-3 text-lg">
            AuntFlo, our chat helper, is powered by Gemini, an AI made by
            Google. What you type is sent to Google so it can write a reply. We
            don&apos;t save your chats or link them to your account, and the
            conversation is gone when you close the tab.
          </p>
          <p className="mt-3 text-lg">
            We use Google&apos;s free service, so Google may keep what you type
            and AuntFlo&apos;s replies and use them to improve its products,
            and its staff may review them. (If you&apos;re in the UK, the EU or
            Switzerland, Google doesn&apos;t use them this way.) Please
            don&apos;t share your name or anything else that identifies you.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl sm:text-3xl">Who else handles your data</h2>
          <p className="mt-3 text-lg">
            The site runs on Vercel, and account, forum and newsletter data is
            stored with Supabase. Google handles sign-in and writes
            AuntFlo&apos;s replies. Apart from AuntFlo chats (see above), each
            processes data only to provide its service to us.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl sm:text-3xl">Your rights</h2>
          <p className="mt-3 text-lg">
            You can ask to see, correct or delete the information we hold about
            you at any time, and you can change your cookie choice above
            whenever you like.
          </p>
        </section>
      </div>
    </div>
  );
}
