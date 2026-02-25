"use client";

import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Item } from "@/types/inventory";
import { formatCurrency } from "@/lib/utils";

function Info({ label, value }: { label: string; value: string | number | boolean | undefined }) {
  return (
    <div className="space-y-1 rounded-md border bg-background/40 p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-sm">{String(value ?? "-")}</p>
    </div>
  );
}

export function ItemViewDialog({ open, onOpenChange, item }: { open: boolean; onOpenChange: (open: boolean) => void; item?: Item }) {
  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {item.code}
            <Badge variant="secondary">View Only</Badge>
          </DialogTitle>
          <p className="text-sm text-muted-foreground">{item.description}</p>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="flex h-auto w-full gap-1 p-1">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="pricing">Pricing & Stock</TabsTrigger>
            <TabsTrigger value="classification">Classification</TabsTrigger>
            <TabsTrigger value="supplier">Supplier Info</TabsTrigger>
            <TabsTrigger value="bom">Bill of Materials</TabsTrigger>
            <TabsTrigger value="image">Image</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="grid gap-3 md:grid-cols-2">
            <Info label="Reference ID" value={item.referenceId} />
            <Info label="Code" value={item.code} />
            <Info label="SKU" value={item.skuCode} />
            <Info label="UOM" value={item.uom} />
            <Info label="Description" value={item.description} />
            <Info label="Status" value={item.status} />
          </TabsContent>

          <TabsContent value="pricing" className="grid gap-3 md:grid-cols-3">
            <Info label="SRP" value={formatCurrency(item.srp, item.currency)} />
            <Info label="Currency" value={item.currency} />
            <Info label="Current Balance" value={item.currentBalance} />
            <Info label="Re-Order Level" value={item.reorderLevel} />
            <Info label="Standard Pack" value={item.standardPack} />
            <Info label="Warranty" value={`${item.warrantyDuration} ${item.warrantyDurationType}`} />
          </TabsContent>

          <TabsContent value="classification" className="grid gap-3 md:grid-cols-2">
            <Info label="Item Group" value={item.itemGroup} />
            <Info label="Category" value={item.category} />
            <Info label="Sub Category" value={item.subCategory} />
            <Info label="Type" value={item.type} />
            <Info label="Brand" value={item.brand} />
            <Info label="Sub Brand" value={item.subBrand} />
            <Info label="Trade" value={item.trade ? "Yes" : "No"} />
            <Info label="With Serial" value={item.withSerial ? "Yes" : "No"} />
            <Info label="Non-Trade" value={item.nonTrade ? "Yes" : "No"} />
            <Info label="Bundle" value={item.bundle ? "Yes" : "No"} />
            <Info label="Non-Inventoriable" value={item.nonInventoriable ? "Yes" : "No"} />
          </TabsContent>

          <TabsContent value="supplier" className="grid gap-3 md:grid-cols-3">
            <Info label="Supplier Model Code" value={item.supplierModelCode} />
            <Info label="ITI Model Code" value={item.itiModelCode} />
            <Info label="Model Code" value={item.modelCode} />
          </TabsContent>

          <TabsContent value="bom" className="space-y-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Component Item</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>UOM</TableHead>
                  <TableHead>Unit Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {item.bom.length ? (
                  item.bom.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.code}</TableCell>
                      <TableCell>{row.componentItem}</TableCell>
                      <TableCell>{row.quantity}</TableCell>
                      <TableCell>{row.uom}</TableCell>
                      <TableCell>{formatCurrency(row.unitCost, item.currency)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">No BOM rows</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="image">
            {item.image ? (
              <img src={item.image} alt={item.code} className="max-h-64 w-full rounded-lg border object-contain" />
            ) : (
              <p className="text-sm text-muted-foreground">No image uploaded.</p>
            )}
          </TabsContent>

          <TabsContent value="history" className="grid gap-3 md:grid-cols-2">
            <Info label="Created At" value={item.createdAt} />
            <Info label="Updated At" value={item.updatedAt} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
