"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { STATS } from "@/lib/constants";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";

interface SiteMetrics {
  visits: number;
  downloads: number;
}

const VISIT_COUNTED_KEY = "blockify:site-visit-counted";

function claimVisitForSession(): boolean {
  try {
    if (window.sessionStorage.getItem(VISIT_COUNTED_KEY) === "1") {
      return false;
    }
    window.sessionStorage.setItem(VISIT_COUNTED_KEY, "1");
    return true;
  } catch {
    return true;
  }
}

function releaseVisitClaim() {
  try {
    window.sessionStorage.removeItem(VISIT_COUNTED_KEY);
  } catch {
    // Ignore storage errors; the next page load will try again.
  }
}

function toMetric(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.max(0, Math.floor(value))
    : null;
}

function parseMetrics(value: unknown): SiteMetrics | null {
  if (typeof value !== "object" || value === null) return null;
  const data = value as Record<string, unknown>;
  const visits = toMetric(data.visits);
  if (visits === null) return null;

  return {
    visits,
    downloads: toMetric(data.downloads) ?? visits,
  };
}

export function Stats() {
  const [siteMetrics, setSiteMetrics] = useState<SiteMetrics | null>(null);

  useEffect(() => {
    let cancelled = false;
    const shouldRecordVisit = claimVisitForSession();

    async function loadMetrics() {
      try {
        const response = await fetch("/api/site-metrics", {
          method: shouldRecordVisit ? "POST" : "GET",
          cache: "no-store",
        });
        if (!response.ok) throw new Error("Failed to load site metrics.");
        const metrics = parseMetrics(await response.json());
        if (!cancelled && metrics) {
          setSiteMetrics(metrics);
        }
      } catch {
        if (shouldRecordVisit) releaseVisitClaim();
      }
    }

    loadMetrics();

    return () => {
      cancelled = true;
    };
  }, []);

  const stats = STATS.map((stat) => {
    const value =
      stat.metric === "visits"
        ? siteMetrics?.visits
        : stat.metric === "downloads"
          ? siteMetrics?.downloads
          : undefined;

    return {
      ...stat,
      value: value ?? stat.value,
    };
  });

  return (
    <section className="relative border-y border-white/[0.06] py-16">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="grid grid-cols-2 gap-8 lg:grid-cols-4"
        >
          {stats.map((stat) => (
            <motion.div key={stat.label} variants={fadeUp} className="text-center">
              <div className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl md:text-5xl">
                <AnimatedCounter
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                />
              </div>
              <p className="mt-2 text-xs text-white/50 sm:text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
