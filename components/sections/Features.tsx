"use client";

import { motion } from "framer-motion";
import { FEATURES } from "@/lib/constants";
import { Section, SectionHeader } from "@/components/ui/Section";
import { GlassCard } from "@/components/ui/GlassCard";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";

export function Features() {
  return (
    <Section id="features">
      <SectionHeader
        eyebrow="Features"
        title="Everything you need to reclaim your focus"
        description="A complete toolkit for deep work — thoughtfully designed, quietly powerful."
      />

      <motion.div
        variants={staggerContainer(0.07)}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {FEATURES.map((feature) => {
          const Icon = feature.icon;
          return (
            <motion.div key={feature.title} variants={fadeUp}>
              <GlassCard interactive className="group h-full p-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-accent-500/20 bg-accent-500/10 text-accent-300 transition-transform duration-300 group-hover:scale-110 group-hover:bg-accent-500/20">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">
                  {feature.description}
                </p>
              </GlassCard>
            </motion.div>
          );
        })}
      </motion.div>
    </Section>
  );
}
