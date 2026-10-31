import Link from "next/link";
import Markdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { slugify } from "@/lib/posts";

const components: Components = {
  h2: ({ children }) => <h2 id={slugify(String(children))}>{children}</h2>,
  a: ({ href = "", children }) =>
    href.startsWith("/") ? (
      <Link href={href}>{children}</Link>
    ) : (
      <a href={href} rel="noopener noreferrer">
        {children}
      </a>
    ),
  // Keyboard users need focus on the wrapper to scroll a wide table
  table: ({ children }) => (
    <div className="table-scroll" role="region" aria-label="Table" tabIndex={0}>
      <table>{children}</table>
    </div>
  ),
};

export function ArticleBody({ content }: { content: string }) {
  return (
    <div className="article-body">
      <Markdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </Markdown>
    </div>
  );
}
