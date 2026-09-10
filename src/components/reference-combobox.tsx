"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { VERSES, verseRef } from "@/lib/reading-data";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  ...VERSES.map((v) => verseRef(v.number)),
  "João 3:16",
  "Provérbios 3:5-6",
  "Filipenses 4:6-7",
  "Isaías 41:10",
  "Romanos 8:28",
  "Salmos 46:1",
];

/**
 * A searchable dropdown for the free-form "reference" field — it suggests
 * known verses, but anything typed is accepted as-is (this isn't a strict
 * picker, the field stays free text).
 */
export function ReferenceCombobox({
  value,
  onChange,
  placeholder = "Ex: Salmos 23:3, ou deixe em branco",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          "flex w-full items-center justify-between rounded-xl border border-border bg-background px-3 py-2.5 text-left text-sm outline-none transition-colors focus:border-accent",
          !value && "text-muted-foreground"
        )}
      >
        <span className="truncate">{value || placeholder}</span>
        <ChevronsUpDown
          className="ml-2 h-3.5 w-3.5 shrink-0 text-muted-foreground"
          strokeWidth={2}
        />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 p-0">
        <Command>
          <CommandInput
            value={value}
            onValueChange={onChange}
            placeholder="Buscar ou escrever uma referência…"
          />
          <CommandList>
            <CommandEmpty className="px-3 py-3 text-xs text-muted-foreground">
              Sem sugestão — sua referência será salva como digitada.
            </CommandEmpty>
            <CommandGroup heading="Sugestões">
              {SUGGESTIONS.map((ref) => (
                <CommandItem
                  key={ref}
                  value={ref}
                  onSelect={(v) => {
                    onChange(v);
                    setOpen(false);
                  }}
                >
                  {ref}
                  {value === ref && (
                    <Check className="ml-auto h-3.5 w-3.5 text-accent" strokeWidth={2.4} />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
