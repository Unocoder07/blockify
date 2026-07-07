import { NextResponse } from "next/server";

import { isAuthorized } from "@/lib/admin-auth";
import type { TestimonialStatus } from "@/lib/testimonials";
import { listAll } from "@/lib/testimonials-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STATUSES: TestimonialStatus[] = ["pending", "approved", "rejected"];

/**
 * GET /api/testimonials/admin?status=pending|approved|rejected
 * Admin-only: returns every testimonial (optionally filtered), newest first.
 */
export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const url = new URL(request.url);
  const statusParam = url.searchParams.get("status");
  const status =
    statusParam && STATUSES.includes(statusParam as TestimonialStatus)
      ? (statusParam as TestimonialStatus)
      : undefined;

  const testimonials = await listAll(status);
  return NextResponse.json(
    { testimonials },
    { headers: { "Cache-Control": "no-store" } }
  );
}
