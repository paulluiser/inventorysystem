"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("luminastock-sidebar-collapsed");
    if (saved === "1") setCollapsed(true);
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("luminastock-sidebar-collapsed", next ? "1" : "0");
      return next;
    });
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-[1600px] gap-3 px-2 py-3 sm:gap-4 sm:px-3 sm:py-4 lg:gap-6 lg:px-5 lg:py-6">
      <aside className={`glass soft-grid hidden rounded-2xl p-4 transition-all duration-200 lg:block ${collapsed ? "w-[92px]" : "w-[280px]"}`}>
        <Sidebar collapsed={collapsed} onToggleCollapsed={toggleCollapsed} />
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent className="w-[280px] p-4">
          <Sidebar onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="min-w-0 flex-1 pb-4">
        <Topbar onOpenMobileNav={() => setMobileOpen(true)} />
        <motion.main initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
          {children}
        </motion.main>
      </div>
    </div>
  );
}
