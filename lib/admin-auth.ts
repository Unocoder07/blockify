import { timingSafeEqual } from "node:crypto";

/**
 * Admin gate for testimonial moderation.
 *
 * The token is read from the ADMIN_TOKEN env var. A dev fallback keeps local
 * development friction-free; ALWAYS set ADMIN_TOKEN in production.
 */
const DEV_FALLBACK = "blockify-admin";

export function adminToken(): string {
  return process.env.ADMIN_TOKEN?.trim() || DEV_FALLBACK;
}

function safeEquals(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/**
 * Returns true when the request carries a valid admin token, supplied either as
 * `Authorization: Bearer <token>` or an `x-admin-token` header.
 */
export function isAuthorized(request: Request): boolean {
  const expected = adminToken();

  const header = request.headers.get("authorization");
  const bearer = header?.toLowerCase().startsWith("bearer ")
    ? header.slice(7).trim()
    : "";
  const custom = request.headers.get("x-admin-token")?.trim() ?? "";

  const provided = bearer || custom;
  if (!provided) return false;
  return safeEquals(provided, expected);
}
