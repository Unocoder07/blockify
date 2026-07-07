"use client";

import * as React from "react";
import { motion, type Variants } from "framer-motion";
import { fadeUp, viewportOnce } from "@/lib/animations";

interface RevealProps {
  children: React.ReactNode;
  variants?: Variants;
  className?: string;
  delay?: number;
  /** Render element tag. */
  as?: "div" | "section" | "li" | "span";
}

/**
 * Scroll-reveal wrapper — animates children into view once.
 */
export function Reveal({
  children,
  variants = fadeUp,
  className,
  delay = 0,
  as = "div",
}: RevealProps) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      transition={{ delay }}
    >
      {children}
    </MotionTag>
  );
}
