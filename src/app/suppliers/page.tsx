import { Building2 } from "lucide-react";

import { PartyModule } from "@/components/dashboard/party-module";

export default function SuppliersPage() {
  return (
    <section className="space-y-4 pb-6">
      <div className="section-hero">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Suppliers</h2>
            <p className="text-sm text-muted-foreground">Maintain supplier profiles, terms, and compliance details.</p>
          </div>
        </div>
      </div>
      <PartyModule mode="supplier" />
    </section>
  );
}
