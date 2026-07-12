// src/components/dashboard/recent-trips-table.tsx

type Trip = {
  id: string;
  vehicleNumber: string;
  driverName: string;
  status: "on_trip" | "completed" | "dispatched" | "draft";
  estimatedTime: string;
};

type RecentTripsTableProps = {
  trips: Trip[];
};

const statusColors = {
  on_trip: "bg-blue-500/10 text-blue-600 border-blue-200",
  completed: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  dispatched: "bg-amber-500/10 text-amber-600 border-amber-200",
  draft: "bg-gray-500/10 text-gray-600 border-gray-200",
};

const statusLabels = {
  on_trip: "On Trip",
  completed: "Completed",
  dispatched: "Dispatched",
  draft: "Draft",
};

export function RecentTripsTable({ trips }: RecentTripsTableProps) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="p-4 border-b border-border">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Recent Trips
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Trip ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Vehicle Number
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Driver Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Estimated Time
              </th>
            </tr>
          </thead>
          <tbody>
            {trips.map((trip, index) => (
              <tr
                key={trip.id}
                className={`border-b border-border transition-colors hover:bg-muted/30 ${
                  index % 2 === 0 ? "bg-background" : "bg-muted/10"
                }`}
              >
                <td className="px-4 py-3 font-medium text-foreground">
                  {trip.id}
                </td>
                <td className="px-4 py-3 text-foreground">{trip.vehicleNumber}</td>
                <td className="px-4 py-3 text-foreground">{trip.driverName}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColors[trip.status]}`}
                  >
                    {statusLabels[trip.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {trip.estimatedTime}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-border px-4 py-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Showing top 10 recent trips</span>
          <button className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
            View all trips →
          </button>
        </div>
      </div>
    </div>
  );
}