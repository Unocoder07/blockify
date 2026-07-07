/**
 * ---------------------------------------------------------------------------
 * TESTIMONIALS — shared types used by both the API routes and the UI.
 * ---------------------------------------------------------------------------
 */

export type TestimonialStatus = "pending" | "approved" | "rejected";

export interface Testimonial {
  id: string;
  name: string;
  /** Company / organization — optional. */
  company?: string;
  /** Role / profession — optional. */
  role?: string;
  /** Data-URL of an uploaded profile photo — optional. */
  photo?: string;
  /** 1–5 star rating. */
  rating: number;
  /** The feedback body. */
  message: string;
  status: TestimonialStatus;
  /** ISO-8601 submission timestamp. */
  createdAt: string;
}

/** The shape the public site receives — never leaks moderation metadata. */
export type PublicTestimonial = Pick<
  Testimonial,
  "id" | "name" | "company" | "role" | "photo" | "rating" | "message" | "createdAt"
>;

/** Fields a visitor may submit. */
export interface TestimonialInput {
  name: string;
  company?: string;
  role?: string;
  photo?: string;
  rating: number;
  message: string;
}

export const NAME_MAX = 80;
export const COMPANY_MAX = 80;
export const ROLE_MAX = 80;
export const MESSAGE_MAX = 800;
export const MESSAGE_MIN = 10;
/** Max size for a stored profile photo data-URL (~350 KB). */
export const PHOTO_MAX_CHARS = 350_000;

/**
 * Validate and normalize a raw submission payload. Returns the cleaned input
 * or a human-readable error string. Shared so the client and server agree.
 */
export function validateTestimonial(
  raw: unknown
): { ok: true; value: TestimonialInput } | { ok: false; error: string } {
  if (typeof raw !== "object" || raw === null) {
    return { ok: false, error: "Invalid request body." };
  }

  const body = raw as Record<string, unknown>;

  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) return { ok: false, error: "Full name is required." };
  if (name.length > NAME_MAX)
    return { ok: false, error: `Name must be ${NAME_MAX} characters or fewer.` };

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message) return { ok: false, error: "Feedback message is required." };
  if (message.length < MESSAGE_MIN)
    return {
      ok: false,
      error: `Feedback must be at least ${MESSAGE_MIN} characters.`,
    };
  if (message.length > MESSAGE_MAX)
    return {
      ok: false,
      error: `Feedback must be ${MESSAGE_MAX} characters or fewer.`,
    };

  const rating =
    typeof body.rating === "number"
      ? body.rating
      : Number.parseInt(String(body.rating ?? ""), 10);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5)
    return { ok: false, error: "Please choose a rating from 1 to 5 stars." };

  const company =
    typeof body.company === "string" ? body.company.trim().slice(0, COMPANY_MAX) : "";
  const role =
    typeof body.role === "string" ? body.role.trim().slice(0, ROLE_MAX) : "";

  let photo = "";
  if (typeof body.photo === "string" && body.photo.trim()) {
    const candidate = body.photo.trim();
    if (!candidate.startsWith("data:image/"))
      return { ok: false, error: "Profile photo must be an image." };
    if (candidate.length > PHOTO_MAX_CHARS)
      return {
        ok: false,
        error: "Profile photo is too large. Please choose a smaller image.",
      };
    photo = candidate;
  }

  return {
    ok: true,
    value: {
      name,
      message,
      rating,
      company: company || undefined,
      role: role || undefined,
      photo: photo || undefined,
    },
  };
}

/** Compute initials for the default avatar. */
export function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
