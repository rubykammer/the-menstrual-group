import type { Metadata } from "next";
import { BlogListing } from "@/components/BlogListing";
import { getAllPosts } from "@/lib/posts";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Articles on periods, cycles and health",
  description:
    "Plain-spoken articles on menstrual cycles, period pain, PMS and PMDD, period products, and how to support someone who has a period.",
  path: "/blog",
});

export default function BlogPage() {
  return <BlogListing posts={getAllPosts()} />;
}
