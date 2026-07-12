import { PageShell } from "@/components/layout/page-shell";
import { PlaceholderSection } from "@/components/layout/placeholder-section";
import { Button } from "@/components/ui/button";

export default function VehiclesPage() {
  return (
    <PageShell
      title="Vehicle registry"
      description="Maintain fleet assets with registration details, capacity, odometer, and status."
      actions={<Button disabled>Add vehicle</Button>}
    >
      <PlaceholderSection
        title="Coming next"
        items={[
          "Searchable vehicle table with type, status, and region filters",
          "Create and edit forms with unique registration validation",
          "Status lifecycle: Available, On Trip, In Shop, Retired",
        ]}
      />
    </PageShell>
  );
}
