"use client";

import { useMemo, useState } from "react";
import { PackageSearch } from "lucide-react";

import { useInventoryStore } from "@/store/use-inventory-store";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Item } from "@/types/inventory";
import { ItemViewDialog } from "@/components/items/item-view-dialog";

export default function InventoryPage() {
  const items = useInventoryStore((s) => s.items);
  const [openView, setOpenView] = useState(false);
  const [activeItem, setActiveItem] = useState<Item | undefined>();

  const rows = useMemo(
    () =>
      items.map((item) => {
        const ratio = item.reorderLevel === 0 ? 2 : item.currentBalance / item.reorderLevel;
        const status = ratio <= 0.8 ? "critical" : ratio <= 1.1 ? "warning" : "ok";
        return { item, status };
      }),
    [items]
  );

  return (
    <section className="space-y-4 pb-6">
      <div className="section-hero">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <PackageSearch className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Inventory</h2>
            <p className="text-sm text-muted-foreground">Live stock overview with reorder risk levels.</p>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-2">
        <div className="space-y-3 md:hidden">
          {rows.map(({ item, status }) => (
            <div
              key={item.id}
              className="rounded-xl border bg-background/50 p-3 cursor-pointer"
              onClick={() => {
                setActiveItem(item);
                setOpenView(true);
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{item.code}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
                <Badge variant={status === "ok" ? "success" : status === "warning" ? "warning" : "danger"}>
                  {status === "ok" ? "OK" : status === "warning" ? "Warning" : "Critical"}
                </Badge>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <p><span className="text-muted-foreground">Balance:</span> {item.currentBalance}</p>
                <p><span className="text-muted-foreground">Re-Order:</span> {item.reorderLevel}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="hidden md:block">
          <Table>
            <TableHeader className="sticky top-0 z-10">
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Current Balance</TableHead>
                <TableHead>Re-Order Level</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(({ item, status }) => (
                <TableRow
                  key={item.id}
                  className="cursor-pointer"
                  onClick={() => {
                    setActiveItem(item);
                    setOpenView(true);
                  }}
                >
                  <TableCell className="max-w-[380px]">
                    <p className="font-medium">{item.code}</p>
                    <p className="truncate text-xs text-muted-foreground" title={item.description}>
                      {item.description}
                    </p>
                  </TableCell>
                  <TableCell>{item.currentBalance}</TableCell>
                  <TableCell>{item.reorderLevel}</TableCell>
                  <TableCell>
                    <Badge variant={status === "ok" ? "success" : status === "warning" ? "warning" : "danger"}>
                      {status === "ok" ? "OK" : status === "warning" ? "Warning" : "Critical"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <ItemViewDialog open={openView} onOpenChange={setOpenView} item={activeItem} />
    </section>
  );
}
