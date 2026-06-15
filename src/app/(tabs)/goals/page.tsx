"use client";

import { useState, useEffect } from "react";
import { getDayNumber, getDaysUntilGolf } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import { X, Plus, Calendar } from "lucide-react";

const MILESTONES = [
  { day: 0,   label: "Surgery",                  icon: "🏥", done: true },
  { day: 14,  label: "Stitches removed",          icon: "🩹", done: true },
  { day: 42,  label: "Phase 2 physio started",    icon: "💪", done: true },
  { day: 60,  label: "Walking without crutches",  icon: "🚶", done: true },
  { day: 87,  label: "Cycling outdoors",          icon: "🚴", done: true },
  { day: 105, label: "Light jogging",             icon: "🏃", done: false },
  { day: 130, label: "Running 20 min continuous", icon: "👟", done: false },
  { day: 150, label: "5K run",                    icon: "5️⃣", done: false },
  { day: 134, label: "Return to golf ⛳",          icon: "🏌️", done: false },
  { day: 195, label: "10K run",                   icon: "🔟", done: false },
];

// Sort milestones by day for display
const SORTED_MILESTONES = [...MILESTONES].sort((a, b) => a.day - b.day);

const WEEKLY_HABITS = [
  { label: "Cycling sessions",    target: 5, icon: "🚴" },
  { label: "Compex AM",           target: 7, icon: "⚡" },
  { label: "Compex PM",           target: 7, icon: "⚡" },
  { label: "Strength sessions",   target: 3, icon: "💪" },
  { label: "Stretches completed", target: 7, icon: "🧘" },
];

interface Appointment {
  id: string;
  appt_date: string;
  appt_time: string | null;
  notes: string | null;
}

export default function GoalsPage() {
  const dayNum = getDayNumber();
  const daysLeft = getDaysUntilGolf();
  const totalDays = 134;
  const progress = Math.min(100, Math.round((dayNum / totalDays) * 100));

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showAddAppt, setShowAddAppt] = useState(false);
  const [weekDone, setWeekDone] = useState<Record<string, number>>({});

  useEffect(() => {
    loadAppointments();
    loadWeekStats();
  }, []);

  async function loadAppointments() {
    const today = new Date().toISOString().slice(0, 10);
    const { data } = await supabase
      .from("acl_physio_appointments")
      .select("*")
      .gte("appt_date", today)
      .order("appt_date", { ascending: true })
      .limit(5);
    if (data) setAppointments(data);
  }

  async function loadWeekStats() {
    const since = new Date();
    since.setDate(since.getDate() - 6);
    const { data } = await supabase
      .from("acl_daily_logs")
      .select("cycle_logged, compex_am, compex_pm, day_completed, exercise_ticked")
      .gte("log_date", since.toISOString().slice(0, 10));
    if (!data) return;
    setWeekDone({
      "Cycling sessions":    data.filter((r) => r.cycle_logged).length,
      "Compex AM":           data.filter((r) => r.compex_am).length,
      "Compex PM":           data.filter((r) => r.compex_pm).length,
      "Strength sessions":   data.filter((r) => r.day_completed).length,
      "Stretches completed": data.filter((r) => (r.exercise_ticked?.length ?? 0) > 0).length,
    });
  }

  function formatApptDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      weekday: "short", day: "numeric", month: "short",
    });
  }

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
            <div className="h-full bg-white rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs opacity-70 mt-1.5">Target: August 2026</p>
        </div>
      </div>

      {/* Physio appointments */}
      <div className="card space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-text-primary">Physio Appointments</h2>
          <button
            onClick={() => setShowAddAppt(true)}
            className="w-8 h-8 rounded-full bg-accent-light flex items-center justify-center"
          >
            <Plus size={16} className="text-accent" />
          </button>
        </div>

        {appointments.length === 0 ? (
          <p className="text-sm text-text-secondary py-2 text-center">
            No upcoming appointments — tap + to add one
          </p>
        ) : (
          <div className="space-y-2">
            {appointments.map((a) => (
              <div key={a.id} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                <div className="w-9 h-9 rounded-xl bg-accent-light flex items-center justify-center flex-shrink-0">
                  <Calendar size={16} className="text-accent" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-text-primary">
                    {formatApptDate(a.appt_date)}
                    {a.appt_time ? ` · ${a.appt_time}` : ""}
                  </p>
                  {a.notes && <p className="text-xs text-text-secondary mt-0.5">{a.notes}</p>}
                </div>
                <button
                  onClick={async () => {
                    await supabase.from("acl_physio_appointments").delete().eq("id", a.id);
                    setAppointments((prev) => prev.filter((x) => x.id !== a.id));
                  }}
                  className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-1"
                >
                  <X size={12} className="text-gray-400" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Weekly summary */}
      <div className="card space-y-3">
        <h2 className="font-semibold text-text-primary">This Week</h2>
        {WEEKLY_HABITS.map((h) => {
          const done = weekDone[h.label] ?? 0;
          return (
            <div key={h.label}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-base">{h.icon}</span>
                  <span className="text-sm text-text-primary">{h.label}</span>
                </div>
                <span className="text-xs font-semibold text-accent">{done}/{h.target}</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full">
                <div
                  className="h-full bg-accent rounded-full transition-all"
                  style={{ width: `${Math.min(100, (done / h.target) * 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recovery timeline */}
      <div className="card space-y-1">
        <h2 className="font-semibold text-text-primary mb-3">Recovery Timeline</h2>
        <div className="relative">
          <div className="absolute left-5 top-4 bottom-4 w-0.5 bg-gray-100" />
          <div className="space-y-4">
            {SORTED_MILESTONES.map((m, i) => {
              const reached = dayNum >= m.day;
              const isCurrent =
                reached &&
                (i === SORTED_MILESTONES.length - 1 || dayNum < SORTED_MILESTONES[i + 1].day);
              return (
                <div key={`${m.day}-${m.label}`} className="flex items-start gap-3 relative">
                  <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-lg z-10 transition-all ${
                    isCurrent
                      ? "bg-accent shadow-md shadow-accent/30 ring-4 ring-accent/20"
                      : reached ? "bg-accent-light" : "bg-gray-100"
                  }`}>
                    {m.icon}
                  </div>
                  <div className="pt-1">
                    <p className={`text-sm font-semibold ${isCurrent ? "text-accent" : reached ? "text-text-primary" : "text-text-secondary"}`}>
                      {m.label}
                    </p>
                    <p className="text-xs text-text-secondary mt-0.5">
                      Day {m.day}{isCurrent ? " · You are here" : ""}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add appointment sheet */}
      {showAddAppt && (
        <AddAppointmentSheet
          onClose={() => setShowAddAppt(false)}
          onSaved={(a) => {
            setAppointments((prev) => [...prev, a].sort((x, y) => x.appt_date.localeCompare(y.appt_date)));
            setShowAddAppt(false);
          }}
        />
      )}
    </div>
  );
}

function AddAppointmentSheet({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved: (a: Appointment) => void;
}) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!date) return;
    setSaving(true);
    const { data, error } = await supabase
      .from("acl_physio_appointments")
      .insert({ appt_date: date, appt_time: time || null, notes: notes || null })
      .select()
      .single();
    setSaving(false);
    if (!error && data) onSaved(data);
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end pb-[72px]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl">
        <div className="pt-3 pb-1 flex justify-center">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        <div className="flex items-center justify-between px-5 pb-4 pt-1">
          <h2 className="text-lg font-bold text-text-primary">Add Physio Appointment</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <X size={15} className="text-gray-500" />
          </button>
        </div>

        <div className="px-5 pb-8 space-y-4">
          <div>
            <label className="text-xs font-medium text-text-secondary mb-1.5 block">Date *</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm text-text-primary bg-white focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-text-secondary mb-1.5 block">Time (optional)</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm text-text-primary bg-white focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-text-secondary mb-1.5 block">Notes (optional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. NHS physio, bring exercise sheet"
              className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm text-text-primary bg-white focus:outline-none focus:border-accent placeholder:text-gray-300"
            />
          </div>

          <button
            onClick={save}
            disabled={!date || saving}
            className="w-full h-12 rounded-xl bg-accent text-white font-semibold text-sm disabled:opacity-40"
          >
            {saving ? "Saving…" : "Save Appointment"}
          </button>
        </div>
      </div>
    </div>
  );
}
