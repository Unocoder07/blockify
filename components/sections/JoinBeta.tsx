"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Download, Check, Loader2, Play } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { SITE } from "@/lib/constants";
import { recordDownload } from "@/lib/record-download";
import { fadeUp, viewportOnce } from "@/lib/animations";

type Status = "idle" | "loading" | "done";

export function JoinBeta() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || status !== "idle") return;
    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as { message?: string; error?: string };

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setStatus("idle");
        return;
      }

      setMessage(data.message ?? "You're on the list!");
      setStatus("done");
      setEmail("");
    } catch {
      setError("Network error. Please try again.");
      setStatus("idle");
    }
  }

  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto w-full max-w-4xl px-6">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <GlassCard className="relative overflow-hidden px-6 py-14 text-center sm:px-12">
            {/* glow */}
            <div className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-accent-600/25 blur-3xl" />
              <div className="absolute inset-0 bg-grid-faint bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
            </div>

            <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
              Ready to reclaim your attention?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-pretty text-base text-white/60 sm:text-lg">
              Join the beta today and start building the focused life you want —
              one distraction-free session at a time.
            </p>

            <div className="mx-auto mt-8 flex max-w-md flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button
                as="a"
                href={SITE.apkUrl}
                download={SITE.apkFileName}
                onClick={recordDownload}
                size="lg"
                className="w-full sm:w-auto"
              >
                <Download className="h-5 w-5" />
                Download Beta APK
              </Button>
              <Button
                as="a"
                href="#waitlist"
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
              >
                Join Waitlist
              </Button>
            </div>

            {/* Google Play — not live yet */}
            <div className="mx-auto mt-4 flex max-w-md justify-center">
              <Button
                variant="ghost"
                size="lg"
                disabled
                className="w-full cursor-not-allowed border border-white/10 opacity-70 sm:w-auto"
                title="Google Play release is on the way"
              >
                <Play className="h-5 w-5" />
                Google Play
                <span className="ml-1 rounded-full border border-white/15 bg-white/[0.06] px-2 py-0.5 text-[11px] font-medium text-white/60">
                  Coming Soon
                </span>
              </Button>
            </div>

            {/* Waitlist form */}
            <form
              id="waitlist"
              onSubmit={handleSubmit}
              className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <label htmlFor="waitlist-email" className="sr-only">
                Email address
              </label>
              <input
                id="waitlist-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={status !== "idle"}
                className="h-12 flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white placeholder:text-white/35 outline-none backdrop-blur-md transition-colors focus:border-accent-500/50 focus:ring-2 focus:ring-accent-500/20 disabled:opacity-60"
              />
              <Button type="submit" size="lg" disabled={status !== "idle"} className="h-12">
                {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
                {status === "done" && <Check className="h-4 w-4" />}
                {status === "idle" && "Notify me"}
                {status === "loading" && "Joining…"}
                {status === "done" && "You're in!"}
              </Button>
            </form>

            {status === "done" && message && (
              <p className="mt-3 text-sm font-medium text-emerald-400">
                {message}
              </p>
            )}
            {error && (
              <p className="mt-3 text-sm font-medium text-red-400">{error}</p>
            )}

            <p className="mt-3 text-xs text-white/35">
              No spam. Unsubscribe anytime.
            </p>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
