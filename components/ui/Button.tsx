"use client";

import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-white shadow-glow-sm hover:bg-accent-700 hover:shadow-glow",
  secondary:
    "bg-white/[0.06] text-white border border-white/10 backdrop-blur-md hover:bg-white/[0.1]",
  ghost: "bg-transparent text-white/80 hover:text-white hover:bg-white/[0.06]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-base",
};

export interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: Variant;
  size?: Size;
  /** Render as an anchor styled like a button. */
  as?: "button" | "a";
  href?: string;
  /** Anchor download attribute — forces the file to download (used for the APK). */
  download?: boolean | string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      as = "button",
      className,
      children,
      download,
      ...props
    },
    ref
  ) => {
    const classes = cn(
      "group relative inline-flex items-center justify-center gap-2 rounded-xl font-medium tracking-tight",
      "transition-colors duration-200 outline-none",
      "focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
      "disabled:pointer-events-none disabled:opacity-50",
      variants[variant],
      sizes[size],
      size === "lg" && "h-[52px]",
      className
    );

    const motionProps = {
      whileHover: { scale: 1.02 },
      whileTap: { scale: 0.98 },
    };

    if (as === "a") {
      const { href, ...rest } = props as HTMLMotionProps<"a"> & { href?: string };
      return (
        <motion.a
          href={href}
          download={download}
          className={classes}
          {...motionProps}
          {...rest}
        >
          {children}
        </motion.a>
      );
    }

    return (
      <motion.button ref={ref} className={classes} {...motionProps} {...props}>
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
