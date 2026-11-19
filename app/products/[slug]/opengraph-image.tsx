import { ogArt, ogContentType, ogImage, ogSize } from "@/lib/og";
import { getProduct, products } from "@/lib/products";

export const alt = "A period product guide from The Menstrual Group";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  return ogImage({
    title: product ? `${product.name}: the pros and cons` : "Period products",
    label: product ? `Period products · ${product.reusable}` : undefined,
    art: ogArt.product(slug),
  });
}
