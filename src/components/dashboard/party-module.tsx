"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";
import { useForm, Controller } from "react-hook-form";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { paymentTerms } from "@/lib/constants";
import { customerSchema, supplierSchema } from "@/lib/schemas";
import { generateReference, uid } from "@/lib/utils";
import { Customer, Supplier } from "@/types/inventory";
import { useInventoryStore } from "@/store/use-inventory-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { PartyViewDialog } from "@/components/dashboard/party-view-dialog";

type Mode = "supplier" | "customer";
type Party = Supplier | Customer;

export function PartyModule({ mode }: { mode: Mode }) {
  const schema = mode === "supplier" ? supplierSchema : customerSchema;
  const label = mode === "supplier" ? "Supplier" : "Customer";
  const list = useInventoryStore((s) => (mode === "supplier" ? s.suppliers : s.customers));
  const upsert = useInventoryStore((s) => (mode === "supplier" ? s.upsertSupplier : s.upsertCustomer));

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [active, setActive] = useState<Party | null>(null);

  const filtered = useMemo(
    () => list.filter((x) => `${x.code} ${x.registeredName} ${x.tradeName}`.toLowerCase().includes(query.toLowerCase())),
    [list, query]
  );

  const columns = useMemo<ColumnDef<Party>[]>(
    () => [
      { accessorKey: "code", header: "Code" },
      { accessorKey: "registeredName", header: "Registered Name" },
      { accessorKey: "paymentTerm", header: "Payment Term" },
      {
        accessorKey: "active",
        header: "Status",
        cell: ({ row }) => <Badge variant={row.original.active ? "success" : "secondary"}>{row.original.active ? "Active" : "Inactive"}</Badge>
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setActive(row.original);
              setOpen(true);
            }}
          >
            Edit
          </Button>
        )
      }
    ],
    []
  );

  const table = useReactTable({
    data: filtered,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  const defaultValues: z.infer<typeof schema> = {
    referenceId: generateReference(mode === "supplier" ? "SUP" : "CUS"),
    code: `${mode === "supplier" ? "S" : "C"}${Math.floor(100000 + Math.random() * 899999)}`,
    registeredName: "",
    tradeName: "",
    parentCompany: "",
    fullAddress: "",
    telNo: "",
    faxNo: "",
    paymentTerm: "30 DAYS",
    active: true,
    tin: "",
    ewt: "",
    currency: "PHP",
    creditLimit: 0,
    businessStyle: "",
    taxScheme: "VAT",
    bdm: "",
    walkIn: false,
    imported: false
  };

  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues
  });

  const submit = handleSubmit((values) => {
    upsert({ ...(active ?? {}), ...values, id: active?.id ?? uid(mode === "supplier" ? "sup" : "cus") } as never);
    toast.success(`${label} saved`);
    setOpen(false);
    setActive(null);
    reset(defaultValues);
  });

  return (
    <div className="space-y-4">
      <div className="glass soft-grid rounded-2xl p-4">
        <div className="flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-0 w-full sm:min-w-[240px]">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`Search ${label.toLowerCase()}...`} />
          </div>
          <Button className="w-full sm:w-auto" onClick={() => { setOpen(true); setActive(null); reset(defaultValues); }}>
            <Plus className="mr-2 h-4 w-4" />
            New {label}
          </Button>
        </div>
      </div>

      <div className="glass rounded-2xl p-2">
        <div className="space-y-3 md:hidden">
          {table.getRowModel().rows.map((row) => (
            <div
              key={row.id}
              className="rounded-xl border bg-background/50 p-3 cursor-pointer"
              onClick={() => {
                setActive(row.original);
                setOpenView(true);
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">{row.original.code}</p>
                  <p className="text-xs text-muted-foreground">{row.original.registeredName}</p>
                </div>
                <Badge variant={row.original.active ? "success" : "secondary"}>{row.original.active ? "Active" : "Inactive"}</Badge>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                <p>{row.original.tradeName || "No trade name"}</p>
                <p>{row.original.paymentTerm}</p>
              </div>
              <div className="mt-3 flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActive(row.original);
                    setOpen(true);
                  }}
                >
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="hidden md:block">
          <Table>
            <TableHeader className="sticky top-0 z-10">
              {table.getHeaderGroups().map((group) => (
                <TableRow key={group.id}>
                  {group.headers.map((header) => (
                    <TableHead key={header.id}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="cursor-pointer"
                    onClick={() => {
                      setActive(row.original);
                      setOpenView(true);
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={cell.column.id === "registeredName" ? "max-w-[360px] truncate" : undefined}
                        title={cell.column.id === "registeredName" ? String(cell.getValue()) : undefined}
                      >
                        {cell.column.id === "actions" ? (
                          <div onClick={(e) => e.stopPropagation()}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </div>
                        ) : (
                          flexRender(cell.column.columnDef.cell, cell.getContext())
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-20 text-center text-muted-foreground">
                    No {label.toLowerCase()} records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2 px-2 pb-1 text-xs text-muted-foreground">
          <p>
            Page {table.getState().pagination.pageIndex + 1} of {Math.max(table.getPageCount(), 1)}
          </p>
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>

      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (next) {
            reset((active as z.infer<typeof schema>) ?? defaultValues);
          }
        }}
      >
        <DialogContent className="overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{active ? `Edit ${label}` : `New ${label}`}</DialogTitle>
          </DialogHeader>
          <form onSubmit={submit} className="grid gap-3 md:grid-cols-2">
            <div>
              <Label>Reference ID</Label>
              <Input {...register("referenceId")} readOnly />
            </div>
            <div>
              <Label>Code *</Label>
              <Input {...register("code")} />
              <p className="text-xs text-rose-500">{errors.code?.message}</p>
            </div>
            <div className="md:col-span-2">
              <Label>Registered Name *</Label>
              <Input {...register("registeredName")} />
              <p className="text-xs text-rose-500">{errors.registeredName?.message}</p>
            </div>
            <div>
              <Label>Trade Name</Label>
              <Input {...register("tradeName")} />
            </div>
            <div>
              <Label>Parent Company</Label>
              <Input {...register("parentCompany")} />
            </div>
            <div className="md:col-span-2">
              <Label>Full Address</Label>
              <Textarea {...register("fullAddress")} />
            </div>
            <div>
              <Label>Payment Term *</Label>
              <Controller
                name="paymentTerm"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {paymentTerms.map((term) => <SelectItem key={term} value={term}>{term}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div>
              <Label>TIN</Label>
              <Input {...register("tin")} />
            </div>
            <div>
              <Label>Currency</Label>
              <Input {...register("currency")} />
            </div>
            <div>
              <Label>Credit Limit</Label>
              <Input type="number" {...register("creditLimit")} />
            </div>
            <div className="md:col-span-2 grid gap-3 md:grid-cols-3">
              {[
                ["active", "Active"],
                ["walkIn", "Walk In"],
                ["imported", "Imported"]
              ].map(([field, text]) => (
                <label key={field} className="flex items-center gap-2 rounded border px-3 py-2">
                  <Controller
                    control={control}
                    name={field as keyof z.infer<typeof schema>}
                    render={({ field }) => <Checkbox checked={Boolean(field.value)} onCheckedChange={field.onChange} />}
                  />
                  <span className="text-sm">{text}</span>
                </label>
              ))}
            </div>
            <div className="md:col-span-2 flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
              <Button className="w-full sm:w-auto" type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button className="w-full sm:w-auto" type="submit">Save {label}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <PartyViewDialog open={openView} onOpenChange={setOpenView} party={active ?? undefined} mode={mode} />
    </div>
  );
}
