import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

export interface SiteMetrics {
  visits: number;
  updatedAt: string | null;
}

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "site-metrics.json");

let writeChain: Promise<unknown> = Promise.resolve();

function sanitizeMetrics(value: unknown): SiteMetrics {
  if (typeof value !== "object" || value === null) {
    return { visits: 0, updatedAt: null };
  }

  const raw = value as Partial<SiteMetrics>;
  const visits =
    typeof raw.visits === "number" && Number.isFinite(raw.visits)
      ? Math.max(0, Math.floor(raw.visits))
      : 0;
  const updatedAt = typeof raw.updatedAt === "string" ? raw.updatedAt : null;

  return { visits, updatedAt };
}

async function readMetrics(): Promise<SiteMetrics> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    return sanitizeMetrics(JSON.parse(raw));
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException)?.code === "ENOENT") {
      return { visits: 0, updatedAt: null };
    }
    console.error("[site-metrics] failed to read store:", err);
    return { visits: 0, updatedAt: null };
  }
}

async function writeMetrics(metrics: SiteMetrics): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = `${DATA_FILE}.${randomUUID()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(metrics, null, 2), "utf8");
  await fs.rename(tmp, DATA_FILE);
}

function mutate<T>(fn: (metrics: SiteMetrics) => Promise<T> | T): Promise<T> {
  const next = writeChain.then(async () => {
    const metrics = await readMetrics();
    return fn(metrics);
  });
  writeChain = next.then(
    () => undefined,
    () => undefined
  );
  return next;
}

export async function getSiteMetrics(): Promise<SiteMetrics> {
  return readMetrics();
}

export async function recordSiteVisit(nowIso: string): Promise<SiteMetrics> {
  return mutate((metrics) => {
    const next: SiteMetrics = {
      visits: metrics.visits + 1,
      updatedAt: nowIso,
    };
    return writeMetrics(next).then(() => next);
  });
}

export function toPublicSiteMetrics(metrics: SiteMetrics) {
  return {
    visits: metrics.visits,
    downloads: metrics.visits,
  };
}
