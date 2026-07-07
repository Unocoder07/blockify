"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Loader2,
  MessageSquarePlus,
  Sparkles,
} from "lucide-react";

import { Section, SectionHeader } from "@/components/ui/Section";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { TestimonialCard } from "@/components/ui/TestimonialCard";
import { TestimonialModal } from "./TestimonialModal";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";
import type { PublicTestimonial } from "@/lib/testimonials";

/** How many testimonials the landing page shows before linking to /feedback. */
const LANDING_LIMIT = 5;

function EmptyState({ onShare }: { onShare: () => void }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className="mx-auto mt-16 max-w-md"
    >
      <GlassCard className="flex flex-col items-center px-8 py-14 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-500/15 text-accent-300">
          <Sparkles className="h-7 w-7" />
        </div>
        <h3 className="mt-6 text-lg font-semibold text-white">
          Be the first to share your experience!
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-white/55">
          No testimonials yet. Tell the community how Blockify helped you take
          back your focus.
        </p>
        <Button className="mt-7" onClick={onShare}>
          <MessageSquarePlus className="h-4 w-4" />
          Share your experience
        </Button>
      </GlassCard>
    </motion.div>
  );
}

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<PublicTestimonial[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/testimonials?limit=${LANDING_LIMIT}`, {
        cache: "no-store",
      });
      const data = await res.json();
      setTestimonials(
        Array.isArray(data.testimonials) ? data.testimonials : []
      );
      setTotal(typeof data.total === "number" ? data.total : 0);
    } catch {
      setTestimonials([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const hasTestimonials = testimonials.length > 0;
  const hasMore = total > LANDING_LIMIT;

  return (
    <Section id="testimonials">
      <SectionHeader
        eyebrow="Testimonials"
        title="Focus that people feel"
        description="Real stories from people getting their time — and attention — back."
      />

      {/* Share CTA — always visible so anyone can contribute. */}
      {hasTestimonials && (
        <div className="mt-10 flex justify-center">
          <Button onClick={() => setModalOpen(true)}>
            <MessageSquarePlus className="h-4 w-4" />
            Share your experience
          </Button>
        </div>
      )}

      {loading ? (
        <div className="mt-16 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-white/40" />
        </div>
      ) : hasTestimonials ? (
        <>
          <motion.div
            variants={staggerContainer(0.08)}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {testimonials.map((t) => (
                <motion.div
                  key={t.id}
                  layout
                  variants={fadeUp}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <TestimonialCard t={t} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {hasMore && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              className="mt-12 flex flex-col items-center gap-2"
            >
              <Button as="a" href="/feedback" variant="secondary" size="lg">
                View all feedback
                <ArrowRight className="h-4 w-4" />
              </Button>
              <p className="text-xs text-white/40">
                Showing the {LANDING_LIMIT} most recent of {total} reviews
              </p>
            </motion.div>
          )}
        </>
      ) : (
        <EmptyState onShare={() => setModalOpen(true)} />
      )}

      <TestimonialModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmitted={load}
      />
    </Section>
  );
}
