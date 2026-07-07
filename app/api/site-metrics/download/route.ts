import { NextResponse } from "next/server";

import { recordDownload, toPublicSiteMetrics } from "@/lib/site-metrics-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store",
};

export async function POST() {
  const metrics = await recordDownload(new Date().toISOString());
  return NextResponse.json(toPublicSiteMetrics(metrics), {
    status: 201,
    headers: NO_STORE_HEADERS,
  });
}
