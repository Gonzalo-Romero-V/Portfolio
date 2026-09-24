import "server-only";
import { timingSafeEqual } from "node:crypto";

/** Single shared secret, compared server-side against process.env.ADMIN_SECRET
    — no user table, no sessions: one admin, one passphrase, sent with every
    protected request (kept in memory client-side, never persisted — see
    components/admin/admin-console.tsx). Good enough for a solo-admin
    portfolio tool, not meant to hold up to a high-value target. */
export function isValidAdminSecret(candidate: string): boolean {
  const expected = process.env.ADMIN_SECRET;
  if (!expected || candidate.length === 0) return false;

  const a = Buffer.from(candidate);
  const b = Buffer.from(expected);
  // timingSafeEqual throws on a length mismatch, and the lengths involved
  // here (a short passphrase) aren't sensitive enough to justify padding to
  // a fixed size just to hide that comparison.
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
