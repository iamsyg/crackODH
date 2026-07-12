// CRACKODH
import { ReportCharts } from "@/components/reports/report-charts";
import { ReportExportActions } from "@/components/reports/report-export-actions";
import { PageShell } from "@/components/layout/page-shell";
import { VehicleReportTable } from "@/components/reports/vehicle-report-table";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { requireAuth } from "@/lib/auth/require-permission";
import { getDashboardMetrics } from "@/lib/dashboard/queries";
import { hasPermission } from "@/lib/rbac";
import { getVehicleReports } from "@/lib/reports/queries";

export default async function ReportsPage() {
  const session = await requireAuth();
  if (!hasPermission(session.user.role, "reports:view")) {
    return (
      <PageShell
        title="Reports & analytics"
        description="You do not have permission to view reports."
      >
        <p className="text-sm text-muted-foreground">Contact your fleet manager for access.</p>
      </PageShell>
    );
  }

  const [rows, metrics] = await Promise.all([getVehicleReports(), getDashboardMetrics()]);

  const totals = rows.reduce(
    (acc, row) => ({
      distance: acc.distance + row.totalDistance,
      fuelCost: acc.fuelCost + row.totalFuelCost,
      maintenanceCost: acc.maintenanceCost + row.totalMaintenanceCost,
      expenseCost: acc.expenseCost + row.totalExpenseCost,
      operationalCost: acc.operationalCost + row.operationalCost,
      revenue: acc.revenue + row.totalRevenue,
    }),
    {
      distance: 0,
      fuelCost: 0,
      maintenanceCost: 0,
      expenseCost: 0,
      operationalCost: 0,
      revenue: 0,
    },
  );

  const rowsWithEfficiency = rows.filter((row) => row.fuelEfficiency);
  const avgFuelEfficiency =
    rowsWithEfficiency.length > 0
      ? (
          rowsWithEfficiency.reduce((sum, row) => sum + (row.fuelEfficiency ?? 0), 0) /
          rowsWithEfficiency.length
        ).toFixed(2)
      : "—";

  return (
    <PageShell
      title="Reports & analytics"
      description="Review fuel efficiency, fleet utilization, operational cost, and vehicle ROI."
      actions={<ReportExportActions />}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Fleet utilization" value={`${metrics.fleetUtilization}%`} />
        <KpiCard
          label="Avg fuel efficiency"
          value={avgFuelEfficiency === "—" ? "—" : `${avgFuelEfficiency} km/L`}
        />
        <KpiCard label="Total operational cost" value={`$${totals.operationalCost.toFixed(2)}`} />
        <KpiCard label="Total revenue" value={`$${totals.revenue.toFixed(2)}`} />
      </div>

      <ReportCharts rows={rows} totals={totals} />
      <VehicleReportTable rows={rows} />
    </PageShell>
  );
}
