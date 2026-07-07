"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SCREENSHOTS } from "@/lib/constants";
import { SectionHeader } from "@/components/ui/Section";
import { PhoneMockup } from "@/components/ui/PhoneMockup";
import { APP_SCREENS } from "@/components/ui/AppScreens";
import { cn } from "@/lib/utils";

export function Screenshots() {
  const [active, setActive] = useState(0);
  const count = SCREENSHOTS.length;

  const go = (dir: number) => setActive((prev) => (prev + dir + count) % count);

  return (
    <section id="screenshots" className="relative overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-700/10 blur-3xl" />

      <div className="mx-auto w-full max-w-6xl px-6">
        <SectionHeader
          eyebrow="Screenshots"
          title="A look inside Blockify"
          description="Designed to feel calm, focused, and effortless — every screen."
        />

        {/* Stage */}
        <div className="mt-16 flex items-center justify-center gap-4 sm:gap-8">
          <CarouselButton direction="prev" onClick={() => go(-1)} />

          <div className="relative flex h-[540px] w-[280px] items-center justify-center">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={SCREENSHOTS[active].id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="absolute"
              >
                <ScreenshotFrame index={active} />
              </motion.div>
            </AnimatePresence>
          </div>

          <CarouselButton direction="next" onClick={() => go(1)} />
        </div>

        {/* Caption + dots */}
        <div className="mt-8 text-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={SCREENSHOTS[active].title}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="text-sm font-medium text-white"
            >
              {SCREENSHOTS[active].title}
            </motion.p>
          </AnimatePresence>

          <div className="mt-4 flex justify-center gap-2">
            {SCREENSHOTS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setActive(i)}
                aria-label={`Show ${s.title}`}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === active ? "w-6 bg-accent" : "w-1.5 bg-white/20 hover:bg-white/40"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Renders a screenshot. Falls back to a CSS-rendered app screen when no real
 * image exists yet. Swap the fallback for <Image> when assets are ready.
 */
function ScreenshotFrame({ index }: { index: number }) {
  const shot = SCREENSHOTS[index];
  const Screen = APP_SCREENS[shot.id];

  return (
    <PhoneMockup>
      {Screen ? (
        <Screen />
      ) : (
        <div
          className={cn(
            "flex h-full w-full items-center justify-center bg-gradient-to-br text-white/70",
            shot.accent
          )}
        >
          {shot.title}
        </div>
      )}
    </PhoneMockup>
  );
}

function CarouselButton({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={direction === "prev" ? "Previous screenshot" : "Next screenshot"}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 backdrop-blur-md transition-all hover:border-accent-500/40 hover:bg-accent-500/10 hover:text-white"
    >
      {direction === "prev" ? (
        <ChevronLeft className="h-5 w-5" />
      ) : (
        <ChevronRight className="h-5 w-5" />
      )}
    </button>
  );
}
