import { PageShell } from "@/components/layout/page-shell";
import { PlaceholderSection } from "@/components/layout/placeholder-section";

const kpiPlaceholders = [
  "Active vehicles",
  "Available vehicles",
  "Vehicles in maintenance",
  "Active trips",
  "Pending trips",
  "Drivers on duty",
  "Fleet utilization (%)",
];

const filterPlaceholders = ["Vehicle type", "Status", "Region"];

export default function DashboardPage() {
  return (
    <PageShell
      title="Operations dashboard"
      description="Fleet KPIs, filters, and operational overview for your transport network."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiPlaceholders.map((label) => (
          <div
            key={label}
            className="rounded-xl border border-border bg-card p-4 shadow-sm"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {label}
            </p>
            <p className="mt-2 text-2xl font-semibold text-foreground">—</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <PlaceholderSection title="Filters" items={filterPlaceholders} />
        <PlaceholderSection
          title="Charts & analytics"
          items={["Fleet utilization trend", "Trip volume", "Operational cost summary"]}
        />
      </div>
    </PageShell>
  );
}
