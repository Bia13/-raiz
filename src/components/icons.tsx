import { cn } from "@/lib/utils";

export function SproutIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 70"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className={cn("h-16 w-28", className)}
    >
      <path d="M60 60C60 40 45 30 30 30" strokeLinecap="round" />
      <path d="M60 60C60 42 72 34 84 34" strokeLinecap="round" />
      <circle cx="30" cy="26" r="4" />
      <circle cx="84" cy="30" r="4" />
      <circle cx="60" cy="14" r="5" />
    </svg>
  );
}
