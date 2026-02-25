"use client";

import * as React from "react";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export function CommandDialog({ open, onOpenChange, children }: { open: boolean; onOpenChange: (v: boolean) => void; children: React.ReactNode }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0">
        {children}
      </DialogContent>
    </Dialog>
  );
}

export function CommandInput({ value, onValueChange, placeholder }: { value: string; onValueChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="flex items-center border-b px-4">
      <Search className="mr-2 h-4 w-4 shrink-0 opacity-60" />
      <input
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={placeholder}
        className="flex h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
    </div>
  );
}

export function CommandList({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("max-h-[360px] overflow-y-auto p-2", className)} {...props} />;
}

export function CommandItem({ className, ...props }: React.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn("w-full rounded-md px-3 py-2 text-left text-sm hover:bg-accent", className)}
      {...props}
    />
  );
}
