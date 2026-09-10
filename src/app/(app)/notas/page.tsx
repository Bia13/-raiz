import { Notebook } from "lucide-react";
import { ComingSoon } from "@/components/coming-soon";

export default function NotasPage() {
  return (
    <ComingSoon
      title="Minhas Notas"
      icon={Notebook}
      description="Seus grifos e anotações da leitura, num só lugar — em construção."
    />
  );
}
