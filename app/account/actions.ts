"use server";

import { randomUUID } from "node:crypto";
import { refresh } from "next/cache";
import { getAdminSupabase } from "@/lib/admin";
import { requireUser } from "@/lib/auth";
import {
  AVATAR_BUCKET,
  AVATAR_MAX_BYTES,
  BIO_MAX,
  DISPLAY_NAME_MAX,
  isMissingColumn,
  sniffImage,
} from "@/lib/profile";
import { isMissingTable } from "@/lib/roles";

export type ProfileFormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

const failed = (message: string): ProfileFormState => ({
  status: "error",
  message,
});

export async function saveProfile(
  _state: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const session = await requireUser("/account");
  if (!session.email) {
    return failed("Profiles are for Google sign-ins, not the admin password.");
  }
  const email = session.email.toLowerCase();

  const displayName = String(formData.get("displayName") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  if (displayName.length > DISPLAY_NAME_MAX) {
    return failed(`Keep your name to ${DISPLAY_NAME_MAX} characters.`);
  }
  if (bio.length > BIO_MAX) {
    return failed(`Keep your bio to ${BIO_MAX} characters.`);
  }

  const supabase = getAdminSupabase();
  if (!supabase) return failed("Profiles aren't set up yet.");

  const { data: current, error: readError } = await supabase
    .from("users")
    .select("avatar_path")
    .eq("email", email)
    .maybeSingle();
  if (readError) {
    if (isMissingTable(readError) || isMissingColumn(readError)) {
      return failed("Profiles aren't set up yet.");
    }
    console.error("Reading a profile failed:", readError.message);
    return failed("Couldn't save. Please try again.");
  }
  const oldPath = (current?.avatar_path as string | null) ?? null;
  let avatarPath = oldPath;

  const avatar = formData.get("avatar");
  if (avatar instanceof File && avatar.size > 0) {
    if (avatar.size > AVATAR_MAX_BYTES) {
      return failed("That photo is too big. Please choose a smaller one.");
    }
    const bytes = new Uint8Array(await avatar.arrayBuffer());
    const image = sniffImage(bytes);
    if (!image) return failed("Please choose a JPG, PNG or WebP photo.");

    // A new name each time, so browsers never show a cached old photo. It
    // isn't based on the email, because photo links are public.
    const path = `${randomUUID()}.${image.ext}`;
    const { error } = await supabase.storage
      .from(AVATAR_BUCKET)
      .upload(path, bytes, { contentType: image.type });
    if (error) {
      console.error("Uploading a photo failed:", error.message);
      return failed("Couldn't upload that photo. Please try again.");
    }
    avatarPath = path;
  } else if (formData.get("removeAvatar") === "1") {
    avatarPath = null;
  }

  const { error } = await supabase.from("users").upsert(
    {
      email,
      display_name: displayName || null,
      bio: bio || null,
      avatar_path: avatarPath,
    },
    { onConflict: "email" },
  );
  if (error) {
    console.error("Saving a profile failed:", error.message);
    // Don't leave a photo behind that nothing points to.
    if (avatarPath && avatarPath !== oldPath) {
      await supabase.storage.from(AVATAR_BUCKET).remove([avatarPath]);
    }
    return failed("Couldn't save. Please try again.");
  }

  if (oldPath && oldPath !== avatarPath) {
    const { error: removeError } = await supabase.storage
      .from(AVATAR_BUCKET)
      .remove([oldPath]);
    if (removeError) {
      console.error("Removing an old photo failed:", removeError.message);
    }
  }

  refresh();
  return { status: "success", message: "Saved." };
}
