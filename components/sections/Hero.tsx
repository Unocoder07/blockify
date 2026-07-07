"use client";

import { motion } from "framer-motion";
import { Download, Play, Shield, Flame, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PhoneMockup } from "@/components/ui/PhoneMockup";
import { APP_SCREENS } from "@/components/ui/AppScreens";
import { SITE } from "@/lib/constants";
import { fadeUp, staggerContainer } from "@/lib/animations";

const HomeScreen = APP_SCREENS.home;

/** Small glassy chips that float around the phone. */
function FloatingChip({
  className,
  delay,
  children,
}: {
  className?: string;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay }}
        className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-medium text-white shadow-glow-sm backdrop-blur-xl"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-28 sm:pt-36">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-radial-fade blur-3xl" />
        <div className="absolute inset-0 bg-grid-faint bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-6 pb-24 lg:grid-cols-2 lg:gap-8">
        {/* Copy */}
        <motion.div
          variants={staggerContainer(0.12)}
          initial="hidden"
          animate="show"
          className="text-center lg:text-left"
        >
          <motion.div variants={fadeUp} className="mb-6 flex justify-center lg:justify-start">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/70 backdrop-blur-md">
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Now in open beta
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl"
          >
            Take Back Control of Your{" "}
            <span className="bg-gradient-to-r from-accent-400 via-fuchsia-400 to-accent-500 bg-clip-text text-transparent">
              Digital Life.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-white/60 sm:text-lg lg:mx-0"
          >
            {SITE.description}
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start"
          >
            <Button
              as="a"
              href={SITE.apkUrl}
              download={SITE.apkFileName}
              size="lg"
              className="w-full sm:w-auto"
            >
              <Download className="h-5 w-5" />
              Download Beta APK
            </Button>
            <Button
              as="a"
              href={SITE.demoVideoUrl}
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
            >
              <Play className="h-5 w-5" />
              Watch Demo
            </Button>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-8 flex items-center justify-center gap-3 text-sm text-white/50 lg:justify-start"
          >
            <div className="flex -space-x-2">
              {["A", "R", "L", "M"].map((c) => (
                <span
                  key={c}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-black bg-gradient-to-br from-accent-500 to-fuchsia-500 text-[10px] font-semibold text-white"
                >
                  {c}
                </span>
              ))}
            </div>
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              Loved by early adopters
            </span>
          </motion.div>
        </motion.div>

        {/* Phone */}
        <div className="relative flex justify-center lg:justify-end">
          <motion.div
            initial={{ opacity: 0, y: 40, rotateX: 8 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="relative"
          >
            <motion.div
              animate={{ y: [0, -16, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="absolute -inset-8 -z-10 rounded-full bg-accent-600/20 blur-3xl" />
              <PhoneMockup>
                <HomeScreen />
              </PhoneMockup>
            </motion.div>

            {/* Floating UI chips */}
            <FloatingChip delay={0.8} className="absolute -left-10 top-16 hidden sm:block">
              <Shield className="h-4 w-4 text-accent-300" />
              27 apps blocked
            </FloatingChip>
            <FloatingChip delay={1.1} className="absolute -right-8 top-40 hidden sm:block">
              <Flame className="h-4 w-4 text-orange-400" />
              14-day streak
            </FloatingChip>
            <FloatingChip delay={1.4} className="absolute -left-6 bottom-24 hidden sm:block">
              <Sparkles className="h-4 w-4 text-fuchsia-300" />
              AI coach active
            </FloatingChip>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
