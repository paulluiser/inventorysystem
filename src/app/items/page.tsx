import { Boxes } from "lucide-react";

import { ItemsTable } from "@/components/items/items-table";

export default function ItemsPage() {
  return (
    <section className="space-y-4 pb-6">
      <div className="section-hero">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <Boxes className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Items</h2>
            <p className="text-sm text-muted-foreground">Manage products, kits, and stock attributes with complete classification and supplier metadata.</p>
          </div>
        </div>
      </div>
      <ItemsTable />
    </section>
  );
}
