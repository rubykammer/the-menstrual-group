"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import { Avatar } from "@/components/Avatar";
import { PROFILE_UPDATED } from "@/components/SiteHeader";
import { BIO_MAX, DISPLAY_NAME_MAX, type Profile } from "@/lib/profile";
import { saveProfile, type ProfileFormState } from "./actions";

const AVATAR_PIXELS = 512;
const initial: ProfileFormState = { status: "idle" };

/**
 * Crops the photo to a centred square and shrinks it, so uploads are small
 * (well under the 1MB server action limit) and every avatar is the same shape.
 */
async function squareAvatar(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const side = Math.min(bitmap.width, bitmap.height);
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = Math.min(AVATAR_PIXELS, side);
  canvas
    .getContext("2d")!
    .drawImage(
      bitmap,
      (bitmap.width - side) / 2,
      (bitmap.height - side) / 2,
      side,
      side,
      0,
      0,
      canvas.width,
      canvas.height,
    );
  bitmap.close();

  const encode = (type: string) =>
    new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.85));
  // Browsers that can't write WebP hand back a PNG, which is far bigger.
  const webp = await encode("image/webp");
  if (webp?.type === "image/webp") return webp;
  const jpeg = await encode("image/jpeg");
  if (!jpeg) throw new Error("Couldn't encode the photo");
  return jpeg;
}

export function ProfileForm({
  profile,
  email,
}: {
  profile: Profile;
  email: string;
}) {
  const ids = useId();
  const fileInput = useRef<HTMLInputElement>(null);
  const [photo, setPhoto] = useState<{ blob: Blob; url: string } | null>(null);
  const [removing, setRemoving] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [name, setName] = useState(profile.displayName);
  const [bio, setBio] = useState(profile.bio);

  const [state, action, pending] = useActionState(
    async (previous: ProfileFormState, formData: FormData) => {
      if (photo) {
        const ext = photo.blob.type === "image/webp" ? "webp" : "jpg";
        formData.set("avatar", photo.blob, `avatar.${ext}`);
      }
      const result = await saveProfile(previous, formData);
      // Once saved, the page shows the uploaded photo, so drop the local copy.
      if (result.status === "success") {
        window.dispatchEvent(new Event(PROFILE_UPDATED));
        setPhoto(null);
        setRemoving(false);
        if (fileInput.current) fileInput.current.value = "";
      }
      return result;
    },
    initial,
  );

  // Free the preview's memory when it's replaced.
  useEffect(() => {
    return () => {
      if (photo) URL.revokeObjectURL(photo.url);
    };
  }, [photo]);

  async function choosePhoto(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setPhotoError(null);
    try {
      const blob = await squareAvatar(file);
      setPhoto({ blob, url: URL.createObjectURL(blob) });
      setRemoving(false);
    } catch {
      setPhotoError(
        "Couldn't read that photo. Please choose a JPG, PNG or WebP.",
      );
      event.target.value = "";
    }
  }

  const shownPhoto = photo?.url ?? (removing ? null : profile.avatarUrl);
  const hasPhoto = shownPhoto !== null;

  return (
    <form action={action} className="flex flex-col gap-6">
      <input type="hidden" name="removeAvatar" value={removing ? "1" : ""} />

      <div className="flex flex-wrap items-center gap-5">
        <Avatar src={shownPhoto} name={name || email} size={96} />
        <div className="flex flex-col items-start gap-2">
          <div className="flex flex-wrap gap-2">
            <label
              htmlFor={`${ids}-photo`}
              className="cursor-pointer rounded-full border-2 border-primary-strong px-4 py-1.5 font-extrabold text-primary-strong hover:bg-primary-strong hover:text-on-primary has-[:focus-visible]:outline-2"
            >
              {hasPhoto ? "Change photo" : "Add a photo"}
              {/* No name: the cropped copy is sent instead of the original. */}
              <input
                ref={fileInput}
                id={`${ids}-photo`}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/heic"
                onChange={choosePhoto}
                className="sr-only"
                aria-describedby={photoError ? `${ids}-photo-error` : undefined}
              />
            </label>
            {hasPhoto && (
              <button
                type="button"
                onClick={() => {
                  setPhoto(null);
                  setRemoving(true);
                  if (fileInput.current) fileInput.current.value = "";
                }}
                className="rounded-full px-4 py-1.5 font-bold text-muted hover:bg-peach hover:text-primary-strong"
              >
                Remove photo
              </button>
            )}
          </div>
          {photoError ? (
            <p
              id={`${ids}-photo-error`}
              role="alert"
              className="text-sm text-accent-strong"
            >
              {photoError}
            </p>
          ) : (
            <p className="text-sm text-muted">
              {photo || removing
                ? "Save to keep this change."
                : "Cropped to a square. Anyone with the link can see it."}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor={`${ids}-name`} className="font-bold">
          Name
        </label>
        <input
          id={`${ids}-name`}
          name="displayName"
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={DISPLAY_NAME_MAX}
          autoComplete="name"
          placeholder="What should we call you?"
          className="rounded-full border-2 border-line bg-background px-4 py-2.5"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between gap-2">
          <label htmlFor={`${ids}-bio`} className="font-bold">
            About you
          </label>
          <span className="text-sm text-muted" aria-live="polite">
            {bio.length}/{BIO_MAX}
          </span>
        </div>
        <textarea
          id={`${ids}-bio`}
          name="bio"
          value={bio}
          onChange={(event) => setBio(event.target.value)}
          maxLength={BIO_MAX}
          rows={3}
          placeholder="A line or two, if you like."
          className="resize-y rounded-2xl border-2 border-line bg-background px-4 py-2.5"
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-primary-strong px-6 py-3 font-extrabold text-on-primary hover:bg-primary-hover disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save profile"}
        </button>
        <p
          role="status"
          className={
            state.status === "error" ? "text-accent-strong" : "text-muted"
          }
        >
          {pending ? "" : state.message}
        </p>
      </div>
    </form>
  );
}
