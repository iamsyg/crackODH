import { PageShell } from "@/components/layout/page-shell";
import { PlaceholderSection } from "@/components/layout/placeholder-section";
import { Button } from "@/components/ui/button";

export default function DriversPage() {
  return (
    <PageShell
      title="Driver management"
      description="Track driver profiles, license validity, safety scores, and assignment eligibility."
      actions={<Button disabled>Add driver</Button>}
    >
      <PlaceholderSection
        title="Coming next"
        items={[
          "Driver directory with license expiry and safety score columns",
          "Compliance checks for expired or suspended drivers",
          "Status lifecycle: Available, On Trip, Off Duty, Suspended",
        ]}
      />
    </PageShell>
  );
}
