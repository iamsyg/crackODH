// CRACKODH
import Link from "next/link";

import { PageShell } from "@/components/layout/page-shell";
import { VehicleReportTable } from "@/components/reports/vehicle-report-table";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { buttonVariants } from "@/components/ui/button";
import { requireAuth } from "@/lib/auth/require-permission";
import { hasPermission } from "@/lib/rbac";
import { getVehicleReports } from "@/lib/reports/queries";
import { cn } from "@/lib/utils";

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

  const rows = await getVehicleReports();
  const activeRows = rows.filter((row) => row.registrationNumber !== "VAN-11");

  const totals = activeRows.reduce(
    (acc, row) => ({
      distance: acc.distance + row.totalDistance,
      fuelCost: acc.fuelCost + row.totalFuelCost,
      maintenanceCost: acc.maintenanceCost + row.totalMaintenanceCost,
      operationalCost: acc.operationalCost + row.operationalCost,
      revenue: acc.revenue + row.totalRevenue,
    }),
    { distance: 0, fuelCost: 0, maintenanceCost: 0, operationalCost: 0, revenue: 0 },
  );

  const avgFuelEfficiency =
    activeRows.filter((row) => row.fuelEfficiency).length > 0
      ? (
          activeRows.reduce((sum, row) => sum + (row.fuelEfficiency ?? 0), 0) /
          activeRows.filter((row) => row.fuelEfficiency).length
        ).toFixed(2)
      : "—";

  const fleetUtilization = activeRows[0]?.fleetUtilization ?? 0;

  return (
    <PageShell
      title="Reports & analytics"
      description="Review fuel efficiency, fleet utilization, operational cost, and vehicle ROI."
      actions={
        <Link className={cn(buttonVariants())} href="/api/reports/export">
          Export CSV
        </Link>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Fleet utilization" value={`${fleetUtilization}%`} />
        <KpiCard label="Avg fuel efficiency" value={avgFuelEfficiency === "—" ? "—" : `${avgFuelEfficiency} km/L`} />
        <KpiCard label="Total operational cost" value={`$${totals.operationalCost.toFixed(2)}`} />
        <KpiCard label="Total revenue" value={`$${totals.revenue.toFixed(2)}`} />
      </div>

      <VehicleReportTable rows={rows} />
    </PageShell>
  );
}
