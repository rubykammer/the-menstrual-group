import { getAdminSupabase } from "./admin";
import { isMissingTable } from "./roles";

/**
 * Profiles live on the users table (supabase/profiles.sql) and photos in the
 * public `avatars` storage bucket. Only the server touches either, with the
 * secret key.
 */

export const AVATAR_BUCKET = "avatars";
export const DISPLAY_NAME_MAX = 60;
export const BIO_MAX = 280;
/** The browser shrinks photos to well under this before uploading. */
export const AVATAR_MAX_BYTES = 1024 * 1024;

export type Profile = {
  displayName: string;
  bio: string;
  avatarPath: string | null;
  avatarUrl: string | null;
};

// "Column doesn't exist", from Postgres and from PostgREST.
export function isMissingColumn(error: { code?: string }) {
  return error.code === "42703" || error.code === "PGRST204";
}

export function avatarUrl(path: string | null) {
  if (!path) return null;
  const supabase = getAdminSupabase();
  if (!supabase) return null;
  return supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path).data.publicUrl;
}

export type ProfileResult =
  | { status: "ok"; profile: Profile }
  | { status: "not-set-up" }
  | { status: "error"; message: string };

export async function getProfile(email: string): Promise<ProfileResult> {
  const supabase = getAdminSupabase();
  if (!supabase) return { status: "not-set-up" };

  const { data, error } = await supabase
    .from("users")
    .select("display_name, bio, avatar_path")
    .eq("email", email.toLowerCase())
    .maybeSingle();

  if (error && (isMissingTable(error) || isMissingColumn(error))) {
    return { status: "not-set-up" };
  }
  if (error) return { status: "error", message: error.message };

  const avatarPath = (data?.avatar_path as string | null) ?? null;
  return {
    status: "ok",
    profile: {
      displayName: (data?.display_name as string | null) ?? "",
      bio: (data?.bio as string | null) ?? "",
      avatarPath,
      avatarUrl: avatarUrl(avatarPath),
    },
  };
}

/**
 * Works out the image type from the file's first bytes rather than trusting
 * the name or the type the browser claims.
 */
export function sniffImage(bytes: Uint8Array) {
  const starts = (...values: number[]) =>
    values.every((value, i) => bytes[i] === value);
  if (starts(0x89, 0x50, 0x4e, 0x47)) return { type: "image/png", ext: "png" };
  if (starts(0xff, 0xd8, 0xff)) return { type: "image/jpeg", ext: "jpg" };
  const ascii = (from: number, to: number) =>
    String.fromCharCode(...bytes.slice(from, to));
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") {
    return { type: "image/webp", ext: "webp" };
  }
  return null;
}

/** Google profile photos are served from these hosts. */
function isGooglePhoto(url: URL) {
  return (
    url.protocol === "https:" && url.hostname.endsWith(".googleusercontent.com")
  );
}

/**
 * Downloads someone's Google photo and stores a copy in the avatars bucket,
 * so the site never depends on, or leaks visits to, Google's link.
 */
async function copyGooglePhoto(pictureUrl: string) {
  let url: URL;
  try {
    url = new URL(pictureUrl);
  } catch {
    return null;
  }
  if (!isGooglePhoto(url)) return null;
  // Google sizes photos with a suffix such as "=s96-c"; ask for a 512px square.
  url.pathname = url.pathname.replace(/=s\d+(-c)?$/, "");
  const sized = `${url.href}=s512-c`;

  const response = await fetch(sized, {
    cache: "no-store",
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) return null;
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.length === 0 || bytes.length > AVATAR_MAX_BYTES) return null;
  const image = sniffImage(bytes);
  if (!image) return null;

  const supabase = getAdminSupabase();
  if (!supabase) return null;
  const path = `${crypto.randomUUID()}.${image.ext}`;
  const { error } = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(path, bytes, { contentType: image.type });
  if (error) {
    console.error("Copying a Google photo failed:", error.message);
    return null;
  }
  return path;
}

/**
 * Auto-profile: the first time someone signs in with Google, fill in their
 * name and photo from their Google account. It only fills fields that are
 * still empty, and only once per person, so it never undoes their own edits.
 * Failures are logged and never stop the sign-in.
 */
export async function seedProfileFromGoogle(
  email: string,
  google: { name?: string; picture?: string },
) {
  const supabase = getAdminSupabase();
  if (!supabase) return;
  try {
    const { data: row, error } = await supabase
      .from("users")
      .select("display_name, avatar_path, profile_seeded_at")
      .eq("email", email.toLowerCase())
      .maybeSingle();
    if (error) {
      if (!isMissingTable(error) && !isMissingColumn(error)) {
        console.error("Reading a profile to seed failed:", error.message);
      }
      return;
    }
    if (!row || row.profile_seeded_at) return;

    const updates: Record<string, string> = {
      profile_seeded_at: new Date().toISOString(),
    };
    const name = google.name?.trim().slice(0, DISPLAY_NAME_MAX);
    if (!row.display_name && name) updates.display_name = name;
    if (!row.avatar_path && google.picture) {
      const path = await copyGooglePhoto(google.picture);
      if (path) updates.avatar_path = path;
    }

    const { error: updateError } = await supabase
      .from("users")
      .update(updates)
      .eq("email", email.toLowerCase());
    if (updateError) {
      console.error("Seeding a profile failed:", updateError.message);
    }
  } catch (error) {
    console.error("Seeding a profile failed:", error);
  }
}
