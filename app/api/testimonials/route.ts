import { NextResponse } from "next/server";

import { validateTestimonial } from "@/lib/testimonials";
import { createTestimonial, listApproved } from "@/lib/testimonials-store";

// File-system storage requires the Node runtime and dynamic evaluation.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/testimonials — approved testimonials, newest first.
 *
 * Optional `?limit=N` caps how many are returned (e.g. the landing page only
 * needs the 5 most recent). `total` always reflects the full approved count so
 * the client can decide whether to surface a "View all" link without a second
 * request.
 */
export async function GET(request: Request) {
  const all = await listApproved();

  const limitParam = new URL(request.url).searchParams.get("limit");
  const limit = limitParam ? Number.parseInt(limitParam, 10) : NaN;
  const testimonials =
    Number.isInteger(limit) && limit >= 0 ? all.slice(0, limit) : all;

  return NextResponse.json(
    { testimonials, total: all.length },
    { headers: { "Cache-Control": "no-store" } }
  );
}

/** POST /api/testimonials — submit a new testimonial (stored as pending). */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const result = validateTestimonial(body);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  await createTestimonial(result.value, new Date().toISOString());

  return NextResponse.json(
    {
      message: "Thank you! Your testimonial is now live on the site.",
    },
    { status: 201 }
  );
}
