"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabase";

function todayKey() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

export interface DailyData {
  cycleDuration: number;
  cycleLogged: boolean;
  compexAM: boolean;
  compexPM: boolean;
  swelling: number;
  pain: number;
  energy: number;
  mood: string;
  exerciseTicked: string[];
  dayCompleted: boolean;
}

const DEFAULT: DailyData = {
  cycleDuration: 20,
  cycleLogged: false,
  compexAM: false,
  compexPM: false,
  swelling: 0,
  pain: 0,
  energy: 0,
  mood: "",
  exerciseTicked: [],
  dayCompleted: false,
};

function fromRow(row: Record<string, unknown>): DailyData {
  return {
    cycleDuration: (row.cycle_duration as number) ?? 20,
    cycleLogged: (row.cycle_logged as boolean) ?? false,
    compexAM: (row.compex_am as boolean) ?? false,
    compexPM: (row.compex_pm as boolean) ?? false,
    swelling: (row.swelling as number) ?? 0,
    pain: (row.pain as number) ?? 0,
    energy: (row.energy as number) ?? 0,
    mood: (row.mood as string) ?? "",
    exerciseTicked: (row.exercise_ticked as string[]) ?? [],
    dayCompleted: (row.day_completed as boolean) ?? false,
  };
}

function toRow(date: string, data: DailyData) {
  return {
    log_date: date,
    cycle_duration: data.cycleDuration,
    cycle_logged: data.cycleLogged,
    compex_am: data.compexAM,
    compex_pm: data.compexPM,
    swelling: data.swelling,
    pain: data.pain,
    energy: data.energy,
    mood: data.mood,
    exercise_ticked: data.exerciseTicked,
    day_completed: data.dayCompleted,
    updated_at: new Date().toISOString(),
  };
}

function loadLocal(): DailyData {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = localStorage.getItem(`acl-daily-${todayKey()}`);
    if (!raw) return DEFAULT;
    return { ...DEFAULT, ...JSON.parse(raw) };
  } catch {
    return DEFAULT;
  }
}

function saveLocal(data: DailyData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(`acl-daily-${todayKey()}`, JSON.stringify(data));
}

async function upsertSupabase(data: DailyData) {
  const date = todayKey();
  await supabase
    .from("acl_daily_logs")
    .upsert(toRow(date, data), { onConflict: "log_date" });
}

export function useDailyStore() {
  const [data, setData] = useState<DailyData>(DEFAULT);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const date = todayKey();

    // Load from localStorage immediately (instant)
    const local = loadLocal();
    setData(local);

    // Then try Supabase — if it has a more recent record, use that
    supabase
      .from("acl_daily_logs")
      .select("*")
      .eq("log_date", date)
      .single()
      .then(({ data: row }) => {
        if (row) {
          const remote = fromRow(row);
          setData(remote);
          saveLocal(remote);
        }
        setHydrated(true);
      })
      .catch(() => {
        // Offline — fall back to localStorage
        setHydrated(true);
      });
  }, []);

  const update = useCallback((patch: Partial<DailyData>) => {
    setData((prev) => {
      const next = { ...prev, ...patch };
      saveLocal(next);
      upsertSupabase(next);
      return next;
    });
  }, []);

  const toggleExercise = useCallback((id: string) => {
    setData((prev) => {
      const ticked = new Set(prev.exerciseTicked);
      ticked.has(id) ? ticked.delete(id) : ticked.add(id);
      const next = { ...prev, exerciseTicked: Array.from(ticked) };
      saveLocal(next);
      upsertSupabase(next);
      return next;
    });
  }, []);

  return { data, update, toggleExercise, hydrated };
}
