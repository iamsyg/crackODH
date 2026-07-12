// CRACKODH
import type { DashboardMetrics } from "@/lib/dashboard/queries";

type DashboardBreakdownProps = {
  metrics: DashboardMetrics;
};

function BreakdownList({
  title,
  items,
}: {
  title: string;
  items: { label: string; count: number }[];
}) {
  const max = Math.max(...items.map((item) => item.count), 1);

  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{title}</h2>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item.label}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span>{item.label}</span>
              <span className="font-medium">{item.count}</span>
            </div>
            <div className="h-2 rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-primary"
                style={{ width: `${Math.round((item.count / max) * 100)}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function DashboardBreakdown({ metrics }: DashboardBreakdownProps) {
  const tripItems = metrics.tripsByStatus.map((item) => ({
    label: item.status.replace("_", " "),
    count: item.count,
  }));

  const vehicleItems = metrics.vehiclesByStatus.map((item) => ({
    label: item.status.replace("_", " "),
    count: item.count,
  }));

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <BreakdownList title="Trips by status" items={tripItems} />
      <BreakdownList title="Vehicles by status" items={vehicleItems} />
    </div>
  );
}
