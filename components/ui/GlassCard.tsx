import * as React from "react";
import { cn } from "@/lib/utils";

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Adds a subtle purple glow on hover. */
  interactive?: boolean;
}

/**
 * Frosted-glass surface used across the site. Composable — pass any children.
 */
export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ interactive = false, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl",
          "shadow-card overflow-hidden",
          interactive &&
            "transition-all duration-300 hover:border-accent-500/40 hover:bg-white/[0.05] hover:shadow-glow-sm",
          className
        )}
        {...props}
      >
        {/* top edge highlight */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        {children}
      </div>
    );
  }
);

GlassCard.displayName = "GlassCard";
