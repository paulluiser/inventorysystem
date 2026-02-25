export type ItemGroup = "EQUIPMENT" | "CONSUMABLE" | "RAW MATERIAL" | "SPARE PARTS" | "SERVICE";

export type Item = {
  id: string;
  referenceId: string;
  code: string;
  skuCode: string;
  description: string;
  itemGroup: ItemGroup;
  category: string;
  subCategory: string;
  type: string;
  brand: string;
  subBrand: string;
  supplierModelCode: string;
  itiModelCode: string;
  modelCode: string;
  uom: string;
  color: string;
  warrantyDuration: number;
  warrantyDurationType: "Months" | "Years";
  trade: boolean;
  withSerial: boolean;
  nonTrade: boolean;
  bundle: boolean;
  nonInventoriable: boolean;
  srp: number;
  currency: string;
  currentBalance: number;
  reorderLevel: number;
  standardPack: number;
  status: "Active" | "Inactive";
  image?: string;
  bom: BomRow[];
  supplierId?: string;
  createdAt: string;
  updatedAt: string;
};

export type BomRow = {
  id: string;
  code: string;
  componentItem: string;
  quantity: number;
  uom: string;
  unitCost: number;
};

export type Supplier = {
  id: string;
  referenceId: string;
  code: string;
  registeredName: string;
  tradeName: string;
  parentCompany: string;
  fullAddress: string;
  telNo: string;
  faxNo: string;
  paymentTerm: string;
  active: boolean;
  tin: string;
  ewt: string;
  currency: string;
  creditLimit: number;
  businessStyle: string;
  taxScheme: string;
  bdm: string;
  walkIn: boolean;
  imported: boolean;
};

export type Customer = {
  id: string;
  referenceId: string;
  code: string;
  registeredName: string;
  tradeName: string;
  parentCompany: string;
  fullAddress: string;
  telNo: string;
  faxNo: string;
  paymentTerm: string;
  active: boolean;
  tin: string;
  ewt: string;
  currency: string;
  creditLimit: number;
  businessStyle: string;
  taxScheme: string;
  bdm: string;
  walkIn: boolean;
  imported: boolean;
};

export type InventorySeed = {
  items: Item[];
  suppliers: Supplier[];
  customers: Customer[];
};
