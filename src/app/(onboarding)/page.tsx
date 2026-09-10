import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SproutIllustration } from "@/components/icons";

export default function WelcomePage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col items-center justify-center gap-7 text-center animate-in fade-in duration-700">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent shadow-elevated">
          <BookOpen className="h-5 w-5 text-accent-foreground" strokeWidth={1.7} />
        </div>
        <div className="relative flex items-center justify-center">
          <div className="absolute h-32 w-32 rounded-full bg-accent/10 blur-2xl" />
          <SproutIllustration className="relative h-16 w-28 text-accent" />
        </div>
        <div className="space-y-2.5">
          <h1 className="text-3xl font-medium tracking-tight text-balance">
            Bem-vindo ao Raiz.
          </h1>
          <p className="mx-auto max-w-[30ch] text-sm leading-relaxed text-muted-foreground">
            Um espaço simples e acolhedor pra ler, refletir e crescer na
            Palavra, um pouco a cada dia.
          </p>
        </div>
      </div>
      <Button
        size="lg"
        className="w-full rounded-full shadow-elevated"
        nativeButton={false}
        render={<Link href="/idade" />}
      >
        Começar
      </Button>
    </div>
  );
}
