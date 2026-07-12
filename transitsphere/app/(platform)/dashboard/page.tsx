// app/(platform)/dashboard/page.tsx

import { PageShell } from "@/components/layout/page-shell";
import { FilterSection } from "@/app/(platform)/dashboard/filter-section";
import { KpiCard } from "@/app/(platform)/dashboard/kpi-card";
import { RecentTripsTable } from "@/app/(platform)/dashboard/recent-trips-table";

// Mock data - replace with actual data from your API
const kpiData = {
  activeVehicles: 142,
  availableVehicles: 87,
  vehiclesInMaintenance: 23,
  activeTrips: 56,
  pendingTrips: 12,
  driversOnDuty: 98,
  fleetUtilization: 78,
};

// Define the Trip type here or import from a types file
type Trip = {
  id: string;
  vehicleNumber: string;
  driverName: string;
  status: "on_trip" | "completed" | "dispatched" | "draft";
  estimatedTime: string;
};

const mockTrips: Trip[] = [
  {
    id: "TR-2026-001",
    vehicleNumber: "KA-01-AB-1234",
    driverName: "Rajesh Kumar",
    status: "on_trip",
    estimatedTime: "2h 30m",
  },
  {
    id: "TR-2026-002",
    vehicleNumber: "KA-02-CD-5678",
    driverName: "Priya Singh",
    status: "completed",
    estimatedTime: "1h 15m",
  },
  {
    id: "TR-2026-003",
    vehicleNumber: "KA-03-EF-9012",
    driverName: "Amit Patel",
    status: "dispatched",
    estimatedTime: "45m",
  },
  {
    id: "TR-2026-004",
    vehicleNumber: "KA-04-GH-3456",
    driverName: "Sneha Reddy",
    status: "draft",
    estimatedTime: "3h 00m",
  },
  {
    id: "TR-2026-005",
    vehicleNumber: "KA-05-IJ-7890",
    driverName: "Vikram Sharma",
    status: "on_trip",
    estimatedTime: "1h 45m",
  },
  {
    id: "TR-2026-006",
    vehicleNumber: "KA-06-KL-2345",
    driverName: "Deepa Nair",
    status: "completed",
    estimatedTime: "2h 10m",
  },
  {
    id: "TR-2026-007",
    vehicleNumber: "KA-07-MN-6789",
    driverName: "Suresh Rao",
    status: "dispatched",
    estimatedTime: "50m",
  },
  {
    id: "TR-2026-008",
    vehicleNumber: "KA-08-OP-0123",
    driverName: "Anjali Menon",
    status: "draft",
    estimatedTime: "4h 00m",
  },
  {
    id: "TR-2026-009",
    vehicleNumber: "KA-09-QR-4567",
    driverName: "Manoj Gupta",
    status: "on_trip",
    estimatedTime: "1h 20m",
  },
  {
    id: "TR-2026-010",
    vehicleNumber: "KA-10-ST-8901",
    driverName: "Kavya Nair",
    status: "completed",
    estimatedTime: "3h 15m",
  },
];

export default function DashboardPage() {
  return (
    <PageShell
      title="Operations Dashboard"
      description="Fleet KPIs, filters, and operational overview for your transport network."
    >
      {/* Filters */}
      <FilterSection />

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Active Vehicles"
          value={kpiData.activeVehicles}
          icon="🚛"
          trend="+12%"
          trendUp
        />
        <KpiCard
          label="Available Vehicles"
          value={kpiData.availableVehicles}
          icon="✅"
          trend="+5%"
          trendUp
        />
        <KpiCard
          label="Vehicles in Maintenance"
          value={kpiData.vehiclesInMaintenance}
          icon="🔧"
          trend="-2%"
          trendUp={false}
        />
        <KpiCard
          label="Active Trips"
          value={kpiData.activeTrips}
          icon="📦"
          trend="+8%"
          trendUp
        />
        <KpiCard
          label="Pending Trips"
          value={kpiData.pendingTrips}
          icon="⏳"
          trend="-15%"
          trendUp
        />
        <KpiCard
          label="Drivers on Duty"
          value={kpiData.driversOnDuty}
          icon="👨‍✈️"
          trend="+3%"
          trendUp
        />
        <KpiCard
          label="Fleet Utilization"
          value={`${kpiData.fleetUtilization}%`}
          icon="📊"
          trend="+4%"
          trendUp
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Fleet Utilization Trend
          </h3>
          <div className="mt-4 h-48 flex items-end justify-between gap-2">
            {[65, 72, 68, 78, 82, 75, 78].map((value, index) => (
              <div key={index} className="flex flex-col items-center gap-2 flex-1">
                <div
                  className="w-full bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
                  style={{ height: `${(value / 100) * 100}%` }}
                />
                <span className="text-xs text-muted-foreground">Day {index + 1}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Trip Volume
          </h3>
          <div className="mt-4 h-48 flex items-end justify-between gap-2">
            {[42, 56, 48, 65, 52, 48, 56].map((value, index) => (
              <div key={index} className="flex flex-col items-center gap-2 flex-1">
                <div
                  className="w-full bg-emerald-500 rounded-t transition-all duration-300 hover:bg-emerald-600"
                  style={{ height: `${(value / 70) * 100}%` }}
                />
                <span className="text-xs text-muted-foreground">Day {index + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Trips Table */}
      <RecentTripsTable trips={mockTrips} />
    </PageShell>
  );
}