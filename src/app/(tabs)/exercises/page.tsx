"use client";

import { useState } from "react";
import {
  EXERCISES,
  getDayType,
  getDayTypeLabel,
  getDayTypeColors,
  type DayType,
  type Exercise,
} from "@/lib/data";
import { useDailyStore } from "@/lib/useDailyStore";
import { X } from "lucide-react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAY_TYPES: DayType[] = [
  "strength",
  "office",
  "strength",
  "office",
  "strength",
  "active-rest",
  "rest",
];

function getTodayIndex(): number {
  const d = new Date().getDay();
  return d === 0 ? 6 : d - 1;
}

export default function ExercisesPage() {
  const todayIndex = getTodayIndex();
  const [selectedDay, setSelectedDay] = useState(todayIndex);
  const [detail, setDetail] = useState<Exercise | null>(null);
  const { data, toggleExercise, hydrated } = useDailyStore();

  const dayType = DAY_TYPES[selectedDay];
  const colors = getDayTypeColors(dayType);

  const filtered = EXERCISES.filter((e) => e.days.includes(dayType));
  const stretches = filtered.filter((e) => e.category === "stretch");
  const strength = filtered.filter((e) => e.category === "strength");

  const isViewingToday = selectedDay === todayIndex;
  const ticked = new Set(isViewingToday ? data.exerciseTicked : []);
  const total = filtered.length;
  const done = filtered.filter((e) => ticked.has(e.id)).length;

  if (!hydrated) return null;

  return (
    <div className="pb-6">
      {/* Day strip */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm px-4 pt-5 pb-3">
        <h1 className="text-xl font-bold text-text-primary mb-3">Exercises</h1>
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
          {DAYS.map((day, i) => {
            const dt = DAY_TYPES[i];
            const dc = getDayTypeColors(dt);
            const isToday = i === todayIndex;
            const isSelected = i === selectedDay;
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(i)}
                className={`flex-shrink-0 flex flex-col items-center px-3 py-2 rounded-xl transition-all min-w-[44px] min-h-[44px] justify-center ${
                  isSelected
                    ? `${dc.bg} ${dc.border} border`
                    : "bg-gray-100"
                }`}
              >
                <span
                  className={`text-[11px] font-semibold ${
                    isSelected ? dc.text : "text-text-secondary"
                  }`}
                >
                  {day}
                </span>
                {isToday && (
                  <span className="w-1 h-1 rounded-full bg-accent mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Day type + progress */}
        <div className="flex items-center justify-between mt-3">
          <span className={`text-sm font-medium ${colors.text}`}>
            {getDayTypeLabel(dayType)}
          </span>
          {isViewingToday ? (
            <span className="text-xs text-text-secondary font-medium">
              {done}/{total} done
            </span>
          ) : (
            <span className="text-xs text-text-secondary font-medium bg-gray-100 px-2 py-0.5 rounded-full">
              Schedule view
            </span>
          )}
        </div>

        {isViewingToday && (
          <div className="h-1.5 bg-gray-100 rounded-full mt-2">
            <div
              className="h-full bg-accent rounded-full transition-all duration-300"
              style={{ width: total > 0 ? `${(done / total) * 100}%` : "0%" }}
            />
          </div>
        )}
      </div>

      <div className="px-4 space-y-5">
        {!isViewingToday && (
          <p className="text-xs text-text-secondary bg-gray-50 rounded-xl px-3 py-2 text-center">
            Tap today&apos;s dot to log exercises
          </p>
        )}
        <ExerciseSection
          title="Daily Stretches"
          exercises={stretches}
          ticked={ticked}
          onToggle={isViewingToday ? toggleExercise : () => {}}
          onDetail={setDetail}
          interactive={isViewingToday}
        />
        {strength.length > 0 && (
          <ExerciseSection
            title="Strength"
            exercises={strength}
            ticked={ticked}
            onToggle={isViewingToday ? toggleExercise : () => {}}
            onDetail={setDetail}
            interactive={isViewingToday}
          />
        )}
      </div>

      {detail && (
        <DetailSheet exercise={detail} onClose={() => setDetail(null)} />
      )}
    </div>
  );
}

function ExerciseSection({
  title,
  exercises,
  ticked,
  onToggle,
  onDetail,
  interactive,
}: {
  title: string;
  exercises: Exercise[];
  ticked: Set<string>;
  onToggle: (id: string) => void;
  onDetail: (e: Exercise) => void;
  interactive: boolean;
}) {
  if (exercises.length === 0) return null;
  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-widest text-text-secondary mb-2">
        {title}
      </h2>
      <div className="space-y-2">
        {exercises.map((ex) => (
          <ExerciseRow
            key={ex.id}
            exercise={ex}
            done={ticked.has(ex.id)}
            onToggle={() => onToggle(ex.id)}
            onDetail={() => onDetail(ex)}
            interactive={interactive}
          />
        ))}
      </div>
    </div>
  );
}

function ExerciseRow({
  exercise,
  done,
  onToggle,
  onDetail,
  interactive,
}: {
  exercise: Exercise;
  done: boolean;
  onToggle: () => void;
  onDetail: () => void;
  interactive: boolean;
}) {
  return (
    <div
      className={`card flex items-center gap-3 py-3 transition-all ${
        done ? "opacity-60" : ""
      }`}
    >
      {/* Tick — iOS style small circle, greyed out when not today */}
      <button
        onClick={interactive ? onToggle : undefined}
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
          interactive ? "active:scale-90" : "cursor-default"
        }`}
        style={{
          backgroundColor: done ? "#3d8b6e" : "transparent",
          borderColor: done ? "#3d8b6e" : interactive ? "#d1d5db" : "#e5e7eb",
          opacity: interactive ? 1 : 0.4,
        }}
      >
        {done && (
          <svg viewBox="0 0 12 10" className="w-2.5 h-2 fill-none stroke-white" strokeWidth={2.5}>
            <polyline points="1,5 4,8 11,1" />
          </svg>
        )}
      </button>

      {/* Name + meta */}
      <button className="flex-1 text-left min-h-[44px] flex flex-col justify-center" onClick={onDetail}>
        <p
          className={`text-sm font-semibold leading-tight ${
            done ? "line-through text-text-secondary" : "text-text-primary"
          }`}
        >
          {exercise.name}
        </p>
        <p className="text-xs text-text-secondary mt-0.5">
          {exercise.sets} sets
          {exercise.reps ? ` · ${exercise.reps} reps` : ""}
          {exercise.hold ? ` · hold ${exercise.hold}` : ""}
        </p>
      </button>

      {/* Chevron */}
      <button onClick={onDetail} className="h-11 w-8 flex items-center justify-center">
        <svg viewBox="0 0 8 14" className="w-2 h-3 fill-none stroke-gray-300" strokeWidth={2}>
          <polyline points="1,1 7,7 1,13" />
        </svg>
      </button>
    </div>
  );
}

function DetailSheet({
  exercise,
  onClose,
}: {
  exercise: Exercise;
  onClose: () => void;
}) {
  return (
    // pb-[72px] lifts the sheet above the bottom nav bar
    <div className="fixed inset-0 z-50 flex flex-col justify-end pb-[72px]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative bg-white rounded-t-3xl max-h-[80vh] flex flex-col">
        {/* Drag handle */}
        <div className="flex-shrink-0 pt-3 pb-1 flex justify-center">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Header — fixed, doesn't scroll */}
        <div className="flex-shrink-0 flex items-start justify-between px-5 pb-3">
          <h2 className="text-xl font-bold text-text-primary flex-1 pr-4 leading-tight">
            {exercise.name}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5"
          >
            <X size={15} className="text-gray-500" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-5 pb-8 space-y-4">
          {/* Meta pills */}
          <div className="flex flex-wrap gap-2">
            <Pill label={`${exercise.sets} sets`} />
            {exercise.reps && <Pill label={`${exercise.reps} reps`} />}
            {exercise.hold && <Pill label={`hold ${exercise.hold}`} />}
            <Pill
              label={exercise.category === "stretch" ? "Stretch" : "Strength"}
              accent
            />
          </div>

          {/* Image — fixed container + object-contain: never crops, never huge */}
          {exercise.imageKey ? (
            <div className="w-full h-44 rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={exercise.imageKey}
                alt={exercise.name}
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="w-full h-36 bg-accent-light rounded-2xl flex items-center justify-center">
              <span className="text-5xl">
                {exercise.category === "stretch" ? "🧘" : "💪"}
              </span>
            </div>
          )}

          {/* Instructions */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-2">
              Instructions
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              {exercise.instructions}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Pill({ label, accent }: { label: string; accent?: boolean }) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        accent ? "bg-accent text-white" : "bg-accent-light text-accent"
      }`}
    >
      {label}
    </span>
  );
}
