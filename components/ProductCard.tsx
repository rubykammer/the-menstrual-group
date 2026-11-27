import Link from "next/link";
import type { Product } from "@/lib/products";
import { ProductArt } from "./illustrations/products";

export function ProductCard({
  product,
  headingLevel: Heading = "h3",
}: {
  product: Product;
  headingLevel?: "h2" | "h3";
}) {
  return (
    <article className="reveal group relative flex flex-col overflow-hidden rounded-card bg-surface shadow-soft transition-all duration-300 focus-within:shadow-lg hover:shadow-lg motion-safe:hover:-translate-y-1">
      <div className="aspect-[5/3] shrink-0 overflow-hidden">
        <ProductArt
          slug={product.slug}
          className="transition-transform duration-500 motion-safe:group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-sm font-extrabold tracking-wide text-primary-strong uppercase">
          {product.worn} · {product.reusable}
        </p>
        <Heading className="mt-2 text-xl transition-colors duration-200 group-hover:text-primary-strong sm:text-2xl">
          <Link
            href={`/products/${product.slug}`}
            className="after:absolute after:inset-0"
          >
            {product.name}
          </Link>
        </Heading>
        <p className="mt-3 text-muted">{product.tagline}</p>
      </div>
    </article>
  );
}
