"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { X, ArrowRight, Check, Volume2, VolumeX } from "lucide-react";
import { completeToday } from "@/lib/streak-store";
import { createAmbientPad } from "@/lib/ambient-audio";

type Star = { top: number; left: number; size: number; delay: number; duration: number };

function makeStars(count: number): Star[] {
  return Array.from({ length: count }, () => ({
    top: Math.random() * 62,
    left: Math.random() * 100,
    size: 1 + Math.random() * 1.6,
    delay: Math.random() * 5,
    duration: 2.5 + Math.random() * 3,
  }));
}

type Stage = "reading" | "prayer" | "done";

const STEP_SECONDS = 20;

const PRAYER_STEPS = [
  {
    label: "gratidão",
    prompt: "Respire fundo. Agradeça por algo simples que aconteceu hoje.",
  },
  {
    label: "confissão",
    prompt: "Sem culpa — só honestidade. O que você quer deixar pra trás?",
  },
  {
    label: "pedidos",
    prompt: "O que está pesando em você agora? Pode falar sem pressa.",
  },
  {
    label: "intercessão",
    prompt: "Pense em alguém que precisa de oração hoje além de você.",
  },
];

export default function DevocionalPage() {
  const [stage, setStage] = useState<Stage>("reading");
  const [step, setStep] = useState(0);
  const [streak, setStreak] = useState<number | null>(null);
  const [muted, setMuted] = useState(false);
  const [breath, setBreath] = useState<"in" | "out">("in");
  const [stars] = useState(() => makeStars(24));

  const padRef = useRef<ReturnType<typeof createAmbientPad>>(null);

  // Breathing cue — toggles in sync with the circle's 8s scale cycle.
  useEffect(() => {
    if (stage !== "prayer") return;
    const interval = setInterval(() => {
      setBreath((b) => (b === "in" ? "out" : "in"));
    }, 4000);
    return () => clearInterval(interval);
  }, [stage]);

  // Auto-advance each prayer step after STEP_SECONDS, unless the user
  // moves on manually first (which resets this effect via the `step` dep).
  useEffect(() => {
    if (stage !== "prayer") return;
    const timeout = setTimeout(() => {
      finishPrayerStep();
    }, STEP_SECONDS * 1000);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, step]);

  // Ambient pad only plays during the prayer stage; always clean up on unmount.
  useEffect(() => {
    return () => {
      padRef.current?.stop();
      padRef.current = null;
    };
  }, []);

  useEffect(() => {
    padRef.current?.setMuted(muted);
  }, [muted]);

  function startPrayer() {
    padRef.current = createAmbientPad();
    padRef.current?.setMuted(muted);
    setStage("prayer");
  }

  function finishPrayerStep() {
    if (step < PRAYER_STEPS.length - 1) {
      setStep((s) => s + 1);
      return;
    }
    padRef.current?.stop();
    padRef.current = null;
    setStreak(completeToday());
    setStage("done");
  }

  function share() {
    const text =
      '"Em tudo dai graças, porque esta é a vontade de Deus em Cristo Jesus para convosco." — 1 Tessalonicenses 5:18';
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title: "Raiz", text }).catch(() => {});
    }
  }

  if (stage === "reading") {
    return (
      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between pb-4">
          <Link
            href="/home"
            aria-label="Fechar"
            className="rounded-full p-1 text-foreground/80 transition-colors hover:text-foreground"
          >
            <X className="h-5 w-5" strokeWidth={1.9} />
          </Link>
          <span className="text-xs font-bold text-muted-foreground">
            Gratidão em tempos difíceis · dia 2 de 3
          </span>
          <div className="flex gap-1">
            <span className="h-1.5 w-4 rounded-full bg-accent" />
            <span className="h-1.5 w-4 rounded-full bg-accent" />
            <span className="h-1.5 w-4 rounded-full bg-border" />
          </div>
        </div>

        <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wide text-accent">
          Devocional de hoje
        </p>
        <h1 className="mb-4 text-xl font-medium text-balance">
          O que sobra quando tudo parece faltar
        </h1>

        <div className="mb-5 rounded-xl border-l-2 border-accent bg-card p-3.5 shadow-elevated">
          <p className="mb-1.5 font-serif text-[15px] italic leading-relaxed">
            &ldquo;Em tudo dai graças, porque esta é a vontade de Deus em
            Cristo Jesus para convosco.&rdquo;
          </p>
          <span className="text-[11px] font-bold text-accent">
            1 Tessalonicenses 5:18
          </span>
        </div>

        <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            Gratidão não é fingir que está tudo bem. É escolher notar o que
            ainda está de pé, mesmo quando muita coisa caiu.
          </p>
          <p>
            Hoje, antes de pedir qualquer coisa, tente só agradecer. Sem lista
            longa — uma coisa pequena já basta.
          </p>
        </div>

        <div className="flex-1" />

        <button
          type="button"
          onClick={startPrayer}
          className="mt-6 w-full rounded-full bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-elevated transition-transform active:scale-[0.98]"
        >
          Ir para oração guiada
        </button>
      </div>
    );
  }

  if (stage === "prayer") {
    const current = PRAYER_STEPS[step];
    return (
      <div className="relative -mx-5 -mt-6 -mb-28 flex flex-1 flex-col overflow-hidden bg-gradient-to-b from-[#241c14] to-[#17120d] px-5 pt-6 pb-10 text-[#f0e6d0]">
        {/* Twinkling stars */}
        <div className="pointer-events-none absolute inset-0">
          {stars.map((s, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-[#f0e6d0]"
              style={{
                top: `${s.top}%`,
                left: `${s.left}%`,
                width: s.size,
                height: s.size,
                animation: `raiz-twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
              }}
            />
          ))}
        </div>

        <div className="relative flex items-center justify-between pb-4">
          <Link
            href="/home"
            aria-label="Fechar"
            className="rounded-full p-1 text-[#f0e6d0]/80 transition-colors hover:text-[#f0e6d0]"
          >
            <X className="h-5 w-5" strokeWidth={1.9} />
          </Link>
          <button
            type="button"
            onClick={() => setMuted((m) => !m)}
            aria-label={muted ? "Ativar música" : "Silenciar música"}
            className="rounded-full p-1 text-[#f0e6d0]/60 transition-colors hover:text-[#f0e6d0]"
          >
            {muted ? (
              <VolumeX className="h-[18px] w-[18px]" strokeWidth={1.8} />
            ) : (
              <Volume2 className="h-[18px] w-[18px]" strokeWidth={1.8} />
            )}
          </button>
        </div>

        <div className="relative flex gap-1.5">
          {PRAYER_STEPS.map((s, i) => (
            <div
              key={s.label}
              className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/15"
            >
              {i < step && <div className="h-full w-full rounded-full bg-[#d3865c]" />}
              {i === step && (
                <div
                  key={step}
                  className="h-full rounded-full bg-[#d3865c]"
                  style={{
                    animation: `raiz-fillbar ${STEP_SECONDS}s linear forwards`,
                    boxShadow: "0 0 6px rgba(211,134,92,.7)",
                  }}
                />
              )}
            </div>
          ))}
        </div>

        <div className="relative flex flex-1 flex-col items-center justify-center gap-6 py-8 text-center">
          <div className="relative flex h-[170px] w-[170px] items-center justify-center">
            <div
              className="absolute h-full w-full rounded-full blur-2xl"
              style={{ background: "radial-gradient(circle, rgba(211,134,92,.35), transparent 70%)" }}
            />
            <motion.div
              className="absolute inset-[8px] rounded-full border border-[#d3865c]/30"
              animate={{ scale: [1, 1.14, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute inset-[30px] rounded-full border border-[#d3865c]/45"
              animate={{ scale: [1, 1.14, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.15 }}
            />
            <motion.div
              className="absolute inset-[52px] rounded-full border border-[#d3865c]/70 bg-[#d3865c]/20"
              animate={{ scale: [1, 1.14, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            />
            <svg viewBox="0 0 24 24" className="relative h-7 w-7" fill="none" stroke="#f0e6d0" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 21s-6-4.5-9-8.5C1 9 2.5 5 6 5c2 0 3.5 1.3 4 2 .5-.7 2-2 4-2 3.5 0 5 4 3 7.5-3 4-9 8.5-9 8.5z" />
            </svg>
          </div>

          <AnimatePresence mode="wait">
            <motion.p
              key={breath}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-[11px] font-bold tracking-[0.22em] text-[#d3865c]/85 uppercase"
            >
              {breath === "in" ? "Inspire" : "Solte o ar"}
            </motion.p>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="space-y-2"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#d3865c]">
                Passo {step + 1} de {PRAYER_STEPS.length} · {current.label}
              </p>
              <p className="mx-auto max-w-[26ch] font-serif text-lg leading-snug text-balance">
                {current.prompt}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative flex items-center justify-between">
          <button
            type="button"
            onClick={finishPrayerStep}
            className="text-xs font-bold text-[#f0e6d0]/55"
          >
            Pular passo
          </button>
          <motion.button
            type="button"
            onClick={finishPrayerStep}
            aria-label="Próximo passo"
            whileTap={{ scale: 0.9 }}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#d3865c] text-[#241c14]"
          >
            <ArrowRight className="h-[18px] w-[18px]" strokeWidth={2.4} />
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 py-10 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-elevated">
        <Check className="h-7 w-7 text-primary-foreground" strokeWidth={2.6} />
      </div>
      <div className="space-y-1.5">
        <h1 className="font-serif text-xl font-medium">Você orou hoje 🙏</h1>
        <p className="text-sm text-muted-foreground">
          Mais um dia cuidando da sua raiz.
        </p>
      </div>
      <div className="flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 shadow-elevated">
        <span className="text-sm font-bold tabular-nums">
          {streak ?? "—"} dias seguidos
        </span>
      </div>
      <p className="mx-auto max-w-[30ch] font-serif text-sm italic leading-relaxed text-muted-foreground">
        &ldquo;Não andeis ansiosos por coisa alguma; em tudo, pela oração...
        apresentai vossas petições a Deus.&rdquo;
      </p>
      <div className="flex w-full flex-col gap-2">
        <Link
          href="/home"
          className="w-full rounded-full bg-primary py-3.5 text-center text-sm font-bold text-primary-foreground shadow-elevated"
        >
          Voltar para o início
        </Link>
        <button
          type="button"
          onClick={share}
          className="w-full rounded-full border border-border py-3.5 text-sm font-bold"
        >
          Compartilhar
        </button>
      </div>
    </div>
  );
}
