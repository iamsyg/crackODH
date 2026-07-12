import { PageShell } from "@/components/layout/page-shell";
import { PlaceholderSection } from "@/components/layout/placeholder-section";
import { Button } from "@/components/ui/button";

export default function FuelPage() {
  return (
    <PageShell
      title="Fuel & expenses"
      description="Record fuel consumption and operational expenses to compute total cost per vehicle."
      actions={<Button disabled>Add entry</Button>}
    >
      <PlaceholderSection
        title="Coming next"
        items={[
          "Fuel logs with liters, cost, and date",
          "Expense categories such as tolls, parking, and maintenance",
          "Operational cost rollups per vehicle and trip",
        ]}
      />
    </PageShell>
  );
}
