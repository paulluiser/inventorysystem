import type { Route } from "next";

export const itemGroups = ["EQUIPMENT", "CONSUMABLE", "RAW MATERIAL", "SPARE PARTS", "SERVICE"];
export const commonUom = ["PCS", "BOX", "PACK", "SET", "UNIT", "LOT", "KG", "ROLL"];
export const paymentTerms = ["COD", "15 DAYS", "30 DAYS", "45 DAYS", "60 DAYS"];

export const navItems: { href: Route; label: string }[] = [
  { href: "/", label: "Dashboard" },
  { href: "/items", label: "Items" },
  { href: "/suppliers", label: "Suppliers" },
  { href: "/customers", label: "Customers" },
  { href: "/inventory", label: "Inventory" },
  { href: "/reports", label: "Reports" },
  { href: "/settings", label: "Settings" }
];
