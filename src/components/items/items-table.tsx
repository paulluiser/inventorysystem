"use client";

import { useMemo, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable
} from "@tanstack/react-table";
import { ArrowUpDown, Download, FileUp, Filter, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Item } from "@/types/inventory";
import { useInventoryStore } from "@/store/use-inventory-store";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ItemFormDialog } from "@/components/items/item-form-dialog";
import { ItemViewDialog } from "@/components/items/item-view-dialog";

const boolOptions = ["all", "yes", "no"];

export function ItemsTable() {
  const items = useInventoryStore((s) => s.items);
  const upsertItem = useInventoryStore((s) => s.upsertItem);
  const deleteItems = useInventoryStore((s) => s.deleteItems);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [activeItem, setActiveItem] = useState<Item | undefined>();

  const [filters, setFilters] = useState({
    itemGroup: "all",
    category: "all",
    brand: "all",
    type: "all",
    trade: "all",
    nonTrade: "all",
    withSerial: "all",
    bundle: "all"
  });

  const filtered = useMemo(
    () =>
      items.filter((item) => {
        const text = `${item.code} ${item.description}`.toLowerCase();
        const q = globalFilter.toLowerCase().trim();
        if (q && !text.includes(q)) return false;

        if (filters.itemGroup !== "all" && item.itemGroup !== filters.itemGroup) return false;
        if (filters.category !== "all" && item.category !== filters.category) return false;
        if (filters.brand !== "all" && item.brand !== filters.brand) return false;
        if (filters.type !== "all" && item.type !== filters.type) return false;

        for (const [key, val] of [
          ["trade", filters.trade],
          ["nonTrade", filters.nonTrade],
          ["withSerial", filters.withSerial],
          ["bundle", filters.bundle]
        ] as const) {
          if (val === "all") continue;
          const boolValue = item[key];
          if (val === "yes" && !boolValue) return false;
          if (val === "no" && boolValue) return false;
        }

        return true;
      }),
    [items, filters, globalFilter]
  );

  const columns = useMemo<ColumnDef<Item>[]>(
    () => [
      {
        id: "select",
        header: () => (
          <input
            type="checkbox"
            checked={selectedIds.length > 0 && selectedIds.length === filtered.length}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => setSelectedIds(e.target.checked ? filtered.map((item) => item.id) : [])}
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={selectedIds.includes(row.original.id)}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
              if (e.target.checked) setSelectedIds((prev) => [...prev, row.original.id]);
              else setSelectedIds((prev) => prev.filter((id) => id !== row.original.id));
            }}
          />
        )
      },
      {
        accessorKey: "code",
        header: ({ column }) => (
          <Button variant="ghost" className="px-0 font-semibold" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Code <ArrowUpDown className="ml-2 h-3 w-3" />
          </Button>
        )
      },
      { accessorKey: "description", header: "Description" },
      {
        accessorKey: "currentBalance",
        header: "Balance"
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <Badge variant={row.original.status === "Active" ? "success" : "secondary"}>{row.original.status}</Badge>
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setActiveItem(row.original);
              setOpenForm(true);
            }}
          >
            Edit
          </Button>
        )
      }
    ],
    [filtered, selectedIds]
  );

  const table = useReactTable({
    data: filtered,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting }
  });

  const unique = (key: keyof Item) => ["all", ...new Set(items.map((x) => x[key] as string))];

  const exportCsv = () => {
    const rows = filtered.map((item) => [item.code, item.skuCode, item.description, item.brand, item.category, item.currentBalance, item.reorderLevel, item.status].join(","));
    const csv = `Code,SKU,Description,Brand,Category,Balance,ReOrderLevel,Status\n${rows.join("\n")}`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "items-export.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    toast.success("CSV exported");
  };

  const importCsv = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result?.toString() ?? "";
      const [, ...lines] = text.split("\n");
      lines.forEach((line) => {
        const [code, skuCode, description, brand, category] = line.split(",");
        if (!code || !description) return;
        upsertItem({
          id: crypto.randomUUID(),
          referenceId: `ITM-${Date.now().toString().slice(-6)}`,
          code,
          skuCode,
          description,
          itemGroup: "CONSUMABLE",
          category: category ?? "General",
          subCategory: "General",
          type: "General",
          brand: brand ?? "Unknown",
          subBrand: "",
          supplierModelCode: "N/A",
          itiModelCode: "N/A",
          modelCode: "N/A",
          uom: "PCS",
          color: "",
          warrantyDuration: 0,
          warrantyDurationType: "Months",
          trade: false,
          withSerial: false,
          nonTrade: false,
          bundle: false,
          nonInventoriable: false,
          srp: 0,
          currency: "PHP",
          currentBalance: 0,
          reorderLevel: 0,
          standardPack: 0,
          status: "Active",
          bom: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      });
      toast.success("CSV imported");
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4">
      <div className="glass soft-grid rounded-2xl p-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-0 w-full flex-1 sm:min-w-[260px]">
            <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search by code or description" value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} />
          </div>

          <Button className="w-full sm:w-auto" onClick={() => { setActiveItem(undefined); setOpenForm(true); }}>
            <Plus className="mr-2 h-4 w-4" />
            New Item
          </Button>

          <Button
            className="w-full sm:w-auto"
            variant={showFilters ? "secondary" : "outline"}
            onClick={() => setShowFilters((prev) => !prev)}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>

          <label className="w-full sm:w-auto">
            <input type="file" accept=".csv" className="hidden" onChange={(e) => importCsv(e.target.files?.[0])} />
            <Button className="w-full sm:w-auto" type="button" variant="outline" asChild>
              <span><FileUp className="mr-2 h-4 w-4" />Import CSV</span>
            </Button>
          </label>

          <Button className="w-full sm:w-auto" variant="outline" onClick={exportCsv}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>

          <Button
            className="w-full sm:w-auto"
            variant="destructive"
            onClick={() => {
              deleteItems(selectedIds);
              setSelectedIds([]);
              toast.success("Selected items deleted");
            }}
            disabled={selectedIds.length === 0}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Bulk Delete
          </Button>
        </div>

        {showFilters ? (
          <div className="mt-4 space-y-4 rounded-xl border bg-background/50 p-3">
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["itemGroup", "Item Group", unique("itemGroup")],
                ["category", "Category", unique("category")],
                ["brand", "Brand", unique("brand")],
                ["type", "Type", unique("type")]
              ].map(([key, label, options]) => (
                <div key={key} className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">{label}</p>
                  <Select
                    value={filters[key as keyof typeof filters]}
                    onValueChange={(value) => setFilters((prev) => ({ ...prev, [key]: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={String(label)} />
                    </SelectTrigger>
                    <SelectContent>
                      {(options as string[]).map((option) => (
                        <SelectItem key={option} value={option}>
                          {option === "all" ? "All" : option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>

            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["trade", "Trade"],
                ["nonTrade", "Non-Trade"],
                ["withSerial", "With Serial"],
                ["bundle", "Bundle"]
              ].map(([key, label]) => (
                <div key={key} className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">{label}</p>
                  <div className="grid grid-cols-3 gap-1 rounded-md border p-1">
                    {boolOptions.map((option) => {
                      const isActive = filters[key as keyof typeof filters] === option;
                      return (
                        <Button
                          key={`${key}-${option}`}
                          type="button"
                          size="sm"
                          variant={isActive ? "secondary" : "ghost"}
                          className="h-8 px-2 text-xs"
                          onClick={() => setFilters((prev) => ({ ...prev, [key]: option }))}
                        >
                          {option === "all" ? "All" : option === "yes" ? "Yes" : "No"}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="glass rounded-2xl p-2">
        <div className="space-y-3 md:hidden">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <div
                key={row.id}
                className="rounded-xl border bg-background/50 p-3 cursor-pointer"
                onClick={() => {
                  setActiveItem(row.original);
                  setOpenView(true);
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{row.original.code}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{row.original.description}</p>
                  </div>
                  <Badge variant={row.original.status === "Active" ? "success" : "secondary"}>{row.original.status}</Badge>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div><span className="text-muted-foreground">Brand:</span> {row.original.brand}</div>
                  <div><span className="text-muted-foreground">Category:</span> {row.original.category}</div>
                  <div><span className="text-muted-foreground">Balance:</span> {row.original.currentBalance}</div>
                  <div><span className="text-muted-foreground">Reorder:</span> {row.original.reorderLevel}</div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">{formatCurrency(row.original.srp * row.original.currentBalance)}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveItem(row.original);
                      setOpenForm(true);
                    }}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="p-3 text-center text-sm text-muted-foreground">No items found.</p>
          )}
        </div>

        <div className="hidden md:block max-h-[62vh] overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={
                        header.id === "description"
                          ? "w-[50%]"
                          : header.id === "select"
                            ? "w-[6%]"
                            : header.id === "actions"
                              ? "w-[14%]"
                              : header.id === "currentBalance"
                                ? "w-[16%]"
                                : "w-[14%]"
                      }
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="cursor-pointer"
                    onClick={() => {
                      setActiveItem(row.original);
                      setOpenView(true);
                    }}
                  >
                  {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={cell.column.id === "description" ? "max-w-[420px]" : undefined}
                      >
                        {cell.column.id === "currentBalance" ? (
                          <div>
                            <p className="font-medium">{cell.getValue<number>()}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatCurrency(row.original.srp * row.original.currentBalance)}
                            </p>
                          </div>
                        ) : cell.column.id === "description" ? (
                          <p className="truncate" title={String(cell.getValue())}>
                            {String(cell.getValue())}
                          </p>
                        ) : (
                          cell.column.id === "actions" ? (
                            <div onClick={(e) => e.stopPropagation()}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </div>
                          ) : (
                            flexRender(cell.column.columnDef.cell, cell.getContext())
                          )
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No items found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex flex-col gap-2 p-2 text-sm lg:flex-row lg:items-center lg:justify-between">
          <p className="text-muted-foreground">
            Showing {table.getRowModel().rows.length} of {filtered.length} items
          </p>
          <div className="flex flex-wrap items-center gap-2 self-end lg:self-auto">
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => table.setPageSize(Number(value))}
            >
              <SelectTrigger className="h-8 w-[130px]">
                <SelectValue placeholder="Rows" />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 50].map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size} rows
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Page {table.getState().pagination.pageIndex + 1} of {Math.max(table.getPageCount(), 1)}
            </p>
            <Button className="w-full sm:w-auto" variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              Previous
            </Button>
            <Button className="w-full sm:w-auto" variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              Next
            </Button>
          </div>
        </div>
      </div>

      <ItemFormDialog
        open={openForm}
        onOpenChange={setOpenForm}
        item={activeItem}
        onSubmit={(values) => {
          upsertItem(values);
          setActiveItem(undefined);
        }}
      />
      <ItemViewDialog open={openView} onOpenChange={setOpenView} item={activeItem} />
    </div>
  );
}
