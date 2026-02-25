"use client";

import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Customer, Supplier } from "@/types/inventory";

type Party = Supplier | Customer;

function Info({ label, value }: { label: string; value: string | number | boolean | undefined }) {
  return (
    <div className="space-y-1 rounded-md border bg-background/40 p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-sm">{String(value ?? "-")}</p>
    </div>
  );
}

export function PartyViewDialog({
  open,
  onOpenChange,
  party,
  mode
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  party?: Party;
  mode: "supplier" | "customer";
}) {
  if (!party) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === "supplier" ? "Supplier" : "Customer"} {party.code}
            <Badge variant="secondary">View Only</Badge>
          </DialogTitle>
          <p className="text-sm text-muted-foreground">{party.registeredName}</p>
        </DialogHeader>

        <div className="grid gap-3 md:grid-cols-2">
          <Info label="Reference ID" value={party.referenceId} />
          <Info label="Code" value={party.code} />
          <Info label="Registered Name" value={party.registeredName} />
          <Info label="Trade Name" value={party.tradeName} />
          <Info label="Parent Company" value={party.parentCompany} />
          <Info label="Payment Term" value={party.paymentTerm} />
          <Info label="TIN" value={party.tin} />
          <Info label="Currency" value={party.currency} />
          <Info label="Credit Limit" value={party.creditLimit} />
          <Info label="Tax Scheme" value={party.taxScheme} />
          <Info label="Business Style" value={party.businessStyle} />
          <Info label="BDM" value={party.bdm} />
          <Info label="Active" value={party.active ? "Yes" : "No"} />
          <Info label="Walk In" value={party.walkIn ? "Yes" : "No"} />
          <Info label="Imported" value={party.imported ? "Yes" : "No"} />
          <div className="md:col-span-2">
            <Info label="Full Address" value={party.fullAddress} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
