import { PageShell } from "@/components/layout/page-shell";
import { PlaceholderSection } from "@/components/layout/placeholder-section";
import { Button } from "@/components/ui/button";

export default function MaintenancePage() {
  return (
    <PageShell
      title="Maintenance"
      description="Log maintenance work and automatically move vehicles in and out of shop status."
      actions={<Button disabled>Log maintenance</Button>}
    >
      <PlaceholderSection
        title="Coming next"
        items={[
          "Open and closed maintenance records per vehicle",
          "Automatic In Shop status when maintenance opens",
          "Restore Available status when maintenance closes",
        ]}
      />
    </PageShell>
  );
}
