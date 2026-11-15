/**
 * Set alongside the admin session so the header knows to show the Admin link.
 * It grants nothing on its own: every admin page and action checks the
 * session cookie, which the browser's scripts can't read.
 */
export const ADMIN_LINK_COOKIE = "tmg_admin_link";

export function hasAdminLinkCookie() {
  return document.cookie
    .split("; ")
    .some((cookie) => cookie === `${ADMIN_LINK_COOKIE}=1`);
}
