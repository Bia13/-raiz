import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageTransition } from "@/components/page-transition";
import Rays from "@/components/light-rays";
import { BlurReveal } from "@/components/blur-reveal";
import { WordsStagger } from "@/components/words-stagger";

export default function WelcomePage() {
  return (
    <PageTransition>
    <div className="relative -mx-6 -my-8 flex flex-1 flex-col overflow-hidden">
      {/* Atmospheric background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 60% at 50% 0%, #f6ead0 0%, #e8cf9e 28%, #b88a55 58%, #6b4a2e 82%, #241a10 100%)",
        }}
      />
      <Rays
        backgroundColor="transparent"
        raysColor={{ mode: "single", color: "#fff3d6" }}
        intensity={32}
        rays={30}
        reach={40}
        position={50}
        animation={{ animate: true, speed: 5 }}
        style={{ zIndex: 0 }}
      />
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative z-10 flex flex-1 flex-col px-6">
        {/* Floating emblem */}
        <div className="flex flex-col items-center pt-16 animate-in fade-in slide-in-from-top-3 duration-700">
          <div className="relative flex h-20 w-20 items-center justify-center rounded-[26px] bg-gradient-to-br from-[#fbf3e0] to-[#dfc696] shadow-[0_20px_36px_-14px_rgba(24,14,4,0.6)]">
            <svg
              viewBox="0 0 40 40"
              className="h-9 w-9"
              fill="none"
              stroke="#8a5a2b"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 32V19" />
              <path d="M20 22c0-6-6-7-11-6 1 7 5 10 11 8" />
              <path d="M20 19c0-7 6-9 12-8-1 8-6 11-12 9" />
            </svg>
          </div>
          <div className="mt-3 h-2 w-12 rounded-full bg-black/35 blur-[6px]" />
        </div>

        <div className="flex-1" />

        {/* Bottom scrim + copy */}
        <div className="relative -mx-6 px-6 pt-28 pb-10">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#140d06] via-[#140d06]/85 to-transparent" />
          <div className="relative space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-700">
            <div className="space-y-2">
              <BlurReveal
                as="h1"
                speedReveal={2}
                className="text-[28px] leading-[1.15] font-medium text-balance text-[#faf3e2]"
              >
                Bem-vindo ao Raiz.
              </BlurReveal>
              <WordsStagger
                delay={0.35}
                stagger={0.05}
                className="max-w-[32ch] text-[13.5px] leading-relaxed text-[#faf3e2]/70"
              >
                Um espaço simples e acolhedor pra ler, refletir e crescer na
                Palavra, um pouco a cada dia.
              </WordsStagger>
            </div>

            <Link
              href="/idade"
              transitionTypes={["nav-forward"]}
              className="group flex items-center justify-between rounded-full bg-[#faf6ec] py-2 pl-6 pr-2 shadow-elevated-lg transition-transform active:scale-[0.98]"
            >
              <span className="text-sm font-bold text-[#241c14]">
                Começar
              </span>
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-accent-foreground transition-transform group-active:scale-90">
                <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
    </PageTransition>
  );
}
