# The Menstrual Group

A warm, friendly blog about menstrual cycles, for the people who have them and the partners who want to support them well. Built with Next.js, React and Tailwind CSS.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Writing an article

Add a Markdown file to `content/posts/`. The file name becomes the URL.

```md
---
title: "Your title"
excerpt: "One or two sentences for cards and search results."
date: 2026-11-01
topic: health # cycle-basics, health, everyday-life or for-partners
sources:
  - label: "Source name"
    url: "https://example.com"
---

Your article. Use `##` headings to fill the "In this article" list, and a `>` blockquote for a highlighted note.
```

## Deploying

Set `NEXT_PUBLIC_SITE_URL` to the live domain so that the sitemap and social links are correct.

## Design tokens

Colors live in `app/globals.css`. The brand orange, amber and pink don't reach 4.5:1 contrast on the cream background, so they're used for shapes and large headings. Body-sized text and buttons use the `-strong` shades.
