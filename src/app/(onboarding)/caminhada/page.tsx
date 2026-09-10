"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import Rays from "@/components/light-rays";
import { FlowButton } from "@/components/flow-button";
import { OnboardingTopBar } from "@/components/onboarding-topbar";
import { PageTransition } from "@/components/page-transition";
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
        <Rays
          backgroundColor="transparent"
          raysColor={{ mode: "single", color: "#ffe9c4" }}
          intensity={45}
          rays={28}
          reach={35}
          position={50}
          animation={{ animate: true, speed: 6 }}
          style={{ zIndex: 0 }}
        />
        <div className="absolute inset-x-0 bottom-9 z-10 flex justify-center">
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

      {selected.length > 0 ? (
        <FlowButton
          asChild
          fullWidth
          borderColor="var(--accent)"
          className="mt-6 h-auto w-full rounded-full bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-elevated"
        >
          <Link href="/recursos" transitionTypes={["nav-forward"]}>
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
