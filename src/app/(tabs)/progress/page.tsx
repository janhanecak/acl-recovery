"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";
import { supabase } from "@/lib/supabase";

const METRICS = ["Pain", "Swelling", "Energy", "Mood", "Steps"] as const;
type Metric = (typeof METRICS)[number];

interface DayRow {
  day: string;
  pain: number;
  swelling: number;
  energy: number;
  mood: number;
  steps: number;
}

const METRIC_CONFIG: Record<
  Metric,
  { key: string; color: string; label: string; max: number }
> = {
  Pain:     { key: "pain",     color: "#ef4444", label: "Pain (1–5)",    max: 5 },
  Swelling: { key: "swelling", color: "#3b82f6", label: "Swelling (1–5)", max: 5 },
  Energy:   { key: "energy",   color: "#3d8b6e", label: "Energy (1–5)",  max: 5 },
  Mood:     { key: "mood",     color: "#c9a84c", label: "Mood (1–5)",    max: 5 },
  Steps:    { key: "steps",    color: "#7b68c8", label: "Steps",         max: 10000 },
};

const MOOD_SCORE: Record<string, number> = {
  "😔": 1, "😐": 2, "🙂": 3, "😊": 4, "🤩": 5,
};

function moodToScore(m: string): number {
  return MOOD_SCORE[m] ?? 0;
}

function shortDay(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", { weekday: "short" });
}

export default function ProgressPage() {
  const [active, setActive] = useState<Metric>("Pain");
  const [chartData, setChartData] = useState<DayRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const since = new Date();
      since.setDate(since.getDate() - 6);
      const sinceStr = since.toISOString().slice(0, 10);

      const { data, error } = await supabase
        .from("acl_daily_logs")
        .select("log_date, pain, swelling, energy, mood")
        .gte("log_date", sinceStr)
        .order("log_date", { ascending: true });

      if (!error && data && data.length > 0) {
        setChartData(
          data.map((r) => ({
            day: shortDay(r.log_date),
            pain: r.pain ?? 0,
            swelling: r.swelling ?? 0,
            energy: r.energy ?? 0,
            mood: moodToScore(r.mood ?? ""),
            steps: 0, // Apple Health sync Phase 3
          }))
        );
      }
      setLoading(false);
    }
    load();
  }, []);

  const config = METRIC_CONFIG[active];
  const hasData = chartData.length > 0;

  function avg(key: keyof DayRow) {
    if (!hasData) return 0;
    return chartData.reduce((s, d) => s + (d[key] as number), 0) / chartData.length;
  }

  return (
    <div className="px-4 py-5 pb-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Progress</h1>
        <p className="text-xs text-text-secondary mt-0.5">7-day overview</p>
      </div>

      {/* Metric selector */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {METRICS.map((m) => (
          <button
            key={m}
            onClick={() => setActive(m)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              active === m
                ? "bg-accent text-white"
                : "bg-white text-text-secondary shadow-card"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Chart card */}
      <div className="card">
        <p className="text-xs font-semibold text-text-secondary mb-4 uppercase tracking-wide">
          {config.label}
        </p>

        {loading ? (
          <div className="h-48 flex items-center justify-center">
            <p className="text-sm text-text-secondary">Loading…</p>
          </div>
        ) : !hasData ? (
          <div className="h-48 flex flex-col items-center justify-center gap-2">
            <span className="text-3xl">📊</span>
            <p className="text-sm text-text-secondary text-center">
              No data yet — complete your first daily check-in
            </p>
          </div>
        ) : (
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              {active === "Steps" ? (
                <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} domain={[0, config.max]} tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", fontSize: 12 }} formatter={(val) => [`${Number(val).toLocaleString()} steps`]} />
                  <Bar dataKey={config.key} fill={config.color} radius={[6, 6, 0, 0]} />
                </BarChart>
              ) : (
                <LineChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} domain={[0, config.max]} ticks={[1, 2, 3, 4, 5]} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", fontSize: 12 }} />
                  <Line type="monotone" dataKey={config.key} stroke={config.color} strokeWidth={2.5} dot={{ r: 4, fill: config.color, strokeWidth: 0 }} activeDot={{ r: 6 }} />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Stats */}
      {hasData && (
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Avg Pain"    value={avg("pain").toFixed(1)}    sub="out of 5"  color="text-red-500" />
          <StatCard label="Avg Energy"  value={avg("energy").toFixed(1)}  sub="out of 5"  color="text-accent" />
          <StatCard label="Avg Swelling" value={avg("swelling").toFixed(1)} sub="out of 5" color="text-blue-500" />
          <StatCard label="Avg Mood"    value={avg("mood").toFixed(1)}    sub="out of 5"  color="text-[#c9a84c]" />
        </div>
      )}

      <p className="text-xs text-center text-text-secondary">
        Steps via Apple Health — coming soon
      </p>
    </div>
  );
}

function StatCard({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <div className="card">
      <p className="text-xs text-text-secondary font-medium">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
      <p className="text-xs text-text-secondary mt-0.5">{sub}</p>
    </div>
  );
}
