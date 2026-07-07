"use client";

import { motion } from "framer-motion";
import { X, Check } from "lucide-react";
import { WITHOUT_BLOCKIFY, WITH_BLOCKIFY } from "@/lib/constants";
import { Section, SectionHeader } from "@/components/ui/Section";
import { GlassCard } from "@/components/ui/GlassCard";
import { fadeUp, viewportOnce } from "@/lib/animations";
import { cn } from "@/lib/utils";

export function WhyBlockify() {
  return (
    <Section>
      <SectionHeader
        eyebrow="Why Blockify"
        title="The difference is night and day"
        description="See what changes when your attention is finally protected."
      />

      <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
        <ComparisonCard
          variant="without"
          title="Without Blockify"
          items={WITHOUT_BLOCKIFY}
        />
        <ComparisonCard
          variant="with"
          title="With Blockify"
          items={WITH_BLOCKIFY}
        />
      </div>
    </Section>
  );
}

function ComparisonCard({
  variant,
  title,
  items,
}: {
  variant: "with" | "without";
  title: string;
  items: string[];
}) {
  const isWith = variant === "with";
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
    >
      <GlassCard
        className={cn(
          "h-full p-8",
          isWith && "border-accent-500/30 bg-accent-500/[0.04] shadow-glow-sm"
        )}
      >
        <h3
          className={cn(
            "text-xl font-semibold",
            isWith ? "text-white" : "text-white/70"
          )}
        >
          {title}
        </h3>
        <ul className="mt-6 space-y-4">
          {items.map((item) => (
            <li key={item} className="flex items-center gap-3">
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                  isWith
                    ? "bg-accent-500/20 text-accent-300"
                    : "bg-white/5 text-white/40"
                )}
              >
                {isWith ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <X className="h-3.5 w-3.5" />
                )}
              </span>
              <span
                className={cn(
                  "text-sm",
                  isWith ? "text-white/80" : "text-white/50 line-through decoration-white/20"
                )}
              >
                {item}
              </span>
            </li>
          ))}
        </ul>
      </GlassCard>
    </motion.div>
  );
}
