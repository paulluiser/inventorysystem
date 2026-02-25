"use client";

import { useEffect } from "react";

import { useInventoryStore } from "@/store/use-inventory-store";

export function StoreBootstrap() {
  const initialize = useInventoryStore((s) => s.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return null;
}
