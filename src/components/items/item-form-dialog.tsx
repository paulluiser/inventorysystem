"use client";

import { useEffect, useMemo } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { commonUom, itemGroups } from "@/lib/constants";
import { itemSchema, ItemFormValues } from "@/lib/schemas";
import { generateReference, uid } from "@/lib/utils";
import { Item } from "@/types/inventory";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: Item) => void;
  item?: Item;
};

const defaults: ItemFormValues = {
  referenceId: generateReference("ITM"),
  code: `I${Math.floor(100000000 + Math.random() * 900000000)}`,
  skuCode: "",
  description: "",
  itemGroup: "EQUIPMENT",
  category: "",
  subCategory: "",
  type: "",
  brand: "",
  subBrand: "",
  supplierModelCode: "",
  itiModelCode: "",
  modelCode: "",
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
  image: ""
};

function Field({ label, error, children, tooltip }: { label: string; error?: string; children: React.ReactNode; tooltip?: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label>{label}</Label>
        {tooltip ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-help text-xs text-muted-foreground">?</span>
            </TooltipTrigger>
            <TooltipContent>{tooltip}</TooltipContent>
          </Tooltip>
        ) : null}
      </div>
      {children}
      {error ? <p className="text-xs text-rose-500">{error}</p> : null}
    </div>
  );
}

export function ItemFormDialog({ open, onOpenChange, onSubmit, item }: Props) {
  const {
    control,
    register,
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: defaults
  });

  const { fields, append, remove } = useFieldArray({ control, name: "bom" });
  const image = watch("image");

  useEffect(() => {
    if (!open) return;
    reset(item ? { ...item } : defaults);
  }, [item, open, reset]);

  const isEdit = useMemo(() => Boolean(item), [item]);

  const onFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setValue("image", reader.result?.toString() ?? "");
    reader.readAsDataURL(file);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Item" : "Create New Item"}</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit((values) => {
            onSubmit({
              ...item,
              ...values,
              id: item?.id ?? uid("itm"),
              createdAt: item?.createdAt ?? new Date().toISOString(),
              updatedAt: new Date().toISOString()
            } as Item);
            toast.success(isEdit ? "Item updated" : "Item created");
            onOpenChange(false);
            reset(defaults);
          })}
          className="space-y-4"
        >
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

            <TabsContent value="general" className="grid gap-4 md:grid-cols-2">
              <Field label="Reference ID">
                <Input {...register("referenceId")} readOnly className="opacity-80" />
              </Field>
              <Field label="Code *" error={errors.code?.message}>
                <Input {...register("code")} placeholder="I000035611" />
              </Field>
              <Field label="SKU Code" error={errors.skuCode?.message}>
                <Input {...register("skuCode")} />
              </Field>
              <Field label="UOM *" error={errors.uom?.message}>
                <Controller
                  control={control}
                  name="uom"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select UOM" />
                      </SelectTrigger>
                      <SelectContent>
                        {commonUom.map((uom) => (
                          <SelectItem key={uom} value={uom}>
                            {uom}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
              <div className="md:col-span-2">
                <Field label="Description *" error={errors.description?.message}>
                  <Textarea rows={4} {...register("description")} />
                </Field>
              </div>
              <Field label="Color">
                <Input {...register("color")} />
              </Field>
              <Field label="Status">
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
            </TabsContent>

            <TabsContent value="pricing" className="grid gap-4 md:grid-cols-3">
              <Field label="SRP" error={errors.srp?.message}>
                <Input type="number" step="0.01" {...register("srp")} />
              </Field>
              <Field label="Currency *" error={errors.currency?.message}>
                <Input {...register("currency")} />
              </Field>
              <Field label="Current Balance" tooltip="Readonly in live mode; editable in demo seed data.">
                <Input type="number" {...register("currentBalance")} readOnly={isEdit} />
              </Field>
              <Field label="Re-Order Level" error={errors.reorderLevel?.message}>
                <Input type="number" {...register("reorderLevel")} />
              </Field>
              <Field label="Standard Pack" error={errors.standardPack?.message}>
                <Input type="number" {...register("standardPack")} />
              </Field>
              <Field label="Warranty Duration" error={errors.warrantyDuration?.message}>
                <Input type="number" {...register("warrantyDuration")} />
              </Field>
              <Field label="Warranty Type">
                <Controller
                  control={control}
                  name="warrantyDurationType"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Months">Months</SelectItem>
                        <SelectItem value="Years">Years</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
            </TabsContent>

            <TabsContent value="classification" className="grid gap-4 md:grid-cols-2">
              <Field label="Item Group *" error={errors.itemGroup?.message}>
                <Controller
                  control={control}
                  name="itemGroup"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select group" />
                      </SelectTrigger>
                      <SelectContent>
                        {itemGroups.map((group) => (
                          <SelectItem key={group} value={group}>
                            {group}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
              <Field label="Category *" error={errors.category?.message}>
                <Input {...register("category")} />
              </Field>
              <Field label="Sub Category *" error={errors.subCategory?.message}>
                <Input {...register("subCategory")} />
              </Field>
              <Field label="Type *" error={errors.type?.message}>
                <Input {...register("type")} />
              </Field>
              <Field label="Brand *" error={errors.brand?.message}>
                <Input {...register("brand")} />
              </Field>
              <Field label="Sub Brand">
                <Input {...register("subBrand")} />
              </Field>
              <div className="md:col-span-2 grid gap-3 md:grid-cols-3">
                {[
                  ["trade", "Trade"],
                  ["withSerial", "With Serial"],
                  ["nonTrade", "Non-Trade"],
                  ["bundle", "Bundle"],
                  ["nonInventoriable", "Non-Inventoriable"]
                ].map(([name, label]) => (
                  <label key={name} className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                    <Controller
                      control={control}
                      name={name as keyof ItemFormValues}
                      render={({ field }) => <Checkbox checked={Boolean(field.value)} onCheckedChange={field.onChange} />}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="supplier" className="grid gap-4 md:grid-cols-3">
              <Field label="Supplier Model Code *" error={errors.supplierModelCode?.message}>
                <Input {...register("supplierModelCode")} />
              </Field>
              <Field label="ITI Model Code *" error={errors.itiModelCode?.message}>
                <Input {...register("itiModelCode")} />
              </Field>
              <Field label="Model Code *" error={errors.modelCode?.message}>
                <Input {...register("modelCode")} />
              </Field>
            </TabsContent>

            <TabsContent value="bom" className="space-y-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">Build kits and assembled products with component-level costing.</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ id: uid("bom"), code: "", componentItem: "", quantity: 1, uom: "PCS", unitCost: 0 })}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Row
                </Button>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Component Item</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>UOM</TableHead>
                      <TableHead>Unit Cost</TableHead>
                      <TableHead className="w-[50px]" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                          No components yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      fields.map((field, index) => (
                        <TableRow key={field.id}>
                          <TableCell>
                            <Input {...register(`bom.${index}.code`)} />
                          </TableCell>
                          <TableCell>
                            <Input {...register(`bom.${index}.componentItem`)} />
                          </TableCell>
                          <TableCell>
                            <Input type="number" {...register(`bom.${index}.quantity`)} />
                          </TableCell>
                          <TableCell>
                            <Input {...register(`bom.${index}.uom`)} />
                          </TableCell>
                          <TableCell>
                            <Input type="number" step="0.01" {...register(`bom.${index}.unitCost`)} />
                          </TableCell>
                          <TableCell>
                            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="image" className="space-y-4">
              <label
                onDrop={(e) => {
                  e.preventDefault();
                  onFile(e.dataTransfer.files?.[0]);
                }}
                onDragOver={(e) => e.preventDefault()}
                className="flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed bg-background/40 p-6 text-center"
              >
                <ImagePlus className="mb-3 h-8 w-8 text-muted-foreground" />
                <p className="text-sm font-medium">Drag and drop image here</p>
                <p className="text-xs text-muted-foreground">or click to browse</p>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => onFile(e.target.files?.[0])}
                />
              </label>
              {image ? <img src={image} alt="Item preview" className="max-h-56 w-full rounded-lg border object-contain" /> : null}
            </TabsContent>

            <TabsContent value="history" className="space-y-2 text-sm">
              <p>
                <span className="text-muted-foreground">Created At:</span> {item?.createdAt ?? "Not saved yet"}
              </p>
              <p>
                <span className="text-muted-foreground">Last Updated:</span> {item?.updatedAt ?? "Not saved yet"}
              </p>
            </TabsContent>
          </Tabs>

          <div className="flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-end">
            <Button className="w-full sm:w-auto" type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button className="w-full sm:w-auto" type="submit" disabled={isSubmitting}>
              {isEdit ? "Save Changes" : "Create Item"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
