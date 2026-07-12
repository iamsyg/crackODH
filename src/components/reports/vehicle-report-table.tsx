import type { VehicleReportRow } from "@/lib/reports/queries";

export function VehicleReportTable({ rows }: { rows: VehicleReportRow[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Vehicle</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Distance</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Fuel eff.</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Op. cost</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Revenue</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">ROI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row) => (
              <tr key={row.registrationNumber}>
                <td className="px-4 py-3">
                  <div className="font-medium">{row.registrationNumber}</div>
                  <div className="text-xs text-muted-foreground">{row.name}</div>
                </td>
                <td className="px-4 py-3">{row.totalDistance.toLocaleString()} km</td>
                <td className="px-4 py-3">
                  {row.fuelEfficiency ? `${row.fuelEfficiency} km/L` : "—"}
                </td>
                <td className="px-4 py-3">${row.operationalCost.toFixed(2)}</td>
                <td className="px-4 py-3">${row.totalRevenue.toFixed(2)}</td>
                <td className="px-4 py-3">
                  {row.roi !== null ? `${(row.roi * 100).toFixed(1)}%` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
