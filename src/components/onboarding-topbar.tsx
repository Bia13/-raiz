import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function OnboardingTopBar({
  backHref,
  skipHref,
  step,
  totalSteps = 3,
}: {
  backHref: string;
  skipHref: string;
  step: number;
  totalSteps?: number;
}) {
  return (
    <div className="mb-7">
      <div className="mb-5 flex items-center justify-between">
        <Link
          href={backHref}
          aria-label="Voltar"
          className="-ml-1 flex h-8 w-8 items-center justify-center rounded-full text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={1.9} />
        </Link>
        <Link
          href={skipHref}
          className="text-xs font-bold text-muted-foreground transition-colors hover:text-foreground"
        >
          Pular
        </Link>
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              i < step ? "bg-accent" : "bg-muted"
            )}
          />
        ))}
      </div>
    </div>
  );
}
