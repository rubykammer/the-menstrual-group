import { ButtonLink } from "@/components/ButtonLink";

export default function NotFound() {
  return (
    <div className="page-width py-24 text-center">
      <h1 className="text-4xl sm:text-5xl">We can&apos;t find that page</h1>
      <p className="mt-4 text-lg text-muted">
        It may have moved, or the link might be off by a character or two.
      </p>
      <ButtonLink href="/blog" className="mt-8">
        Go to the blog
      </ButtonLink>
    </div>
  );
}
