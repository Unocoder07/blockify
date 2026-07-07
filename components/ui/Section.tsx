import * as React from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  id?: string;
}

/** Consistent vertical rhythm + max width container for every section. */
export function Section({ id, className, children, ...props }: SectionProps) {
  return (
    <section
      id={id}
      className={cn("relative py-24 sm:py-32", className)}
      {...props}
    >
      <div className="mx-auto w-full max-w-6xl px-6">{children}</div>
    </section>
  );
}

interface SectionHeaderProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  className?: string;
  align?: "center" | "left";
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  className,
  align = "center",
}: SectionHeaderProps) {
  return (
    <Reveal
      className={cn(
        "mx-auto max-w-2xl",
        align === "center" ? "text-center" : "text-left",
        className
      )}
    >
      {eyebrow && (
        <span className="mb-4 inline-block rounded-full border border-accent-500/30 bg-accent-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-accent-300">
          {eyebrow}
        </span>
      )}
      <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-pretty text-base leading-relaxed text-white/60 sm:text-lg">
          {description}
        </p>
      )}
    </Reveal>
  );
}
