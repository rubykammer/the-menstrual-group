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
