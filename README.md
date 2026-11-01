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

## Newsletter

The signup form in the footer adds people to a [Buttondown](https://buttondown.com) list. Copy the API key from [your Buttondown settings](https://buttondown.com/requests) and set it as `BUTTONDOWN_API_KEY` in your host's environment variables, or in `.env.local` when running the site locally. Never commit the key, or give it a `NEXT_PUBLIC_` name.

New subscribers get a confirmation email from Buttondown before they join the list. Until the key is set, the form shows an error message.

## Design tokens

Colors live in `app/globals.css`. Rosewood doesn't reach 4.5:1 contrast on the paper background, so it's used for shapes and large headings, and body-sized text uses the `-strong` shades. Rose, sage, sky and honey are backgrounds only: put ink on them, never use them for text.
