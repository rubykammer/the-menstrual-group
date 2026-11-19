import { getAdminSupabase } from "./admin";
import { avatarUrl, isMissingColumn } from "./profile";
import { isEnvAdmin, isMissingTable } from "./roles";

/**
 * The members' forum (supabase/forum.sql). Only the server reads and writes
 * it, with the secret key, after checking who's signed in. Email addresses
 * never leave the server: pages get a display name, a photo and whether the
 * viewer may delete each post.
 */

export const categories = [
  {
    slug: "products",
    label: "Products & tips",
    description: "Pads, cups, period pants and what works for you.",
  },
  {
    slug: "symptoms",
    label: "Pain & symptoms",
    description: "Cramps, heavy days and everything in between.",
  },
  {
    slug: "feelings",
    label: "Moods & feelings",
    description: "PMS, PMDD and the emotional side of a cycle.",
  },
  {
    slug: "supporting",
    label: "Supporting someone",
    description: "For partners, parents and friends.",
  },
  {
    slug: "chat",
    label: "General chat",
    description: "Anything else.",
  },
] as const;

export type CategorySlug = (typeof categories)[number]["slug"];

export function getCategory(slug: unknown) {
  return categories.find((category) => category.slug === slug);
}

export const TITLE_MIN = 3;
export const TITLE_MAX = 120;
export const BODY_MAX = 5000;

export type Author = {
  name: string;
  avatarUrl: string | null;
  isTeam: boolean;
};

type AuthorRow = {
  display_name: string | null;
  avatar_path: string | null;
  role: string | null;
} | null;

function toAuthor(email: string, row: AuthorRow): Author {
  return {
    name: row?.display_name?.trim() || "A member",
    avatarUrl: avatarUrl(row?.avatar_path ?? null),
    isTeam: row?.role === "admin" || isEnvAdmin(email),
  };
}

export type ThreadSummary = {
  id: number;
  category: string;
  title: string;
  postCount: number;
  lastPostAt: string;
  author: Author;
};

export type ForumResult<T> =
  | { status: "ok"; data: T }
  | { status: "not-set-up" }
  | { status: "error"; message: string };

function failure(error: { code?: string; message: string }) {
  if (isMissingTable(error) || isMissingColumn(error)) {
    return { status: "not-set-up" as const };
  }
  return { status: "error" as const, message: error.message };
}

const AUTHOR = "author:users(display_name, avatar_path, role)";

export async function listThreads(
  category?: string,
): Promise<ForumResult<ThreadSummary[]>> {
  const supabase = getAdminSupabase();
  if (!supabase) return { status: "not-set-up" };

  let query = supabase
    .from("forum_threads")
    .select(
      `id, category, title, post_count, last_post_at, author_email, ${AUTHOR}`,
    )
    .order("last_post_at", { ascending: false })
    .limit(100);
  if (category) query = query.eq("category", category);

  const { data, error } = await query;
  if (error) return failure(error);

  return {
    status: "ok",
    data: data.map((row) => ({
      id: row.id as number,
      category: row.category as string,
      title: row.title as string,
      postCount: row.post_count as number,
      lastPostAt: row.last_post_at as string,
      author: toAuthor(
        row.author_email as string,
        row.author as unknown as AuthorRow,
      ),
    })),
  };
}

export type Post = {
  id: number;
  body: string;
  createdAt: string;
  editedAt: string | null;
  author: Author;
  /** Only the author can edit. */
  canEdit: boolean;
  canDelete: boolean;
  isOpening: boolean;
};

export type Thread = {
  id: number;
  category: string;
  title: string;
  posts: Post[];
};

/**
 * A thread with its posts, oldest first. `viewer` decides which posts show a
 * delete button: your own, or any for admins.
 */
export async function getThread(
  id: number,
  viewer: { email: string | null; isAdmin: boolean },
): Promise<ForumResult<Thread | null>> {
  const supabase = getAdminSupabase();
  if (!supabase) return { status: "not-set-up" };

  const { data: thread, error } = await supabase
    .from("forum_threads")
    .select("id, category, title")
    .eq("id", id)
    .maybeSingle();
  if (error) return failure(error);
  if (!thread) return { status: "ok", data: null };

  const { data: posts, error: postsError } = await supabase
    .from("forum_posts")
    .select(`id, body, created_at, edited_at, author_email, ${AUTHOR}`)
    .eq("thread_id", id)
    .order("created_at", { ascending: true })
    .order("id", { ascending: true });
  if (postsError) return failure(postsError);

  const viewerEmail = viewer.email?.toLowerCase();
  return {
    status: "ok",
    data: {
      id: thread.id as number,
      category: thread.category as string,
      title: thread.title as string,
      posts: posts.map((row, index) => ({
        id: row.id as number,
        body: row.body as string,
        createdAt: row.created_at as string,
        editedAt: (row.edited_at as string | null) ?? null,
        author: toAuthor(
          row.author_email as string,
          row.author as unknown as AuthorRow,
        ),
        canEdit: row.author_email === viewerEmail,
        canDelete: viewer.isAdmin || row.author_email === viewerEmail,
        isOpening: index === 0,
      })),
    },
  };
}

const relative = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
const steps: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 365 * 24 * 60 * 60],
  ["month", 30 * 24 * 60 * 60],
  ["week", 7 * 24 * 60 * 60],
  ["day", 24 * 60 * 60],
  ["hour", 60 * 60],
  ["minute", 60],
];

/** "3 hours ago", which reads the same in every time zone. */
export function timeAgo(iso: string, now = Date.now()) {
  const seconds = (Date.parse(iso) - now) / 1000;
  for (const [unit, size] of steps) {
    if (Math.abs(seconds) >= size) {
      return relative.format(Math.round(seconds / size), unit);
    }
  }
  return "just now";
}

export type MyPost = {
  id: number;
  body: string;
  createdAt: string;
  editedAt: string | null;
  isOpening: boolean;
  thread: { id: number; title: string; category: string };
};

/** Everything someone has posted, newest first, with its conversation. */
export async function listMyPosts(
  email: string,
): Promise<ForumResult<MyPost[]>> {
  const supabase = getAdminSupabase();
  if (!supabase) return { status: "not-set-up" };

  const { data, error } = await supabase
    .from("forum_posts")
    .select(
      "id, body, created_at, edited_at, thread_id, thread:forum_threads(id, title, category)",
    )
    .eq("author_email", email.toLowerCase())
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) return failure(error);

  // Which of these posts opened their conversation.
  const threadIds = [...new Set(data.map((row) => row.thread_id as number))];
  const openingIds = new Set<number>();
  if (threadIds.length > 0) {
    const { data: firsts, error: firstsError } = await supabase
      .from("forum_posts")
      .select("id, thread_id")
      .in("thread_id", threadIds)
      .order("created_at", { ascending: true })
      .order("id", { ascending: true });
    if (firstsError) return failure(firstsError);
    const seen = new Set<number>();
    for (const row of firsts) {
      if (seen.has(row.thread_id as number)) continue;
      seen.add(row.thread_id as number);
      openingIds.add(row.id as number);
    }
  }

  return {
    status: "ok",
    data: data.flatMap((row) => {
      const thread = row.thread as unknown as {
        id: number;
        title: string;
        category: string;
      } | null;
      if (!thread) return [];
      return [
        {
          id: row.id as number,
          body: row.body as string,
          createdAt: row.created_at as string,
          editedAt: (row.edited_at as string | null) ?? null,
          isOpening: openingIds.has(row.id as number),
          thread,
        },
      ];
    }),
  };
}
