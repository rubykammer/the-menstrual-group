"use client";

import { ErrorMessage } from "@/components/ErrorMessage";

/** Shown when a page throws; the site header and footer stay in place. */
export default function Error({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  return (
    <>
      <title>Something went wrong | The Menstrual Group</title>
      <ErrorMessage error={error} retry={retry} />
    </>
  );
}
