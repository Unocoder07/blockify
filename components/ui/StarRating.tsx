"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  /** Current rating (0–5). */
  value: number;
  /** When provided, the component is interactive. */
  onChange?: (value: number) => void;
  /** Star size in pixels. */
  size?: number;
  className?: string;
  /** Accessible label prefix for interactive mode. */
  label?: string;
}

/**
 * Star rating — read-only when `onChange` is omitted, interactive otherwise.
 * Interactive mode supports hover preview and keyboard input.
 */
export function StarRating({
  value,
  onChange,
  size = 20,
  className,
  label = "Rate",
}: StarRatingProps) {
  const [hover, setHover] = useState(0);
  const interactive = typeof onChange === "function";
  const shown = interactive && hover > 0 ? hover : value;

  if (!interactive) {
    return (
      <div
        className={cn("inline-flex items-center gap-0.5", className)}
        role="img"
        aria-label={`${value} out of 5 stars`}
      >
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            style={{ width: size, height: size }}
            className={cn(
              "transition-colors",
              i <= value
                ? "fill-amber-400 text-amber-400"
                : "fill-transparent text-white/20"
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn("inline-flex items-center gap-1", className)}
      role="radiogroup"
      aria-label={label}
      onMouseLeave={() => setHover(0)}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          role="radio"
          aria-checked={value === i}
          aria-label={`${i} star${i > 1 ? "s" : ""}`}
          onMouseEnter={() => setHover(i)}
          onFocus={() => setHover(i)}
          onBlur={() => setHover(0)}
          onClick={() => onChange(i)}
          className="rounded-md p-0.5 outline-none transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-accent-400"
        >
          <Star
            style={{ width: size, height: size }}
            className={cn(
              "transition-colors",
              i <= shown
                ? "fill-amber-400 text-amber-400"
                : "fill-transparent text-white/25"
            )}
          />
        </button>
      ))}
    </div>
  );
}
