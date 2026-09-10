import type { LucideIcon } from "lucide-react";
import { Sparkles } from "lucide-react";

export function ComingSoon({
  title,
  description = "Essa tela ainda não foi implementada em código — por enquanto existe só como protótipo visual.",
  icon: Icon = Sparkles,
}: {
  title: string;
  description?: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 py-20 text-center animate-in fade-in duration-500">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/15 to-primary/10 text-accent shadow-elevated">
        <Icon className="h-7 w-7" strokeWidth={1.6} />
      </div>
      <div className="space-y-1.5">
        <p className="font-serif text-xl font-medium">{title}</p>
        <p className="mx-auto max-w-[26ch] text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
      <span className="rounded-full border border-border bg-card px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-muted-foreground shadow-elevated">
        Em breve
      </span>
    </div>
  );
}
