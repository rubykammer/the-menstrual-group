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

[/admin](http://localhost:3000/admin) manages newsletter signups with full CRUD (add, list and search, edit, remove, plus CSV download) and the published articles. Sign in at `/admin/login` with Google (only addresses in `ADMIN_EMAILS` get in) or, if `ADMIN_PASSWORD` is set, with the password. The header links to it for everyone. Sessions last 30 days. Removing an address from `ADMIN_EMAILS` signs that person out; changing the password signs out password sessions.

### Google sign-in

1. In [Google Cloud Console](https://console.cloud.google.com/apis/credentials), create a project if you don't have one, set up the OAuth consent screen (External, app name, your email), then **Create credentials → OAuth client ID → Web application**.
2. Under **Authorized redirect URIs**, add both:
   - `http://localhost:3000/admin/login/google/callback`
   - `https://<your-domain>/admin/login/google/callback`
3. Copy the client ID and secret into the settings below.

While the consent screen is in "Testing", add each admin as a test user, or publish the app (the `email` scope needs no review).

### Settings

Set these in `.env.local` locally and in Vercel under Settings → Environment Variables for the live site:

- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`: from the OAuth client above. Never commit the secret or give it a `NEXT_PUBLIC_` name. Changing it signs out every Google session.
- `ADMIN_EMAILS`: comma-separated Google addresses allowed in, e.g. `you@gmail.com,friend@gmail.com`.
- `ADMIN_PASSWORD` (optional): a long random password for signing in without Google. Leave it unset to allow Google only. Without either Google or a password, the live site has no admin at all (every `/admin` URL is a 404).
- `SUPABASE_SECRET_KEY`: a **secret** key from Supabase (Project Settings → API Keys), which lets the admin read and delete signups. It bypasses Row Level Security, so never commit it or give it a `NEXT_PUBLIC_` name.
