import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

import type {
  PublicTestimonial,
  Testimonial,
  TestimonialInput,
  TestimonialStatus,
} from "./testimonials";

/**
 * ---------------------------------------------------------------------------
 * Simple file-backed store for testimonials.
 *
 * The whole set lives in a single JSON file under `data/`. Volume here is tiny
 * (visitor-submitted reviews), so read-modify-write of the full file is fine.
 * Writes are serialized through an in-process promise chain to avoid clobbering
 * concurrent requests, and written atomically via a temp file + rename.
 * ---------------------------------------------------------------------------
 */

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "testimonials.json");

let writeChain: Promise<unknown> = Promise.resolve();

async function readAll(): Promise<Testimonial[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Testimonial[]) : [];
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException)?.code === "ENOENT") return [];
    // Corrupt file: fail safe to empty rather than crashing the route.
    console.error("[testimonials] failed to read store:", err);
    return [];
  }
}

async function writeAll(list: Testimonial[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = `${DATA_FILE}.${randomUUID()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(list, null, 2), "utf8");
  await fs.rename(tmp, DATA_FILE);
}

/** Serialize a read-modify-write mutation against the store. */
function mutate<T>(fn: (list: Testimonial[]) => Promise<T> | T): Promise<T> {
  const next = writeChain.then(async () => {
    const list = await readAll();
    return fn(list);
  });
  // Keep the chain alive regardless of individual success/failure.
  writeChain = next.then(
    () => undefined,
    () => undefined
  );
  return next;
}

function toPublic(t: Testimonial): PublicTestimonial {
  return {
    id: t.id,
    name: t.name,
    company: t.company,
    role: t.role,
    photo: t.photo,
    rating: t.rating,
    message: t.message,
    createdAt: t.createdAt,
  };
}

function byNewest(a: Testimonial, b: Testimonial): number {
  return b.createdAt.localeCompare(a.createdAt);
}

/** Public: approved testimonials, newest first. */
export async function listApproved(): Promise<PublicTestimonial[]> {
  const list = await readAll();
  return list
    .filter((t) => t.status === "approved")
    .sort(byNewest)
    .map(toPublic);
}

/** Admin: every testimonial (optionally filtered by status), newest first. */
export async function listAll(
  status?: TestimonialStatus
): Promise<Testimonial[]> {
  const list = await readAll();
  return list
    .filter((t) => (status ? t.status === status : true))
    .sort(byNewest);
}

/**
 * Create a new testimonial. Defaults to `approved` so feedback given on the
 * landing page appears immediately; the admin can still edit/reject/delete it.
 * Pass an explicit status to hold submissions for moderation instead.
 */
export async function createTestimonial(
  input: TestimonialInput,
  createdAtIso: string,
  status: TestimonialStatus = "approved"
): Promise<Testimonial> {
  return mutate((list) => {
    const testimonial: Testimonial = {
      id: randomUUID(),
      name: input.name,
      company: input.company,
      role: input.role,
      photo: input.photo,
      rating: input.rating,
      message: input.message,
      status,
      createdAt: createdAtIso,
    };
    list.push(testimonial);
    return writeAll(list).then(() => testimonial);
  });
}

export type TestimonialPatch = Partial<
  Pick<
    Testimonial,
    "name" | "company" | "role" | "photo" | "rating" | "message" | "status"
  >
>;

/** Update fields and/or status of a testimonial. Returns null if not found. */
export async function updateTestimonial(
  id: string,
  patch: TestimonialPatch
): Promise<Testimonial | null> {
  return mutate((list) => {
    const idx = list.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    const updated: Testimonial = { ...list[idx], ...patch, id: list[idx].id };
    list[idx] = updated;
    return writeAll(list).then(() => updated);
  });
}

/** Delete a testimonial. Returns true if something was removed. */
export async function deleteTestimonial(id: string): Promise<boolean> {
  return mutate((list) => {
    const idx = list.findIndex((t) => t.id === id);
    if (idx === -1) return false;
    list.splice(idx, 1);
    return writeAll(list).then(() => true);
  });
}
