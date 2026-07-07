import * as React from "react";
import {
  Shield,
  Timer,
  Flame,
  Target,
  BarChart3,
  Settings as SettingsIcon,
  Sparkles,
  Lock,
} from "lucide-react";

/**
 * CSS-rendered placeholder app screens. These give the landing page a premium,
 * "real app" feel before actual screenshots exist.
 *
 * TODO: When real screenshots are ready, replace usages with:
 *   <Image src="/screenshots/home.png" alt="Home" fill className="object-cover" />
 */

const StatusBar = () => (
  <div className="flex items-center justify-between px-5 pt-5 text-[9px] font-medium text-white/60">
    <span>9:41</span>
    <div className="flex items-center gap-1">
      <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
      <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
      <span className="h-1.5 w-3 rounded-sm bg-white/40" />
    </div>
  </div>
);

const ScreenShell = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-full w-full flex-col bg-gradient-to-b from-neutral-950 via-black to-neutral-950">
    <StatusBar />
    <div className="flex-1 px-4 py-4">{children}</div>
  </div>
);

function HomeScreen() {
  return (
    <ScreenShell>
      <p className="mt-2 text-[10px] text-white/40">Good morning</p>
      <h3 className="text-lg font-semibold text-white">Stay focused ✨</h3>
      <div className="mt-4 rounded-2xl bg-gradient-to-br from-accent-600 to-fuchsia-600 p-4">
        <div className="flex items-center gap-2 text-white">
          <Target className="h-4 w-4" />
          <span className="text-[11px] font-medium">Today&apos;s goal</span>
        </div>
        <p className="mt-2 text-2xl font-bold text-white">3h 20m</p>
        <div className="mt-2 h-1.5 w-full rounded-full bg-white/25">
          <div className="h-full w-2/3 rounded-full bg-white" />
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {[
          { icon: Flame, label: "Streak", value: "14 days" },
          { icon: Shield, label: "Blocked", value: "27 apps" },
        ].map((c) => (
          <div key={c.label} className="rounded-xl border border-white/10 bg-white/5 p-3">
            <c.icon className="h-4 w-4 text-accent-300" />
            <p className="mt-2 text-[9px] text-white/40">{c.label}</p>
            <p className="text-sm font-semibold text-white">{c.value}</p>
          </div>
        ))}
      </div>
    </ScreenShell>
  );
}

function ShieldScreen() {
  return (
    <ScreenShell>
      <div className="flex h-full flex-col items-center justify-center text-center">
        <div className="relative">
          <div className="absolute inset-0 animate-pulse-glow rounded-full bg-accent-500/40 blur-2xl" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-accent-400/40 bg-accent-500/10">
            <Shield className="h-10 w-10 text-accent-300" />
          </div>
        </div>
        <p className="mt-6 text-sm font-semibold text-white">You&apos;re protected</p>
        <p className="mt-1 text-[10px] text-white/40">Distractions blocked until 5:00 PM</p>
        <div className="mt-6 flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[9px] text-white/60">
          <Lock className="h-3 w-3" /> Focus mode active
        </div>
      </div>
    </ScreenShell>
  );
}

function StatsScreen() {
  const bars = [40, 65, 50, 80, 55, 95, 70];
  return (
    <ScreenShell>
      <div className="flex items-center gap-2">
        <BarChart3 className="h-4 w-4 text-accent-300" />
        <h3 className="text-sm font-semibold text-white">This week</h3>
      </div>
      <div className="mt-5 flex h-32 items-end justify-between gap-1.5">
        {bars.map((h, i) => (
          <div
            key={i}
            className="w-full rounded-t bg-gradient-to-t from-accent-700 to-accent-400"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <div className="mt-5 space-y-2">
        {[
          { label: "Focus time", value: "18h 42m" },
          { label: "Sessions", value: "36" },
        ].map((r) => (
          <div
            key={r.label}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2"
          >
            <span className="text-[10px] text-white/50">{r.label}</span>
            <span className="text-xs font-semibold text-white">{r.value}</span>
          </div>
        ))}
      </div>
    </ScreenShell>
  );
}

function FocusScreen() {
  return (
    <ScreenShell>
      <div className="flex h-full flex-col items-center justify-center text-center">
        <div className="relative flex h-40 w-40 items-center justify-center">
          <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="#7C3AED"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="276"
              strokeDashoffset="80"
            />
          </svg>
          <div>
            <Timer className="mx-auto h-5 w-5 text-accent-300" />
            <p className="mt-1 text-2xl font-bold text-white">24:18</p>
            <p className="text-[9px] text-white/40">remaining</p>
          </div>
        </div>
        <p className="mt-6 text-sm font-semibold text-white">Deep Work</p>
        <div className="mt-4 flex gap-2">
          <span className="h-9 w-9 rounded-full border border-white/10 bg-white/5" />
          <span className="h-9 w-9 rounded-full bg-accent-600" />
        </div>
      </div>
    </ScreenShell>
  );
}

function SettingsScreen() {
  const rows = [
    { icon: Shield, label: "Blocked apps" },
    { icon: Target, label: "Daily goals" },
    { icon: Sparkles, label: "AI coach" },
    { icon: Flame, label: "Streaks" },
    { icon: SettingsIcon, label: "Preferences" },
  ];
  return (
    <ScreenShell>
      <h3 className="text-sm font-semibold text-white">Settings</h3>
      <div className="mt-4 space-y-2">
        {rows.map((r) => (
          <div
            key={r.label}
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-500/15">
              <r.icon className="h-3.5 w-3.5 text-accent-300" />
            </span>
            <span className="text-[11px] text-white/80">{r.label}</span>
            <span className="ml-auto text-white/30">›</span>
          </div>
        ))}
      </div>
    </ScreenShell>
  );
}

export const APP_SCREENS: Record<string, React.FC> = {
  home: HomeScreen,
  shield: ShieldScreen,
  stats: StatsScreen,
  focus: FocusScreen,
  settings: SettingsScreen,
};
