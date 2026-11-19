import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/lib/products";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Period products compared",
  description:
    "Pads, tampons, cups, discs, period underwear and more: how each one works, the pros and cons, and who it might suit.",
  path: "/products",
  shareTitle: "Period products compared: pads, tampons, cups and more",
});

export default function ProductsPage() {
  return (
    <>
      <header className="page-width pt-12 sm:pt-16">
        <h1 className="max-w-3xl text-4xl sm:text-6xl">
          Find the period product that{" "}
          <span className="text-primary">suits you</span>.
        </h1>
        <p className="mt-5 max-w-2xl text-lg sm:text-xl">
          There&apos;s no best product, only the one that fits your body, your
          flow and your day. Lots of people use more than one. Here&apos;s how
          each works, and the honest pros and cons.
        </p>
      </header>

      <section aria-labelledby="products-heading" className="page-width mt-12">
        <h2 id="products-heading" className="sr-only">
          All products
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <section aria-labelledby="compare-heading" className="page-width mt-16">
        <h2 id="compare-heading" className="text-3xl sm:text-4xl">
          At a glance
        </h2>
        <div className="mt-6 overflow-x-auto rounded-card bg-surface shadow-soft">
          <table className="w-full min-w-[40rem] text-left">
            <thead className="border-b border-line text-sm text-muted">
              <tr>
                <th scope="col" className="px-5 py-3 font-extrabold">
                  Product
                </th>
                <th scope="col" className="px-5 py-3 font-extrabold">
                  Worn
                </th>
                <th scope="col" className="px-5 py-3 font-extrabold">
                  How long
                </th>
                <th scope="col" className="px-5 py-3 font-extrabold">
                  Reusable?
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {products.map((product) => (
                <tr key={product.slug}>
                  <th scope="row" className="px-5 py-3 font-bold">
                    <Link
                      href={`/products/${product.slug}`}
                      className="hover:text-primary-strong"
                    >
                      {product.name}
                    </Link>
                  </th>
                  <td className="px-5 py-3">{product.worn}</td>
                  <td className="px-5 py-3">{product.wearTime}</td>
                  <td className="px-5 py-3">{product.reusable}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 max-w-2xl text-muted">
          Change sooner if your flow is heavy or a product feels full. If you
          regularly soak through a pad or tampon every hour or two, talk to a
          doctor: it could be a heavy period worth checking.
        </p>
      </section>

      <section className="page-width mt-16 mb-16">
        <div className="rounded-card bg-peach p-8 sm:p-10">
          <h2 className="text-2xl sm:text-3xl">What do other people use?</h2>
          <p className="mt-3 max-w-2xl text-lg">
            Ask questions and swap experiences with other members in the forum.
          </p>
          <Link
            href="/forum?category=products"
            className="mt-6 inline-block rounded-full bg-primary-strong px-6 py-3 font-extrabold text-on-primary hover:bg-primary-hover"
          >
            Go to the forum
          </Link>
        </div>
      </section>
    </>
  );
}
