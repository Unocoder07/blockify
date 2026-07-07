import {
  Shield,
  Target,
  Sparkles,
  Timer,
  BarChart3,
  Flame,
  Unlock,
  CalendarClock,
  type LucideIcon,
} from "lucide-react";

/**
 * ---------------------------------------------------------------------------
 * SITE CONFIG — swap these placeholders for real values before launch.
 * ---------------------------------------------------------------------------
 */
export const SITE = {
  name: "Blockify",
  tagline: "Take Back Control of Your Digital Life.",
  description:
    "Block distracting apps, build better habits, and stay focused with AI-powered productivity.",
  url: "https://blockify.app", // TODO: replace with production domain
  // The beta APK is too large (113 MB) to bundle with the Vercel deploy, so it
  // is hosted on GitHub Releases. Upload a new APK as a release asset and update
  // the tag in this URL when publishing a new build.
  apkUrl:
    "https://github.com/Unocoder07/blockify/releases/download/v1.0-beta/Blockify-beta.apk",
  // Filename suggested to the browser when downloading.
  apkFileName: "blockify-beta.apk",
  playStoreUrl: "#play-store",
  demoVideoUrl: "#demo-video",
  ogImage: "/og-image.svg",
} as const;

export const SOCIALS = {
  github: "https://github.com/blockify", // TODO
  twitter: "https://x.com/blockify", // TODO
  email: "mailto:hello@blockify.app", // TODO
} as const;

/**
 * ---------------------------------------------------------------------------
 * NAV
 * ---------------------------------------------------------------------------
 */
export const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Screenshots", href: "#screenshots" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
] as const;

/**
 * ---------------------------------------------------------------------------
 * STATS
 * ---------------------------------------------------------------------------
 */
export interface Stat {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  metric?: "visits" | "downloads";
}

export const STATS: Stat[] = [
  { label: "Website Visits", value: 200, suffix: "+", metric: "visits" },
  { label: "Beta Downloads", value: 100, suffix: "+", metric: "downloads" },
  { label: "Focus Sessions Completed", value: 1240, suffix: "+" },
  { label: "Hours Saved", value: 420, suffix: "+" },
];

/**
 * ---------------------------------------------------------------------------
 * FEATURES
 * ---------------------------------------------------------------------------
 */
export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const FEATURES: Feature[] = [
  {
    icon: Shield,
    title: "Smart App Blocking",
    description:
      "Intelligently block the apps that pull you away — with rules that adapt to your day.",
  },
  {
    icon: Target,
    title: "Daily Focus Goals",
    description:
      "Set a clear intention each morning and let Blockify keep you accountable to it.",
  },
  {
    icon: Sparkles,
    title: "AI Productivity Coach",
    description:
      "Personalized nudges and insights that learn your habits and help you improve.",
  },
  {
    icon: Timer,
    title: "Focus Timer",
    description:
      "Distraction-free deep work sessions with gentle breaks built in.",
  },
  {
    icon: BarChart3,
    title: "Usage Analytics",
    description:
      "Beautiful dashboards that reveal exactly where your attention goes.",
  },
  {
    icon: Flame,
    title: "Streak Tracking",
    description:
      "Build momentum with streaks that make staying focused genuinely rewarding.",
  },
  {
    icon: Unlock,
    title: "Emergency Unlock",
    description:
      "Need access in a pinch? A mindful, friction-first unlock keeps you honest.",
  },
  {
    icon: CalendarClock,
    title: "Scheduled Blocking",
    description:
      "Automate focus windows for work, study, sleep — or anything that matters.",
  },
];

/**
 * ---------------------------------------------------------------------------
 * HOW IT WORKS
 * ---------------------------------------------------------------------------
 */
export interface Step {
  step: number;
  title: string;
  description: string;
}

export const STEPS: Step[] = [
  {
    step: 1,
    title: "Choose distracting apps",
    description:
      "Pick the apps that steal your focus. Social media, games, news — you decide.",
  },
  {
    step: 2,
    title: "Set your daily focus goal",
    description:
      "Tell Blockify how much focused time you want, and when you want it.",
  },
  {
    step: 3,
    title: "Stay productive, protected",
    description:
      "Blockify guards your attention in the background while you do your best work.",
  },
];

/**
 * ---------------------------------------------------------------------------
 * SCREENSHOTS — add new entries here; the gallery scales automatically.
 * TODO: replace `src` with real screenshots in /public/screenshots.
 * ---------------------------------------------------------------------------
 */
export interface Screenshot {
  id: string;
  title: string;
  src: string;
  accent: string; // gradient used by the placeholder frame
}

export const SCREENSHOTS: Screenshot[] = [
  { id: "home", title: "Home Screen", src: "/screenshots/home.png", accent: "from-accent-600 to-fuchsia-500" },
  { id: "shield", title: "Shield Screen", src: "/screenshots/shield.png", accent: "from-violet-600 to-indigo-500" },
  { id: "stats", title: "Statistics", src: "/screenshots/stats.png", accent: "from-purple-600 to-accent-500" },
  { id: "focus", title: "Focus Session", src: "/screenshots/focus.png", accent: "from-indigo-600 to-accent-500" },
  { id: "settings", title: "Settings", src: "/screenshots/settings.png", accent: "from-fuchsia-600 to-violet-500" },
];

/**
 * ---------------------------------------------------------------------------
 * WHY BLOCKIFY
 * ---------------------------------------------------------------------------
 */
export const WITHOUT_BLOCKIFY = [
  "Endless scrolling",
  "Lost productivity",
  "Broken focus",
  "Digital addiction",
];

export const WITH_BLOCKIFY = [
  "Deep work",
  "Better habits",
  "Less screen time",
  "More accomplished every day",
];

/**
 * ---------------------------------------------------------------------------
 * TESTIMONIALS
 *
 * Testimonials are no longer hardcoded — they are submitted by real users,
 * moderated, and served from `/api/testimonials`. See `lib/testimonials.ts`
 * and `components/sections/Testimonials.tsx`.
 * ---------------------------------------------------------------------------
 */

/**
 * ---------------------------------------------------------------------------
 * FAQ
 * ---------------------------------------------------------------------------
 */
export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQS: FaqItem[] = [
  {
    question: "Is Blockify free?",
    answer:
      "Yes — the beta is completely free while we build. Core blocking, focus goals, and analytics are included, with premium features arriving later.",
  },
  {
    question: "Does it work offline?",
    answer:
      "Absolutely. Blocking, timers, and streaks all run on-device, so your focus is protected even without a connection.",
  },
  {
    question: "Can I unblock apps anytime?",
    answer:
      "You're always in control. Emergency Unlock gives you mindful access when you genuinely need it, without breaking your streak by accident.",
  },
  {
    question: "Is my data private?",
    answer:
      "Your usage data stays on your device by default. We never sell your data, and analytics are yours alone.",
  },
  {
    question: "How does AI help me focus?",
    answer:
      "The AI Productivity Coach learns your patterns and suggests smarter focus windows, gentle nudges, and habit tweaks tailored to you.",
  },
];

/**
 * ---------------------------------------------------------------------------
 * FOOTER
 * ---------------------------------------------------------------------------
 */
export const FOOTER_LINKS = [
  { label: "Privacy Policy", href: "/privacy" }, // TODO
  { label: "Terms", href: "/terms" }, // TODO
  { label: "Contact", href: SOCIALS.email },
] as const;
