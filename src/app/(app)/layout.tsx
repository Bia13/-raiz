import { BottomNav } from "@/components/bottom-nav";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col">
      <div className="flex-1 px-5 pt-6 pb-28">{children}</div>
      <BottomNav />
    </div>
  );
}
