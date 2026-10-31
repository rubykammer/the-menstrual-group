import type { Metadata } from "next";
import { BlogListing } from "@/components/BlogListing";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Plain-spoken articles on menstrual cycles, health and everyday life.",
};

export default function BlogPage() {
  return <BlogListing posts={getAllPosts()} />;
}
