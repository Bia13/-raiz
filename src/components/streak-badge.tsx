"use client";

import { Flame } from "lucide-react";
import { useStreak } from "@/lib/streak-store";
import { cn } from "@/lib/utils";

export function StreakBadge({ className }: { className?: string }) {
  const streak = useStreak();

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 shadow-elevated",
        className
      )}
    >
      <Flame
        className="h-4 w-4 text-accent"
        strokeWidth={2}
        fill="currentColor"
        fillOpacity={0.18}
      />
      <span className="text-sm font-bold tabular-nums">{streak}</span>
    </div>
  );
}
