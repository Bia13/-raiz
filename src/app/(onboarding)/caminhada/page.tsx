"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OnboardingTopBar } from "@/components/onboarding-topbar";
import { cn } from "@/lib/utils";

const OPTIONS = [
  "Me sinto distante",
  "Lutando, mas seguindo firme",
  "Com sede de mais Dele",
  "Grato e em paz",
];

export default function JourneyPage() {
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(label: string) {
    setSelected((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <OnboardingTopBar backHref="/idade" skipHref="/recursos" step={2} />

      <h1 className="text-2xl font-medium text-balance">
        Como está sua caminhada com Deus?
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Pode marcar mais de uma. Isso molda seus devocionais.
      </p>

      <div className="mt-6 flex flex-1 flex-col gap-2.5">
        {OPTIONS.map((label) => {
          const isSelected = selected.includes(label);
          return (
            <button
              key={label}
              type="button"
              onClick={() => toggle(label)}
              aria-pressed={isSelected}
              className={cn(
                "flex items-center justify-between rounded-2xl border px-4 py-3.5 text-sm font-semibold transition-all",
                isSelected
                  ? "border-foreground bg-foreground text-background shadow-elevated"
                  : "border-border bg-card text-foreground hover:border-foreground/30 hover:shadow-elevated"
              )}
            >
              {label}
              <span
                className={cn(
                  "flex h-4.5 w-4.5 items-center justify-center rounded-md border transition-colors",
                  isSelected
                    ? "border-accent bg-accent"
                    : "border-muted-foreground/40"
                )}
              >
                {isSelected && (
                  <Check className="h-3 w-3 text-accent-foreground" strokeWidth={3} />
                )}
              </span>
            </button>
          );
        })}
      </div>

      <Button
        size="lg"
        className="mt-6 w-full rounded-full shadow-elevated"
        nativeButton={false}
        render={<Link href="/recursos" />}
      >
        Continuar
      </Button>
    </div>
  );
}
