"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { FlowButton } from "@/components/flow-button";
import { OnboardingTopBar } from "@/components/onboarding-topbar";
import { PageTransition } from "@/components/page-transition";
import { cn } from "@/lib/utils";

const AGE_GROUPS = [
  "13–17 anos",
  "18–24 anos",
  "25–34 anos",
  "35–44 anos",
  "45–54 anos",
  "55+ anos",
];

export default function AgePage() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <PageTransition>
    <div className="flex flex-1 flex-col">
      <OnboardingTopBar backHref="/" skipHref="/caminhada" step={1} />

      <h1 className="text-2xl font-medium text-balance">
        Qual a sua faixa etária?
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Ajuda a ajustar o tom dos conteúdos à sua fase de vida.
      </p>

      <div className="mt-6 flex flex-1 flex-col gap-2.5">
        {AGE_GROUPS.map((label) => {
          const isSelected = selected === label;
          return (
            <button
              key={label}
              type="button"
              onClick={() => setSelected(label)}
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
                  "flex h-4.5 w-4.5 items-center justify-center rounded-full border transition-colors",
                  isSelected
                    ? "border-accent bg-accent"
                    : "border-muted-foreground/40"
                )}
              >
                <svg viewBox="0 0 20 20" className="h-3 w-3 text-accent-foreground">
                  <motion.path
                    d="M 0 4.5 L 3.182 8 L 10 0"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    transform="translate(5 6)"
                    initial={false}
                    animate={{
                      pathLength: isSelected ? 1 : 0,
                      opacity: isSelected ? 1 : 0,
                    }}
                    transition={{
                      pathLength: { ease: "easeOut", duration: 0.3 },
                      opacity: { duration: 0 },
                    }}
                  />
                </svg>
              </span>
            </button>
          );
        })}
      </div>

      {selected ? (
        <FlowButton
          asChild
          fullWidth
          borderColor="var(--accent)"
          className="mt-6 h-auto w-full rounded-full bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-elevated"
        >
          <Link href="/caminhada" transitionTypes={["nav-forward"]}>
            Continuar
          </Link>
        </FlowButton>
      ) : (
        <FlowButton
          fullWidth
          disabled
          className="mt-6 h-auto w-full rounded-full bg-primary py-3.5 text-sm font-bold text-primary-foreground opacity-40"
        >
          Continuar
        </FlowButton>
      )}
    </div>
    </PageTransition>
  );
}
