import { NextResponse } from "next/server";

import { isAuthorized } from "@/lib/admin-auth";
import {
  COMPANY_MAX,
  MESSAGE_MAX,
  MESSAGE_MIN,
  NAME_MAX,
  PHOTO_MAX_CHARS,
  ROLE_MAX,
  type TestimonialStatus,
} from "@/lib/testimonials";
import {
  deleteTestimonial,
  updateTestimonial,
  type TestimonialPatch,
} from "@/lib/testimonials-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STATUSES: TestimonialStatus[] = ["pending", "approved", "rejected"];

type RouteContext = { params: Promise<{ id: string }> };

/**
 * PATCH /api/testimonials/admin/:id
 * Approve / reject (via `status`) and/or edit fields. Admin-only.
 */
export async function PATCH(request: Request, ctx: RouteContext) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await ctx.params;

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const patch: TestimonialPatch = {};

  if (body.status !== undefined) {
    if (!STATUSES.includes(body.status as TestimonialStatus)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }
    patch.status = body.status as TestimonialStatus;
  }

  if (body.name !== undefined) {
    const name = String(body.name).trim();
    if (!name || name.length > NAME_MAX)
      return NextResponse.json({ error: "Invalid name." }, { status: 400 });
    patch.name = name;
  }

  if (body.message !== undefined) {
    const message = String(body.message).trim();
    if (message.length < MESSAGE_MIN || message.length > MESSAGE_MAX)
      return NextResponse.json({ error: "Invalid message." }, { status: 400 });
    patch.message = message;
  }

  if (body.rating !== undefined) {
    const rating = Number(body.rating);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5)
      return NextResponse.json({ error: "Invalid rating." }, { status: 400 });
    patch.rating = rating;
  }

  if (body.company !== undefined) {
    patch.company = String(body.company).trim().slice(0, COMPANY_MAX) || undefined;
  }

  if (body.role !== undefined) {
    patch.role = String(body.role).trim().slice(0, ROLE_MAX) || undefined;
  }

  if (body.photo !== undefined) {
    const photo = String(body.photo).trim();
    if (!photo) {
      patch.photo = undefined;
    } else if (!photo.startsWith("data:image/") || photo.length > PHOTO_MAX_CHARS) {
      return NextResponse.json({ error: "Invalid photo." }, { status: 400 });
    } else {
      patch.photo = photo;
    }
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "No changes provided." }, { status: 400 });
  }

  const updated = await updateTestimonial(id, patch);
  if (!updated) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  return NextResponse.json({ testimonial: updated });
}

/** DELETE /api/testimonials/admin/:id — remove a testimonial. Admin-only. */
export async function DELETE(request: Request, ctx: RouteContext) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await ctx.params;
  const removed = await deleteTestimonial(id);
  if (!removed) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  return NextResponse.json({ message: "Deleted." });
}
