import { TripRowActions } from "@/components/trips/trip-row-actions";
import { TripStatusBadge } from "@/components/trips/trip-status-badge";
import type { SerializedTrip } from "@/lib/trips/serialize";

type TripTableProps = {
  trips: SerializedTrip[];
  canWrite: boolean;
};

export function TripTable({ trips, canWrite }: TripTableProps) {
  if (trips.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
        <p className="text-sm font-medium text-foreground">No trips found</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Adjust your filters or create a trip to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Reference</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Route</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Vehicle</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Driver</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Cargo</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Distance</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {trips.map((trip) => (
              <tr key={trip.id} className="hover:bg-muted/20">
                <td className="px-4 py-3 font-medium">{trip.reference}</td>
                <td className="px-4 py-3">
                  <div>{trip.source}</div>
                  <div className="text-xs text-muted-foreground">→ {trip.destination}</div>
                </td>
                <td className="px-4 py-3">
                  <div>{trip.vehicleRegistration}</div>
                  <div className="text-xs text-muted-foreground">{trip.vehicleName}</div>
                </td>
                <td className="px-4 py-3">{trip.driverName}</td>
                <td className="px-4 py-3">{trip.cargoWeight.toLocaleString()} kg</td>
                <td className="px-4 py-3">
                  {trip.actualDistance
                    ? `${trip.actualDistance} km`
                    : `${trip.plannedDistance} km planned`}
                </td>
                <td className="px-4 py-3">
                  <TripStatusBadge status={trip.status} />
                </td>
                <td className="px-4 py-3">
                  <TripRowActions canWrite={canWrite} trip={trip} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
