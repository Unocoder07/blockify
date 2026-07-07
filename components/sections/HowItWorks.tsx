"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { STEPS } from "@/lib/constants";
import { Section, SectionHeader } from "@/components/ui/Section";
import { GlassCard } from "@/components/ui/GlassCard";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";

export function HowItWorks() {
  return (
    <Section id="how-it-works">
      <SectionHeader
        eyebrow="How it works"
        title="Focus in three simple steps"
        description="No complicated setup. Just choose, set, and stay productive."
      />

      <motion.ol
        variants={staggerContainer(0.15)}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="relative mx-auto mt-16 max-w-2xl"
      >
        {/* Vertical connector line */}
        <div className="absolute left-[27px] top-4 bottom-4 hidden w-px bg-gradient-to-b from-accent-500/50 via-accent-500/20 to-transparent sm:block" />

        {STEPS.map((step, i) => (
          <motion.li key={step.step} variants={fadeUp} className="relative mb-6 last:mb-0">
            <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
              <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-accent-500/30 bg-black text-lg font-bold text-accent-300 shadow-glow-sm">
                {step.step}
              </div>
              <GlassCard interactive className="flex-1 p-5 text-center sm:text-left">
                <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/55">
                  {step.description}
                </p>
              </GlassCard>
            </div>

            {i < STEPS.length - 1 && (
              <div className="my-3 flex justify-center sm:hidden">
                <ArrowDown className="h-5 w-5 text-accent-400/60" />
              </div>
            )}
          </motion.li>
        ))}
      </motion.ol>
    </Section>
  );
}
