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

New subscribers get a confirmation email from Buttondown before they join the list. Until the key is set, the form pretends every signup worked, on the live site too, but nothing is saved, so those addresses are lost.

## Design tokens

Colors live in `app/globals.css`. The brand orange, amber and pink don't reach 4.5:1 contrast on the cream background, so they're used for shapes and large headings. Body-sized text and buttons use the `-strong` shades.

## Admin

[/admin](http://localhost:3000/admin) lists newsletter signups (with search, CSV download and removal) and the published articles. Sign in at `/admin/login` with the password in `ADMIN_PASSWORD`. Once you're signed in, an Admin link appears in the header. Sessions last 30 days, and changing the password signs everyone out.

It needs two settings, in `.env.local` locally and in Vercel under Settings → Environment Variables for the live site:

- `ADMIN_PASSWORD`: a long random password. Without it, the live site has no admin at all (every `/admin` URL is a 404).
- `SUPABASE_SECRET_KEY`: a **secret** key from Supabase (Project Settings → API Keys), which lets the admin read and delete signups. It bypasses Row Level Security, so never commit it or give it a `NEXT_PUBLIC_` name.
