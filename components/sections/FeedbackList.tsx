"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Loader2,
  MessageSquarePlus,
  Sparkles,
} from "lucide-react";

import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { TestimonialCard } from "@/components/ui/TestimonialCard";
import { TestimonialModal } from "@/components/sections/TestimonialModal";
import { fadeUp, staggerContainer } from "@/lib/animations";
import type { PublicTestimonial } from "@/lib/testimonials";

/** Full, self-contained listing of every approved testimonial. */
export function FeedbackList() {
  const [testimonials, setTestimonials] = useState<PublicTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/testimonials", { cache: "no-store" });
      const data = await res.json();
      setTestimonials(
        Array.isArray(data.testimonials) ? data.testimonials : []
      );
    } catch {
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const hasTestimonials = testimonials.length > 0;

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-black">
      {/* Ambient glow to match the landing aesthetic. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-radial-fade" />

      <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-24">
        <Link
          href="/#testimonials"
          className="inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <div className="mt-8 max-w-2xl">
          <span className="mb-4 inline-block rounded-full border border-accent-500/30 bg-accent-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-accent-300">
            Community feedback
          </span>
          <h1 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
            What people are saying about Blockify
          </h1>
          <p className="mt-4 text-pretty text-base leading-relaxed text-white/60 sm:text-lg">
            Every approved review from our community, newest first.
          </p>
        </div>

        <div className="mt-8">
          <Button onClick={() => setModalOpen(true)}>
            <MessageSquarePlus className="h-4 w-4" />
            Share your experience
          </Button>
        </div>

        {loading ? (
          <div className="mt-20 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-white/40" />
          </div>
        ) : hasTestimonials ? (
          <motion.div
            variants={staggerContainer(0.05)}
            initial="hidden"
            animate="show"
            className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {testimonials.map((t) => (
                <motion.div
                  key={t.id}
                  layout
                  variants={fadeUp}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <TestimonialCard t={t} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="mx-auto mt-16 max-w-md">
            <GlassCard className="flex flex-col items-center px-8 py-14 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-500/15 text-accent-300">
                <Sparkles className="h-7 w-7" />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-white">
                Be the first to share your experience!
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">
                No testimonials yet. Tell the community how Blockify helped you
                take back your focus.
              </p>
              <Button className="mt-7" onClick={() => setModalOpen(true)}>
                <MessageSquarePlus className="h-4 w-4" />
                Share your experience
              </Button>
            </GlassCard>
          </div>
        )}
      </div>

      <TestimonialModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmitted={load}
      />
    </main>
  );
}
