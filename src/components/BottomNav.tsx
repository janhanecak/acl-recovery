"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Dumbbell, BarChart2, Target } from "lucide-react";

const tabs = [
  { href: "/today", label: "Today", icon: Calendar },
  { href: "/exercises", label: "Exercises", icon: Dumbbell },
  { href: "/progress", label: "Progress", icon: BarChart2 },
  { href: "/goals", label: "Goals", icon: Target },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-[72px] bg-white/80 backdrop-blur-xl border-t border-gray-100">
      <div className="h-full flex items-center justify-around px-2 pb-safe">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center gap-0.5 w-16 h-14 rounded-xl transition-colors ${
                active ? "text-accent" : "text-gray-400"
              }`}
            >
              <Icon
                size={22}
                strokeWidth={active ? 2.2 : 1.8}
                className="transition-transform active:scale-90"
              />
              <span
                className={`text-[10px] font-medium tracking-wide ${
                  active ? "text-accent font-semibold" : "text-gray-400"
                }`}
              >
                {label}
              </span>
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-accent rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
