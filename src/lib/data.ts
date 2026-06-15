export const POST_OP_START = new Date("2026-03-20"); // Day 0 — adjust to actual surgery date
export const GOLF_TARGET = new Date("2026-08-01");

export type DayType = "strength" | "office" | "active-rest" | "rest";

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps?: string;
  hold?: string;
  category: "stretch" | "strength";
  days: DayType[];
  instructions: string;
  imageKey?: string;
}

export const EXERCISES: Exercise[] = [
  {
    id: "hamstring-stretch",
    name: "Hamstrings stretch",
    sets: 3,
    hold: "20–30s",
    category: "stretch",
    days: ["strength", "office", "active-rest", "rest"],
    instructions:
      "Lie on your back. Loop a towel around your foot and gently straighten your knee, pulling your leg towards you until you feel a stretch behind your thigh. Hold for 20–30 seconds. Relax and repeat.",
    imageKey: "/exercises/15_seated_hamstrings_stretch_p2.jpg",
  },
  {
    id: "calf-stretch",
    name: "Calf stretch",
    sets: 3,
    hold: "20–30s",
    category: "stretch",
    days: ["strength", "office", "active-rest", "rest"],
    instructions:
      "Stand facing a wall with both hands on the wall for support. Step the operated leg back, keeping the heel flat on the floor. Lean forward until you feel a stretch in the calf. Hold 20–30 seconds.",
    imageKey: "/exercises/16_calf_stretch_p2.jpg",
  },
  {
    id: "single-leg-stand",
    name: "Single leg stand",
    sets: 3,
    hold: "30–60s",
    category: "stretch",
    days: ["strength", "office", "active-rest", "rest"],
    instructions:
      "Stand near a wall or chair for safety. Lift your non-operated foot slightly off the floor and balance on the operated leg. Keep a soft bend in the knee. Hold for 30–60 seconds.",
    imageKey: "/exercises/17_single_leg_stand.jpg",
  },
  {
    id: "knee-ext-red",
    name: "Knee ext red band",
    sets: 3,
    reps: "10",
    hold: "3–5s",
    category: "strength",
    days: ["strength"],
    instructions:
      "Sit on a chair with a red resistance band looped around your ankle and fixed behind you. Straighten your knee fully, hold for 3–5 seconds, then slowly lower. Keep the movement controlled throughout.",
    imageKey: "/exercises/18_seated_knee_ext_red_band.jpg",
  },
  {
    id: "terminal-knee-ext",
    name: "Terminal knee ext red band",
    sets: 3,
    reps: "10",
    hold: "3–5s",
    category: "strength",
    days: ["strength"],
    instructions:
      "Stand with a red band behind the operated knee, anchored in front. Start with the knee slightly bent. Drive the knee back to full extension and hold 3–5 seconds. Slowly return. Do not lock the knee hard.",
    imageKey: "/exercises/19_terminal_knee_ext_red_band.jpg",
  },
  {
    id: "single-leg-sit-stand",
    name: "Single leg sit to stand",
    sets: 3,
    reps: "10",
    category: "strength",
    days: ["strength"],
    instructions:
      "Sit on a chair. Cross your non-operated leg off the floor. Lean slightly forward and push through the operated leg to stand fully. Slowly lower back down. Use arms on the chair only if needed for safety.",
    imageKey: "/exercises/20_single_leg_sit_to_stand.jpg",
  },
  {
    id: "lateral-step-up",
    name: "Lateral step up",
    sets: 3,
    reps: "10",
    category: "strength",
    days: ["strength"],
    instructions:
      "Stand beside a step. Step the operated foot up onto the step, then drive through that foot to bring the other foot up. Step back down leading with the non-operated foot. Keep the knee aligned over the second toe throughout.",
    imageKey: "/exercises/21_lateral_step_up.jpg",
  },
  {
    id: "heel-raise",
    name: "Heel raise standing",
    sets: 3,
    reps: "10",
    category: "strength",
    days: ["strength"],
    instructions:
      "Stand with feet hip-width apart, hands lightly on a surface for balance. Rise up onto your toes as high as you can, hold briefly, then lower slowly over 3 seconds. Progress to single-leg when comfortable.",
    imageKey: "/exercises/22_heel_raise_standing.jpg",
  },
  {
    id: "glute-bridge",
    name: "Glute bridge feet offset",
    sets: 3,
    reps: "10",
    category: "strength",
    days: ["strength"],
    instructions:
      "Lie on your back, knees bent, feet flat. Place the operated foot slightly further from your body than usual (offset). Drive through both feet to lift your hips until your body forms a straight line. Hold briefly, lower slowly.",
    imageKey: "/exercises/23_glute_bridge_feet_offset.jpg",
  },
];

export function getDayType(date: Date): DayType {
  const day = date.getDay(); // 0=Sun,1=Mon,...,6=Sat
  if (day === 1 || day === 3 || day === 5) return "strength";
  if (day === 2 || day === 4) return "office";
  if (day === 6) return "active-rest";
  return "rest";
}

export function getDayTypeLabel(type: DayType): string {
  const map: Record<DayType, string> = {
    strength: "💪 Strength Day",
    office: "🏢 Office Day",
    "active-rest": "🚴 Active Rest",
    rest: "😴 Rest Day",
  };
  return map[type];
}

export function getDayTypeColors(type: DayType) {
  const map: Record<DayType, { bg: string; text: string; border: string }> = {
    strength: {
      bg: "bg-[#fef9ec]",
      text: "text-[#7a5c00]",
      border: "border-[#c9a84c]",
    },
    office: {
      bg: "bg-[#f0eeff]",
      text: "text-[#3d2e8a]",
      border: "border-[#7b68c8]",
    },
    "active-rest": {
      bg: "bg-accent-light",
      text: "text-accent",
      border: "border-accent",
    },
    rest: {
      bg: "bg-gray-50",
      text: "text-gray-600",
      border: "border-gray-300",
    },
  };
  return map[type];
}

export function getDayNumber(): number {
  const now = new Date();
  const diff = now.getTime() - POST_OP_START.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function getDaysUntilGolf(): number {
  const now = new Date();
  const diff = GOLF_TARGET.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}
