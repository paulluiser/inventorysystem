import { BarChart3 } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ReportsPage() {
  return (
    <section className="space-y-4 pb-6">
      <div className="section-hero">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Reports</h2>
            <p className="text-sm text-muted-foreground">Sales, inventory turns, and valuation snapshots.</p>
          </div>
        </div>
      </div>

      <Card className="glass border-0">
        <CardHeader>
          <CardTitle>Coming Next</CardTitle>
          <CardDescription>Report builder stubs are in place and ready for chart integrations.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
        </CardContent>
      </Card>
    </section>
  );
}
