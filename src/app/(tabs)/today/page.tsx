"use client";

import { useState } from "react";
import Link from "next/link";
import {
  getDayType,
  getDayTypeLabel,
  getDayTypeColors,
  getDayNumber,
  EXERCISES,
} from "@/lib/data";
import { useDailyStore } from "@/lib/useDailyStore";
import { ChevronRight, Zap, Sun, Moon, CheckCircle2 } from "lucide-react";

const CYCLE_DURATIONS = [15, 20, 30, 45];
const SCALE_LABELS: Record<number, string> = {
  1: "😣",
  2: "😕",
  3: "😐",
  4: "🙂",
  5: "😄",
};
const MOOD_EMOJIS = ["😔", "😐", "🙂", "😊", "🤩"];

export default function TodayPage() {
  const today = new Date();
  const dayType = getDayType(today);
  const colors = getDayTypeColors(dayType);
  const dayNum = getDayNumber();
  const { data, update, hydrated } = useDailyStore();
  const [showSummary, setShowSummary] = useState(false);

  const dateStr = today.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  // How many of today's exercises are ticked
  const todaysExercises = EXERCISES.filter((e) => e.days.includes(dayType));
  const tickedCount = todaysExercises.filter((e) =>
    data.exerciseTicked.includes(e.id)
  ).length;

  if (!hydrated) return null;

  return (
    <div className="px-4 py-5 space-y-4 pb-6">
      {/* Header */}
      <div>
        <p className="text-xs font-medium text-text-secondary uppercase tracking-widest">
          {dateStr}
        </p>
        <h1 className="text-2xl font-bold text-text-primary mt-0.5">
          Day {dayNum}
        </h1>
      </div>

      {/* Day type banner */}
      <div
        className={`rounded-2xl border px-4 py-3 flex items-center gap-3 ${colors.bg} ${colors.border}`}
      >
        <span className="text-2xl">{getDayTypeLabel(dayType).split(" ")[0]}</span>
        <div>
          <p className={`font-semibold text-base ${colors.text}`}>
            {getDayTypeLabel(dayType).split(" ").slice(1).join(" ")}
          </p>
          <p className="text-xs text-text-secondary mt-0.5">
            {dayType === "strength"
              ? "3 stretches · 6 strength exercises"
              : "3 stretches · light day"}
          </p>
        </div>
      </div>

      {/* Cycling log */}
      <div className="card space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🚴</span>
          <h2 className="font-semibold text-text-primary">Cycling</h2>
        </div>

        <div className="flex gap-2">
          {CYCLE_DURATIONS.map((d) => (
            <button
              key={d}
              onClick={() => update({ cycleDuration: d })}
              className={`flex-1 h-11 rounded-xl text-sm font-medium transition-colors ${
                data.cycleDuration === d
                  ? "bg-accent text-white"
                  : "bg-accent-light text-accent"
              }`}
            >
              {d}m
            </button>
          ))}
        </div>

        <button
          onClick={() => update({ cycleLogged: !data.cycleLogged })}
          className={`w-full h-11 rounded-xl font-semibold text-sm transition-colors ${
            data.cycleLogged
              ? "bg-accent-light text-accent"
              : "bg-accent text-white"
          }`}
        >
          {data.cycleLogged
            ? `✓ Logged ${data.cycleDuration} min`
            : `Log ${data.cycleDuration} min`}
        </button>
      </div>

      {/* Compex cards */}
      <div className="grid grid-cols-2 gap-3">
        <CompexCard
          label="AM Session"
          icon={<Sun size={15} className="text-gold" />}
          done={data.compexAM}
          onToggle={() => update({ compexAM: !data.compexAM })}
        />
        <CompexCard
          label="PM Session"
          icon={<Moon size={15} className="text-purple" />}
          done={data.compexPM}
          onToggle={() => update({ compexPM: !data.compexPM })}
        />
      </div>

      {/* Daily check-in */}
      <div className="card space-y-4">
        <h2 className="font-semibold text-text-primary">Daily Check-In</h2>

        <RatingRow
          label="Swelling"
          emoji="💧"
          value={data.swelling}
          onChange={(v) => update({ swelling: v })}
        />
        <RatingRow
          label="Pain"
          emoji="⚡"
          value={data.pain}
          onChange={(v) => update({ pain: v })}
        />
        <RatingRow
          label="Energy"
          emoji="🔋"
          value={data.energy}
          onChange={(v) => update({ energy: v })}
        />

        {/* Mood */}
        <div>
          <p className="text-xs font-medium text-text-secondary mb-2">Mood</p>
          <div className="flex gap-2 justify-between">
            {MOOD_EMOJIS.map((e) => (
              <button
                key={e}
                onClick={() => update({ mood: e })}
                className={`flex-1 h-11 rounded-xl text-xl transition-all ${
                  data.mood === e
                    ? "bg-accent-light scale-110"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Link to exercises */}
      <Link
        href="/exercises"
        className="flex items-center justify-between card active:bg-accent-light transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-xl bg-accent-light flex items-center justify-center">
            <Zap size={18} className="text-accent" />
          </span>
          <div>
            <p className="font-semibold text-text-primary text-sm">
              Today&apos;s Exercises
            </p>
            <p className="text-xs text-text-secondary">
              {tickedCount}/{todaysExercises.length} completed
            </p>
          </div>
        </div>
        <ChevronRight size={18} className="text-text-secondary" />
      </Link>

      {/* Complete Day button */}
      <button
        onClick={() => setShowSummary(true)}
        className={`w-full h-14 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
          data.dayCompleted
            ? "bg-accent-light text-accent border-2 border-accent"
            : "bg-accent text-white shadow-lg shadow-accent/25"
        }`}
      >
        <CheckCircle2 size={20} />
        {data.dayCompleted ? "Day Complete ✓" : "Complete Day"}
      </button>

      {/* Day summary sheet */}
      {showSummary && (
        <DaySummary
          data={data}
          dayNum={dayNum}
          dateStr={dateStr}
          dayType={getDayTypeLabel(dayType)}
          tickedCount={tickedCount}
          totalExercises={todaysExercises.length}
          onClose={() => setShowSummary(false)}
          onConfirm={() => {
            update({ dayCompleted: true });
            setShowSummary(false);
          }}
        />
      )}
    </div>
  );
}

function DaySummary({
  data,
  dayNum,
  dateStr,
  dayType,
  tickedCount,
  totalExercises,
  onClose,
  onConfirm,
}: {
  data: ReturnType<typeof import("@/lib/useDailyStore").useDailyStore>["data"];
  dayNum: number;
  dateStr: string;
  dayType: string;
  tickedCount: number;
  totalExercises: number;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const rows: { label: string; value: string }[] = [
    {
      label: "Cycling",
      value: data.cycleLogged ? `${data.cycleDuration} min ✓` : "Not logged",
    },
    {
      label: "Compex AM",
      value: data.compexAM ? "Done ✓" : "Not done",
    },
    {
      label: "Compex PM",
      value: data.compexPM ? "Done ✓" : "Not done",
    },
    {
      label: "Exercises",
      value: `${tickedCount}/${totalExercises} completed`,
    },
    {
      label: "Pain",
      value: data.pain ? `${data.pain}/5` : "—",
    },
    {
      label: "Swelling",
      value: data.swelling ? `${data.swelling}/5` : "—",
    },
    {
      label: "Energy",
      value: data.energy ? `${data.energy}/5` : "—",
    },
    {
      label: "Mood",
      value: data.mood || "—",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end pb-[72px]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative bg-white rounded-t-3xl max-h-[80vh] flex flex-col">
        <div className="flex-shrink-0 pt-3 pb-1 flex justify-center">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        <div className="flex-shrink-0 px-5 pb-3">
          <h2 className="text-xl font-bold text-text-primary">Day {dayNum} Summary</h2>
          <p className="text-xs text-text-secondary mt-0.5">{dateStr} · {dayType}</p>
        </div>

        <div className="overflow-y-auto flex-1 px-5 pb-6 space-y-2">
          {rows.map(({ label, value }) => (
            <div
              key={label}
              className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
            >
              <span className="text-sm text-text-secondary">{label}</span>
              <span
                className={`text-sm font-semibold ${
                  value.includes("✓") ? "text-accent" : "text-text-primary"
                }`}
              >
                {value}
              </span>
            </div>
          ))}

          <p className="text-xs text-text-secondary text-center pt-2">
            Data is saved locally. Supabase sync comes in Phase 2.
          </p>
        </div>

        <div className="flex-shrink-0 px-5 pb-6 pt-2 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-12 rounded-xl border border-gray-200 text-sm font-semibold text-text-secondary"
          >
            Keep editing
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 h-12 rounded-xl bg-accent text-white text-sm font-semibold"
          >
            Mark complete
          </button>
        </div>
      </div>
    </div>
  );
}

function CompexCard({
  label,
  icon,
  done,
  onToggle,
}: {
  label: string;
  icon: React.ReactNode;
  done: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`card text-left transition-all active:scale-95 w-full ${
        done ? "bg-accent-light border border-accent" : ""
      }`}
    >
      <div className="flex items-center gap-1.5 mb-2">
        {icon}
        <span className="text-xs font-medium text-text-secondary">Compex</span>
      </div>
      <p className="text-sm font-semibold text-text-primary">{label}</p>
      <div className="mt-2 flex items-center gap-1.5">
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
            done ? "bg-accent border-accent" : "border-gray-300"
          }`}
        >
          {done && (
            <svg viewBox="0 0 12 10" className="w-2.5 h-2 fill-none stroke-white stroke-[2.5]">
              <polyline points="1,5 4,8 11,1" />
            </svg>
          )}
        </div>
        <span className={`text-xs font-medium ${done ? "text-accent" : "text-text-secondary"}`}>
          {done ? "Done" : "Tap to mark"}
        </span>
      </div>
    </button>
  );
}

function RatingRow({
  label,
  emoji,
  value,
  onChange,
}: {
  label: string;
  emoji: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <p className="text-xs font-medium text-text-secondary">
          {emoji} {label}
        </p>
        {value > 0 && (
          <span className="text-xs text-accent font-semibold">
            {SCALE_LABELS[value]} {value}/5
          </span>
        )}
      </div>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className={`flex-1 h-10 rounded-xl text-sm font-semibold transition-colors ${
              value === n
                ? "bg-accent text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}
