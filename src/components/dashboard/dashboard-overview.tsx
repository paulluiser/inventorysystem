"use client";

import Link from "next/link";
import { AlertTriangle, Boxes, Building2, PackageCheck, Plus, Users } from "lucide-react";
import { useState } from "react";

import { useInventoryStore } from "@/store/use-inventory-store";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Item } from "@/types/inventory";
import { ItemViewDialog } from "@/components/items/item-view-dialog";

export function DashboardOverview() {
  const items = useInventoryStore((s) => s.items);
  const suppliers = useInventoryStore((s) => s.suppliers);
  const customers = useInventoryStore((s) => s.customers);
  const [openView, setOpenView] = useState(false);
  const [activeItem, setActiveItem] = useState<Item | undefined>();

  const lowStock = items.filter((x) => x.currentBalance <= x.reorderLevel);
  const stockValue = items.reduce((sum, item) => sum + item.srp * item.currentBalance, 0);

  const kpis = [
    { label: "Total Items", value: items.length, icon: Boxes },
    { label: "Low Stock Items", value: lowStock.length, icon: AlertTriangle },
    { label: "Total Suppliers", value: suppliers.length, icon: Building2 },
    { label: "Total Customers", value: customers.length, icon: Users },
    { label: "Stock Value", value: formatCurrency(stockValue), icon: PackageCheck }
  ];

  return (
    <div className="space-y-4 pb-6">
      <div className="section-hero">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Overview</p>
        <h2 className="mt-1 font-[var(--font-heading)] text-2xl font-semibold">Operations Snapshot</h2>
        <p className="mt-1 text-sm text-muted-foreground">Track inventory health, partner activity, and stock valuation in one place.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="glass border-0">
            <CardHeader className="pb-2">
              <CardDescription>{kpi.label}</CardDescription>
              <CardTitle className="text-2xl">{kpi.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <kpi.icon className="h-4 w-4 text-primary" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="glass border-0 xl:col-span-2">
          <CardHeader>
            <CardTitle>Recent Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:hidden">
              {items.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border bg-background/50 p-3 cursor-pointer"
                  onClick={() => {
                    setActiveItem(item);
                    setOpenView(true);
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">{item.code}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                    <Badge variant={item.currentBalance <= item.reorderLevel ? "warning" : "success"}>
                      {item.currentBalance <= item.reorderLevel ? "Low" : "Healthy"}
                    </Badge>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">Balance: {item.currentBalance}</p>
                </div>
              ))}
            </div>
            <div className="hidden md:block">
              <Table>
                <TableHeader className="sticky top-0 z-10">
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.slice(0, 5).map((item) => (
                    <TableRow
                      key={item.id}
                      className="cursor-pointer"
                      onClick={() => {
                        setActiveItem(item);
                        setOpenView(true);
                      }}
                    >
                      <TableCell>{item.code}</TableCell>
                      <TableCell className="max-w-[320px] truncate" title={item.description}>
                        {item.description}
                      </TableCell>
                      <TableCell>{item.currentBalance}</TableCell>
                      <TableCell>
                        <Badge variant={item.currentBalance <= item.reorderLevel ? "warning" : "success"}>
                          {item.currentBalance <= item.reorderLevel ? "Low" : "Healthy"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-0">
          <CardHeader>
            <CardTitle>Low Stock Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {lowStock.length === 0 ? <p className="text-sm text-muted-foreground">No critical stock alerts right now.</p> : null}
            {lowStock.slice(0, 6).map((item) => (
              <div key={item.id} className="rounded-lg border bg-background/40 p-3 text-sm">
                <p className="font-medium">{item.code}</p>
                <p className="text-muted-foreground">{item.description}</p>
                <p className="text-xs text-amber-600">Balance {item.currentBalance} / Reorder {item.reorderLevel}</p>
              </div>
            ))}
            <div className="grid gap-2 pt-2">
              <Button asChild>
                <Link href="/items"><Plus className="mr-2 h-4 w-4" />New Item</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/suppliers"><Plus className="mr-2 h-4 w-4" />New Supplier</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/customers"><Plus className="mr-2 h-4 w-4" />New Customer</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <ItemViewDialog open={openView} onOpenChange={setOpenView} item={activeItem} />
    </div>
  );
}
