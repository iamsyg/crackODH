// CRACKODH
import { DashboardCharts } from "@/components/dashboard/dashboard-charts";
import { DashboardFilters } from "@/components/dashboard/dashboard-filters";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { PageShell } from "@/components/layout/page-shell";
import { requireAuth } from "@/lib/auth/require-permission";
import {
  dashboardFilterSchema,
  getDashboardFilterOptions,
  getDashboardMetrics,
} from "@/lib/dashboard/queries";

type DashboardPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  await requireAuth();

  const rawParams = await searchParams;
  const parsedFilters = dashboardFilterSchema.safeParse({
    type: typeof rawParams.type === "string" ? rawParams.type : undefined,
    status: typeof rawParams.status === "string" ? rawParams.status : undefined,
    region: typeof rawParams.region === "string" ? rawParams.region : undefined,
  });

  const filters = parsedFilters.success ? parsedFilters.data : {};

  const [metrics, filterOptions] = await Promise.all([
    getDashboardMetrics(filters),
    getDashboardFilterOptions(),
  ]);

  return (
    <PageShell
      title="Operations dashboard"
      description="Fleet KPIs, filters, and operational overview for your transport network."
    >
      <DashboardFilters
        filters={filters}
        regions={filterOptions.regions}
        types={filterOptions.types}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard hint="Non-retired fleet" label="Active vehicles" value={metrics.activeVehicles} />
        <KpiCard label="Available vehicles" value={metrics.availableVehicles} />
        <KpiCard label="Vehicles in maintenance" value={metrics.vehiclesInMaintenance} />
        <KpiCard label="Active trips" value={metrics.activeTrips} />
        <KpiCard label="Pending trips" value={metrics.pendingTrips} />
        <KpiCard hint="Currently on trip" label="Drivers on duty" value={metrics.driversOnDuty} />
        <KpiCard
          hint="On trip / active fleet"
          label="Fleet utilization"
          value={`${metrics.fleetUtilization}%`}
        />
      </div>

      <DashboardCharts metrics={metrics} />
    </PageShell>
  );
}
