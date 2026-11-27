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

## Period products

`/products` lists period products, and each has its own page at `/products/<slug>` with how it works, pros and cons, who it might suit, tips, a toxic shock syndrome note for anything worn inside, and sources. The content lives in `lib/products.ts`; add an entry there to add a product, and a drawing for it in `components/illustrations/products.tsx`.

## AI helpers

Both use Google's Gemini API (free tier). Set `GEMINI_API_KEY` in your host's environment variables or `.env.local`; until then each says it isn't set up. Shared settings, such as the models tried in order, live in `lib/gemini.ts`.

- **AuntFlo** is the chat in the corner of every page (`components/AuntFlo.tsx`, `app/api/auntflo/route.ts`). Its instructions and the article library it draws on are in `lib/auntflo.ts`.
- **Help me say it** sits under "Say this, not that" on `/partners`, `/dads` and `/friends` (`components/SayItHelper.tsx`, `app/api/say-it/route.ts`). Visitors describe a moment and get three things they could say, one to avoid and a next step. The example prompts for each page are in `lib/say-it.ts`.

## Forum

`/forum` is a members-only forum. Anyone signed in with Google can start a conversation in one of the categories in `lib/forum.ts`, and reply to others. Posts are plain text and show the author's name and photo from their profile, never their email. People can remove their own posts, and admins can remove anyone's; removing a conversation's opening post removes the whole conversation. Each person can post at most 5 times a minute and start 5 conversations an hour.

Set it up once, after `supabase/users.sql` and `supabase/profiles.sql`: in Supabase, open SQL Editor → New query, paste in `supabase/forum.sql`, and run it. Until then, `/forum` says it isn't set up.

To let signed-out visitors read the forum, remove its line from `protectedPaths` in `lib/session.ts` and the `requireUser()` calls in `app/forum`, and think about search engines first: posts are personal.

## Deploying

Set `NEXT_PUBLIC_SITE_URL` to the live domain (for example `https://themenstrualgroup.com`) so canonical links, share images and the sitemap use it. On Vercel it falls back to the project's production domain if unset.

## Search and sharing

- Every public page sets its title, description, canonical link, and Open Graph and X (Twitter) cards with `pageMetadata()` from `lib/seo.ts`. Keep titles under about 40 characters, since " | The Menstrual Group" is added, and descriptions between 110 and 160.
- Share images are drawn in code: each `opengraph-image.tsx` picks a title, a label and one of the site's drawings, and `lib/og.tsx` draws the 1200 x 630 card with the site's fonts (in `assets/fonts`). New articles and products get one automatically.
- Articles include schema.org Article and breadcrumb data, product pages include breadcrumbs, and the home page describes the site, all with `components/JsonLd.tsx`.
- `app/sitemap.ts` lists every public page with its share image; `app/robots.ts` keeps private pages out of search.

## Newsletter

The signup form in the footer adds people to a [Buttondown](https://buttondown.com) list. Copy the API key from [your Buttondown settings](https://buttondown.com/requests) and set it as `BUTTONDOWN_API_KEY` in your host's environment variables, or in `.env.local` when running the site locally. Never commit the key, or give it a `NEXT_PUBLIC_` name.

New subscribers get a confirmation email from Buttondown before they join the list. Until the key is set, the form pretends every signup worked, on the live site too, but nothing is saved, so those addresses are lost.

## Design tokens

Colors live in `app/globals.css`. The brand orange, amber and pink don't reach 4.5:1 contrast on the cream background, so they're used for shapes and large headings. Body-sized text and buttons use the `-strong` shades.

## Sign-in and roles

There are two roles. **Members** are anyone who signs in with Google at `/login`. **Admins** can do everything members can, plus use `/admin`. Someone is an admin if any of these is true:

- their address is in `ADMIN_EMAILS` (these can't be changed from the admin page, so there's always a way in)
- an admin made them one in the **Users** section of `/admin`
- they signed in with `ADMIN_PASSWORD` at `/admin/login`

Roles are checked on every page load, so a change takes effect straight away. Taking admin away leaves that person signed in as a member. Sessions last 30 days.

The Users section lists everyone who has signed in with Google, saved in a Supabase `users` table. Create it once: in Supabase, open SQL Editor → New query, paste in `supabase/users.sql`, and run it. People appear in the list the next time they sign in. Until the table exists, only `ADMIN_EMAILS` and the password make someone an admin. Admins can't change their own role.

Which pages need which role is set in `protectedPaths` in `lib/session.ts`: today `/account` needs a member and `/admin` needs an admin. To put another page behind sign-in, add its path there. `proxy.ts` sends visitors without the role to sign in first, and the page should also call `requireUser()` or `requireAdmin()` from `lib/auth.ts` (and so should every server action and route that reads or changes private data), since the proxy only reads the cookie.

The header's person icon links to `/account`, which shows who you're signed in as and lets you sign out.

## Profiles

The first time someone signs in with Google, their profile starts with their Google name and a copy of their Google photo (auto-profile). It only fills fields that are empty, and only once, so it never undoes their own changes. Signed-in members edit their profile at `/account`: a name (up to 60 characters), a short bio (up to 280) and a photo. The browser crops the photo to a square, shrinks it to 512px and uploads it through a server action. The server checks it really is a JPG, PNG or WebP under 1MB, stores it under a random name in Supabase's public `avatars` bucket, and deletes the old one. Photo links are public, so anyone who has one can see the photo.

Set it up once, after `supabase/users.sql`: in Supabase, open SQL Editor → New query, paste in `supabase/profiles.sql`, and run it. It adds the profile columns to the `users` table and creates the bucket. Until then, `/account` says profiles aren't set up. People signed in with the admin password have no profile, because the password isn't tied to anyone.

## Your account

Signed-in members have four pages under `/account`:

- **Profile**: name, bio and photo (see Profiles).
- **Your posts**: everything they've written in the forum, newest first, with Edit and Remove. Editing a conversation's opening post can change its title too. Only authors can edit; edited posts say "(edited)".
- **Favourites**: articles and products saved with the **Save to favourites** button on each article and product page.
- **Quiz results**: every quiz finished while signed in, with latest and best scores and progress over time. "How to improve" lists the questions missed last time, the better answer, why, and an article to read (set per question in `lib/quiz-results.ts`). Scores are worked out on the server from the answers.

Set it up once, after `supabase/forum.sql`: run `supabase/activity.sql` in Supabase's SQL Editor. It adds the favourites and quiz results tables and the edited time on forum posts.

## Admin

[/admin](http://localhost:3000/admin) manages newsletter signups with full CRUD (add, list and search, edit, remove, plus CSV download) and the published articles. Sign in at `/admin/login` with Google (only addresses in `ADMIN_EMAILS` get in) or, if `ADMIN_PASSWORD` is set, with the password. The header links to it for everyone. Changing the password signs out password sessions.

### Google sign-in

1. In [Google Cloud Console](https://console.cloud.google.com/apis/credentials), create a project if you don't have one, set up the OAuth consent screen (External, app name, your email), then **Create credentials → OAuth client ID → Web application**.
2. Under **Authorized redirect URIs**, add both:
   - `http://localhost:3000/admin/login/google/callback`
   - `https://<your-domain>/admin/login/google/callback`
3. Copy the client ID and secret into the settings below.

While the consent screen is in "Testing", only test users you add can sign in, admins and members alike, so publish the app before opening sign-in to everyone (the `email` and `profile` scopes need no review).

### Settings

Set these in `.env.local` locally and in Vercel under Settings → Environment Variables for the live site:

- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`: from the OAuth client above. With just these set, anyone can sign in as a member. Never commit the secret or give it a `NEXT_PUBLIC_` name. Changing it signs out every Google session.
- `ADMIN_EMAILS`: comma-separated Google addresses that get the admin role, e.g. `you@gmail.com,friend@gmail.com`.
- `ADMIN_PASSWORD` (optional): a long random password for signing in without Google. Leave it unset to allow Google only. Without either Google or a password, the live site has no admin at all (every `/admin` URL is a 404).
- `SUPABASE_SECRET_KEY`: a **secret** key from Supabase (Project Settings → API Keys), which lets the admin read and delete signups. It bypasses Row Level Security, so never commit it or give it a `NEXT_PUBLIC_` name.
- `NEXT_PUBLIC_UMAMI_WEBSITE_ID`: the website ID from Umami Cloud (the site's Settings page). Set it for **Production only** in Vercel, and leave it out of `.env.local`, so local and preview visits aren't counted. Unset means no analytics. Visitors are only counted after they accept the cookie banner; the events sent are listed in `lib/analytics.ts`. `NEXT_PUBLIC_UMAMI_HOST` (optional) points at a self-hosted Umami instead.
