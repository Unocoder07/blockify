import { NextResponse } from "next/server";

import {
  getSiteMetrics,
  recordSiteVisit,
  toPublicSiteMetrics,
} from "@/lib/site-metrics-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store",
};

export async function GET() {
  const metrics = await getSiteMetrics();
  return NextResponse.json(toPublicSiteMetrics(metrics), {
    headers: NO_STORE_HEADERS,
  });
}

export async function POST() {
  const metrics = await recordSiteVisit(new Date().toISOString());
  return NextResponse.json(toPublicSiteMetrics(metrics), {
    status: 201,
    headers: NO_STORE_HEADERS,
  });
}
