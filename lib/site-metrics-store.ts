import { Redis } from "@upstash/redis";

export interface SiteMetrics {
  visits: number;
  downloads: number;
  updatedAt: string | null;
}

const VISITS_KEY = "blockify:visits";
const DOWNLOADS_KEY = "blockify:downloads";

/**
 * Baseline shown on the site before any real activity. Redis stores the true
 * event count starting from 0; the public value is BASE + real count, so the
 * counters start at 100 and grow from there with each visit / download.
 */
const BASE_VISITS = 100;
const BASE_DOWNLOADS = 100;

/**
 * Upstash Redis is used as the persistent, serverless-friendly counter store.
 * On Vercel the filesystem is ephemeral, so a file-based store would reset on
 * every request/deploy — Redis survives across all of them.
 *
 * When the env vars are missing (typical local dev without a Redis instance)
 * we fall back to in-memory counters so the app still runs. These reset on
 * server restart, which is fine for development.
 */
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? Redis.fromEnv()
    : null;

if (!redis) {
  console.warn(
    "[site-metrics] UPSTASH_REDIS_REST_URL/TOKEN not set — using in-memory counters (resets on restart)."
  );
}

// In-memory fallback state (dev only).
const memory: SiteMetrics = { visits: 0, downloads: 0, updatedAt: null };

function toCount(value: unknown): number {
  const n =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number.parseInt(value, 10)
        : 0;
  return Number.isFinite(n) ? Math.max(0, Math.floor(n)) : 0;
}

export async function getSiteMetrics(): Promise<SiteMetrics> {
  if (!redis) {
    return { ...memory };
  }

  try {
    const [visits, downloads] = await redis.mget<[unknown, unknown]>(
      VISITS_KEY,
      DOWNLOADS_KEY
    );
    return {
      visits: toCount(visits),
      downloads: toCount(downloads),
      updatedAt: null,
    };
  } catch (err) {
    console.error("[site-metrics] failed to read metrics:", err);
    return { visits: 0, downloads: 0, updatedAt: null };
  }
}

export async function recordSiteVisit(nowIso: string): Promise<SiteMetrics> {
  if (!redis) {
    memory.visits += 1;
    memory.updatedAt = nowIso;
    return { ...memory };
  }

  try {
    const visits = await redis.incr(VISITS_KEY);
    const downloads = toCount(await redis.get(DOWNLOADS_KEY));
    return { visits: toCount(visits), downloads, updatedAt: nowIso };
  } catch (err) {
    console.error("[site-metrics] failed to record visit:", err);
    return getSiteMetrics();
  }
}

export async function recordDownload(nowIso: string): Promise<SiteMetrics> {
  if (!redis) {
    memory.downloads += 1;
    memory.updatedAt = nowIso;
    return { ...memory };
  }

  try {
    const downloads = await redis.incr(DOWNLOADS_KEY);
    const visits = toCount(await redis.get(VISITS_KEY));
    return { visits, downloads: toCount(downloads), updatedAt: nowIso };
  } catch (err) {
    console.error("[site-metrics] failed to record download:", err);
    return getSiteMetrics();
  }
}

export function toPublicSiteMetrics(metrics: SiteMetrics) {
  return {
    visits: BASE_VISITS + metrics.visits,
    downloads: BASE_DOWNLOADS + metrics.downloads,
  };
}
