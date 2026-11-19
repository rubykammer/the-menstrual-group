import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductArt } from "@/components/illustrations/products";
import { FavoriteButton } from "@/components/FavoriteButton";
import { ProductCard } from "@/components/ProductCard";
import { getProduct, products } from "@/lib/products";

// Only listed products exist, so anything else is a real 404.
export const dynamicParams = false;

type ProductPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product = getProduct((await params).slug);
  if (!product) return {};
  return {
    title: `${product.name}: pros, cons and who they suit`,
    description: product.tagline,
  };
}

function Check() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="mt-1 size-5 shrink-0 text-primary-strong"
      aria-hidden="true"
    >
      <path
        d="M5 12.5l4.5 4.5L19 7.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Cross() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="mt-1 size-5 shrink-0 text-accent-strong"
      aria-hidden="true"
    >
      <path
        d="M7 7l10 10M17 7L7 17"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = getProduct((await params).slug);
  if (!product) notFound();

  const others = products.filter((other) => other.slug !== product.slug);
  const facts = [
    { label: "Worn", value: product.worn },
    { label: "How long", value: product.wearTime },
    { label: "Reusable?", value: product.reusable },
    { label: "Cost", value: product.cost },
  ];

  return (
    <>
      <article className="page-width pt-8 sm:pt-12">
        <nav aria-label="Breadcrumb" className="text-sm font-bold text-muted">
          <ol className="flex flex-wrap gap-2">
            <li>
              <Link
                href="/products"
                className="transition-colors duration-200 hover:text-primary-strong"
              >
                Period products
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">{product.name}</li>
          </ol>
        </nav>

        <header className="mt-6 grid items-center gap-8 lg:grid-cols-2">
          <div>
            <h1 className="text-4xl sm:text-6xl">{product.name}</h1>
            <p className="mt-4 text-lg sm:text-xl">{product.tagline}</p>
            <FavoriteButton
              kind="product"
              slug={product.slug}
              className="mt-6"
            />
          </div>
          <div className="aspect-[5/3] overflow-hidden rounded-card">
            <ProductArt slug={product.slug} fit="contain" />
          </div>
        </header>

        <dl className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {facts.map((fact) => (
            <div
              key={fact.label}
              className="rounded-card bg-surface p-5 shadow-soft"
            >
              <dt className="text-sm font-bold text-muted">{fact.label}</dt>
              <dd className="mt-1 font-bold">{fact.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-12 max-w-3xl">
          <section aria-labelledby="how-heading">
            <h2 id="how-heading" className="text-2xl sm:text-3xl">
              How it works
            </h2>
            {product.howItWorks.map((paragraph) => (
              <p key={paragraph} className="mt-4 text-lg">
                {paragraph}
              </p>
            ))}
          </section>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <section
            aria-labelledby="pros-heading"
            className="rounded-card bg-surface p-6 shadow-soft sm:p-8"
          >
            <h2 id="pros-heading" className="text-2xl">
              The good
            </h2>
            <ul className="mt-4 flex flex-col gap-3">
              {product.pros.map((pro) => (
                <li key={pro} className="flex gap-3">
                  <Check />
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </section>
          <section
            aria-labelledby="cons-heading"
            className="rounded-card bg-surface p-6 shadow-soft sm:p-8"
          >
            <h2 id="cons-heading" className="text-2xl">
              The not so good
            </h2>
            <ul className="mt-4 flex flex-col gap-3">
              {product.cons.map((con) => (
                <li key={con} className="flex gap-3">
                  <Cross />
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="mt-12 max-w-3xl">
          <section
            aria-labelledby="suits-heading"
            className="rounded-card bg-peach p-6 sm:p-8"
          >
            <h2 id="suits-heading" className="text-2xl sm:text-3xl">
              Could be good for you if…
            </h2>
            <ul className="mt-4 flex list-disc flex-col gap-2 pl-5 text-lg marker:text-primary-strong">
              {product.goodIf.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="tips-heading" className="mt-12">
            <h2 id="tips-heading" className="text-2xl sm:text-3xl">
              Tips
            </h2>
            <ul className="mt-4 flex list-disc flex-col gap-2 pl-5 text-lg marker:text-primary-strong">
              {product.tips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </section>

          {product.tssNote && (
            <aside
              aria-labelledby="tss-heading"
              className="mt-12 rounded-card border-2 border-accent-strong p-6 sm:p-8"
            >
              <h2 id="tss-heading" className="text-xl sm:text-2xl">
                Know the signs of toxic shock syndrome
              </h2>
              <p className="mt-3">
                Toxic shock syndrome (TSS) is rare but serious, and can happen
                with anything worn inside the vagina. Symptoms come on quickly
                and can include a sudden high temperature, vomiting or
                diarrhoea, a sunburn-like rash, and feeling dizzy or confused.
              </p>
              <p className="mt-3 font-bold">
                If you get these symptoms, take the product out and get medical
                help straight away. Say that you were using it.
              </p>
            </aside>
          )}

          <section aria-labelledby="sources-heading" className="mt-12">
            <h2 id="sources-heading" className="text-xl">
              Sources
            </h2>
            <ul className="mt-3 flex flex-col gap-2 text-muted">
              {product.sources.map((source) => (
                <li key={source.url}>
                  <a
                    href={source.url}
                    className="underline hover:text-primary-strong"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {source.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted">
              This page is general information, not medical advice. If something
              doesn&apos;t feel right, talk to a doctor or nurse.
            </p>
          </section>

          <div className="mt-12 rounded-card bg-surface p-6 shadow-soft sm:p-8">
            <h2 className="text-xl sm:text-2xl">
              Tried {product.name.toLowerCase()}?
            </h2>
            <p className="mt-2">
              Share what worked for you, or ask how others get on, in the forum.
            </p>
            <Link
              href="/forum?category=products"
              className="mt-4 inline-block font-extrabold text-primary-strong underline"
            >
              Talk about it in the forum
            </Link>
          </div>
        </div>
      </article>

      <section
        aria-labelledby="others-heading"
        className="page-width mt-16 mb-16"
      >
        <h2 id="others-heading" className="text-3xl sm:text-4xl">
          Other options
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((other) => (
            <ProductCard key={other.slug} product={other} />
          ))}
        </div>
      </section>
    </>
  );
}
