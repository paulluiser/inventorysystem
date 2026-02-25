"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { CommandDialog, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { navItems } from "@/lib/constants";
import { useInventoryStore } from "@/store/use-inventory-store";

export function GlobalSearch({ open, setOpen }: { open: boolean; setOpen: (value: boolean) => void }) {
  const router = useRouter();
  const items = useInventoryStore((s) => s.items);
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) {
      return {
        pages: navItems,
        items: items.slice(0, 5)
      };
    }

    return {
      pages: navItems.filter((x) => x.label.toLowerCase().includes(q)),
      items: items.filter((x) => `${x.code} ${x.description}`.toLowerCase().includes(q)).slice(0, 8)
    };
  }, [items, query]);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput value={query} onValueChange={setQuery} placeholder="Search pages, items, and workflows..." />
      <CommandList>
        <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Pages</p>
        {results.pages.map((page) => (
          <CommandItem
            key={page.href}
            onClick={() => {
              setOpen(false);
              router.push(page.href);
            }}
          >
            {page.label}
          </CommandItem>
        ))}
        <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Items</p>
        {results.items.map((item) => (
          <CommandItem
            key={item.id}
            onClick={() => {
              setOpen(false);
              router.push(`/items?item=${item.id}`);
            }}
          >
            {item.code} • {item.description}
          </CommandItem>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
