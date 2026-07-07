import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

/**
 * ---------------------------------------------------------------------------
 * Simple file-backed store for waitlist signups.
 *
 * Mirrors the testimonials store: the whole set lives in a single JSON file
 * under `data/`. Volume is tiny (one row per signup), so read-modify-write of
 * the full file is fine. Writes are serialized through an in-process promise
 * chain and written atomically via a temp file + rename.
 * ---------------------------------------------------------------------------
 */

export interface WaitlistEntry {
  id: string;
  email: string;
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "waitlist.json");

let writeChain: Promise<unknown> = Promise.resolve();

async function readAll(): Promise<WaitlistEntry[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as WaitlistEntry[]) : [];
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException)?.code === "ENOENT") return [];
    // Corrupt file: fail safe to empty rather than crashing the route.
    console.error("[waitlist] failed to read store:", err);
    return [];
  }
}

async function writeAll(list: WaitlistEntry[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = `${DATA_FILE}.${randomUUID()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(list, null, 2), "utf8");
  await fs.rename(tmp, DATA_FILE);
}

/** Serialize a read-modify-write mutation against the store. */
function mutate<T>(fn: (list: WaitlistEntry[]) => Promise<T> | T): Promise<T> {
  const next = writeChain.then(async () => {
    const list = await readAll();
    return fn(list);
  });
  writeChain = next.then(
    () => undefined,
    () => undefined
  );
  return next;
}

export type AddResult =
  | { status: "added"; entry: WaitlistEntry }
  | { status: "duplicate" };

/**
 * Add an email to the waitlist. Emails are normalized to lower-case and
 * de-duplicated, so re-submitting an existing address is a no-op.
 */
export async function addToWaitlist(
  email: string,
  createdAtIso: string
): Promise<AddResult> {
  const normalized = email.trim().toLowerCase();
  return mutate((list) => {
    if (list.some((e) => e.email === normalized)) {
      return { status: "duplicate" } as const;
    }
    const entry: WaitlistEntry = {
      id: randomUUID(),
      email: normalized,
      createdAt: createdAtIso,
    };
    list.push(entry);
    return writeAll(list).then(() => ({ status: "added", entry }) as const);
  });
}

/** Every signup, newest first. */
export async function listWaitlist(): Promise<WaitlistEntry[]> {
  const list = await readAll();
  return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
