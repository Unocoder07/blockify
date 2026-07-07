"use client";

import { useEffect, useRef, useState } from "react";

interface UseCountUpOptions {
  /** Final value to count to. */
  end: number;
  /** Duration in ms. */
  duration?: number;
  /** Only start once `active` is true (e.g. when in view). */
  active?: boolean;
}

/**
 * Animate a number from 0 to `end` with an ease-out curve.
 * Respects `prefers-reduced-motion` by snapping to the final value.
 */
export function useCountUp({
  end,
  duration = 2000,
  active = true,
}: UseCountUpOptions) {
  const [value, setValue] = useState(0);
  const valueRef = useRef(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;

    const setCurrentValue = (nextValue: number) => {
      valueRef.current = nextValue;
      setValue(nextValue);
    };

    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      setCurrentValue(end);
      return;
    }

    const startValue = valueRef.current;
    const delta = end - startValue;

    if (delta === 0) return;

    let startTime: number | null = null;

    const tick = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCurrentValue(Math.round(startValue + eased * delta));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [active, end, duration]);

  return value;
}
