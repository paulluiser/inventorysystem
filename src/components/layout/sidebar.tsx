"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Boxes, Building2, LayoutDashboard, PackageSearch, PanelLeftClose, PanelLeftOpen, Settings, ShoppingCart } from "lucide-react";

import { cn } from "@/lib/utils";
import { navItems } from "@/lib/constants";
import { Button } from "@/components/ui/button";

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  Dashboard: LayoutDashboard,
  Items: Boxes,
  Suppliers: Building2,
  Customers: ShoppingCart,
  Inventory: PackageSearch,
  Reports: BarChart3,
  Settings
};

type SidebarProps = {
  onNavigate?: () => void;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
};

export function Sidebar({ onNavigate, collapsed = false, onToggleCollapsed }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-full flex-col">
      <div className={cn("mb-6", collapsed ? "px-0" : "px-2")}>
        <div className={cn("rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/10 to-sky-500/10 shadow-glow", collapsed ? "p-2" : "p-4")}>
          <div className={cn("flex items-center", collapsed ? "justify-center" : "justify-between")}>
            {collapsed ? (
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">LS</p>
            ) : (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">LuminaStock</p>
                <h1 className="mt-1 text-2xl font-semibold">Inventory OS</h1>
              </div>
            )}
            {onToggleCollapsed && !collapsed ? (
              <Button variant="ghost" size="icon" className="shrink-0" onClick={onToggleCollapsed} aria-label="Collapse sidebar">
                <PanelLeftClose className="h-4 w-4" />
              </Button>
            ) : null}
          </div>
          {collapsed && onToggleCollapsed ? (
            <Button variant="ghost" size="icon" className="mx-auto mt-2 flex h-8 w-8" onClick={onToggleCollapsed} aria-label="Expand sidebar">
              <PanelLeftOpen className="h-4 w-4" />
            </Button>
          ) : null}
        </div>
      </div>

      <nav className={cn("space-y-1", collapsed ? "px-0" : "px-1")}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = iconMap[item.label];
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group flex rounded-xl text-sm transition-all duration-200",
                collapsed ? "justify-center px-2 py-3" : "items-center gap-3 px-3 py-2",
                isActive ? "bg-primary text-primary-foreground shadow-[0_14px_28px_-18px_hsl(var(--primary))]" : "hover:bg-muted/70"
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={cn("h-4 w-4", !isActive && "text-muted-foreground group-hover:text-foreground")} />
              {!collapsed ? <span>{item.label}</span> : null}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
