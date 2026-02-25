import { z } from "zod";

export const bomRowSchema = z.object({
  id: z.string(),
  code: z.string().min(1, "Code is required"),
  componentItem: z.string().min(1, "Component item is required"),
  quantity: z.coerce.number().min(0.01, "Quantity must be greater than 0"),
  uom: z.string().min(1, "UOM is required"),
  unitCost: z.coerce.number().min(0, "Unit cost cannot be negative")
});

export const itemSchema = z.object({
  id: z.string().optional(),
  referenceId: z.string(),
  code: z.string().min(4, "Code is required"),
  skuCode: z.string().optional().default(""),
  description: z.string().min(5, "Description is required"),
  itemGroup: z.string().min(1, "Item group is required"),
  category: z.string().min(1, "Category is required"),
  subCategory: z.string().min(1, "Sub category is required"),
  type: z.string().min(1, "Type is required"),
  brand: z.string().min(1, "Brand is required"),
  subBrand: z.string().optional().default(""),
  supplierModelCode: z.string().min(1, "Supplier model code is required"),
  itiModelCode: z.string().min(1, "ITI model code is required"),
  modelCode: z.string().min(1, "Model code is required"),
  uom: z.string().min(1, "UOM is required"),
  color: z.string().optional().default(""),
  warrantyDuration: z.coerce.number().min(0, "Warranty cannot be negative"),
  warrantyDurationType: z.enum(["Months", "Years"]),
  trade: z.boolean().default(false),
  withSerial: z.boolean().default(false),
  nonTrade: z.boolean().default(false),
  bundle: z.boolean().default(false),
  nonInventoriable: z.boolean().default(false),
  srp: z.coerce.number().min(0, "SRP cannot be negative"),
  currency: z.string().min(1, "Currency is required"),
  currentBalance: z.coerce.number().min(0),
  reorderLevel: z.coerce.number().min(0),
  standardPack: z.coerce.number().min(0),
  status: z.enum(["Active", "Inactive"]),
  image: z.string().optional(),
  bom: z.array(bomRowSchema).default([])
});

export type ItemFormValues = z.infer<typeof itemSchema>;

const partySchema = z.object({
  id: z.string().optional(),
  referenceId: z.string(),
  code: z.string().min(1, "Code is required"),
  registeredName: z.string().min(2, "Registered name is required"),
  tradeName: z.string().optional().default(""),
  parentCompany: z.string().optional().default(""),
  fullAddress: z.string().min(5, "Address is required"),
  telNo: z.string().optional().default(""),
  faxNo: z.string().optional().default(""),
  paymentTerm: z.string().min(1, "Payment term is required"),
  active: z.boolean().default(true),
  tin: z.string().optional().default(""),
  ewt: z.string().optional().default(""),
  currency: z.string().default("PHP"),
  creditLimit: z.coerce.number().min(0),
  businessStyle: z.string().optional().default(""),
  taxScheme: z.string().optional().default("VAT"),
  bdm: z.string().optional().default(""),
  walkIn: z.boolean().default(false),
  imported: z.boolean().default(false)
});

export const supplierSchema = partySchema;
export const customerSchema = partySchema;

export type SupplierFormValues = z.infer<typeof supplierSchema>;
export type CustomerFormValues = z.infer<typeof customerSchema>;
