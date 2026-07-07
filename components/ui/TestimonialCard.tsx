import { Quote } from "lucide-react";

import { GlassCard } from "@/components/ui/GlassCard";
import { StarRating } from "@/components/ui/StarRating";
import { Avatar } from "@/components/ui/Avatar";
import type { PublicTestimonial } from "@/lib/testimonials";

/** Human-friendly submission date, e.g. "Jul 7, 2026". */
export function formatTestimonialDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** A single testimonial card — shared by the landing section and Feedback page. */
export function TestimonialCard({ t }: { t: PublicTestimonial }) {
  const subtitle = [t.role, t.company].filter(Boolean).join(" · ");
  return (
    <GlassCard interactive className="flex h-full flex-col p-7">
      <div className="flex items-center justify-between">
        <Quote className="h-7 w-7 text-accent-400/60" />
        <StarRating value={t.rating} size={16} />
      </div>
      <p className="mt-4 flex-1 whitespace-pre-line text-sm leading-relaxed text-white/70">
        &ldquo;{t.message}&rdquo;
      </p>
      <div className="mt-6 flex items-center gap-3 border-t border-white/[0.06] pt-5">
        <Avatar name={t.name} photo={t.photo} size={44} />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white">{t.name}</p>
          {subtitle && (
            <p className="truncate text-xs text-white/45">{subtitle}</p>
          )}
          <p className="mt-0.5 text-[11px] text-white/30">
            {formatTestimonialDate(t.createdAt)}
          </p>
        </div>
      </div>
    </GlassCard>
  );
}
