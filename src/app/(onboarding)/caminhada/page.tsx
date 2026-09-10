"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OnboardingTopBar } from "@/components/onboarding-topbar";
import { PageTransition } from "@/components/page-transition";
import { cn } from "@/lib/utils";

const OPTIONS = [
  "Me sinto distante",
  "Lutando, mas seguindo firme",
  "Com sede de mais Dele",
  "Grato e em paz",
];

const RAYS = [-26, -13, 0, 13, 26];

export default function JourneyPage() {
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(label: string) {
    setSelected((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  }

  return (
    <PageTransition>
    <div className="flex flex-1 flex-col">
      {/* Atmospheric hero — light breaking through, echoing a moment of prayer */}
      <div className="relative -mx-6 -mt-8 mb-6 h-52 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #43301d 0%, #b8834a 42%, #f3cf9a 72%, #faf6ec 100%)",
          }}
        />
        <div className="absolute inset-0 flex items-end justify-center overflow-hidden">
          {RAYS.map((deg, i) => (
            <span
              key={deg}
              className="absolute bottom-0 h-[180%] w-3 origin-bottom blur-md"
              style={{
                background:
                  "linear-gradient(to top, rgba(255,244,214,0.65), transparent)",
                transform: `rotate(${deg}deg)`,
                opacity: i === 2 ? 0.9 : 0.45,
              }}
            />
          ))}
        </div>
        <div className="absolute inset-x-0 bottom-9 flex justify-center">
          <svg
            viewBox="0 0 24 24"
            className="h-7 w-7 text-[#fff7e6]"
            style={{ filter: "drop-shadow(0 0 10px rgba(255,235,180,0.85))" }}
            fill="currentColor"
          >
            <path d="M12 2l1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7L12 2z" />
          </svg>
        </div>
      </div>

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

      {selected.length > 0 ? (
        <Button
          size="lg"
          className="mt-6 w-full rounded-full shadow-elevated"
          nativeButton={false}
          render={<Link href="/recursos" transitionTypes={["nav-forward"]} />}
        >
          Continuar
        </Button>
      ) : (
        <Button size="lg" disabled className="mt-6 w-full rounded-full opacity-40">
          Continuar
        </Button>
      )}
    </div>
    </PageTransition>
  );
}
