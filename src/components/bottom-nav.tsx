"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, MessageCircle, Notebook, User } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/home", label: "Início", icon: Home },
  { href: "/biblia", label: "Bíblia", icon: BookOpen },
  { href: "/chat", label: "Chat", icon: MessageCircle },
  { href: "/notas", label: "Notas", icon: Notebook },
  { href: "/perfil", label: "Perfil", icon: User },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto flex w-full max-w-sm justify-center px-3.5 pb-[calc(0.875rem+env(safe-area-inset-bottom))]">
      <div className="flex w-full items-center justify-around rounded-[22px] border border-white/60 bg-background/70 px-2 py-2 shadow-elevated-lg backdrop-blur-xl backdrop-saturate-150 dark:border-white/10 dark:bg-background/60">
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex flex-col items-center gap-1 rounded-2xl px-3.5 py-1.5 text-[10px] font-semibold transition-colors duration-200",
                active
                  ? "text-accent"
                  : "text-muted-foreground/60 hover:text-muted-foreground"
              )}
            >
              {active && (
                <span className="absolute inset-0 rounded-2xl bg-accent/12" />
              )}
              <Icon
                className={cn(
                  "relative h-[19px] w-[19px] transition-transform duration-200",
                  active && "scale-110"
                )}
                strokeWidth={active ? 2.1 : 1.9}
              />
              <span className="relative">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
