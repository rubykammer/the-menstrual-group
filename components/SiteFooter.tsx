import Link from "next/link";
import { navLinks, site, topics } from "@/lib/site";
import { Logo } from "./Logo";
import { NewsletterSignup } from "./NewsletterSignup";

export function SiteFooter() {
  return (
    <footer className="mt-20">
      <NewsletterSignup />

      <div className="page-width grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]">
        <div className="max-w-md sm:col-span-2 lg:col-span-1">
          <Logo />
          <p className="mt-4 text-muted">{site.description}</p>
        </div>

        <nav aria-label="Explore">
          <h2 className="font-sans text-sm font-extrabold tracking-normal">
            Explore
          </h2>
          <ul className="mt-3 space-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="footer-link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Topics">
          <h2 className="font-sans text-sm font-extrabold tracking-normal">
            Topics
          </h2>
          <ul className="mt-3 space-y-2">
            {topics.map((topic) => (
              <li key={topic.slug}>
                <Link href={`/blog/topic/${topic.slug}`} className="footer-link">
                  {topic.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="bg-rose">
        <p className="page-width py-5 text-sm">
          This site is for general education and isn&apos;t a substitute for
          medical advice. If you&apos;re worried about your health, talk to a
          healthcare professional. In an emergency, call your local emergency
          number.
        </p>
      </div>
    </footer>
  );
}
