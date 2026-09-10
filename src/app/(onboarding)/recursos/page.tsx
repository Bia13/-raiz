import Link from "next/link";
import { BookOpen, MessageCircle, Sprout, HandHeart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OnboardingTopBar } from "@/components/onboarding-topbar";

const FEATURES = [
  {
    icon: BookOpen,
    iconClass: "bg-[#e7dcc2] text-accent",
    title: "Leitura em scroll",
    desc: "A Bíblia num formato contínuo e fácil de seguir, com grifos e notas.",
  },
  {
    icon: MessageCircle,
    iconClass: "bg-[#dde3d3] text-primary",
    title: "Chat bíblico com IA",
    desc: "Pergunte sobre qualquer passagem, contexto histórico ou tema de fé.",
  },
  {
    icon: Sprout,
    iconClass: "bg-[#f0d9c5] text-accent",
    title: "Jornada diária",
    desc: "Progresso visual, sequências e pequenas conquistas pra manter o ritmo.",
  },
  {
    icon: HandHeart,
    iconClass: "bg-[#e7dcc2] text-accent",
    title: "Devocionais e orações guiadas",
    desc: "Pra dias em que você não sabe nem por onde começar.",
  },
];

export default function FeaturesPage() {
  return (
    <div className="flex flex-1 flex-col">
      <OnboardingTopBar backHref="/caminhada" skipHref="/home" step={3} />

      <h1 className="text-2xl font-medium text-balance">
        O Raiz caminha com você assim
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Quatro formas de manter o hábito vivo.
      </p>

      <div className="mt-7 flex flex-1 flex-col gap-3">
        {FEATURES.map(({ icon: Icon, iconClass, title, desc }, i) => (
          <div
            key={title}
            style={{ animationDelay: `${i * 80}ms`, animationFillMode: "backwards" }}
            className="flex animate-in fade-in slide-in-from-bottom-2 gap-3.5 rounded-2xl border border-border bg-card p-3.5 shadow-elevated duration-500"
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
            >
              <Icon className="h-5 w-5" strokeWidth={1.8} />
            </div>
            <div>
              <h3 className="text-sm font-bold">{title}</h3>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                {desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Button
        size="lg"
        className="mt-6 w-full rounded-full shadow-elevated"
        nativeButton={false}
        render={<Link href="/home" />}
      >
        Continuar
      </Button>
    </div>
  );
}
