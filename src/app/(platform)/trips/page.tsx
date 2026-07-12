import { PageShell } from "@/components/layout/page-shell";
import { PlaceholderSection } from "@/components/layout/placeholder-section";
import { Button } from "@/components/ui/button";

export default function TripsPage() {
  return (
    <PageShell
      title="Trip management"
      description="Create, dispatch, complete, and cancel trips with automatic vehicle and driver status updates."
      actions={<Button disabled>Create trip</Button>}
    >
      <PlaceholderSection
        title="Coming next"
        items={[
          "Trip board with Draft, Dispatched, Completed, and Cancelled states",
          "Dispatch validation for capacity, license, and availability rules",
          "Completion flow with final odometer and fuel consumed",
        ]}
      />
    </PageShell>
  );
}
