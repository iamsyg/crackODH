import { PageShell } from "@/components/layout/page-shell";
import { PlaceholderSection } from "@/components/layout/placeholder-section";
import { Button } from "@/components/ui/button";

export default function ReportsPage() {
  return (
    <PageShell
      title="Reports & analytics"
      description="Review fuel efficiency, fleet utilization, operational cost, and vehicle ROI."
      actions={<Button disabled>Export CSV</Button>}
    >
      <PlaceholderSection
        title="Coming next"
        items={[
          "Fuel efficiency (distance / fuel)",
          "Fleet utilization and operational cost dashboards",
          "Vehicle ROI and CSV export",
        ]}
      />
    </PageShell>
  );
}
