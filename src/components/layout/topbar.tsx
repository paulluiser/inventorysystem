"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, Search } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { GlobalSearch } from "@/components/layout/global-search";

export function Topbar({ onOpenMobileNav }: { onOpenMobileNav: () => void }) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const crumbs = useMemo(() => {
    const parts = pathname.split("/").filter(Boolean);
    return ["Dashboard", ...parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1))];
  }, [pathname]);

  return (
    <header className="glass sticky top-0 z-30 mb-4 rounded-2xl px-3 py-3 sm:mb-6 sm:px-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 lg:hidden">
          <Button variant="ghost" size="icon" onClick={onOpenMobileNav}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        <div className="hidden flex-1 max-w-xl lg:block">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex h-10 w-full items-center rounded-md border bg-background/80 px-3 text-left text-sm text-muted-foreground transition hover:bg-background"
          >
            <Search className="mr-2 h-4 w-4" />
            Search everything...
            <span className="ml-auto rounded border px-1.5 py-0.5 text-xs">⌘K</span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Avatar className="h-9 w-9 border border-primary/20 shadow-sm">
            <AvatarFallback className="bg-primary/10 text-primary">PL</AvatarFallback>
          </Avatar>
        </div>
      </div>
      <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Breadcrumb className="max-w-full overflow-x-auto">
          <BreadcrumbList className="w-max whitespace-nowrap">
            {crumbs.map((crumb, index) => (
              <BreadcrumbItem key={`${crumb}-${index}`}>
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbPage>{crumb}</BreadcrumbPage>
              </BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
        <div className="lg:hidden">
          <Input placeholder="Search..." onFocus={() => setSearchOpen(true)} readOnly />
        </div>
      </div>
      <GlobalSearch open={searchOpen} setOpen={setSearchOpen} />
    </header>
  );
}
