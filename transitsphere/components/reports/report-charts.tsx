// CRACKODH
"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { VehicleReportRow } from "@/lib/reports/queries";

const CHART_COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];

type ReportChartsProps = {
  rows: VehicleReportRow[];
  totals: {
    fuelCost: number;
    maintenanceCost: number;
    expenseCost: number;
    revenue: number;
    operationalCost: number;
  };
};

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; name: string; color?: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-sm shadow-md">
      {label ? <p className="mb-1 font-medium text-popover-foreground">{label}</p> : null}
      {payload.map((entry) => (
        <p className="text-muted-foreground" key={entry.name}>
          {entry.name}: {typeof entry.value === "number" ? entry.value.toLocaleString() : entry.value}
        </p>
      ))}
    </div>
  );
}

export function ReportCharts({ rows, totals }: ReportChartsProps) {
  const costBreakdown = [
    { name: "Fuel", value: totals.fuelCost },
    { name: "Maintenance", value: totals.maintenanceCost },
    { name: "Other expenses", value: totals.expenseCost },
  ].filter((item) => item.value > 0);

  const topVehicles = [...rows]
    .sort((a, b) => b.operationalCost - a.operationalCost)
    .slice(0, 5)
    .map((row) => ({
      name: row.registrationNumber,
      cost: row.operationalCost,
      revenue: row.totalRevenue,
    }));

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Operational cost breakdown
        </h2>
        <div className="mt-4 h-72">
          {costBreakdown.length === 0 ? (
            <p className="text-sm text-muted-foreground">No cost data available.</p>
          ) : (
            <ResponsiveContainer height="100%" width="100%">
              <PieChart>
                <Pie
                  cx="50%"
                  cy="50%"
                  data={costBreakdown}
                  dataKey="value"
                  innerRadius={60}
                  nameKey="name"
                  outerRadius={96}
                  paddingAngle={2}
                >
                  {costBreakdown.map((entry, index) => (
                    <Cell fill={CHART_COLORS[index % CHART_COLORS.length]} key={entry.name} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => (
                    <ChartTooltip
                      active={active}
                      payload={payload?.map((item) => ({
                        name: String(item.name),
                        value: Number(item.value),
                      }))}
                    />
                  )}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Top vehicles — cost vs revenue
        </h2>
        <div className="mt-4 h-72">
          {topVehicles.length === 0 ? (
            <p className="text-sm text-muted-foreground">No vehicle report data available.</p>
          ) : (
            <ResponsiveContainer height="100%" width="100%">
              <BarChart data={topVehicles} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                <CartesianGrid className="stroke-border" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  axisLine={false}
                  dataKey="name"
                  tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis
                  axisLine={false}
                  tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                  tickFormatter={(value) => `$${value}`}
                  tickLine={false}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--color-muted)", opacity: 0.4 }} />
                <Legend />
                <Bar dataKey="cost" fill="#ef4444" name="Operational cost" radius={[4, 4, 0, 0]} />
                <Bar dataKey="revenue" fill="#22c55e" name="Revenue" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </section>
    </div>
  );
}
