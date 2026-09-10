import type { Metadata } from "next";
import { Fraunces, Karla } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Raiz",
  description: "Bíblia, devocionais e oração guiada, um pouco a cada dia.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${fraunces.variable} ${karla.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-[-12%] h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-accent/15 blur-[120px] dark:bg-accent/10" />
          <div className="absolute bottom-[-15%] left-[-12%] h-[24rem] w-[24rem] rounded-full bg-primary/15 blur-[120px] dark:bg-primary/10" />
          <div className="absolute -right-16 bottom-1/3 h-64 w-64 rounded-full bg-[#c9a86a]/15 blur-[100px] dark:bg-[#c9a86a]/10" />
        </div>
        {children}
      </body>
    </html>
  );
}
