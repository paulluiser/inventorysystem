"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { seedData } from "@/data/seed";
import { Customer, Item, Supplier } from "@/types/inventory";
import { uid } from "@/lib/utils";

type InventoryState = {
  items: Item[];
  suppliers: Supplier[];
  customers: Customer[];
  hydrated: boolean;
  initialize: () => void;
  setHydrated: (hydrated: boolean) => void;
  upsertItem: (item: Item) => void;
  deleteItems: (ids: string[]) => void;
  upsertSupplier: (supplier: Supplier) => void;
  upsertCustomer: (customer: Customer) => void;
};

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set, get) => ({
      items: [],
      suppliers: [],
      customers: [],
      hydrated: false,
      initialize: () => {
        const { items, suppliers, customers } = get();
        if (items.length || suppliers.length || customers.length) return;
        set({
          items: seedData.items,
          suppliers: seedData.suppliers,
          customers: seedData.customers
        });
      },
      setHydrated: (hydrated) => set({ hydrated }),
      upsertItem: (item) =>
        set((state) => {
          const now = new Date().toISOString();
          const exists = state.items.find((x) => x.id === item.id);
          if (!exists) {
            return {
              items: [{ ...item, id: uid("itm"), createdAt: now, updatedAt: now }, ...state.items]
            };
          }
          return {
            items: state.items.map((x) => (x.id === item.id ? { ...item, updatedAt: now } : x))
          };
        }),
      deleteItems: (ids) => set((state) => ({ items: state.items.filter((x) => !ids.includes(x.id)) })),
      upsertSupplier: (supplier) =>
        set((state) => {
          const exists = state.suppliers.find((x) => x.id === supplier.id);
          if (!exists) {
            return { suppliers: [{ ...supplier, id: uid("sup") }, ...state.suppliers] };
          }
          return { suppliers: state.suppliers.map((x) => (x.id === supplier.id ? supplier : x)) };
        }),
      upsertCustomer: (customer) =>
        set((state) => {
          const exists = state.customers.find((x) => x.id === customer.id);
          if (!exists) {
            return { customers: [{ ...customer, id: uid("cus") }, ...state.customers] };
          }
          return { customers: state.customers.map((x) => (x.id === customer.id ? customer : x)) };
        })
    }),
    {
      name: "luminastock-store",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
        state?.initialize();
      }
    }
  )
);
