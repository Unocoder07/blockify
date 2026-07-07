import type { Variants } from "framer-motion";

/** Easing tuned to feel like Linear / Raycast — soft, confident. */
export const easeOut = [0.16, 1, 0.3, 1] as const;

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: easeOut } },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut },
  },
};

export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: easeOut },
  },
};

/**
 * Parent container that reveals children one after another.
 * Pair with `fadeUp` (or similar) on child elements.
 */
export const staggerContainer = (stagger = 0.1, delay = 0): Variants => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren: stagger,
      delayChildren: delay,
    },
  },
});

/** Default viewport config for scroll-reveal sections. */
export const viewportOnce = { once: true, amount: 0.25 } as const;
