import { Users } from "lucide-react";

import { PartyModule } from "@/components/dashboard/party-module";

export default function CustomersPage() {
  return (
    <section className="space-y-4 pb-6">
      <div className="section-hero">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Customers</h2>
            <p className="text-sm text-muted-foreground">Manage customer accounts, payment terms, and tax identifiers.</p>
          </div>
        </div>
      </div>
      <PartyModule mode="customer" />
    </section>
  );
}
