import { Settings } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <section className="space-y-4 pb-6">
      <div className="section-hero">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <Settings className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Settings</h2>
            <p className="text-sm text-muted-foreground">System defaults, workflow preferences, and access policies.</p>
          </div>
        </div>
      </div>

      <Card className="glass border-0">
        <CardHeader>
          <CardTitle>Workspace Preferences</CardTitle>
          <CardDescription>Theme and keyboard shortcuts are already enabled globally.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">Add role permissions and approval routes in this section.</CardContent>
      </Card>
    </section>
  );
}
