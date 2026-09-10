"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, BookOpen, MoreHorizontal } from "lucide-react";
import { Mascot } from "@/components/mascot";
import { verseRef } from "@/lib/reading-data";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  role: "user" | "bot";
  text: string;
  verseCard?: { ref: string; quote: string };
};

const SUGGESTIONS = [
  "Explique o que acabei de ler",
  "Ore por mim agora",
  "Qual o contexto histórico?",
];

function getBotReply(input: string): Omit<Message, "id" | "role"> {
  const q = input.toLowerCase();

  if (q.includes("context") || q.includes("histór")) {
    return {
      text: "Davi era pastor antes de ser rei — por isso ele compara Deus a alguém que cuida das ovelhas todos os dias, não só de vez em quando.",
    };
  }

  if (q.includes("ora") || q.includes("pray") || q.includes("preocup") || q.includes("ansi")) {
    return {
      text: "Vamos com calma: respire fundo. Deus já sabe o que está pesando em você antes mesmo de você contar. Quer começar agradecendo por algo pequeno de hoje?",
    };
  }

  if (
    q.includes("expli") ||
    q.includes("salmo") ||
    q.includes("pastor") ||
    q.includes("alma") ||
    q.includes("23")
  ) {
    return {
      text: "É a ideia de trazer de volta o fôlego — como uma ovelha cansada que o pastor deita pra descansar antes de seguir viagem.",
      verseCard: {
        ref: verseRef(3),
        quote:
          "Restaura a minha alma e me guia pelas veredas da justiça, por amor do seu nome.",
      },
    };
  }

  return {
    text: "Boa pergunta. Pode me contar um pouco mais sobre o que você está buscando entender? Posso explicar uma passagem, o contexto histórico, ou só te acompanhar num momento de oração.",
  };
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isTyping]);

  function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    const reply = getBotReply(trimmed);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "bot", ...reply }]);
    }, 900);
  }

  const started = messages.length > 0;

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center gap-2.5 pb-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f0e6d0]">
          <Mascot className="h-7 w-7" />
        </div>
        <div>
          <p className="text-sm font-bold">Cordeirinho</p>
          <p className="flex items-center gap-1 text-[10px] font-bold text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            por perto
          </p>
        </div>
        <MoreHorizontal className="ml-auto h-[18px] w-[18px] text-foreground/60" strokeWidth={1.8} />
      </div>

      {!started ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-5 pb-6 text-center">
          <Mascot expression="greet" className="h-24 w-24" />
          <div className="space-y-1.5">
            <h1 className="font-serif text-lg font-medium">
              Oi, eu sou o Cordeirinho 🌾
            </h1>
            <p className="mx-auto max-w-[28ch] text-sm leading-relaxed text-muted-foreground">
              Pode me perguntar sobre qualquer passagem, contexto histórico ou o
              que estiver pesando no coração.
            </p>
          </div>
          <div className="flex w-full flex-col gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => sendMessage(s)}
                className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-left text-sm font-semibold shadow-elevated transition-colors hover:border-accent/40"
              >
                {s}
                <ArrowRight className="h-3.5 w-3.5 shrink-0 text-accent" strokeWidth={2.2} />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-3 overflow-y-auto pb-3">
          {messages.map((m) => (
            <div key={m.id}>
              {m.role === "bot" ? (
                <div className="flex items-end gap-1.5">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#f0e6d0]">
                    <Mascot className="h-4 w-4" />
                  </div>
                  <div className="max-w-[78%] rounded-2xl rounded-bl-sm bg-muted px-3.5 py-2.5 text-sm leading-relaxed">
                    {m.text}
                  </div>
                </div>
              ) : (
                <div className="flex justify-end">
                  <div className="max-w-[78%] rounded-2xl rounded-br-sm bg-[#3b2f22] px-3.5 py-2.5 text-sm leading-relaxed text-[#f6f0e2]">
                    {m.text}
                  </div>
                </div>
              )}
              {m.verseCard && (
                <div className="ml-6 mt-2 max-w-[82%] rounded-2xl rounded-bl-sm border border-border bg-card p-3 shadow-elevated">
                  <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-accent">
                    <BookOpen className="h-3 w-3" strokeWidth={2} />
                    {m.verseCard.ref}
                  </p>
                  <p className="mb-1.5 font-serif text-[13px] italic leading-relaxed">
                    &ldquo;{m.verseCard.quote}&rdquo;
                  </p>
                  <span className="text-[11px] font-bold text-primary">
                    Abrir capítulo →
                  </span>
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex items-end gap-1.5">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#f0e6d0]">
                <Mascot expression="thinking" className="h-4 w-4" />
              </div>
              <div className="flex gap-1 rounded-2xl rounded-bl-sm bg-muted px-3.5 py-3">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent"
                    style={{ animationDelay: `${i * 120}ms` }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(input);
        }}
        className="flex items-center gap-2 pt-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escreva sua pergunta…"
          className="flex-1 rounded-full border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-accent"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          aria-label="Enviar"
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground transition-transform active:scale-90",
            !input.trim() && "opacity-40"
          )}
        >
          <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
        </button>
      </form>
    </div>
  );
}
