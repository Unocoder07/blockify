import * as React from "react";
import { cn } from "@/lib/utils";

interface PhoneMockupProps {
  children: React.ReactNode;
  className?: string;
  /** Screen background classes (e.g. a gradient). */
  screenClassName?: string;
}

/**
 * A reusable Android-style phone frame. Drop any screen content as children —
 * a CSS mock, a <Image>, or a video. Keeps a consistent 9:19.5 aspect ratio.
 */
export function PhoneMockup({
  children,
  className,
  screenClassName,
}: PhoneMockupProps) {
  return (
    <div
      className={cn(
        "relative aspect-[9/19.5] w-[260px] rounded-[2.5rem] border border-white/15 bg-neutral-950 p-2.5 shadow-2xl",
        "ring-1 ring-white/5",
        className
      )}
    >
      {/* Side buttons */}
      <div className="absolute -right-[3px] top-24 h-14 w-[3px] rounded-r bg-white/20" />
      <div className="absolute -left-[3px] top-20 h-8 w-[3px] rounded-l bg-white/20" />
      <div className="absolute -left-[3px] top-32 h-12 w-[3px] rounded-l bg-white/20" />

      {/* Screen */}
      <div
        className={cn(
          "relative h-full w-full overflow-hidden rounded-[2rem] bg-black",
          screenClassName
        )}
      >
        {/* Punch-hole camera */}
        <div className="absolute left-1/2 top-3 z-20 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-black ring-1 ring-white/10" />
        {children}
      </div>
    </div>
  );
}
