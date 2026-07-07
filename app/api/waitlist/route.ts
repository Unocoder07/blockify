import { NextResponse } from "next/server";

import { addToWaitlist } from "@/lib/waitlist-store";

// File-system storage requires the Node runtime and dynamic evaluation.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Pragmatic email check — good enough to reject obvious garbage without
// getting into the weeds of full RFC 5322 validation.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** POST /api/waitlist — add an email to the beta waitlist. */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const email =
    typeof body === "object" && body !== null && "email" in body
      ? String((body as { email: unknown }).email ?? "")
      : "";

  if (!EMAIL_RE.test(email.trim())) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  const result = await addToWaitlist(email, new Date().toISOString());

  const message =
    result.status === "duplicate"
      ? "You're already on the list — we'll be in touch!"
      : "You're on the list! We'll let you know the moment we launch.";

  return NextResponse.json({ message, status: result.status }, { status: 201 });
}
