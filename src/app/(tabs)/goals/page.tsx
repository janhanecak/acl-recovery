"use client";

import { getDayNumber, getDaysUntilGolf } from "@/lib/data";

const MILESTONES = [
  { day: 0, label: "Surgery", icon: "🏥", done: true },
  { day: 14, label: "Stitches out", icon: "🩹", done: true },
  { day: 42, label: "Started Phase 2", icon: "💪", done: true },
  { day: 60, label: "Walking without crutches", icon: "🚶", done: true },
  { day: 90, label: "Stationary cycling", icon: "🚴", done: false },
  { day: 120, label: "Light jogging", icon: "🏃", done: false },
  { day: 150, label: "Return to sport drills", icon: "⛳", done: false },
  { day: 180, label: "Return to golf", icon: "🏌️", done: false },
];

const WEEKLY_HABITS = [
  { label: "Cycling sessions", target: 5, done: 3, icon: "🚴" },
  { label: "Compex AM", target: 7, done: 5, icon: "⚡" },
  { label: "Compex PM", target: 7, done: 4, icon: "⚡" },
  { label: "Strength sessions", target: 3, done: 2, icon: "💪" },
  { label: "Stretches completed", target: 7, done: 6, icon: "🧘" },
];

export default function GoalsPage() {
  const dayNum = getDayNumber();
  const daysLeft = getDaysUntilGolf();
  const totalDays = 134; // approx days from surgery to Aug 2026 target
  const progress = Math.min(100, Math.round((dayNum / totalDays) * 100));

  return (
    <div className="px-4 py-5 pb-6 space-y-5">
      <h1 className="text-2xl font-bold text-text-primary">Goals</h1>

      {/* Golf countdown hero */}
      <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-accent to-[#2d6b52] text-white p-5 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⛳</span>
          <p className="text-sm font-medium opacity-80">Return to golf</p>
        </div>

        <div>
          <p className="text-5xl font-bold">{daysLeft}</p>
          <p className="text-sm opacity-80 mt-1">days to go</p>
        </div>

        <div>
          <div className="flex justify-between text-xs opacity-70 mb-1.5">
            <span>Day {dayNum}</span>
            <span>{progress}% there</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full">
            <div
              className="h-full bg-white rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs opacity-70 mt-1.5">Target: August 2026</p>
        </div>
      </div>

      {/* Weekly summary */}
      <div className="card space-y-3">
        <h2 className="font-semibold text-text-primary">This Week</h2>
        {WEEKLY_HABITS.map((h) => (
          <div key={h.label}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <span className="text-base">{h.icon}</span>
                <span className="text-sm text-text-primary">{h.label}</span>
              </div>
              <span className="text-xs font-semibold text-accent">
                {h.done}/{h.target}
              </span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full">
              <div
                className="h-full bg-accent rounded-full transition-all"
                style={{ width: `${(h.done / h.target) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Recovery timeline */}
      <div className="card space-y-1">
        <h2 className="font-semibold text-text-primary mb-3">
          Recovery Timeline
        </h2>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-4 bottom-4 w-0.5 bg-gray-100" />

          <div className="space-y-4">
            {MILESTONES.map((m, i) => {
              const reached = dayNum >= m.day;
              const isCurrent =
                dayNum >= m.day &&
                (i === MILESTONES.length - 1 || dayNum < MILESTONES[i + 1].day);
              return (
                <div key={m.day} className="flex items-start gap-3 relative">
                  {/* Circle */}
                  <div
                    className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-lg z-10 transition-all ${
                      isCurrent
                        ? "bg-accent shadow-md shadow-accent/30 ring-4 ring-accent/20"
                        : reached
                        ? "bg-accent-light"
                        : "bg-gray-100"
                    }`}
                  >
                    {m.icon}
                  </div>

                  <div className="pt-1">
                    <p
                      className={`text-sm font-semibold ${
                        isCurrent
                          ? "text-accent"
                          : reached
                          ? "text-text-primary"
                          : "text-text-secondary"
                      }`}
                    >
                      {m.label}
                    </p>
                    <p className="text-xs text-text-secondary mt-0.5">
                      Day {m.day}
                      {isCurrent ? " · Current" : ""}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
