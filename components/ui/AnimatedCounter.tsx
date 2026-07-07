"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { useCountUp } from "@/hooks/useCountUp";

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

/** Formats large numbers compactly, e.g. 1_200_000 -> "1.2M". */
function formatCompact(n: number): string {
  if (n >= 1_000_000) {
    const v = n / 1_000_000;
    return `${v % 1 === 0 ? v.toFixed(0) : v.toFixed(1)}M`;
  }
  if (n >= 1_000) {
    const v = n / 1_000;
    return `${v % 1 === 0 ? v.toFixed(0) : v.toFixed(1)}K`;
  }
  return n.toLocaleString();
}

export function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const current = useCountUp({ end: value, active: inView, duration: 2200 });

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatCompact(current)}
      {suffix}
    </span>
  );
}
