"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Check,
  Loader2,
  LogOut,
  Pencil,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { StarRating } from "@/components/ui/StarRating";
import { Avatar } from "@/components/ui/Avatar";
import type { Testimonial, TestimonialStatus } from "@/lib/testimonials";

const STORAGE_KEY = "blockify_admin_token";
const TABS: { key: TestimonialStatus | "all"; label: string }[] = [
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
  { key: "all", label: "All" },
];

const statusBadge: Record<TestimonialStatus, string> = {
  pending: "border-amber-400/30 bg-amber-400/10 text-amber-300",
  approved: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  rejected: "border-red-400/30 bg-red-400/10 text-red-300",
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

export default function AdminTestimonialsPage() {
  const [token, setToken] = useState<string>("");
  const [tokenInput, setTokenInput] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [tab, setTab] = useState<TestimonialStatus | "all">("pending");
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Testimonial | null>(null);

  // Restore a saved token on mount.
  useEffect(() => {
    const saved =
      typeof window !== "undefined"
        ? window.localStorage.getItem(STORAGE_KEY)
        : null;
    if (saved) {
      setToken(saved);
      setAuthed(true);
    }
  }, []);

  const authHeaders = useCallback(
    (json = false): HeadersInit => ({
      Authorization: `Bearer ${token}`,
      ...(json ? { "Content-Type": "application/json" } : {}),
    }),
    [token]
  );

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const qs = tab === "all" ? "" : `?status=${tab}`;
      const res = await fetch(`/api/testimonials/admin${qs}`, {
        headers: authHeaders(),
        cache: "no-store",
      });
      if (res.status === 401) {
        setAuthed(false);
        setLoginError("Session expired or invalid token. Please sign in again.");
        window.localStorage.removeItem(STORAGE_KEY);
        return;
      }
      const data = await res.json();
      setItems(Array.isArray(data.testimonials) ? data.testimonials : []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [tab, token, authHeaders]);

  useEffect(() => {
    if (authed) load();
  }, [authed, load]);

  async function handleLogin() {
    const t = tokenInput.trim();
    if (!t) return;
    setLoginError("");
    // Validate by hitting the admin endpoint.
    const res = await fetch("/api/testimonials/admin?status=pending", {
      headers: { Authorization: `Bearer ${t}` },
    });
    if (res.ok) {
      window.localStorage.setItem(STORAGE_KEY, t);
      setToken(t);
      setAuthed(true);
      setTokenInput("");
    } else {
      setLoginError("Invalid admin token.");
    }
  }

  function logout() {
    window.localStorage.removeItem(STORAGE_KEY);
    setToken("");
    setAuthed(false);
    setItems([]);
  }

  async function patch(id: string, body: Record<string, unknown>) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/testimonials/admin/${id}`, {
        method: "PATCH",
        headers: authHeaders(true),
        body: JSON.stringify(body),
      });
      if (res.ok) await load();
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this testimonial permanently?")) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/testimonials/admin/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (res.ok) await load();
    } finally {
      setBusyId(null);
    }
  }

  // ---- Login screen ------------------------------------------------------
  if (!authed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-6">
        <GlassCard className="w-full max-w-sm p-8">
          <h1 className="text-xl font-semibold text-white">Admin sign in</h1>
          <p className="mt-1 text-sm text-white/50">
            Enter the admin token to moderate testimonials.
          </p>
          <input
            type="password"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Admin token"
            className="mt-6 h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white placeholder:text-white/35 outline-none focus:border-accent-500/50 focus:ring-2 focus:ring-accent-500/20"
          />
          {loginError && (
            <p className="mt-3 text-sm text-red-300">{loginError}</p>
          )}
          <Button className="mt-5 w-full" onClick={handleLogin}>
            Sign in
          </Button>
        </GlassCard>
      </main>
    );
  }

  // ---- Dashboard ---------------------------------------------------------
  return (
    <main className="min-h-screen bg-black px-6 py-12">
      <div className="mx-auto w-full max-w-4xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-white">
              Testimonial moderation
            </h1>
            <p className="mt-1 text-sm text-white/50">
              Approve, reject, edit, or delete user-submitted testimonials.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={load}>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                tab === t.key
                  ? "border-accent-500/50 bg-accent-500/15 text-white"
                  : "border-white/10 bg-white/[0.03] text-white/60 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="mt-6 space-y-4">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-white/40" />
            </div>
          ) : items.length === 0 ? (
            <GlassCard className="p-10 text-center text-sm text-white/50">
              No testimonials in this view.
            </GlassCard>
          ) : (
            items.map((t) => (
              <GlassCard key={t.id} className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <Avatar name={t.name} photo={t.photo} size={48} />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-white">{t.name}</p>
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[11px] font-medium capitalize ${statusBadge[t.status]}`}
                        >
                          {t.status}
                        </span>
                      </div>
                      <p className="text-xs text-white/45">
                        {[t.role, t.company].filter(Boolean).join(" · ") ||
                          "—"}
                      </p>
                      <div className="mt-1">
                        <StarRating value={t.rating} size={14} />
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-white/35">
                    {formatDate(t.createdAt)}
                  </p>
                </div>

                <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-white/70">
                  &ldquo;{t.message}&rdquo;
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {t.status !== "approved" && (
                    <Button
                      size="sm"
                      onClick={() => patch(t.id, { status: "approved" })}
                      disabled={busyId === t.id}
                    >
                      <Check className="h-4 w-4" />
                      Approve
                    </Button>
                  )}
                  {t.status !== "rejected" && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => patch(t.id, { status: "rejected" })}
                      disabled={busyId === t.id}
                    >
                      <X className="h-4 w-4" />
                      Reject
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditing(t)}
                    disabled={busyId === t.id}
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => remove(t.id)}
                    disabled={busyId === t.id}
                    className="text-red-300 hover:text-red-200"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </GlassCard>
            ))
          )}
        </div>
      </div>

      {editing && (
        <EditModal
          testimonial={editing}
          onClose={() => setEditing(null)}
          onSave={async (body) => {
            await patch(editing.id, body);
            setEditing(null);
          }}
        />
      )}
    </main>
  );
}

// ---- Edit modal ----------------------------------------------------------
function EditModal({
  testimonial,
  onClose,
  onSave,
}: {
  testimonial: Testimonial;
  onClose: () => void;
  onSave: (body: Record<string, unknown>) => Promise<void>;
}) {
  const [name, setName] = useState(testimonial.name);
  const [company, setCompany] = useState(testimonial.company ?? "");
  const [role, setRole] = useState(testimonial.role ?? "");
  const [rating, setRating] = useState(testimonial.rating);
  const [message, setMessage] = useState(testimonial.message);
  const [saving, setSaving] = useState(false);

  const input =
    "h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white placeholder:text-white/35 outline-none focus:border-accent-500/50 focus:ring-2 focus:ring-accent-500/20";

  async function save() {
    setSaving(true);
    try {
      await onSave({ name, company, role, rating, message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <GlassCard className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-white">Edit testimonial</h2>
        <div className="mt-6 space-y-4">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className={input} />
          <div className="grid grid-cols-2 gap-4">
            <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company" className={input} />
            <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Role" className={input} />
          </div>
          <div>
            <span className="mb-1.5 block text-sm text-white/70">Rating</span>
            <StarRating value={rating} onChange={setRating} size={26} />
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder="Feedback"
            className="w-full resize-y rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-accent-500/50 focus:ring-2 focus:ring-accent-500/20"
          />
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={save} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Save changes
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}
