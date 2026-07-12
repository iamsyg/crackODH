// CRACKODH
"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { DashboardMetrics } from "@/lib/dashboard/queries";

const CHART_COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

type ChartItem = {
  name: string;
  value: number;
};

type DashboardChartsProps = {
  metrics: DashboardMetrics;
};

function formatStatusLabel(status: string) {
  return status.replace(/_/g, " ");
}

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { value: number; payload: ChartItem }[];
}) {
  if (!active || !payload?.length) return null;

  const item = payload[0].payload;

  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-sm shadow-md">
      <p className="font-medium text-popover-foreground">{item.name}</p>
      <p className="text-muted-foreground">{item.value}</p>
    </div>
  );
}

function StatusBarChart({ title, data }: { title: string; data: ChartItem[] }) {
  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{title}</h2>
      <div className="mt-4 h-64">
        <ResponsiveContainer height="100%" width="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid className="stroke-border" strokeDasharray="3 3" vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="name"
              tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              axisLine={false}
              tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
              tickLine={false}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--color-muted)", opacity: 0.4 }} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell fill={CHART_COLORS[index % CHART_COLORS.length]} key={entry.name} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function FleetSnapshotChart({ metrics }: { metrics: DashboardMetrics }) {
  const data: ChartItem[] = [
    { name: "Available", value: metrics.availableVehicles },
    { name: "On trip", value: metrics.activeTrips },
    { name: "In maintenance", value: metrics.vehiclesInMaintenance },
    { name: "Pending trips", value: metrics.pendingTrips },
  ].filter((item) => item.value > 0);

  if (data.length === 0) {
    return (
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Fleet snapshot
        </h2>
        <p className="mt-4 text-sm text-muted-foreground">No fleet activity to chart yet.</p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Fleet snapshot
      </h2>
      <div className="mt-4 h-64">
        <ResponsiveContainer height="100%" width="100%">
          <PieChart>
            <Pie
              cx="50%"
              cy="50%"
              data={data}
              dataKey="value"
              innerRadius={56}
              nameKey="name"
              outerRadius={88}
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell fill={CHART_COLORS[index % CHART_COLORS.length]} key={entry.name} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
        {data.map((item, index) => (
          <li className="flex items-center gap-1.5" key={item.name}>
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
            />
            {item.name}: {item.value}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function DashboardCharts({ metrics }: DashboardChartsProps) {
  const tripData = metrics.tripsByStatus.map((item) => ({
    name: formatStatusLabel(item.status),
    value: item.count,
  }));

  const vehicleData = metrics.vehiclesByStatus.map((item) => ({
    name: formatStatusLabel(item.status),
    value: item.count,
  }));

  return (
    <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
      <StatusBarChart data={tripData} title="Trips by status" />
      <StatusBarChart data={vehicleData} title="Vehicles by status" />
      <FleetSnapshotChart metrics={metrics} />
    </div>
  );
}
